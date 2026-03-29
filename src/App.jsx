import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AnalysisProvider } from './context/AnalysisContext';

import LandingPage from './pages/LandingPage';

// Route-based code splitting for non-critical pages
const UploadPage = lazy(() => import('./pages/UploadPage'));
const ResultsPage = lazy(() => import('./pages/ResultsPage'));


// Lightweight loading component for Suspense
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
      <p className="text-gray-500 font-medium animate-pulse">Loading experience...</p>
    </div>
  </div>
);

function App() {
  return (
    <AnalysisProvider>
      <Router>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/upload" element={<UploadPage />} />
            <Route path="/results" element={<ResultsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </Router>
    </AnalysisProvider>
  );
}

export default App;

