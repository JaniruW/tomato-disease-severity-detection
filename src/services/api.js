import axios from 'axios';
import mockAPI from './mockData';

// API base URL 
const API_BASE_URL = import.meta.env.PROD
    ? '/api'
    : (import.meta.env.VITE_API_URL || 'http://localhost:5000/api');

// Use mock API for development
const USE_MOCK_API = import.meta.env.PROD
    ? false
    : (import.meta.env.VITE_USE_MOCK_API === 'true');

/**
 * API Service Class 
 */
class APIService {
    constructor(baseURL, useMock = false) {
        this.baseURL = baseURL;
        this.useMock = useMock;
        this.timeout = 30000; // 30 seconds

        // Create axios instance
        this.client = axios.create({
            baseURL: this.baseURL,
            headers: {
                'Content-Type': 'application/json',
            },
            timeout: this.timeout,
        });

        // Setup interceptors
        this._setupInterceptors();
    }

    /**
     * Private method to setup request/response interceptors
     */
    _setupInterceptors() {
        // Request interceptor
        this.client.interceptors.request.use(
            (config) => {
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
        this.client.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error.response) {
                    console.error('API Error:', error.response.data);
                } else if (error.request) {
                    console.error('Network Error:', error.message);
                } else {
                    console.error('Error:', error.message);
                }
                return Promise.reject(error);
            }
        );
    }

    /**
     * Analyze uploaded image
     * @param {File} imageFile - The image file to analyze
     * @returns {Promise<Object>} Analysis result
     */
    async analyzeImage(imageFile) {
        if (this.useMock) {
            return mockAPI.analyzeImage(imageFile);
        }

        try {
            const formData = new FormData();
            formData.append('image', imageFile);

            const response = await this.client.post('/analyze', formData, {
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
    }


    /**
     * Get disease information
     * @param {string} diseaseId - The disease identifier
     * @returns {Promise<Object>} Disease information
     */
    async getDiseaseInfo(diseaseId) {
        if (this.useMock) {
            return mockAPI.getDiseaseInfo(diseaseId);
        }

        try {
            const response = await this.client.get(`/diseases/${diseaseId}`);
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
    }

}

// Create singleton instance
const apiService = new APIService(API_BASE_URL, USE_MOCK_API);

// Export the instance 
export default apiService;

// Also export the class for potential direct usage
export { APIService };
