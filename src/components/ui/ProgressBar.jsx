import React from 'react';

const ProgressBar = ({
    value = 0,
    max = 100,
    color = 'primary',
    size = 'md',
    showLabel = false,
    label = null,
    animated = true,
    className = ''
}) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

    const colors = {
        primary: 'bg-primary-600',
        success: 'bg-green-600',
        warning: 'bg-yellow-500',
        danger: 'bg-red-600',
        early: 'bg-severity-early',
        mid: 'bg-severity-mid',
        late: 'bg-severity-late'
    };

    const sizes = {
        sm: 'h-2',
        md: 'h-3',
        lg: 'h-4'
    };

    return (
        <div className={className}>
            {(showLabel || label) && (
                <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">
                        {label || `${percentage.toFixed(0)}%`}
                    </span>
                    {showLabel && !label && (
                        <span className="text-sm font-medium text-gray-700">
                            {percentage.toFixed(0)}%
                        </span>
                    )}
                </div>
            )}

            <div className={`w-full bg-gray-200 rounded-full overflow-hidden ${sizes[size]}`}>
                <div
                    className={`${colors[color]} ${sizes[size]} rounded-full transition-all duration-500 ease-out ${animated ? 'animate-pulse-slow' : ''
                        }`}
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    );
};

export default ProgressBar;
