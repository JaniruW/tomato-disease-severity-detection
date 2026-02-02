import { IMAGE_VALIDATION } from './constants';

/**
 * Validate image file format
 */
export const validateImageFormat = (file) => {
    if (!file) {
        return { valid: false, error: 'No file provided' };
    }

    if (!IMAGE_VALIDATION.ALLOWED_FORMATS.includes(file.type)) {
        return {
            valid: false,
            error: 'Invalid file format. Please upload JPG or PNG images only.'
        };
    }

    return { valid: true };
};

/**
 * Validate image file size
 */
export const validateImageSize = (file) => {
    if (file.size > IMAGE_VALIDATION.MAX_SIZE) {
        return {
            valid: false,
            error: `File size exceeds ${IMAGE_VALIDATION.MAX_SIZE / (1024 * 1024)}MB limit.`
        };
    }

    return { valid: true };
};

/**
 * Validate image resolution
 */
export const validateImageResolution = (file) => {
    return new Promise((resolve) => {
        const img = new Image();
        const url = URL.createObjectURL(file);

        img.onload = () => {
            URL.revokeObjectURL(url);

            const { width, height } = img;

            if (width < IMAGE_VALIDATION.MIN_RESOLUTION || height < IMAGE_VALIDATION.MIN_RESOLUTION) {
                resolve({
                    valid: false,
                    error: `Image resolution too low. Minimum ${IMAGE_VALIDATION.MIN_RESOLUTION}x${IMAGE_VALIDATION.MIN_RESOLUTION} required.`
                });
            } else if (width > IMAGE_VALIDATION.MAX_RESOLUTION || height > IMAGE_VALIDATION.MAX_RESOLUTION) {
                resolve({
                    valid: false,
                    error: `Image resolution too high. Maximum ${IMAGE_VALIDATION.MAX_RESOLUTION}x${IMAGE_VALIDATION.MAX_RESOLUTION} allowed.`
                });
            } else {
                resolve({ valid: true, width, height });
            }
        };

        img.onerror = () => {
            URL.revokeObjectURL(url);
            resolve({ valid: false, error: 'Failed to load image' });
        };

        img.src = url;
    });
};

/**
 * Detect image blur using canvas analysis
 */
export const detectBlur = (file) => {
    return new Promise((resolve) => {
        const img = new Image();
        const url = URL.createObjectURL(file);

        img.onload = () => {
            URL.revokeObjectURL(url);

            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            // Use smaller canvas for performance
            const size = 100;
            canvas.width = size;
            canvas.height = size;

            ctx.drawImage(img, 0, 0, size, size);
            const imageData = ctx.getImageData(0, 0, size, size);
            const data = imageData.data;

            // Simple edge detection for blur estimation
            let edgeStrength = 0;
            for (let i = 0; i < data.length - 4; i += 4) {
                const diff = Math.abs(data[i] - data[i + 4]);
                edgeStrength += diff;
            }

            const avgEdgeStrength = edgeStrength / (data.length / 4);
            const isBlurry = avgEdgeStrength < 10; // Threshold for blur detection

            resolve({
                isBlurry,
                edgeStrength: avgEdgeStrength,
                warning: isBlurry ? 'Image appears blurry. This may affect detection accuracy.' : null
            });
        };

        img.onerror = () => {
            URL.revokeObjectURL(url);
            resolve({ isBlurry: false, warning: null });
        };

        img.src = url;
    });
};

/**
 * Check image lighting quality
 */
export const checkLighting = (file) => {
    return new Promise((resolve) => {
        const img = new Image();
        const url = URL.createObjectURL(file);

        img.onload = () => {
            URL.revokeObjectURL(url);

            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            const size = 100;
            canvas.width = size;
            canvas.height = size;

            ctx.drawImage(img, 0, 0, size, size);
            const imageData = ctx.getImageData(0, 0, size, size);
            const data = imageData.data;

            // Calculate average brightness
            let totalBrightness = 0;
            for (let i = 0; i < data.length; i += 4) {
                const r = data[i];
                const g = data[i + 1];
                const b = data[i + 2];
                const brightness = (r + g + b) / 3;
                totalBrightness += brightness;
            }

            const avgBrightness = totalBrightness / (data.length / 4);

            let warning = null;
            if (avgBrightness < 50) {
                warning = 'Image is too dark. Better lighting may improve detection.';
            } else if (avgBrightness > 200) {
                warning = 'Image is overexposed. Reduce lighting for better results.';
            }

            resolve({
                brightness: avgBrightness,
                warning
            });
        };

        img.onerror = () => {
            URL.revokeObjectURL(url);
            resolve({ brightness: 128, warning: null });
        };

        img.src = url;
    });
};

/**
 * Comprehensive image validation
 */
export const validateImage = async (file) => {
    const errors = [];
    const warnings = [];

    // Format validation
    const formatResult = validateImageFormat(file);
    if (!formatResult.valid) {
        errors.push(formatResult.error);
        return { valid: false, errors, warnings };
    }

    // Size validation
    const sizeResult = validateImageSize(file);
    if (!sizeResult.valid) {
        errors.push(sizeResult.error);
        return { valid: false, errors, warnings };
    }

    // Resolution validation
    const resolutionResult = await validateImageResolution(file);
    if (!resolutionResult.valid) {
        errors.push(resolutionResult.error);
        return { valid: false, errors, warnings };
    }

    // Blur detection
    const blurResult = await detectBlur(file);
    if (blurResult.warning) {
        warnings.push(blurResult.warning);
    }

    // Lighting check
    const lightingResult = await checkLighting(file);
    if (lightingResult.warning) {
        warnings.push(lightingResult.warning);
    }

    return {
        valid: true,
        errors: [],
        warnings,
        metadata: {
            width: resolutionResult.width,
            height: resolutionResult.height,
            size: file.size,
            type: file.type
        }
    };
};
