import React, { useState } from 'react';
import { Eye, EyeOff, Layers, ZoomIn, Info } from 'lucide-react';
import Card from './ui/Card';
import Button from './ui/Button';

const GradCAMViewer = ({ gradcam, diseaseName }) => {
    const [viewMode, setViewMode] = useState('side-by-side'); // 'side-by-side', 'overlay', 'original', 'heatmap'
    const [overlayOpacity, setOverlayOpacity] = useState(0.5);
    const [showInfo, setShowInfo] = useState(true);

    if (!gradcam) return null;

    const { original, overlay, contour } = gradcam;

    // Helper to handle both base64 and URLs
    const formatImageSrc = (src) => {
        if (!src) return '';
        if (src.startsWith('data:') || src.startsWith('blob:') || src.startsWith('http')) {
            return src;
        }
        return `data:image/jpeg;base64,${src}`;
    };

    return (
        <Card
            title="Explainable AI Results (Grad-CAM++)"
            subtitle="Detailed analysis of lesion locations and model focus areas"
            className="animate-fade-in"
            hover
        >
            <div className="space-y-6">
                {/* Info Banner */}
                {showInfo && (
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                        <div className="flex items-start justify-between">
                            <div className="flex items-start space-x-3 flex-1">
                                <Info className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                                <div>
                                    <h4 className="text-sm font-semibold text-purple-900 mb-1">
                                        Advanced Lesion Detection
                                    </h4>
                                    <p className="text-sm text-purple-800 leading-relaxed">
                                        We use <strong>Grad-CAM++</strong> to pinpoint infected areas. 
                                        The <strong>Heatmap</strong> shows overall model focus, 
                                        while <strong>Lesion Contours</strong> (yellow borders) 
                                        automatically detect and outline specific symptoms.
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => setShowInfo(false)}
                                className="text-purple-400 hover:text-purple-600 ml-2"
                            >
                                <EyeOff size={16} />
                            </button>
                        </div>
                    </div>
                )}

                {!showInfo && (
                    <button
                        onClick={() => setShowInfo(true)}
                        className="text-sm text-gray-500 hover:text-gray-700 flex items-center space-x-1"
                    >
                        <Eye size={16} />
                        <span>Show explanation</span>
                    </button>
                )}

                {/* 3-Column Display - Fixed Side-by-Side as requested */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Original Image */}
                    <div className="space-y-2">
                        <p className="text-sm font-bold text-gray-700 text-center uppercase tracking-wider">
                            Original Image
                        </p>
                        <div className="bg-gray-100 rounded-xl p-2 shadow-inner">
                            <img
                                src={formatImageSrc(original)}
                                alt="Original leaf"
                                className="w-full h-64 object-contain bg-white rounded-lg shadow-sm"
                            />
                        </div>
                    </div>

                    {/* Grad-CAM++ Heatmap */}
                    <div className="space-y-2">
                        <p className="text-sm font-bold text-gray-700 text-center uppercase tracking-wider">
                            Grad-CAM++ Heatmap
                        </p>
                        <div className="bg-gray-100 rounded-xl p-2 shadow-inner">
                            <img
                                src={formatImageSrc(overlay)}
                                alt="Grad-CAM++ overlay"
                                className="w-full h-64 object-contain bg-white rounded-lg shadow-sm"
                            />
                        </div>
                    </div>

                    {/* Lesion Contours */}
                    <div className="space-y-2">
                        <p className="text-sm font-bold text-gray-700 text-center uppercase tracking-wider">
                            Lesion Contours
                        </p>
                        <div className="bg-gray-100 rounded-xl p-2 shadow-inner border-2 border-yellow-400/30">
                            <img
                                src={formatImageSrc(contour)}
                                alt="Lesion contours"
                                className="w-full h-64 object-contain bg-white rounded-lg shadow-sm"
                            />
                        </div>
                    </div>
                </div>

                {/* Legend & Details */}
                <div className="bg-gray-50 rounded-lg p-5 border border-gray-100">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="space-y-2">
                            <h4 className="text-sm font-bold text-gray-900">Visualization Legend</h4>
                            <div className="flex flex-wrap gap-4">
                                <div className="flex items-center space-x-2">
                                    <div className="w-4 h-4 bg-red-500 rounded-sm"></div>
                                    <span className="text-xs text-gray-600">High Severity</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <div className="w-4 h-4 bg-yellow-500 rounded-sm"></div>
                                    <span className="text-xs text-gray-600">Medium Severity</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <div className="w-4 h-4 border-2 border-yellow-400 rounded-sm"></div>
                                    <span className="text-xs text-gray-600 font-medium">Lesion Boundary</span>
                                </div>
                            </div>
                        </div>
                        <div className="text-xs text-gray-500 max-w-sm italic">
                            Heatmap areas indicate where {diseaseName || 'the disease'} symptoms were most prominently detected.
                            Yellow borders outline suspected lesions based on a 60% confidence threshold.
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default GradCAMViewer;
