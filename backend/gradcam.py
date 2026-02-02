import torch
import torch.nn.functional as F
import numpy as np
import cv2


class GradCAM:
    """Grad-CAM implementation for CNN visualization"""
    
    def __init__(self, model, target_layer):
        """
        Args:
            model: PyTorch model
            target_layer: The layer to compute gradients on (usually last conv layer)
        """
        self.model = model
        self.target_layer = target_layer
        self.gradients = None
        self.activations = None
        
        # Register hooks
        self._register_hooks()
    
    def _register_hooks(self):
        """Register forward and backward hooks on target layer"""
        def forward_hook(module, input, output):
            self.activations = output.detach()
        
        def backward_hook(module, grad_in, grad_out):
            self.gradients = grad_out[0].detach()
        
        self.target_layer.register_forward_hook(forward_hook)
        self.target_layer.register_full_backward_hook(backward_hook)
    
    def generate(self, input_tensor, target_class=None):
        """
        Generate Grad-CAM heatmap
        
        Args:
            input_tensor: Input image tensor [1, 3, H, W]
            target_class: Target class index (if None, uses predicted class)
        
        Returns:
            cam: Normalized heatmap as numpy array [H, W]
        """
        self.model.eval()
        
        # Forward pass
        disease_logits, _ = self.model(input_tensor)
        
        # Determine target class
        if target_class is None:
            target_class = disease_logits.argmax(dim=1).item()
        
        # Zero gradients
        self.model.zero_grad()
        
        # Backward pass for target class
        disease_logits[0, target_class].backward()
        
        # Get gradients and activations
        gradients = self.gradients  # [1, C, H, W]
        activations = self.activations  # [1, C, H, W]
        
        # Calculate weights (global average pooling of gradients)
        weights = torch.mean(gradients, dim=(2, 3), keepdim=True)  # [1, C, 1, 1]
        
        # Weighted combination of activation maps
        cam = torch.sum(weights * activations, dim=1, keepdim=True)  # [1, 1, H, W]
        
        # Apply ReLU to focus on positive contributions
        cam = F.relu(cam)
        
        # Normalize to [0, 1]
        cam = cam.squeeze().cpu().numpy()
        cam = (cam - cam.min()) / (cam.max() - cam.min() + 1e-8)
        
        return cam
    
    def apply_overlay(self, image, cam, alpha=0.4, colormap=cv2.COLORMAP_JET):
        """
        Apply Grad-CAM overlay on original image
        
        Args:
            image: Original PIL image or numpy array [H, W, 3]
            cam: Grad-CAM heatmap [h, w]
            alpha: Overlay transparency (0-1)
            colormap: OpenCV colormap
        
        Returns:
            overlay: Image with heatmap overlay [H, W, 3]
        """
        # Convert PIL to numpy if needed
        if hasattr(image, 'convert'):
            image = np.array(image.convert('RGB'))
        
        # Resize CAM to match image size
        h, w = image.shape[:2]
        cam_resized = cv2.resize(cam, (w, h))
        
        # Convert to heatmap
        heatmap = cv2.applyColorMap(np.uint8(255 * cam_resized), colormap)
        heatmap = cv2.cvtColor(heatmap, cv2.COLOR_BGR2RGB)
        
        # Overlay
        overlay = cv2.addWeighted(image, 1 - alpha, heatmap, alpha, 0)
        
        return overlay
