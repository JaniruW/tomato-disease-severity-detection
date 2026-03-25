from flask import Flask, request, jsonify, send_from_directory

from flask_cors import CORS
from werkzeug.utils import secure_filename
import os
from datetime import datetime
import traceback
from model import get_model_instance
from gradcam import GradCAMPlusPlus
import cv2
import numpy as np
import base64
import torch
from PIL import Image
import io
from constants import DISEASES, SEVERITY_LEVELS

app = Flask(__name__, static_folder='dist', static_url_path='/')
CORS(app)  # Enable CORS

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(app.static_folder + '/' + path):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')

# Robust Model Path Detection
possible_paths = [
    "disease_severity_model.pth", 
    "../disease_severity_model.pth", 
    "/app/disease_severity_model.pth"
]
MODEL_PATH = "../disease_severity_model.pth" # Default fallback
for path in possible_paths:
    if os.path.exists(path):
        MODEL_PATH = path
        print(f"Found model at: {MODEL_PATH}")
        break

# Configuration
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB

os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def allowed_file(filename):
    """Check if file extension is allowed"""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def get_severity_info(level, percentage):
    """Get severity information from constants"""
    config = SEVERITY_LEVELS.get(level, SEVERITY_LEVELS['MID'])
    return {
        'label': config['label'],
        'percentage': percentage,
        'level': level,
        'color': config['color'],
        'icon': config['icon']
    }

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'message': 'Plant Disease Detection API is running'
    })

@app.route('/api/analyze', methods=['POST'])
def analyze_image():
    """
    Analyze uploaded image for disease detection
    """
    try:
        # Check if image is in request
        if 'image' not in request.files:
            return jsonify({
                'success': False,
                'error': 'No image file provided'
            }), 400
        
        file = request.files['image']
        
        # Check if file is selected
        if file.filename == '':
            return jsonify({
                'success': False,
                'error': 'No file selected'
            }), 400
        
        # Check file extension
        if not allowed_file(file.filename):
            return jsonify({
                'success': False,
                'error': 'Invalid file format. Only JPG, JPEG, and PNG are allowed.'
            }), 400
        
        # Read file bytes
        image_bytes = file.read()
        
        # Check file size
        if len(image_bytes) > MAX_FILE_SIZE:
            return jsonify({
                'success': False,
                'error': 'File size exceeds 5MB limit'
            }), 400
        
        # Get model instance
        model = get_model_instance(MODEL_PATH)
        
        
        prediction = model.predict(image_bytes)
        
        # Get disease information
        disease_id = prediction['disease_id']
        disease_info = DISEASES.get(disease_id, DISEASES['healthy'])
        
        # Get severity information
        severity_info = get_severity_info(
            prediction['severity_level'],
            prediction['severity_percentage']
        )
        
        # genarate grad-cam++ XAI
        # Reopen image for processing
        image = Image.open(io.BytesIO(image_bytes)).convert('RGB')
        
        # Preprocess image (same as in model)
        x = model.transform(image).unsqueeze(0).to(model.device)
        # Get target layer for Grad-CAM
        target_layer = model.get_target_layer()
        
        # Initialize Grad-CAM++
        gradcam = GradCAMPlusPlus(model.model, target_layer)
        
        # Generate CAM heatmap
        # Get predicted class index
        with torch.no_grad():
            disease_logits, _ = model.model(x)
            predicted_class_idx = disease_logits.argmax(dim=1).item()
        
        # Generate Grad-CAM++
        cam = gradcam.generate(x, predicted_class_idx)
        
        # Generate Visuals 
        visuals = gradcam.generate_visuals(image, cam, threshold_pct=60)
        
        # Clean up hooks
        gradcam.remove()

        # Convert to base64 for JSON response
        def image_to_base64(img_bgr):
            """Convert BGR numpy array to base64 string"""
            _, buffer = cv2.imencode('.jpg', img_bgr)
            return base64.b64encode(buffer).decode('utf-8')
        
        # Prepare visuals for response
        overlay_bgr = cv2.cvtColor((visuals['overlay'] * 255).astype(np.uint8), cv2.COLOR_RGB2BGR)
        contour_bgr = cv2.cvtColor((visuals['overlay_contour'] * 255).astype(np.uint8), cv2.COLOR_RGB2BGR)
        heatmap_bgr = cv2.cvtColor((visuals['heatmap'] * 255).astype(np.uint8), cv2.COLOR_RGB2BGR)
        original_bgr = cv2.cvtColor(np.array(image.convert('RGB').resize((224, 224))), cv2.COLOR_RGB2BGR)

        # Prepare response
        response = {
            'success': True,
            'data': {
                'disease': disease_info,
                'confidence': prediction['confidence'],
                'severity': severity_info,
                'gradcam': {
                    'original': image_to_base64(original_bgr),
                    'heatmap': image_to_base64(heatmap_bgr),
                    'overlay': image_to_base64(overlay_bgr),
                    'contour': image_to_base64(contour_bgr)
                },
                'timestamp': prediction.get('timestamp', datetime.now().isoformat())
            }
        }
        
        return jsonify(response)
    
    except Exception as e:
        print(f"Error during analysis: {str(e)}")
        print(traceback.format_exc())
        return jsonify({
            'success': False,
            'error': f'Analysis failed: {str(e)}'
        }), 500


@app.route('/api/diseases/<disease_id>', methods=['GET'])
def get_disease_info(disease_id):
    """Get information about a specific disease"""
    disease_info = DISEASES.get(disease_id)
    
    if disease_info:
        return jsonify({
            'success': True,
            'data': disease_info
        })
    else:
        return jsonify({
            'success': False,
            'error': 'Disease not found'
        }), 404

@app.route('/api/diseases', methods=['GET'])
def get_all_diseases():
    """Get information about all diseases"""
    return jsonify({
        'success': True,
        'data': list(DISEASES.values())
    })


if __name__ == '__main__':
    print("Starting Plant Disease Detection API...")
    print("Loading model...")
    
    try:
        # Initialize model on startup
        model = get_model_instance(MODEL_PATH)
        print("Model loaded successfully!")
        print(f"Supported diseases: {', '.join(model.disease_classes)}")
    except Exception as e:
        print(f"Error loading model: {e}")
        print("Server will start but predictions will fail until model is loaded correctly.")
    
    print("\nAPI Server running on http://localhost:5000")
    print("Endpoints:")
    print("  - POST /api/analyze - Analyze image")
    print("  - GET  /api/diseases - Get all diseases")
    print("  - GET  /api/diseases/<id> - Get disease info")
    print("  - GET  /api/health - Health check")
    
    # For Hugging Face Spaces, the default port must be 7860
    port = int(os.environ.get('PORT', 7860))
    print(f"\nAPI Server starting on http://0.0.0.0:{port}")
    app.run(debug=False, host='0.0.0.0', port=port)
