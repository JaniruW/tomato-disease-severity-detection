# How to Host on Hugging Face Spaces

Your application is now configured for Hugging Face Spaces using Docker!

## Prerequisites
- A Hugging Face account
- Basic knowledge of Git

## Steps

### 1. Create a New Space
1. Go to [huggingface.co/spaces](https://huggingface.co/spaces)
2. Click **"Create new Space"**
3. Enter a name (e.g., `tomato-disease-detection`)
4. Select **Docker** as the SDK
5. Choose **Public**
6. Click **"Create Space"**

### 2. Upload Your Code
You can upload via Git or the Web Interface. Git is recommended for large projects.

**Option A: Using Git (Recommended)**
```bash
# 1. Clone the repository created by Hugging Face
git clone https://huggingface.co/spaces/YOUR_USERNAME/SPACE_NAME
cd SPACE_NAME

# 2. Copy ALL your project files into this folder
# (Copy src, backend, public, package.json, Dockerfile, disease_severity_model.pth, etc.)
# MAKE SURE 'disease_severity_model.pth' IS INCLUDED!

# 3. Add files to git
git add .

# 4. Commit and Push
git commit -m "Initial commit"
git push
```

**Option B: Web Interface**
1. Go to the **Files** tab of your Space.
2. Click **"Add file"** -> **"Upload files"**.
3. Drag and drop your files.
   * *Note: You might have issues uploading the large .pth model file this way.*

## Checklist
Ensure these files are present in the Space's root:
- [x] `Dockerfile`
- [x] `disease_severity_model.pth`
- [x] `package.json` & `vite.config.js`
- [x] `src/` folder
- [x] `public/` folder
- [x] `backend/` folder (containing `app.py`, `model.py`, `gradcam.py`, `requirements.txt`)

## Troubleshooting
- **Build Failed?** Check the "Logs" tab in your Space.
- **Model not found?** Ensure `disease_severity_model.pth` is in the root directory of the Space.
- **Port Error?** The Dockerfile exposes port 7860, which is what HF expects.

## That's it!
Once pushed, Hugging Face will automatically:
1. Build the Docker image (installs Node, builds React, installs Python, etc.)
2. Start the server
3. Your app will be live at `https://huggingface.co/spaces/YOUR_USERNAME/SPACE_NAME`!
