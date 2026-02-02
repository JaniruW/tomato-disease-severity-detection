import torch
import torch.nn as nn
import torch.nn.functional as F
from torchvision import models, transforms
from PIL import Image
import io

# =========================
# MODEL DEFINITION
# =========================
class DiseaseSeverityNet(nn.Module):
    def __init__(self, disease_classes):
        super().__init__()
        self.backbone = models.efficientnet_b0(weights="IMAGENET1K_V1")
        feat_dim = self.backbone.classifier[1].in_features
        self.backbone.classifier = nn.Identity()

        self.disease_head = nn.Linear(feat_dim, len(disease_classes))

        self.severity_heads = nn.ModuleDict({
            d: nn.Sequential(
                nn.Linear(feat_dim, 256),
                nn.BatchNorm1d(256),
                nn.ReLU(),
                nn.Dropout(0.6),
                nn.Linear(256, 3)
            )
            for d in disease_classes if d.lower() != "healthy"
        })

    def forward(self, x, disease_name=None):
        feat = self.backbone(x)
        d_logits = self.disease_head(feat)

        s_logits = None
        if disease_name is not None and disease_name in self.severity_heads:
            s_logits = self.severity_heads[disease_name](feat)

        return d_logits, s_logits


# =========================
# INFERENCE WRAPPER
# =========================
class ModelInference:
    def __init__(self, model_path):
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

        checkpoint = torch.load(model_path, map_location=self.device)
        self.disease_classes = checkpoint["class_names"]

        print("INFERENCE class_names:", self.disease_classes)

        self.model = DiseaseSeverityNet(self.disease_classes)
        self.model.load_state_dict(checkpoint["model_state_dict"])
        self.model.to(self.device)
        self.model.eval()

        self.severity_levels = ["EARLY", "MID", "LATE"]

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
        return self.model.backbone.features[-1]


# =========================
# SINGLETON INSTANCE
# =========================
_model_instance = None

def get_model_instance(model_path="disease_severity_model.pth"):
    global _model_instance
    if _model_instance is None:
        _model_instance = ModelInference(model_path)
    return _model_instance
