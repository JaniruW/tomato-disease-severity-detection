// Disease information database
export const DISEASES = {
    'early_blight': {
        id: 'early_blight',
        name: 'Early Blight',
        description: 'Early blight is a common fungal disease caused by Alternaria solani. It affects leaves, stems, and fruits, causing dark brown spots with concentric rings.',
        symptoms: [
            'Dark brown spots with concentric rings on older leaves',
            'Yellowing around the spots',
            'Leaf drop in severe cases',
            'Stem lesions near soil line'
        ],
        causes: [
            'Warm, humid weather',
            'Poor air circulation',
            'Overhead watering',
            'Infected plant debris'
        ]
    },
    'late_blight': {
        id: 'late_blight',
        name: 'Late Blight',
        description: 'Late blight is a devastating disease caused by Phytophthora infestans. It can destroy entire crops within days under favorable conditions.',
        symptoms: [
            'Water-soaked spots on leaves',
            'White fuzzy growth on leaf undersides',
            'Brown lesions on stems',
            'Rapid plant death'
        ],
        causes: [
            'Cool, wet weather',
            'High humidity',
            'Infected seed potatoes',
            'Wind-dispersed spores'
        ]
    },
    'leaf_mold': {
        id: 'leaf_mold',
        name: 'Leaf Mold',
        description: 'Leaf mold is caused by the fungus Passalora fulva. It primarily affects greenhouse tomatoes but can occur in field conditions.',
        symptoms: [
            'Pale green to yellow spots on upper leaf surface',
            'Olive-green to brown velvety growth on lower surface',
            'Leaf curling and wilting',
            'Premature leaf drop'
        ],
        causes: [
            'High humidity (above 85%)',
            'Poor ventilation',
            'Dense plant canopy',
            'Overhead irrigation'
        ]
    },
    'septoria_leaf_spot': {
        id: 'septoria_leaf_spot',
        name: 'Septoria Leaf Spot',
        description: 'Septoria leaf spot is caused by Septoria lycopersici. It is one of the most destructive tomato diseases.',
        symptoms: [
            'Small circular spots with dark borders',
            'Gray centers with tiny black dots',
            'Starts on lower leaves',
            'Progressive defoliation'
        ],
        causes: [
            'Wet, humid conditions',
            'Splashing water',
            'Infected plant debris',
            'Warm temperatures (60-80°F)'
        ]
    },
    'bacterial_spot': {
        id: 'bacterial_spot',
        name: 'Bacterial Spot',
        description: 'Bacterial spot is caused by Xanthomonas species. It affects leaves, stems, and fruits.',
        symptoms: [
            'Small, dark brown spots on leaves',
            'Yellow halos around spots',
            'Raised spots on fruits',
            'Leaf drop and defoliation'
        ],
        causes: [
            'Warm, wet weather',
            'Overhead irrigation',
            'Contaminated seeds',
            'Infected transplants'
        ]
    },
    'healthy': {
        id: 'healthy',
        name: 'Healthy Plant',
        description: 'The plant appears healthy with no visible signs of disease.',
        symptoms: [
            'Vibrant green leaves',
            'No discoloration or spots',
            'Strong stem structure',
            'Normal growth pattern'
        ],
        causes: []
    }
};

// Severity levels
export const SEVERITY_LEVELS = {
    EARLY: {
        label: 'Early Stage',
        color: '#10b981',
        bgColor: '#ecfdf5',
        textColor: '#065f46',
        range: [0, 33],
        icon: '🟢'
    },
    MID: {
        label: 'Mid Stage',
        color: '#f59e0b',
        bgColor: '#fffbeb',
        textColor: '#92400e',
        range: [34, 66],
        icon: '🟡'
    },
    LATE: {
        label: 'Late Stage',
        color: '#ef4444',
        bgColor: '#fef2f2',
        textColor: '#991b1b',
        range: [67, 100],
        icon: '🔴'
    }
};

// Treatment recommendations based on disease and severity
export const RECOMMENDATIONS = {
    early_blight: {
        early: {
            treatments: [
                'Remove and destroy affected leaves',
                'Apply copper-based fungicide',
                'Improve air circulation by pruning',
                'Mulch around plants to prevent soil splash'
            ],
            preventive: [
                'Water at soil level, avoid wetting foliage',
                'Space plants properly for air circulation',
                'Rotate crops annually',
                'Use disease-resistant varieties'
            ],
            priority: 'medium'
        },
        mid: {
            treatments: [
                'Apply fungicide every 7-10 days',
                'Remove severely infected leaves',
                'Increase plant spacing if possible',
                'Apply organic fungicides (neem oil, copper)'
            ],
            preventive: [
                'Monitor plants daily',
                'Avoid overhead watering',
                'Remove plant debris regularly',
                'Apply preventive fungicide sprays'
            ],
            priority: 'high'
        },
        late: {
            treatments: [
                'Consider removing severely infected plants',
                'Intensive fungicide treatment',
                'Improve drainage and air circulation',
                'Harvest remaining healthy fruits'
            ],
            preventive: [
                'Destroy infected plant material',
                'Sanitize tools and equipment',
                'Plan crop rotation for next season',
                'Test soil and amend as needed'
            ],
            priority: 'critical'
        }
    },
    late_blight: {
        early: {
            treatments: [
                'Apply systemic fungicide immediately',
                'Remove infected plant parts',
                'Improve drainage',
                'Reduce humidity around plants'
            ],
            preventive: [
                'Monitor weather conditions',
                'Use resistant varieties',
                'Ensure good air circulation',
                'Avoid overhead irrigation'
            ],
            priority: 'high'
        },
        mid: {
            treatments: [
                'Aggressive fungicide application',
                'Remove heavily infected plants',
                'Protect neighboring plants',
                'Apply copper-based fungicides'
            ],
            preventive: [
                'Isolate infected area',
                'Destroy infected material properly',
                'Disinfect tools after each use',
                'Monitor spread to other plants'
            ],
            priority: 'critical'
        },
        late: {
            treatments: [
                'Remove and destroy all infected plants',
                'Do not compost infected material',
                'Treat surrounding soil',
                'Consider crop rotation'
            ],
            preventive: [
                'Clean up all plant debris',
                'Sanitize growing area',
                'Plan for resistant varieties next season',
                'Improve field drainage'
            ],
            priority: 'critical'
        }
    },
    // Add similar structures for other diseases
    healthy: {
        early: {
            treatments: ['Continue regular care', 'Monitor for any changes'],
            preventive: ['Maintain good cultural practices', 'Regular inspection'],
            priority: 'low'
        }
    }
};

// Get severity level from percentage
export const getSeverityLevel = (percentage) => {
    if (percentage <= 33) return 'EARLY';
    if (percentage <= 66) return 'MID';
    return 'LATE';
};

// Get recommendations for disease and severity
export const getRecommendations = (diseaseId, severityLevel) => {
    const disease = diseaseId.toLowerCase().replace(/ /g, '_');
    const severity = severityLevel.toLowerCase();

    if (RECOMMENDATIONS[disease] && RECOMMENDATIONS[disease][severity]) {
        return RECOMMENDATIONS[disease][severity];
    }

    return {
        treatments: ['Consult with agricultural expert'],
        preventive: ['Monitor plant health regularly'],
        priority: 'medium'
    };
};

// Image validation constants
export const IMAGE_VALIDATION = {
    MAX_SIZE: 5 * 1024 * 1024, // 5MB
    ALLOWED_FORMATS: ['image/jpeg', 'image/jpg', 'image/png'],
    MIN_RESOLUTION: 224, // Minimum width/height
    MAX_RESOLUTION: 4096
};
