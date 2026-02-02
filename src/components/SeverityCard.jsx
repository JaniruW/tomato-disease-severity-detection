import React from 'react';
import { AlertTriangle, AlertCircle, CheckCircle } from 'lucide-react';
import Card from './ui/Card';
import Badge from './ui/Badge';
import ProgressBar from './ui/ProgressBar';
import { SEVERITY_LEVELS } from '../utils/constants';

const SeverityCard = ({ severity }) => {
    if (!severity) return null;

    const { percentage, level, label, icon } = severity;

    // Get severity configuration
    const severityConfig = SEVERITY_LEVELS[level] || SEVERITY_LEVELS.MID;

    // Determine icon and message
    const getIcon = () => {
        switch (level) {
            case 'EARLY':
                return <CheckCircle className="w-8 h-8" style={{ color: severityConfig.color }} />;
            case 'MID':
                return <AlertCircle className="w-8 h-8" style={{ color: severityConfig.color }} />;
            case 'LATE':
                return <AlertTriangle className="w-8 h-8" style={{ color: severityConfig.color }} />;
            default:
                return <AlertCircle className="w-8 h-8" style={{ color: severityConfig.color }} />;
        }
    };

    const getMessage = () => {
        switch (level) {
            case 'EARLY':
                return 'Disease detected at early stage. Immediate action can prevent further spread.';
            case 'MID':
                return 'Disease has progressed to mid stage. Prompt treatment is recommended.';
            case 'LATE':
                return 'Disease is at advanced stage. Aggressive treatment required immediately.';
            default:
                return 'Disease severity has been assessed.';
        }
    };

    const getColorClass = () => {
        switch (level) {
            case 'EARLY':
                return 'early';
            case 'MID':
                return 'mid';
            case 'LATE':
                return 'late';
            default:
                return 'mid';
        }
    };

    return (
        <Card
            title="Severity Analysis"
            className="animate-fade-in"
            hover
        >
            <div className="space-y-6">
                {/* Severity Level */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        {getIcon()}
                        <div>
                            <h3 className="text-2xl font-bold text-gray-900">{label}</h3>
                            <p className="text-sm text-gray-600 mt-1">Infection Level: {percentage}%</p>
                        </div>
                    </div>
                    <Badge
                        variant={getColorClass()}
                        size="lg"
                        icon={icon}
                    >
                        {level}
                    </Badge>
                </div>

                {/* Severity Progress */}
                <div>
                    <ProgressBar
                        value={percentage}
                        max={100}
                        color={getColorClass()}
                        size="lg"
                        showLabel
                    />
                </div>

                {/* Severity Message */}
                <div
                    className="rounded-lg p-4 border"
                    style={{
                        backgroundColor: severityConfig.bgColor,
                        borderColor: severityConfig.color,
                        color: severityConfig.textColor
                    }}
                >
                    <p className="text-sm font-medium leading-relaxed">
                        {getMessage()}
                    </p>
                </div>

                {/* Severity Scale */}
                <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">Severity Scale</h4>
                    <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center space-x-2">
                                <div className="w-4 h-4 rounded-full bg-severity-early"></div>
                                <span className="text-gray-700">Early Stage (0-33%)</span>
                            </div>
                            {level === 'EARLY' && <CheckCircle className="w-4 h-4 text-severity-early" />}
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center space-x-2">
                                <div className="w-4 h-4 rounded-full bg-severity-mid"></div>
                                <span className="text-gray-700">Mid Stage (34-66%)</span>
                            </div>
                            {level === 'MID' && <CheckCircle className="w-4 h-4 text-severity-mid" />}
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center space-x-2">
                                <div className="w-4 h-4 rounded-full bg-severity-late"></div>
                                <span className="text-gray-700">Late Stage (67-100%)</span>
                            </div>
                            {level === 'LATE' && <CheckCircle className="w-4 h-4 text-severity-late" />}
                        </div>
                    </div>
                </div>

                {/* Urgency Indicator */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <span className="text-sm font-medium text-gray-700">Action Priority:</span>
                    <Badge
                        variant={level === 'LATE' ? 'danger' : level === 'MID' ? 'warning' : 'success'}
                        size="md"
                    >
                        {level === 'LATE' ? 'CRITICAL' : level === 'MID' ? 'HIGH' : 'MEDIUM'}
                    </Badge>
                </div>
            </div>
        </Card>
    );
};

export default SeverityCard;
