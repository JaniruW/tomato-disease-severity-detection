import React, { Component, createContext } from 'react';

const AnalysisContext = createContext();

/**
 * AnalysisProvider - Class-based Context Provider for OOP Architecture
 */
class AnalysisProvider extends Component {
    constructor(props) {
        super(props);

        // Initialize state
        this.state = {
            currentAnalysis: null,
            isAnalyzing: false
        };

        // Bind methods
        this.saveAnalysis = this.saveAnalysis.bind(this);
        this.clearCurrentAnalysis = this.clearCurrentAnalysis.bind(this);
        this.setIsAnalyzing = this.setIsAnalyzing.bind(this);
    }

    /**
     * Save analysis results
     * @param {Object} analysis - Analysis data from backend
     */
    saveAnalysis(analysis) {
        this.setState({ currentAnalysis: analysis });
    }

    /**
     * Clear current analysis
     */
    clearCurrentAnalysis() {
        this.setState({ currentAnalysis: null });
    }


    /**
     * Set analyzing state
     * @param {boolean} isAnalyzing - Whether analysis is in progress
     */
    setIsAnalyzing(isAnalyzing) {
        this.setState({ isAnalyzing });
    }

    render() {
        const { children } = this.props;
        const { currentAnalysis, isAnalyzing } = this.state;

        const contextValue = {
            currentAnalysis,
            isAnalyzing,
            setIsAnalyzing: this.setIsAnalyzing,
            saveAnalysis: this.saveAnalysis,
            clearCurrentAnalysis: this.clearCurrentAnalysis
        };

        return (
            <AnalysisContext.Provider value={contextValue}>
                {children}
            </AnalysisContext.Provider>
        );
    }
}

/**
 * Custom hook for consuming AnalysisContext
 */
const useAnalysis = () => {
    const context = React.useContext(AnalysisContext);
    if (!context) {
        throw new Error('useAnalysis must be used within AnalysisProvider');
    }
    return context;
};

export { AnalysisProvider, useAnalysis };
export default AnalysisContext;
