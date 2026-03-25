import torch
import torch.nn as nn
import torch.nn.functional as F
from torchvision import models, transforms
from PIL import Image
import io


# MODEL DEFINITION
class ChannelAttention(nn.Module):
    def __init__(self, in_features, reduction=16):
        super().__init__()
        hidden = max(in_features // reduction, 8)
        self.attn = nn.Sequential(
            nn.Linear(in_features, hidden),
            nn.BatchNorm1d(hidden),
            nn.SiLU(),
            nn.Linear(hidden, in_features),
            nn.Sigmoid()
        )

    def forward(self, x):
        weights = self.attn(x)
        return x * weights + x

class DiseaseSeverityNet(nn.Module):
    def __init__(self, disease_classes):
        super().__init__()

        # Backbone
        self.backbone = models.efficientnet_b0(weights="IMAGENET1K_V1")
        self.features = self.backbone.features
        self.backbone.classifier = nn.Identity()

        self.pool = nn.AdaptiveAvgPool2d(1)

        # Dummy forward to get correct dims
        with torch.no_grad():
            dummy = torch.zeros(1, 3, 224, 224)
            x0 = self.features[0](dummy)
            x1 = self.features[1](x0)
            x2 = self.features[2](x1)

            x_deep = x2
            for i in range(3, len(self.features)):
                x_deep = self.features[i](x_deep)

            deep_dim = self.pool(x_deep).flatten(1).shape[1]
            shallow_dim = self.pool(x2).flatten(1).shape[1]

        fusion_dim = deep_dim + shallow_dim


        # Attention after fusion
        self.attention = ChannelAttention(fusion_dim)

        # Disease Head
        self.disease_head = nn.Sequential(
            nn.Linear(fusion_dim, 512),
            nn.BatchNorm1d(512),
            nn.SiLU(),
            nn.Dropout(0.4),
        
            nn.Linear(512, 256),
            nn.BatchNorm1d(256),
            nn.SiLU(),
            nn.Dropout(0.3),
        
            nn.Linear(256, len(disease_classes))
        )

        # Severity Heads
        self.severity_heads = nn.ModuleDict({
            d: nn.Sequential(
                nn.Linear(fusion_dim, 256),
                nn.BatchNorm1d(256),
                nn.SiLU(),
                nn.Dropout(0.4),
            
                nn.Linear(256, 128),
                nn.BatchNorm1d(128),
                nn.SiLU(),
                nn.Dropout(0.3),
            
                nn.Linear(128, 3)
            )
            for d in disease_classes if d.lower() != "healthy"
        })

    def forward(self, x, disease_name=None):
        # Pass through first few layers manually
        x0 = self.features[0](x)   # Stem
        x1 = self.features[1](x0)
        x2 = self.features[2](x1)  # <-- shallow feature

        # Continue full backbone
        x_deep = x2
        for i in range(3, len(self.features)):
            x_deep = self.features[i](x_deep)

        # Global pooling
        deep_feat = self.pool(x_deep).flatten(1)
        shallow_feat = self.pool(x2).flatten(1)

        # Concatenate (Multi-scale fusion)
        fused_feat = torch.cat([deep_feat, shallow_feat], dim=1)

        # Attention
        fused_feat = self.attention(fused_feat)

        # Disease head
        d_logits = self.disease_head(fused_feat)

        s_logits = None
        if disease_name in self.severity_heads:
            raw_logits = self.severity_heads[disease_name](fused_feat)
            s_logits = raw_logits

        return d_logits, s_logits


# INFERENCE WRAPPER
class ModelInference:
    def __init__(self, model_path):
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

        checkpoint = torch.load(model_path, map_location=self.device)
        
        # Determine if checkpoint is state_dict or contains metadata
        if "model_state_dict" in checkpoint:
            state_dict = checkpoint["model_state_dict"]
            self.disease_classes = checkpoint.get("class_names", [
                "Bacterial_spot", "Early_blight", "Late_blight", 
                "Leaf_Mold", "Septoria_leaf_spot", "healthy"
            ])
        else:
            state_dict = checkpoint
            # Fallback classes 
            self.disease_classes = [
                "Bacterial_spot", "Early_blight", "Late_blight", 
                "Leaf_Mold", "Septoria_leaf_spot", "healthy"
            ]

        print("INFERENCE class_names:", self.disease_classes)

        self.model = DiseaseSeverityNet(self.disease_classes)
        self.model.load_state_dict(state_dict, strict=False)
        self.model.to(self.device)
        self.model.eval()

        # Severity classes from metadata: ["Early", "Late", "Mid"]
        self.severity_levels = ["EARLY", "LATE", "MID"]

        self.transform = transforms.Compose([
            transforms.Resize((224, 224)),
            transforms.ToTensor(),
            transforms.Normalize(
                mean=[0.485, 0.456, 0.406],
                std=[0.229, 0.224, 0.225]
            )
        ])

    def predict(self, image_bytes):
        image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        x = self.transform(image).unsqueeze(0).to(self.device)

        with torch.no_grad():
            # Disease prediction
            d_logits, _ = self.model(x)
            d_probs = F.softmax(d_logits, dim=1)
            d_conf, d_idx = torch.max(d_probs, 1)
            disease_name = self.disease_classes[d_idx.item()]

            severity_level = None
            severity_conf = None
            severity_percentage = None

            if disease_name.lower() != "healthy":
                _, s_logits = self.model(x, disease_name)
                s_probs = F.softmax(s_logits, dim=1)
                s_conf, s_idx = torch.max(s_probs, 1)

                severity_level = self.severity_levels[s_idx.item()]
                severity_conf = s_conf.item()

                base_map = {"EARLY": 20, "MID": 50, "LATE": 80}
                base = base_map[severity_level]
                severity_percentage = min(
                    95,
                    max(5, base + (severity_conf - 0.33) * 20)
                )

        return {
            "disease_id": disease_name.lower().replace(" ", "_"),
            "disease": disease_name,
            "confidence": round(d_conf.item() * 100, 2),
            "severity_level": severity_level,
            "severity_confidence": None if severity_conf is None else round(severity_conf * 100, 2),
            "severity_percentage": None if severity_percentage is None else round(severity_percentage, 1)
        }
    def get_target_layer(self):
        # Using features[-1] (the final convolutional layer) as requested for optimal Grad-CAM++
        return self.model.features[-1]



# SINGLETON INSTANCE
_model_instance = None

def get_model_instance(model_path="disease_severity_model.pth"):
    global _model_instance
    if _model_instance is None:
        _model_instance = ModelInference(model_path)
    return _model_instance
