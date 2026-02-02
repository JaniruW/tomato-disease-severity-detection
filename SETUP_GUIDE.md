# 🚀 Complete Setup Guide - Plant Disease Detection System

## Overview
This guide will help you set up both the **React frontend** and **Python backend** to work together with your PyTorch model.

## Prerequisites
- Node.js (v20.11.0 or higher)
- Python (3.8 or higher)
- Your trained model file: `disease_severity_model.pth`

---

## Part 1: Backend Setup (Python + Flask)

### Step 1: Navigate to Backend Directory
```bash
cd backend
```

### Step 2: Create Virtual Environment
```bash
python -m venv venv
```

### Step 3: Activate Virtual Environment

**Windows:**
```bash
venv\Scripts\activate
```

**Mac/Linux:**
```bash
source venv/bin/activate
```

### Step 4: Install Dependencies
```bash
pip install -r requirements.txt
```

> **Note:** This will install Flask, PyTorch, torchvision, and other required packages.

### Step 5: Configure Your Model

**IMPORTANT:** You need to update `model.py` with your actual model architecture.

Open `backend/model.py` and:

1. **Update the `DiseaseClassifier` class** with your model architecture (lines 8-17)
2. **Update `disease_classes`** list to match your training classes (lines 27-34)
3. **Update the `load_model` function** if needed (lines 50-63)

**Example:** If you used ResNet18:
```python
import torchvision.models as models

class DiseaseClassifier(nn.Module):
    def __init__(self, num_classes=6):
        super(DiseaseClassifier, self).__init__()
        self.model = models.resnet18(pretrained=False)
        self.model.fc = nn.Linear(self.model.fc.in_features, num_classes)
    
    def forward(self, x):
        return self.model(x)
```

### Step 6: Test the Backend
```bash
python app.py
```

You should see:
```
Starting Plant Disease Detection API...
Loading model...
Model loaded successfully!
API Server running on http://localhost:5000
```

**Test the API:**
Open another terminal and run:
```bash
curl http://localhost:5000/api/health
```

You should get: `{"status":"healthy","message":"Plant Disease Detection API is running"}`

---

## Part 2: Frontend Setup (React + Vite)

### Step 1: Navigate to Project Root
```bash
cd ..  # Go back to project root
```

### Step 2: Create Environment File
Create a file named `.env` in the project root:

```bash
# Copy the example
cp .env.example .env
```

Edit `.env` and set:
```env
VITE_API_URL=http://localhost:5000/api
VITE_USE_MOCK_API=false
```

### Step 3: Install Frontend Dependencies (if not done)
```bash
npm install
```

### Step 4: Start Frontend
```bash
npm run dev
```

The frontend will run at: `http://localhost:5173`

---

## Part 3: Testing the Complete System

### Test Flow:

1. **Open Frontend:** Go to `http://localhost:5173`

2. **Navigate to Upload:** Click "Start Analysis" or go to `/upload`

3. **Upload an Image:**
   - Drag and drop a leaf image
   - Or click to browse and select

4. **Click "Analyze Disease"**
   - The image will be sent to your backend
   - Your PyTorch model will process it
   - Results will be displayed

5. **View Results:**
   - Disease name and confidence
   - Severity analysis
   - Treatment recommendations
   - Grad-CAM visualization (placeholder for now)

---

## Troubleshooting

### Backend Issues

**Problem:** `ModuleNotFoundError: No module named 'torch'`
**Solution:** Make sure virtual environment is activated and dependencies are installed:
```bash
venv\Scripts\activate  # Windows
pip install -r requirements.txt
```

**Problem:** `Error loading model`
**Solution:** 
1. Check that `disease_severity_model.pth` is in the project root
2. Update `model.py` with correct architecture
3. Verify model was saved correctly during training

**Problem:** `CORS error in browser console`
**Solution:** Backend has CORS enabled. Make sure backend is running on port 5000.

### Frontend Issues

**Problem:** `Network Error` or `Failed to fetch`
**Solution:**
1. Check backend is running: `http://localhost:5000/api/health`
2. Verify `.env` file has correct API URL
3. Restart frontend dev server after changing `.env`

**Problem:** Still using mock data
**Solution:** Make sure `.env` has `VITE_USE_MOCK_API=false`

---

## Running Both Servers

You need **TWO terminal windows**:

**Terminal 1 - Backend:**
```bash
cd backend
venv\Scripts\activate  # Windows
python app.py
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

---

## Project Structure

```
ProjectCode/
├── backend/
│   ├── app.py              # Flask API server
│   ├── model.py            # PyTorch model inference
│   ├── requirements.txt    # Python dependencies
│   ├── .gitignore
│   └── README.md
├── src/
│   ├── components/         # React components
│   ├── pages/             # React pages
│   ├── services/          # API services
│   ├── utils/             # Utilities
│   └── context/           # State management
├── disease_severity_model.pth  # Your PyTorch model
├── .env                   # Environment variables
├── package.json           # Node dependencies
└── README.md             # Main documentation
```

---

## Next Steps

### 1. Add Grad-CAM Visualization

To implement Grad-CAM heatmaps:
1. Install `pytorch-grad-cam`: `pip install grad-cam`
2. Update `model.py` to generate heatmaps
3. Save heatmap images and return URLs in API response

### 2. Add Database for History

Currently history is stored in browser. To persist:
1. Add SQLite or PostgreSQL
2. Create history table
3. Implement save/retrieve endpoints

### 3. Deploy to Production

**Backend:**
- Use Gunicorn: `gunicorn -w 4 app:app`
- Deploy to Heroku, AWS, or DigitalOcean

**Frontend:**
- Build: `npm run build`
- Deploy to Vercel, Netlify, or AWS S3

---

## Quick Reference

### Backend Commands
```bash
cd backend
venv\Scripts\activate
python app.py
```

### Frontend Commands
```bash
npm run dev          # Development
npm run build        # Production build
npm run preview      # Preview build
```

### API Endpoints
- `POST /api/analyze` - Analyze image
- `GET /api/diseases` - Get all diseases
- `GET /api/diseases/:id` - Get disease info
- `GET /api/health` - Health check

---

## Support

If you encounter issues:
1. Check both servers are running
2. Verify `.env` configuration
3. Check browser console for errors
4. Check backend terminal for errors
5. Ensure model architecture matches in `model.py`

**Your system is now ready to detect plant diseases! 🌿**
