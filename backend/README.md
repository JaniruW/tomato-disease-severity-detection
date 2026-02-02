# Plant Disease Detection - Backend API

Python Flask backend for serving the PyTorch disease detection model.

## Setup

### 1. Create Virtual Environment

```bash
cd backend
python -m venv venv
```

### 2. Activate Virtual Environment

**Windows:**
```bash
venv\Scripts\activate
```

**Mac/Linux:**
```bash
source venv/bin/activate
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Run the Server

```bash
python app.py
```

The API will be available at `http://localhost:5000`

## API Endpoints

### POST /api/analyze
Analyze an uploaded image for disease detection.

**Request:**
- Method: POST
- Content-Type: multipart/form-data
- Body: `image` file (JPG, JPEG, or PNG)

**Response:**
```json
{
  "success": true,
  "data": {
    "disease": {
      "id": "early_blight",
      "name": "Early Blight",
      "description": "...",
      "symptoms": [...],
      "causes": [...]
    },
    "confidence": 92.5,
    "severity": {
      "label": "Mid Stage",
      "percentage": 45,
      "level": "MID",
      "color": "#f59e0b",
      "icon": "🟡"
    },
    "gradcam": {
      "original": "base64_encoded_image",
      "heatmap": "base64_encoded_heatmap",
      "overlay": "base64_encoded_overlay"
    },
    "timestamp": "2026-01-15T20:00:00",
    "imageUrl": null
  }
}
```

**XAI Explainability:** The `gradcam` object contains Grad-CAM visualizations showing which parts of the leaf the model focused on when making its prediction. See [XAI_INTEGRATION.md](./XAI_INTEGRATION.md) for details.

### GET /api/diseases
Get information about all supported diseases.

### GET /api/diseases/:id
Get information about a specific disease.

### GET /api/health
Health check endpoint.

## Model Configuration

The model is loaded from `disease_severity_model.pth` in the parent directory.

### Important Notes:

1. **Model Architecture**: You need to update `model.py` with your actual model architecture. The current code has placeholders that need to be replaced with your model's structure.

2. **Disease Classes**: Update the `disease_classes` list in `model.py` to match your model's training classes.

3. **Image Preprocessing**: The default preprocessing uses ImageNet normalization. Adjust if your model was trained differently.

4. **Severity Prediction**: If your model doesn't output severity directly, the code includes a placeholder estimation function.

## Connecting to Frontend

1. Make sure the backend is running on `http://localhost:5000`

2. In the frontend directory, create a `.env` file:
```env
VITE_API_URL=http://localhost:5000/api
VITE_USE_MOCK_API=false
```

3. Restart the frontend dev server

## Troubleshooting

### Model Loading Issues
If you get errors loading the model, you may need to:
1. Check the model architecture in `model.py`
2. Verify the model was saved correctly
3. Ensure PyTorch versions match between training and inference

### CORS Issues
The backend has CORS enabled for all origins. In production, restrict this to your frontend domain.

### File Upload Issues
- Maximum file size: 5MB
- Allowed formats: JPG, JPEG, PNG
- Files are validated before processing
