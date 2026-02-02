# Stage 1: Build React Frontend
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Setup Python Backend
FROM python:3.9-slim

# Install system dependencies for OpenCV
RUN apt-get update && apt-get install -y \
    libgl1-mesa-glx \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy backend requirements and install
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend code
COPY backend/ .
# Copy the trained model (ensure it's in the backend folder or root)
# The current app expects "../disease_severity_model.pth". 
# In Docker, we'll put it in the root or adjust path. 
# Let's copy it to /app/ and update app behavior if needed, or simply put it where app expects.
# If app is in /app (WORKDIR), and model is at ../model.pth, it looks at /model.pth.
# But inside container WORKDIR is /app.
# So ".." from /app is /.
COPY disease_severity_model.pth /disease_severity_model.pth

# Copy frontend build from Stage 1 to /app/dist
COPY --from=build /app/dist ./dist

# Create uploads folder & set permissions for non-root user
RUN mkdir -p uploads && chmod 777 uploads

# Create a non-root user (Hugging Face requirement)
RUN useradd -m -u 1000 user
USER user
ENV HOME=/home/user \
    PATH=/home/user/.local/bin:$PATH

# Expose Hugging Face default port
EXPOSE 7860

# Run Flask
CMD ["python", "app.py"]
