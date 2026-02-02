import axios from 'axios';
import mockAPI from './mockData';

// API base URL - change this when you have a backend
// API base URL - auto-detects environment
const API_BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/api' : 'http://localhost:5000/api');

// Use mock API for development (default to false in PROD)
const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API ? import.meta.env.VITE_USE_MOCK_API === 'true' : !import.meta.env.PROD;

// Create axios instance
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 30000, // 30 seconds
});

// Request interceptor
apiClient.interceptors.request.use(
    (config) => {
        // Add auth token if available
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            // Server responded with error
            console.error('API Error:', error.response.data);
        } else if (error.request) {
            // Request made but no response
            console.error('Network Error:', error.message);
        } else {
            console.error('Error:', error.message);
        }
        return Promise.reject(error);
    }
);

/**
 * API Service
 */
const api = {
    /**
     * Analyze uploaded image
     */
    analyzeImage: async (imageFile) => {
        if (USE_MOCK_API) {
            return mockAPI.analyzeImage(imageFile);
        }

        try {
            const formData = new FormData();
            formData.append('image', imageFile);

            const response = await apiClient.post('/analyze', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            const data = response.data;

            // Inject local image URL if not provided by backend
            if (data.data && !data.data.imageUrl) {
                data.data.imageUrl = URL.createObjectURL(imageFile);
            }

            return data;
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Failed to analyze image'
            };
        }
    },

    /**
     * Get analysis history
     */
    getHistory: async () => {
        if (USE_MOCK_API) {
            return mockAPI.getHistory();
        }

        try {
            const response = await apiClient.get('/history');
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Failed to fetch history'
            };
        }
    },

    /**
     * Get disease information
     */
    getDiseaseInfo: async (diseaseId) => {
        if (USE_MOCK_API) {
            return mockAPI.getDiseaseInfo(diseaseId);
        }

        try {
            const response = await apiClient.get(`/diseases/${diseaseId}`);
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Failed to fetch disease info'
            };
        }
    },

    /**
     * Save analysis to history
     */
    saveToHistory: async (analysisData) => {
        if (USE_MOCK_API) {
            return mockAPI.saveToHistory(analysisData);
        }

        try {
            const response = await apiClient.post('/history', analysisData);
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Failed to save to history'
            };
        }
    },

    /**
     * Delete history item
     */
    deleteHistoryItem: async (itemId) => {
        if (USE_MOCK_API) {
            return { success: true };
        }

        try {
            await apiClient.delete(`/history/${itemId}`);
            return { success: true };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Failed to delete item'
            };
        }
    }
};

export default api;
