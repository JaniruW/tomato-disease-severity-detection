# Stage 1: Build React Frontend
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
# Increase memory for build
ENV NODE_OPTIONS="--max-old-space-size=4096"
# Use install instead of ci for better cross-platform luck
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Setup Python Backend
FROM python:3.9-slim

# Install system dependencies including build tools
RUN apt-get update && apt-get install -y \
    libgl1-mesa-glx \
    libglib2.0-0 \
    gcc \
    python3-dev \
    && rm -rf /var/lib/apt/lists/*

# Create user with ID 1000 first
RUN useradd -m -u 1000 user

WORKDIR /app

# Copy backend requirements and install
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend code
COPY backend/ .

# Copy model
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
