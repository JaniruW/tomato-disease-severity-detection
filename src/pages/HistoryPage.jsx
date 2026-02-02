import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Trash2, Eye, Download } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { useAnalysis } from '../context/AnalysisContext';
import api from '../services/api';

const HistoryPage = () => {
    const navigate = useNavigate();
    const { analysisHistory, deleteHistoryItem } = useAnalysis();
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // 'all', 'early', 'mid', 'late'

    useEffect(() => {
        loadHistory();
    }, []);

    const loadHistory = async () => {
        setLoading(true);
        try {
            // Try to get from API first, fallback to context
            const result = await api.getHistory();
            if (result.success && result.data.length > 0) {
                setHistory(result.data);
            } else {
                setHistory(analysisHistory);
            }
        } catch (error) {
            console.error('Error loading history:', error);
            setHistory(analysisHistory);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this analysis?')) {
            await api.deleteHistoryItem(id);
            deleteHistoryItem(id);
            setHistory(prev => prev.filter(item => item.id !== id));
        }
    };

    const handleView = (item) => {
        // Navigate to results with this analysis data
        if (item.fullData) {
            navigate('/results');
        }
    };

    const getSeverityBadge = (severity) => {
        if (severity.includes('Early')) return 'early';
        if (severity.includes('Mid')) return 'mid';
        if (severity.includes('Late')) return 'late';
        return 'default';
    };

    const filteredHistory = filter === 'all'
        ? history
        : history.filter(item => getSeverityBadge(item.severity) === filter);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center">
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-6xl mx-auto">
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
                            Analysis History
                        </h1>
                        <p className="text-lg text-gray-600">
                            View and manage your past disease analyses
                        </p>
                    </div>

                    {/* Filters */}
                    <div className="mb-6 flex flex-wrap gap-3">
                        <Button
                            variant={filter === 'all' ? 'primary' : 'outline'}
                            size="sm"
                            onClick={() => setFilter('all')}
                        >
                            All ({history.length})
                        </Button>
                        <Button
                            variant={filter === 'early' ? 'success' : 'outline'}
                            size="sm"
                            onClick={() => setFilter('early')}
                        >
                            Early Stage
                        </Button>
                        <Button
                            variant={filter === 'mid' ? 'warning' : 'outline'}
                            size="sm"
                            onClick={() => setFilter('mid')}
                        >
                            Mid Stage
                        </Button>
                        <Button
                            variant={filter === 'late' ? 'danger' : 'outline'}
                            size="sm"
                            onClick={() => setFilter('late')}
                        >
                            Late Stage
                        </Button>
                    </div>

                    {/* History List */}
                    {filteredHistory.length === 0 ? (
                        <Card>
                            <div className="text-center py-12">
                                <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                    No Analysis History
                                </h3>
                                <p className="text-gray-600 mb-6">
                                    Start analyzing leaves to build your history
                                </p>
                                <Button
                                    variant="primary"
                                    onClick={() => navigate('/upload')}
                                >
                                    Analyze First Leaf
                                </Button>
                            </div>
                        </Card>
                    ) : (
                        <div className="space-y-4">
                            {filteredHistory.map((item) => (
                                <Card key={item.id} className="hover-lift">
                                    <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                                        {/* Thumbnail */}
                                        <div className="w-24 h-24 flex-shrink-0">
                                            <img
                                                src={item.thumbnail}
                                                alt={item.disease}
                                                className="w-full h-full object-cover rounded-lg"
                                            />
                                        </div>

                                        {/* Info */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between mb-2">
                                                <div>
                                                    <h3 className="text-lg font-semibold text-gray-900">
                                                        {item.disease}
                                                    </h3>
                                                    <p className="text-sm text-gray-600">
                                                        <Calendar className="w-4 h-4 inline mr-1" />
                                                        {new Date(item.date).toLocaleString()}
                                                    </p>
                                                </div>
                                                <Badge variant={getSeverityBadge(item.severity)} size="md">
                                                    {item.severity}
                                                </Badge>
                                            </div>

                                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                                                <div>
                                                    <p className="text-gray-600">Confidence</p>
                                                    <p className="font-semibold text-gray-900">{item.confidence}%</p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-600">Severity</p>
                                                    <p className="font-semibold text-gray-900">{item.severityPercentage}%</p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-600">Status</p>
                                                    <Badge variant="success" size="sm">Analyzed</Badge>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex flex-wrap gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleView(item)}
                                                icon={<Eye size={16} />}
                                            >
                                                View
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                icon={<Download size={16} />}
                                            >
                                                Export
                                            </Button>
                                            <Button
                                                variant="danger"
                                                size="sm"
                                                onClick={() => handleDelete(item.id)}
                                                icon={<Trash2 size={16} />}
                                            >
                                                Delete
                                            </Button>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}

                    {/* Stats Summary */}
                    {history.length > 0 && (
                        <Card className="mt-8">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Summary Statistics</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="text-center p-4 bg-gray-50 rounded-lg">
                                    <p className="text-2xl font-bold text-primary-600">{history.length}</p>
                                    <p className="text-sm text-gray-600 mt-1">Total Analyses</p>
                                </div>
                                <div className="text-center p-4 bg-gray-50 rounded-lg">
                                    <p className="text-2xl font-bold text-green-600">
                                        {history.filter(h => getSeverityBadge(h.severity) === 'early').length}
                                    </p>
                                    <p className="text-sm text-gray-600 mt-1">Early Stage</p>
                                </div>
                                <div className="text-center p-4 bg-gray-50 rounded-lg">
                                    <p className="text-2xl font-bold text-yellow-600">
                                        {history.filter(h => getSeverityBadge(h.severity) === 'mid').length}
                                    </p>
                                    <p className="text-sm text-gray-600 mt-1">Mid Stage</p>
                                </div>
                                <div className="text-center p-4 bg-gray-50 rounded-lg">
                                    <p className="text-2xl font-bold text-red-600">
                                        {history.filter(h => getSeverityBadge(h.severity) === 'late').length}
                                    </p>
                                    <p className="text-sm text-gray-600 mt-1">Late Stage</p>
                                </div>
                            </div>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
};

export default HistoryPage;
