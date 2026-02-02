import React, { createContext, useContext, useState } from 'react';

const AnalysisContext = createContext();

export const useAnalysis = () => {
    const context = useContext(AnalysisContext);
    if (!context) {
        throw new Error('useAnalysis must be used within AnalysisProvider');
    }
    return context;
};

export const AnalysisProvider = ({ children }) => {
    const [currentAnalysis, setCurrentAnalysis] = useState(null);
    const [analysisHistory, setAnalysisHistory] = useState([]);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const saveAnalysis = (analysis) => {
        setCurrentAnalysis(analysis);

        // Add to history
        const historyItem = {
            id: Date.now().toString(),
            date: analysis.timestamp,
            disease: analysis.disease.name,
            severity: analysis.severity.label,
            severityPercentage: analysis.severity.percentage,
            confidence: analysis.confidence,
            thumbnail: analysis.imageUrl,
            fullData: analysis
        };

        setAnalysisHistory(prev => [historyItem, ...prev]);
    };

    const clearCurrentAnalysis = () => {
        setCurrentAnalysis(null);
    };

    const deleteHistoryItem = (id) => {
        setAnalysisHistory(prev => prev.filter(item => item.id !== id));
    };

    const value = {
        currentAnalysis,
        analysisHistory,
        isAnalyzing,
        setIsAnalyzing,
        saveAnalysis,
        clearCurrentAnalysis,
        deleteHistoryItem
    };

    return (
        <AnalysisContext.Provider value={value}>
            {children}
        </AnalysisContext.Provider>
    );
};
