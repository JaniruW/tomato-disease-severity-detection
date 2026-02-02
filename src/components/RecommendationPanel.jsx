import React from 'react';
import { Lightbulb, Shield, AlertTriangle, ExternalLink } from 'lucide-react';
import Card from './ui/Card';
import Badge from './ui/Badge';
import { getRecommendations } from '../utils/constants';

const RecommendationPanel = ({ disease, severity }) => {
    if (!disease || !severity) return null;

    const recommendations = getRecommendations(disease.id, severity.level.toLowerCase());

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'critical':
                return 'danger';
            case 'high':
                return 'warning';
            case 'medium':
                return 'info';
            default:
                return 'default';
        }
    };

    const getPriorityIcon = (priority) => {
        switch (priority) {
            case 'critical':
            case 'high':
                return <AlertTriangle className="w-5 h-5" />;
            default:
                return <Lightbulb className="w-5 h-5" />;
        }
    };

    return (
        <Card
            title="Treatment Recommendations"
            subtitle={`Based on ${disease.name} at ${severity.label}`}
            className="animate-fade-in"
            hover
        >
            <div className="space-y-6">
                {/* Priority Badge */}
                <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                    <div className="flex items-center space-x-2">
                        {getPriorityIcon(recommendations.priority)}
                        <span className="text-sm font-medium text-gray-700">Action Priority:</span>
                    </div>
                    <Badge
                        variant={getPriorityColor(recommendations.priority)}
                        size="md"
                    >
                        {recommendations.priority.toUpperCase()}
                    </Badge>
                </div>

                {/* Immediate Treatments */}
                {recommendations.treatments && recommendations.treatments.length > 0 && (
                    <div>
                        <div className="flex items-center space-x-2 mb-4">
                            <div className="p-2 bg-red-100 rounded-lg">
                                <AlertTriangle className="w-5 h-5 text-red-600" />
                            </div>
                            <h4 className="text-lg font-semibold text-gray-900">Immediate Actions</h4>
                        </div>

                        <div className="space-y-3">
                            {recommendations.treatments.map((treatment, index) => (
                                <div
                                    key={index}
                                    className="flex items-start space-x-3 p-3 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
                                >
                                    <div className="flex-shrink-0 w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
                                        {index + 1}
                                    </div>
                                    <p className="text-sm text-gray-800 leading-relaxed flex-1">
                                        {treatment}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Preventive Measures */}
                {recommendations.preventive && recommendations.preventive.length > 0 && (
                    <div>
                        <div className="flex items-center space-x-2 mb-4">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <Shield className="w-5 h-5 text-green-600" />
                            </div>
                            <h4 className="text-lg font-semibold text-gray-900">Preventive Measures</h4>
                        </div>

                        <div className="space-y-3">
                            {recommendations.preventive.map((measure, index) => (
                                <div
                                    key={index}
                                    className="flex items-start space-x-3 p-3 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors"
                                >
                                    <div className="flex-shrink-0 w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
                                        {index + 1}
                                    </div>
                                    <p className="text-sm text-gray-800 leading-relaxed flex-1">
                                        {measure}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Additional Resources */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                        <Lightbulb className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                            <h4 className="text-sm font-semibold text-blue-900 mb-2">Expert Consultation</h4>
                            <p className="text-sm text-blue-800 mb-3">
                                For severe cases or if symptoms persist, consult with a local agricultural extension
                                officer or plant pathologist for personalized treatment plans.
                            </p>
                            <a
                                href="#"
                                className="inline-flex items-center space-x-1 text-sm font-medium text-blue-600 hover:text-blue-800"
                            >
                                <span>Find local experts</span>
                                <ExternalLink className="w-4 h-4" />
                            </a>
                        </div>
                    </div>
                </div>

                {/* Important Note */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-xs text-yellow-800">
                        <strong>Note:</strong> These recommendations are general guidelines. Always follow
                        local regulations for pesticide use and consider organic alternatives when possible.
                        Effectiveness may vary based on environmental conditions and plant variety.
                    </p>
                </div>
            </div>
        </Card>
    );
};

export default RecommendationPanel;
