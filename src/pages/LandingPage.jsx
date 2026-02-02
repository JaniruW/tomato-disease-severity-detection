import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Leaf, Brain, TrendingUp, Shield, ArrowRight, Sparkles } from 'lucide-react';
import Button from '../components/ui/Button';

const LandingPage = () => {
    const navigate = useNavigate();

    const features = [
        {
            icon: <Brain className="w-8 h-8" />,
            title: 'AI-Powered Detection',
            description: 'Advanced deep learning models trained on thousands of tomato leaf images for accurate disease identification.'
        },
        {
            icon: <TrendingUp className="w-8 h-8" />,
            title: 'Severity Estimation',
            description: 'Precise assessment of disease progression to help you take timely action and prevent crop loss.'
        },
        {
            icon: <Sparkles className="w-8 h-8" />,
            title: 'Explainable AI',
            description: 'Grad-CAM visualization shows exactly which parts of the leaf influenced the AI\'s decision.'
        },
        {
            icon: <Shield className="w-8 h-8" />,
            title: 'Actionable Insights',
            description: 'Get specific treatment recommendations and preventive measures based on disease and severity.'
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
            {/* Hero Section */}
            <div className="container mx-auto px-4 py-16">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-16 animate-fade-in">
                        <div className="inline-flex items-center justify-center p-3 bg-primary-100 rounded-full mb-6">
                            <Leaf className="w-12 h-12 text-primary-600" />
                        </div>
                        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                            Tomato Plant Disease Detection
                            <span className="block text-primary-600 mt-2">Made Simple & Accurate</span>
                        </h1>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                            Upload a photo of your tomato leaf and get instant AI-powered disease detection
                            with severity analysis and expert treatment recommendations.
                        </p>
                        <Button
                            variant="primary"
                            size="lg"
                            className="shadow-xl hover:shadow-2xl transform hover:scale-105"
                            onClick={() => navigate('/upload')}
                            icon={<ArrowRight size={20} />}
                        >
                            Start Analysis
                        </Button>
                    </div>

                    {/* Features Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-xl p-6 shadow-md hover-lift animate-slide-up"
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                <div className="p-3 bg-primary-100 rounded-lg inline-block mb-4 text-primary-600">
                                    {feature.icon}
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                    {feature.title}
                                </h3>
                                <p className="text-sm text-gray-600 leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* How It Works */}
                    <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 mb-16">
                        <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
                            How It Works
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="text-center">
                                <div className="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                                    1
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">Upload Image</h3>
                                <p className="text-gray-600">
                                    Take a clear photo of the affected tomato leaf and upload it to our system.
                                </p>
                            </div>
                            <div className="text-center">
                                <div className="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                                    2
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">AI Analysis</h3>
                                <p className="text-gray-600">
                                    Our AI model analyzes the image to detect tomato diseases and estimate severity.
                                </p>
                            </div>
                            <div className="text-center">
                                <div className="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                                    3
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">Get Results</h3>
                                <p className="text-gray-600">
                                    Receive detailed results with treatment recommendations and XAI visualization.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* CTA Section */}
                    <div className="bg-gradient-to-r from-primary-600 to-green-600 rounded-2xl shadow-2xl p-8 md:p-12 text-center text-white">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            Ready to Protect Your Tomato Crop?
                        </h2>
                        <p className="text-lg mb-8 opacity-90">
                            Join thousands of farmers using AI to detect and treat tomato plant diseases early.
                        </p>
                        <Button
                            variant="secondary"
                            size="lg"
                            className="shadow-xl"
                            onClick={() => navigate('/upload')}
                            icon={<Leaf size={20} />}
                        >
                            Analyze Your First Leaf
                        </Button>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-8">
                <div className="container mx-auto px-4 text-center">
                    <p className="text-gray-400">
                        © 2026 Tomato Plant Disease Detection System. Final Year Project.
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
