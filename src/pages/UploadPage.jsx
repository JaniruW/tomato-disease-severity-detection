import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Sparkles } from 'lucide-react';
import ImageUpload from '../components/ImageUpload';
import Button from '../components/ui/Button';
import { useAnalysis } from '../context/AnalysisContext';
import api from '../services/api';

const UploadPage = () => {
    const navigate = useNavigate();
    const { setIsAnalyzing, saveAnalysis } = useAnalysis();
    const [selectedImage, setSelectedImage] = useState(null);
    const [imageMetadata, setImageMetadata] = useState(null);
    const [isAnalyzing, setLocalAnalyzing] = useState(false);
    const [error, setError] = useState(null);

    const handleImageSelect = (file, metadata) => {
        setSelectedImage(file);
        setImageMetadata(metadata);
        setError(null);
    };

    const handleImageRemove = () => {
        setSelectedImage(null);
        setImageMetadata(null);
        setError(null);
    };

    const handleAnalyze = async () => {
        if (!selectedImage) {
            setError('Please upload an image first');
            return;
        }

        setLocalAnalyzing(true);
        setIsAnalyzing(true);
        setError(null);

        try {
            const result = await api.analyzeImage(selectedImage);

            if (result.success) {
                // Save analysis to context
                saveAnalysis(result.data);

                // Navigate to results page
                navigate('/results');
            } else {
                setError(result.error || 'Failed to analyze image. Please try again.');
            }
        } catch (err) {
            console.error('Analysis error:', err);
            setError('An unexpected error occurred. Please try again.');
        } finally {
            setLocalAnalyzing(false);
            setIsAnalyzing(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <Button
                            variant="ghost"
                            onClick={() => navigate('/')}
                            icon={<ArrowLeft size={18} />}
                            className="mb-4"
                        >
                            Back to Home
                        </Button>
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">
                            Upload Tomato Leaf Image
                        </h1>
                        <p className="text-lg text-gray-600">
                            Upload a clear photo of the affected tomato leaf for AI-powered disease detection
                        </p>
                    </div>

                    {/* Upload Section */}
                    <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
                        <ImageUpload
                            onImageSelect={handleImageSelect}
                            onImageRemove={handleImageRemove}
                            disabled={isAnalyzing}
                        />

                        {/* Image Info */}
                        {imageMetadata && (
                            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                                <h3 className="text-sm font-semibold text-gray-900 mb-2">Image Information</h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                    <div>
                                        <p className="text-gray-600">Width</p>
                                        <p className="font-medium text-gray-900">{imageMetadata.width}px</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-600">Height</p>
                                        <p className="font-medium text-gray-900">{imageMetadata.height}px</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-600">Size</p>
                                        <p className="font-medium text-gray-900">
                                            {(imageMetadata.size / 1024).toFixed(2)} KB
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-gray-600">Format</p>
                                        <p className="font-medium text-gray-900">
                                            {imageMetadata.type.split('/')[1].toUpperCase()}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Error Message */}
                        {error && (
                            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                                <p className="text-sm text-red-800">{error}</p>
                            </div>
                        )}

                        {/* Analyze Button */}
                        <div className="mt-8">
                            <Button
                                variant="primary"
                                size="lg"
                                onClick={handleAnalyze}
                                disabled={!selectedImage || isAnalyzing}
                                loading={isAnalyzing}
                                icon={!isAnalyzing && <Sparkles size={20} />}
                                className="w-full shadow-lg"
                            >
                                {isAnalyzing ? 'Analyzing Tomato Leaf...' : 'Analyze Disease'}
                            </Button>
                            <p className="text-xs text-gray-500 text-center mt-3">
                                Analysis typically takes 2-3 seconds
                            </p>
                        </div>
                    </div>

                    {/* Tips Section */}
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                        <h3 className="text-lg font-semibold text-blue-900 mb-4">
                            📸 Tips for Best Results
                        </h3>
                        <ul className="space-y-2 text-sm text-blue-800">
                            <li className="flex items-start space-x-2">
                                <span className="text-blue-600 font-bold mt-0.5">•</span>
                                <span>Use good lighting - natural daylight works best</span>
                            </li>
                            <li className="flex items-start space-x-2">
                                <span className="text-blue-600 font-bold mt-0.5">•</span>
                                <span>Focus on the affected area of the tomato leaf</span>
                            </li>
                            <li className="flex items-start space-x-2">
                                <span className="text-blue-600 font-bold mt-0.5">•</span>
                                <span>Avoid blurry images - hold your camera steady</span>
                            </li>
                            <li className="flex items-start space-x-2">
                                <span className="text-blue-600 font-bold mt-0.5">•</span>
                                <span>Fill the frame with the leaf for better accuracy</span>
                            </li>
                            <li className="flex items-start space-x-2">
                                <span className="text-blue-600 font-bold mt-0.5">•</span>
                                <span>Use a plain background if possible</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UploadPage;
