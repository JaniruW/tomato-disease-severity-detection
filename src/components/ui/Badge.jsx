import React from 'react';

const Badge = ({
    children,
    variant = 'default',
    size = 'md',
    icon = null,
    className = '',
    ...props
}) => {
    const variants = {
        default: 'bg-gray-100 text-gray-800',
        success: 'bg-green-100 text-green-800',
        warning: 'bg-yellow-100 text-yellow-800',
        danger: 'bg-red-100 text-red-800',
        info: 'bg-blue-100 text-blue-800',
        early: 'bg-severity-early/10 text-severity-early border border-severity-early',
        mid: 'bg-severity-mid/10 text-severity-mid border border-severity-mid',
        late: 'bg-severity-late/10 text-severity-late border border-severity-late'
    };

    const sizes = {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-3 py-1 text-sm',
        lg: 'px-4 py-1.5 text-base'
    };

    return (
        <span
            className={`inline-flex items-center font-medium rounded-full ${variants[variant]} ${sizes[size]} ${className}`}
            {...props}
        >
            {icon && <span className="mr-1">{icon}</span>}
            {children}
        </span>
    );
};

export default Badge;
