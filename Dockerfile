# Stage 1: Build React Frontend
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
# Increase memory for build
ENV NODE_OPTIONS="--max-old-space-size=4096"
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

# Create user with ID 1000 first
RUN useradd -m -u 1000 user

WORKDIR /app

# Copy backend requirements and install
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend code
COPY backend/ .

# Copy model (Handle potential LFS pointer vs real file)
COPY disease_severity_model.pth /app/disease_severity_model.pth

# Copy frontend build from Stage 1
COPY --from=build /app/dist ./dist

# Create uploads folder
RUN mkdir -p uploads

# FIX PERMISSIONS: Ensure user 1000 owns everything in /app
RUN chown -R user:user /app

# Switch to non-root user
USER user
ENV HOME=/home/user \
    PATH=/home/user/.local/bin:$PATH

EXPOSE 7860

CMD ["python", "app.py"]
