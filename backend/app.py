from flask import Flask, request, jsonify, send_from_directory

from flask_cors import CORS
from werkzeug.utils import secure_filename
import os
from datetime import datetime
import traceback
from model import get_model_instance
from gradcam import GradCAM
import cv2
import numpy as np
import base64
import torch
from PIL import Image
import io

app = Flask(__name__, static_folder='dist', static_url_path='/')
CORS(app)  # Enable CORS

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(app.static_folder + '/' + path):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')
MODEL_PATH = "../disease_severity_model.pth"

# Configuration
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB

os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Disease information database
DISEASE_INFO = {
    'early_blight': {
        'id': 'early_blight',
        'name': 'Early Blight',
        'description': 'Early blight is a common fungal disease caused by Alternaria solani. It affects leaves, stems, and fruits, causing dark brown spots with concentric rings.',
        'symptoms': [
            'Dark brown spots with concentric rings on older leaves',
            'Yellowing around the spots',
            'Leaf drop in severe cases',
            'Stem lesions near soil line'
        ],
        'causes': [
            'Warm, humid weather',
            'Poor air circulation',
            'Overhead watering',
            'Infected plant debris'
        ]
    },
    'late_blight': {
        'id': 'late_blight',
        'name': 'Late Blight',
        'description': 'Late blight is a devastating disease caused by Phytophthora infestans. It can destroy entire crops within days under favorable conditions.',
        'symptoms': [
            'Water-soaked spots on leaves',
            'White fuzzy growth on leaf undersides',
            'Brown lesions on stems',
            'Rapid plant death'
        ],
        'causes': [
            'Cool, wet weather',
            'High humidity',
            'Infected seed potatoes',
            'Wind-dispersed spores'
        ]
    },
    'leaf_mold': {
        'id': 'leaf_mold',
        'name': 'Leaf Mold',
        'description': 'Leaf mold is caused by the fungus Passalora fulva. It primarily affects greenhouse tomatoes.',
        'symptoms': [
            'Pale green to yellow spots on upper leaf surface',
            'Olive-green to brown velvety growth on lower surface',
            'Leaf curling and wilting',
            'Premature leaf drop'
        ],
        'causes': [
            'High humidity (above 85%)',
            'Poor ventilation',
            'Dense plant canopy',
            'Overhead irrigation'
        ]
    },
    'septoria_leaf_spot': {
        'id': 'septoria_leaf_spot',
        'name': 'Septoria Leaf Spot',
        'description': 'Septoria leaf spot is caused by Septoria lycopersici. It is one of the most destructive tomato diseases.',
        'symptoms': [
            'Small circular spots with dark borders',
            'Gray centers with tiny black dots',
            'Starts on lower leaves',
            'Progressive defoliation'
        ],
        'causes': [
            'Wet, humid conditions',
            'Splashing water',
            'Infected plant debris',
            'Warm temperatures (60-80°F)'
        ]
    },
    'bacterial_spot': {
        'id': 'bacterial_spot',
        'name': 'Bacterial Spot',
        'description': 'Bacterial spot is caused by Xanthomonas species. It affects leaves, stems, and fruits.',
        'symptoms': [
            'Small, dark brown spots on leaves',
            'Yellow halos around spots',
            'Raised spots on fruits',
            'Leaf drop and defoliation'
        ],
        'causes': [
            'Warm, wet weather',
            'Overhead irrigation',
            'Contaminated seeds',
            'Infected transplants'
        ]
    },
    'healthy': {
        'id': 'healthy',
        'name': 'Healthy Plant',
        'description': 'The plant appears healthy with no visible signs of disease.',
        'symptoms': [
            'Vibrant green leaves',
            'No discoloration or spots',
            'Strong stem structure',
            'Normal growth pattern'
        ],
        'causes': []
    }
}

def allowed_file(filename):
    """Check if file extension is allowed"""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def get_severity_info(level, percentage):
    """Get severity information"""
    severity_config = {
        'EARLY': {
            'label': 'Early Stage',
            'color': '#10b981',
            'icon': '🟢'
        },
        'MID': {
            'label': 'Mid Stage',
            'color': '#f59e0b',
            'icon': '🟡'
        },
        'LATE': {
            'label': 'Late Stage',
            'color': '#ef4444',
            'icon': '🔴'
        }
    }
    
    config = severity_config.get(level, severity_config['MID'])
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
    
    Expected: multipart/form-data with 'image' file
    Returns: JSON with disease prediction and severity + Grad-CAM XAI
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
        
        # ===== PERFORM PREDICTION =====
        prediction = model.predict(image_bytes)
        
        # Get disease information
        disease_id = prediction['disease_id']
        disease_info = DISEASE_INFO.get(disease_id, DISEASE_INFO['healthy'])
        
        # Get severity information
        severity_info = get_severity_info(
            prediction['severity_level'],
            prediction['severity_percentage']
        )
        
        # ===== GENERATE GRAD-CAM XAI =====
        # Reopen image for processing
        image = Image.open(io.BytesIO(image_bytes)).convert('RGB')
        
        # Preprocess image (same as in model)
        x = model.transform(image).unsqueeze(0).to(model.device)
        
        # Get target layer for Grad-CAM
        target_layer = model.get_target_layer()
        
        # Initialize Grad-CAM
        gradcam = GradCAM(model.model, target_layer)
        
        # Generate CAM heatmap
        # Get predicted class index
        with torch.no_grad():
            disease_logits, _ = model.model(x)
            predicted_class_idx = disease_logits.argmax(dim=1).item()
        
        # Generate Grad-CAM (requires gradients, so no torch.no_grad())
        cam = gradcam.generate(x, target_class=predicted_class_idx)
        
        # Resize image to 224x224 for overlay (same as model input)
        img_resized = image.resize((224, 224))
        img_array = np.array(img_resized)
        
        # Generate overlay
        overlay = gradcam.apply_overlay(img_array, cam, alpha=0.4)
        
        # Convert to base64 for JSON response
        def image_to_base64(img_array):
            """Convert numpy array to base64 string"""
            img_rgb = cv2.cvtColor(img_array, cv2.COLOR_BGR2RGB) if len(img_array.shape) == 3 else img_array
            _, buffer = cv2.imencode('.jpg', img_rgb)
            return base64.b64encode(buffer).decode('utf-8')
        
        # Generate heatmap visualization
        heatmap_colored = cv2.applyColorMap(np.uint8(255 * cam), cv2.COLORMAP_JET)
        heatmap_resized = cv2.resize(heatmap_colored, (224, 224))
        
        # Prepare response
        response = {
            'success': True,
            'data': {
                'disease': disease_info,
                'confidence': prediction['confidence'],
                'severity': severity_info,
                'gradcam': {
                    'original': image_to_base64(cv2.cvtColor(img_array, cv2.COLOR_RGB2BGR)),
                    'heatmap': image_to_base64(heatmap_resized),
                    'overlay': image_to_base64(cv2.cvtColor(overlay, cv2.COLOR_RGB2BGR))
                },
                'timestamp': datetime.now().isoformat(),
                'imageUrl': None  # Frontend will use the uploaded image
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
    disease_info = DISEASE_INFO.get(disease_id)
    
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
        'data': list(DISEASE_INFO.values())
    })

# In-memory history storage (replace with database in production)
history_storage = []

@app.route('/api/history', methods=['GET'])
def get_history():
    """Get analysis history"""
    return jsonify({
        'success': True,
        'data': sorted(history_storage, key=lambda x: x['date'], reverse=True)
    })

@app.route('/api/history', methods=['POST'])
def save_history():
    """Save analysis to history"""
    try:
        data = request.json
        if not data:
            return jsonify({'success': False, 'error': 'No data provided'}), 400
            
        # Add ID if not present
        if 'id' not in data:
            data['id'] = str(len(history_storage) + 1)
            
        # Ensure date format
        if 'date' not in data:
            data['date'] = datetime.now().isoformat()
            
        history_storage.append(data)
        
        return jsonify({
            'success': True,
            'data': data,
            'message': 'Analysis saved to history'
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/history/<id>', methods=['DELETE'])
def delete_history_item(id):
    """Delete history item"""
    global history_storage
    initial_len = len(history_storage)
    history_storage = [item for item in history_storage if str(item.get('id')) != str(id)]
    
    if len(history_storage) < initial_len:
        return jsonify({'success': True, 'message': 'Item deleted'})
    else:
        return jsonify({'success': False, 'error': 'Item not found'}), 404


if __name__ == '__main__':
    print("Starting Plant Disease Detection API...")
    print("Loading model...")
    
    try:
        # Initialize model on startup
        model = get_model_instance('../disease_severity_model.pth')
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
    
    port = int(os.environ.get('PORT', 7860))
    print(f"\nAPI Server running on http://0.0.0.0:{port}")
    app.run(debug=False, host='0.0.0.0', port=port)
