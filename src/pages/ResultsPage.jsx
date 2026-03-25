import React, { Component, createRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Download, ArrowLeft, Eye, ClipboardList, ChevronDown, ChevronUp } from 'lucide-react';
import { useAnalysis } from '../context/AnalysisContext';
import Button from '../components/ui/Button';
import DiseaseCard from '../components/DiseaseCard';
import SeverityCard from '../components/SeverityCard';
import GradCAMViewer from '../components/GradCAMViewer';
import RecommendationPanel from '../components/RecommendationPanel';
import { exportToPDF } from '../utils/pdfExport';


class ResultsPageClass extends Component {
    constructor(props) {
        super(props);

        // Initialize state
        this.state = {
            showExplanations: false,
            showRecommendations: false
        };

        // Create refs
        this.contentRef = createRef();

        // Bind methods
        this.handleExport = this.handleExport.bind(this);
        this.handleNavigateUpload = this.handleNavigateUpload.bind(this);
        this.toggleExplanations = this.toggleExplanations.bind(this);
        this.toggleRecommendations = this.toggleRecommendations.bind(this);
    }

    /**
     * Lifecycle method - Called after component mounts
     */
    componentDidMount() {
        const { currentAnalysis, navigate } = this.props;

        // Redirect to upload if no analysis data
        if (!currentAnalysis) {
            navigate('/upload');
        }
    }

    /**
     * Lifecycle method - Called when component updates
     */
    componentDidUpdate(prevProps) {
        const { currentAnalysis, navigate } = this.props;

        // Redirect if analysis was removed
        if (prevProps.currentAnalysis && !currentAnalysis) {
            navigate('/upload');
        }
    }

    /**
     * Navigate to upload page
     */
    handleNavigateUpload() {
        this.props.navigate('/upload');
    }

    /**
     * Toggle explanations section
     */
    toggleExplanations() {
        this.setState(prevState => ({
            showExplanations: !prevState.showExplanations
        }));
    }

    /**
     * Toggle recommendations section
     */
    toggleRecommendations() {
        this.setState(prevState => ({
            showRecommendations: !prevState.showRecommendations
        }));
    }

    /**
     * Export results to PDF
     */
    async handleExport() {
        const { currentAnalysis } = this.props;

        try {
            await exportToPDF(currentAnalysis, `analysis-report-${Date.now()}.pdf`);
        } catch (error) {
            console.error("Export failed:", error);
            alert("Failed to export report. Please try again.");
        }
    }

    render() {
        const { currentAnalysis } = this.props;
        const { showExplanations, showRecommendations } = this.state;

        if (!currentAnalysis) {
            return null;
        }

        const { disease, confidence, severity, gradcam, imageUrl } = currentAnalysis;

        return (
            <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">

                    {/* Header Actions */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                        <Button
                            variant="ghost"
                            onClick={this.handleNavigateUpload}
                            icon={<ArrowLeft size={18} />}
                        >
                            Back to Upload
                        </Button>

                        <Button
                            variant="primary"
                            onClick={this.handleExport}
                            icon={<Download size={18} />}
                        >
                            Export Report
                        </Button>
                    </div>

                    <div ref={this.contentRef} className="space-y-8">

                        {/* CORE RESULTS SECTION */}
                        <div className={`grid grid-cols-1 ${disease.id === 'healthy' ? 'max-w-2xl mx-auto w-full' : 'lg:grid-cols-2'} gap-8`}>
                            {/* Disease Info Card */}
                            <div className="h-full">
                                <DiseaseCard
                                    disease={disease}
                                    confidence={confidence}
                                />
                            </div>

                            {/* Severity Info Card - Hidden for healthy plants */}
                            {disease.id !== 'healthy' && (
                                <div className="h-full">
                                    <SeverityCard
                                        severity={severity}
                                    />
                                </div>
                            )}
                        </div>

                        {/* ACTION BUTTONS SECTION */}
                        <div className="flex flex-wrap justify-center gap-4 py-4 border-t border-gray-200 border-b">
                            <Button
                                variant={showExplanations ? "primary" : "outline"}
                                onClick={this.toggleExplanations}
                                className="min-w-[200px] justify-center"
                            >
                                <div className="flex items-center gap-2">
                                    <Eye size={18} />
                                    <span>{showExplanations ? "Hide" : "View"} Explanations</span>
                                    {showExplanations ? <ChevronUp size={16} className="ml-1" /> : <ChevronDown size={16} className="ml-1" />}
                                </div>
                            </Button>

                            {disease.id !== 'healthy' && (
                                <Button
                                    variant={showRecommendations ? "primary" : "outline"}
                                    onClick={this.toggleRecommendations}
                                    className="min-w-[200px] justify-center"
                                >
                                    <div className="flex items-center gap-2">
                                        <ClipboardList size={18} />
                                        <span>{showRecommendations ? "Hide" : "View"} Recommendations</span>
                                        {showRecommendations ? <ChevronUp size={16} className="ml-1" /> : <ChevronDown size={16} className="ml-1" />}
                                    </div>
                                </Button>
                            )}
                        </div>

                        {/* EXPANDABLE SECTIONS */}
                        <div className="space-y-8">

                            {/* 1. VISUAL EXPLANATION (GRAD-CAM) */}
                            {showExplanations && (
                                <div className="animate-fade-in-down space-y-4">
                                    <h3 className="text-xl font-bold text-gray-800 border-l-4 border-blue-500 pl-3">
                                        Visual Intelligence & Analysis
                                    </h3>

                                    {gradcam && gradcam.original ? (
                                        <GradCAMViewer
                                            gradcam={gradcam}
                                            diseaseName={disease.name}
                                        />
                                    ) : (
                                        <div className="bg-white rounded-2xl shadow-sm p-6 max-w-2xl mx-auto">
                                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                                Visual Analysis Input
                                            </h3>
                                            <div className="aspect-square relative rounded-xl overflow-hidden border border-gray-100">
                                                <img
                                                    src={imageUrl}
                                                    alt="Analyzed Leaf"
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <p className="text-sm text-gray-500 mt-4 text-center">
                                                Standard input image (XAI unavailable)
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* 2. RECOMMENDATIONS & CHART */}
                            {showRecommendations && (
                                <div className="animate-fade-in-down space-y-8">
                                    <h3 className="text-xl font-bold text-gray-800 border-l-4 border-green-500 pl-3">
                                        Detailed Report & Recommendations
                                    </h3>

                                    <div className="max-w-4xl mx-auto">
                                        <RecommendationPanel
                                            disease={disease}
                                            severity={severity}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                    </div>
                </div>
            </div>
        );
    }
}

/**
 * Wrapper component to inject hooks into class component
 */
const ResultsPage = () => {
    const { currentAnalysis } = useAnalysis();
    const navigate = useNavigate();

    return (
        <ResultsPageClass
            currentAnalysis={currentAnalysis}
            navigate={navigate}
        />
    );
};

export default ResultsPage;
export { ResultsPageClass };
