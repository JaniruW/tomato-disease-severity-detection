---
title: Tomato Disease Detection
emoji: 🍅
colorFrom: green
colorTo: red
sdk: docker
pinned: false
app_file: app.py
app_port: 7860
---

# Plant Disease Detection System

A comprehensive React-based frontend application for AI-powered plant disease detection with severity analysis and treatment recommendations.

## Features

- 🌿 **AI-Powered Detection**: Advanced deep learning models for accurate disease identification
- 📊 **Severity Analysis**: Precise assessment of disease progression with color-coded indicators
- 🔍 **Explainable AI**: Grad-CAM visualization showing which parts influenced the AI's decision
- 💊 **Treatment Recommendations**: Specific actions based on disease type and severity level
- 📱 **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- 📈 **Analysis History**: Track and manage past disease analyses
- 📄 **PDF Export**: Generate professional reports of analysis results

## Tech Stack

- **Frontend Framework**: React 19 with Vite
- **Styling**: Tailwind CSS with custom configurations
- **Routing**: React Router DOM
- **Charts**: Recharts for data visualization
- **Icons**: Lucide React
- **PDF Generation**: jsPDF and html2canvas
- **Image Upload**: React Dropzone
- **HTTP Client**: Axios

## Getting Started

### Prerequisites

- Node.js (v20.11.0 or higher)
- npm (v10.4.0 or higher)
- Python 3.8+ (for backend)

### Quick Start

**See [SETUP_GUIDE.md](SETUP_GUIDE.md) for detailed setup instructions.**

#### Frontend Only (with Mock API)

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

#### Full System (Frontend + Backend)

1. **Setup Backend:**
```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt
python app.py
```

2. **Setup Frontend:**
```bash
# In a new terminal, from project root
npm install
npm run dev
```

3. **Configure Environment:**
Create `.env` file:
```env
VITE_API_URL=http://localhost:7860/api
VITE_USE_MOCK_API=false
```

### Build

Create a production build:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

## Project Structure

```
src/
├── components/          # Reusable components
│   ├── ui/             # UI components (Button, Card, Badge, etc.)
│   ├── DiseaseCard.jsx
│   ├── SeverityCard.jsx
│   ├── GradCAMViewer.jsx
│   ├── RecommendationPanel.jsx
│   ├── SeverityChart.jsx
│   └── ImageUpload.jsx
├── pages/              # Page components
│   ├── LandingPage.jsx
│   ├── UploadPage.jsx
│   ├── ResultsPage.jsx
│   └── HistoryPage.jsx
├── context/            # React Context
│   └── AnalysisContext.jsx
├── services/           # API services
│   ├── api.js
│   └── mockData.js
├── utils/              # Utility functions
│   ├── constants.js
│   ├── imageValidation.js
│   └── pdfExport.js
├── App.jsx             # Main app component
├── main.jsx            # Entry point
└── index.css           # Global styles
```

## Usage

### 1. Landing Page
- View feature highlights and system capabilities
- Click "Start Analysis" to begin

### 2. Upload Image
- Drag and drop or click to upload a leaf image
- System validates image quality (format, size, resolution, blur, lighting)
- Click "Analyze Disease" to process

### 3. View Results
- **Disease Card**: Shows detected disease with confidence score
- **Severity Card**: Displays infection level with color-coded indicators
- **Grad-CAM Viewer**: Interactive XAI visualization with multiple view modes
- **Recommendations**: Treatment and preventive measures
- **Severity Chart**: Visual distribution of affected vs healthy areas
- Export results to PDF or save to history

### 4. History
- View all past analyses
- Filter by severity level
- Export or delete individual analyses
- View summary statistics

## Mock API

The application includes a comprehensive mock API for development and testing. To use the mock API:

1. Set `VITE_USE_MOCK_API=true` in your `.env` file
2. The mock API will return realistic random results for each analysis

## Backend Integration

To connect to a real backend:

1. Set `VITE_USE_MOCK_API=false` in your `.env` file
2. Configure `VITE_API_URL` to point to your backend API (default: http://localhost:7860/api)
3. Ensure your backend provides these endpoints:
   - `POST /api/analyze` - Upload and analyze image
   - `GET /api/history` - Fetch analysis history
   - `GET /api/diseases/:id` - Get disease information
   - `POST /api/history` - Save analysis to history
   - `DELETE /api/history/:id` - Delete history item

### Expected API Response Format

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
      "original": "url",
      "heatmap": "url",
      "overlay": "url"
    },
    "timestamp": "2026-01-15T10:30:00Z",
    "imageUrl": "url"
  }
}
```

## Customization

### Colors
Edit `tailwind.config.js` to customize severity colors and theme:

```javascript
colors: {
  severity: {
    early: '#10b981',  // green
    mid: '#f59e0b',    // yellow/orange
    late: '#ef4444',   // red
  }
}
```

### Disease Information
Update `src/utils/constants.js` to add or modify disease information and recommendations.

## Contributing

This is a final year project. For questions or suggestions, please contact the project maintainer.

## License

This project is part of a final year academic project.

## Acknowledgments

- Plant disease dataset providers
- Deep learning model researchers
- Open source community

---

**Final Year Project** - Plant Disease Detection System
