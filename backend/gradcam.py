import torch
import torch.nn.functional as F
import numpy as np
import cv2


class GradCAMPlusPlus:
    def __init__(self, model, target_layer):
        self.model = model
        self.target_layer = target_layer
        self._acts = None
        self._handle = target_layer.register_forward_hook(
            lambda m, i, o: setattr(self, '_acts', o)
        )

    def generate(self, img_tensor, class_idx):
        # GradCAM++ needs gradients of the score w.r.t activations
        #ensure input requires grad for backprop
        self.model.zero_grad()
        x = img_tensor.detach().clone().requires_grad_(True)
        self._acts = None
        
        # Forward pass
        d_logits, _ = self.model(x)
        score = d_logits[0, class_idx]
        
        # Backward pass
        # We use torch.autograd.grad for direct access to gradients of score w.r.t activations
        grads = torch.autograd.grad(score, self._acts, create_graph=False)[0]
        
        grads_sq = grads ** 2
        grads_cub = grads ** 3
        acts = self._acts.detach()
        
        # Alpha calculation for GradCAM++
        alpha_denom = 2 * grads_sq + (grads_cub * acts).sum(dim=(2, 3), keepdim=True)
        alpha = grads_sq / (alpha_denom + 1e-7)
        
        # Calculation of weights
        weights = (alpha * F.relu(grads)).sum(dim=(2, 3), keepdim=True)
        
        # Heatmap calculation
        cam = F.relu((weights * acts).sum(dim=1)).squeeze()
        cam = cam.detach().cpu().numpy()
        
        # Resize and normalize
        cam = cv2.resize(cam, (224, 224))
        cam -= cam.min()
        cam /= cam.max() + 1e-8
        
        return cam

    def generate_visuals(self, image, cam, threshold_pct=60):
        """
        Implements the user's visualization logic including thresholding and contours.
        Returns multiple versions of the visual data.
        """
        # Prepare image (RGB, 0-1, 224x224)
        if hasattr(image, 'convert'):
            image = image.convert('RGB').resize((224, 224))
        img_np = np.array(image) / 255.0

        # Thresholding (User logic)
        threshold = np.percentile(cam, threshold_pct)
        cam_thresh = np.where(cam >= threshold, cam, 0).astype(np.float32)
        cam_thresh -= cam_thresh.min()
        cam_thresh /= cam_thresh.max() + 1e-8

        # Heatmap
        heatmap = cv2.applyColorMap(np.uint8(255 * cam_thresh), cv2.COLORMAP_JET)
        heatmap = cv2.cvtColor(heatmap, cv2.COLOR_BGR2RGB) / 255.0
        
        # Fusion/Overlay (User formula: heatmap*alpha*0.7 + img_np*(1-alpha*0.4))
        alpha = cam_thresh[:, :, np.newaxis]
        overlay = np.clip(heatmap * alpha * 0.7 + img_np * (1 - alpha * 0.4), 0, 1)

        # Contours
        cam_uint8 = np.uint8(255 * cam_thresh)
        _, binary = cv2.threshold(cam_uint8, 127, 255, cv2.THRESH_BINARY)
        contours, _ = cv2.findContours(binary, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        
        # Create overlay with contours
        overlay_contour = (overlay * 255).astype(np.uint8)
        cv2.drawContours(overlay_contour, contours, -1, (255, 220, 0), 2)
        
        return {
            'cam': cam,
            'cam_thresh': cam_thresh,
            'heatmap': heatmap,
            'overlay': overlay,
            'overlay_contour': overlay_contour / 255.0
        }

    def remove(self):
        if hasattr(self, '_handle'):
            self._handle.remove()
