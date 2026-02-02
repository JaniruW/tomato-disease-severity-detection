import React, { useState } from 'react';
import { Eye, EyeOff, Layers, ZoomIn, Info } from 'lucide-react';
import Card from './ui/Card';
import Button from './ui/Button';

const GradCAMViewer = ({ gradcam, diseaseName }) => {
    const [viewMode, setViewMode] = useState('side-by-side'); // 'side-by-side', 'overlay', 'original', 'heatmap'
    const [overlayOpacity, setOverlayOpacity] = useState(0.5);
    const [showInfo, setShowInfo] = useState(true);

    if (!gradcam) return null;

    const { original, heatmap, overlay } = gradcam;

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
            title="Explainable AI Visualization (Grad-CAM)"
            subtitle="See which parts of the leaf influenced the disease detection"
            className="animate-fade-in"
            hover
        >
            <div className="space-y-4">
                {/* Info Banner */}
                {showInfo && (
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                        <div className="flex items-start justify-between">
                            <div className="flex items-start space-x-3 flex-1">
                                <Info className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                                <div>
                                    <h4 className="text-sm font-semibold text-purple-900 mb-1">
                                        What is Grad-CAM?
                                    </h4>
                                    <p className="text-sm text-purple-800 leading-relaxed">
                                        Gradient-weighted Class Activation Mapping (Grad-CAM) highlights the regions
                                        of the leaf that were most important for the AI's decision. Warmer colors (red/yellow)
                                        indicate areas with higher influence on the disease prediction.
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

                {/* View Mode Selector */}
                <div className="flex flex-wrap gap-2">
                    <Button
                        variant={viewMode === 'side-by-side' ? 'primary' : 'outline'}
                        size="sm"
                        onClick={() => setViewMode('side-by-side')}
                        icon={<Layers size={16} />}
                    >
                        Side by Side
                    </Button>
                    <Button
                        variant={viewMode === 'overlay' ? 'primary' : 'outline'}
                        size="sm"
                        onClick={() => setViewMode('overlay')}
                        icon={<Layers size={16} />}
                    >
                        Overlay
                    </Button>
                    <Button
                        variant={viewMode === 'original' ? 'primary' : 'outline'}
                        size="sm"
                        onClick={() => setViewMode('original')}
                        icon={<Eye size={16} />}
                    >
                        Original Only
                    </Button>
                    <Button
                        variant={viewMode === 'heatmap' ? 'primary' : 'outline'}
                        size="sm"
                        onClick={() => setViewMode('heatmap')}
                        icon={<ZoomIn size={16} />}
                    >
                        Heatmap Only
                    </Button>
                </div>

                {/* Image Display */}
                <div className="bg-gray-100 rounded-lg p-4">

                    {viewMode === 'side-by-side' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm font-medium text-gray-700 mb-2">Original Image</p>
                                <img
                                    src={formatImageSrc(original)}
                                    alt="Original leaf"
                                    className="w-full h-64 object-contain bg-white rounded-lg shadow-sm"
                                />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-700 mb-2">Grad-CAM Heatmap</p>
                                <img
                                    src={formatImageSrc(heatmap || original)}
                                    alt="Grad-CAM heatmap"
                                    className="w-full h-64 object-contain bg-white rounded-lg shadow-sm"
                                />
                            </div>
                        </div>
                    )}

                    {viewMode === 'overlay' && (
                        <div className="space-y-4">
                            <div>
                                <img
                                    src={formatImageSrc(overlay || original)}
                                    alt="Grad-CAM overlay"
                                    className="w-full h-96 object-contain bg-white rounded-lg shadow-sm"
                                />
                            </div>

                            {/* Note: Opacity slider removed as overlay is pre-rendered by backend */}
                            <p className="text-xs text-gray-500 text-center">
                                Overlay combines original image with heatmap (60%/40% blend)
                            </p>
                        </div>
                    )}

                    {viewMode === 'original' && (
                        <div>
                            <img
                                src={formatImageSrc(original)}
                                alt="Original leaf"
                                className="w-full h-96 object-contain bg-white rounded-lg shadow-sm mx-auto"
                            />
                        </div>
                    )}

                    {viewMode === 'heatmap' && (
                        <div>
                            <img
                                src={formatImageSrc(heatmap || original)}
                                alt="Grad-CAM heatmap"
                                className="w-full h-96 object-contain bg-white rounded-lg shadow-sm mx-auto"
                            />
                        </div>
                    )}
                </div>

                {/* Heatmap Legend */}
                <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">Heatmap Legend</h4>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <div className="w-8 h-4 bg-gradient-to-r from-blue-500 to-green-500 rounded"></div>
                            <span className="text-xs text-gray-600">Low Influence</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="w-8 h-4 bg-gradient-to-r from-yellow-500 to-red-500 rounded"></div>
                            <span className="text-xs text-gray-600">High Influence</span>
                        </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-3">
                        Red/yellow regions indicate areas where {diseaseName || 'the disease'} symptoms
                        were most prominently detected by the AI model.
                    </p>
                </div>
            </div>
        </Card>
    );
};

export default GradCAMViewer;
