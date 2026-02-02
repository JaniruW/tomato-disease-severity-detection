import React from 'react';
import { Activity, Info } from 'lucide-react';
import Card from './ui/Card';
import ProgressBar from './ui/ProgressBar';

const DiseaseCard = ({ disease, confidence }) => {
    if (!disease) return null;

    return (
        <Card
            title="Disease Detection"
            className="animate-fade-in"
            hover
        >
            <div className="space-y-6">
                {/* Disease Name */}
                <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">
                        {disease.name}
                    </h2>
                    <div className="flex items-center space-x-2 text-gray-600">
                        <Activity className="w-5 h-5" />
                        <span className="text-sm">Fungal/Bacterial Disease</span>
                    </div>
                </div>

                {/* Confidence Score */}
                <div>
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">Confidence Score</span>
                        <span className="text-2xl font-bold text-primary-600">{confidence}%</span>
                    </div>
                    <ProgressBar
                        value={confidence}
                        max={100}
                        color={confidence > 90 ? 'success' : confidence > 75 ? 'primary' : 'warning'}
                        size="lg"
                    />
                    <p className="text-xs text-gray-500 mt-2">
                        {confidence > 90 ? 'Very High Confidence' : confidence > 75 ? 'High Confidence' : 'Moderate Confidence'}
                    </p>
                </div>

                {/* Description */}
                {disease.description && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-start space-x-3">
                            <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                            <div>
                                <h4 className="text-sm font-semibold text-blue-900 mb-1">About This Disease</h4>
                                <p className="text-sm text-blue-800 leading-relaxed">
                                    {disease.description}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Symptoms */}
                {disease.symptoms && disease.symptoms.length > 0 && (
                    <div>
                        <h4 className="text-sm font-semibold text-gray-900 mb-3">Common Symptoms</h4>
                        <ul className="space-y-2">
                            {disease.symptoms.map((symptom, index) => (
                                <li key={index} className="flex items-start space-x-2 text-sm text-gray-700">
                                    <span className="text-primary-600 font-bold mt-0.5">•</span>
                                    <span>{symptom}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Causes */}
                {disease.causes && disease.causes.length > 0 && (
                    <div>
                        <h4 className="text-sm font-semibold text-gray-900 mb-3">Common Causes</h4>
                        <div className="flex flex-wrap gap-2">
                            {disease.causes.map((cause, index) => (
                                <span
                                    key={index}
                                    className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full border border-gray-200"
                                >
                                    {cause}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </Card>
    );
};

export default DiseaseCard;
