import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import Card from './ui/Card';
import { SEVERITY_LEVELS } from '../utils/constants';

const SeverityChart = ({ severity }) => {
    if (!severity) return null;

    const { percentage, level } = severity;

    // Prepare data for pie chart
    const data = [
        { name: 'Affected Area', value: percentage },
        { name: 'Healthy Area', value: 100 - percentage }
    ];

    const COLORS = {
        EARLY: [SEVERITY_LEVELS.EARLY.color, '#e5e7eb'],
        MID: [SEVERITY_LEVELS.MID.color, '#e5e7eb'],
        LATE: [SEVERITY_LEVELS.LATE.color, '#e5e7eb']
    };

    const colors = COLORS[level] || COLORS.MID;

    // Custom label for pie chart
    const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
        const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);

        return (
            <text
                x={x}
                y={y}
                fill="white"
                textAnchor={x > cx ? 'start' : 'end'}
                dominantBaseline="central"
                className="text-sm font-bold"
            >
                {`${(percent * 100).toFixed(0)}%`}
            </text>
        );
    };

    return (
        <Card
            title="Severity Distribution"
            subtitle="Visual representation of infection spread"
            className="animate-fade-in"
            hover
        >
            <div className="space-y-4">
                {/* Pie Chart */}
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={renderCustomLabel}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={colors[index]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Statistics */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <p className="text-2xl font-bold" style={{ color: colors[0] }}>
                            {percentage}%
                        </p>
                        <p className="text-sm text-gray-600 mt-1">Affected Area</p>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <p className="text-2xl font-bold text-green-600">
                            {100 - percentage}%
                        </p>
                        <p className="text-sm text-gray-600 mt-1">Healthy Area</p>
                    </div>
                </div>

                {/* Interpretation */}
                <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="text-sm font-semibold text-gray-900 mb-2">Interpretation</h4>
                    <p className="text-sm text-gray-700 leading-relaxed">
                        {percentage < 33 && (
                            <>
                                The disease is in its early stages with limited spread. Early intervention
                                can prevent further damage and save most of the plant.
                            </>
                        )}
                        {percentage >= 33 && percentage < 67 && (
                            <>
                                The disease has spread to a moderate extent. Immediate treatment is necessary
                                to prevent further progression and protect the remaining healthy tissue.
                            </>
                        )}
                        {percentage >= 67 && (
                            <>
                                The disease is at an advanced stage with significant spread. Aggressive treatment
                                is critical. Consider removing severely affected plants to protect others.
                            </>
                        )}
                    </p>
                </div>
            </div>
        </Card>
    );
};

export default SeverityChart;
