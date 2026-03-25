// Disease information database
export const DISEASES = {
    'early_blight': {
        id: 'early_blight',
        name: 'Early Blight',
        description: 'Early blight, caused by Alternaria fungus, is the most common type of leaf spot disease on tomatoes. It is more prevalent in hot, humid regions and remains in the soil for one year.',
        symptoms: [
            'Dark brown spots encircled with rings starting on lowest leaves',
            'Foliage shrivels, dries up, and falls off',
            'Lesions develop on stems and fruits',
            'Defoliation leading to sunscald'
        ],
        management: [
            'Remove lower leaves, including up to a third of infected foliage',
            'Apply tomato fungicide at first sign of infection',
            'Do not compost affected plants'
        ],
        prevention: [
            'Water at soil level and use mulch',
            'Keep adequate space between plants and rows',
            'Rotate tomato plants and other nightshades every two years',
            'Use copper and/or sulfur sprays as a deterrent'
        ]
    },
    'late_blight': {
        id: 'late_blight',
        name: 'Late Blight',
        description: 'Late blight is a mold disease affecting tomato leaves, stems, and fruit. It develops in cool, wet weather and spreads rapidly.',
        symptoms: [
            'Greasy-looking, irregularly shaped dark brown blotches with green-gray edges',
            'White mold rings around spots in wet weather',
            'Spots eventually turn dry and papery',
            'Blackened areas may appear on the stems',
            'Fruit develops large, greasy gray spots'
        ],
        management: [
            'Apply copper sprays for some control',
            'Use Serenade fungicide as a deterrent',
            'Remove all debris and rotate crops'
        ],
        prevention: [
            'Rotate crops each year',
            'Plant blight-resistant varieties',
            'Promote air circulation between plants',
            'Prune leaves that touch'
        ]
    },
    'leaf_mold': {
        id: 'leaf_mold',
        name: 'Leaf Mold',
        description: 'Leaf mold is a fungus caused by Passalora fulva and it occurs most frequently in humid conditions.',
        symptoms: [
            'Pale green or yellowish spots on the upper leaves',
            'Olive-green to brown velvety growth on lower surface',
            'Leathery, blackish rot near the stem on fruits'
        ],
        management: [
            'Increase air circulation by pruning, spacing, and staking',
            'Avoid watering overhead to keep leaves dry'
        ],
        prevention: [
            'Implement strict crop rotation',
            'Use preventive fungicides',
            'Provide proper spacing'
        ]
    },
    'septoria_leaf_spot': {
        id: 'septoria_leaf_spot',
        name: 'Septoria Leaf Spot',
        description: 'The Septoria fungus causes septoria leaf spot, affecting leaves but not the fruit. This fungus thrives in warm, wet weather.',
        symptoms: [
            'Multiple small, dark circles (1/8 to 1/4 inch diameter)',
            'Spots develop a tan or gray center',
            'Leaves eventually wilt and fall off',
            'Spreads rapidly from older to new leaves'
        ],
        management: [
            'Repeated applications with a tomato fungicide or biofungicide',
            'Use copper sprays or Serenade fungicide',
            'Remove infected leaves immediately'
        ],
        prevention: [
            'Maintain good garden sanitation',
            'Clean tools before and after working with plants',
            'Water at ground level',
            'Rotate tomato crops every three years'
        ]
    },
    'bacterial_spot': {
        id: 'bacterial_spot',
        name: 'Bacterial Spot',
        description: 'Bacterial spot is a disease that affects tomatoes and peppers in particularly hot, humid conditions, resulting in spotty and pitted fruits.',
        symptoms: [
            'Small brown spots with a yellow ring around them on leaves',
            'Spots often fall away and leave holes behind',
            'Fruits have scabby spots'
        ],
        management: [
            'Do not eat infected tomatoes',
            'Remove infected plants',
            'Rotate crops'
        ],
        prevention: [
            'Choose resistant varieties',
            'Water in the morning to allow drying time',
            'Space out plants properly'
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
        management: ['Continue regular maintenance'],
        prevention: ['Monitor regularly for any changes']
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
            treatments: DISEASES.early_blight.management,
            preventive: DISEASES.early_blight.prevention,
            priority: 'medium'
        },
        mid: {
            treatments: DISEASES.early_blight.management,
            preventive: DISEASES.early_blight.prevention,
            priority: 'high'
        },
        late: {
            treatments: DISEASES.early_blight.management,
            preventive: DISEASES.early_blight.prevention,
            priority: 'critical'
        }
    },
    late_blight: {
        early: {
            treatments: DISEASES.late_blight.management,
            preventive: DISEASES.late_blight.prevention,
            priority: 'high'
        },
        mid: {
            treatments: DISEASES.late_blight.management,
            preventive: DISEASES.late_blight.prevention,
            priority: 'critical'
        },
        late: {
            treatments: DISEASES.late_blight.management,
            preventive: DISEASES.late_blight.prevention,
            priority: 'critical'
        }
    },
    septoria_leaf_spot: {
        early: {
            treatments: DISEASES.septoria_leaf_spot.management,
            preventive: DISEASES.septoria_leaf_spot.prevention,
            priority: 'medium'
        },
        mid: {
            treatments: DISEASES.septoria_leaf_spot.management,
            preventive: DISEASES.septoria_leaf_spot.prevention,
            priority: 'high'
        },
        late: {
            treatments: DISEASES.septoria_leaf_spot.management,
            preventive: DISEASES.septoria_leaf_spot.prevention,
            priority: 'critical'
        }
    },
    leaf_mold: {
        early: {
            treatments: DISEASES.leaf_mold.management,
            preventive: DISEASES.leaf_mold.prevention,
            priority: 'medium'
        },
        mid: {
            treatments: DISEASES.leaf_mold.management,
            preventive: DISEASES.leaf_mold.prevention,
            priority: 'high'
        },
        late: {
            treatments: DISEASES.leaf_mold.management,
            preventive: DISEASES.leaf_mold.prevention,
            priority: 'critical'
        }
    },
    bacterial_spot: {
        early: {
            treatments: DISEASES.bacterial_spot.management,
            preventive: DISEASES.bacterial_spot.prevention,
            priority: 'medium'
        },
        mid: {
            treatments: DISEASES.bacterial_spot.management,
            preventive: DISEASES.bacterial_spot.prevention,
            priority: 'high'
        },
        late: {
            treatments: DISEASES.bacterial_spot.management,
            preventive: DISEASES.bacterial_spot.prevention,
            priority: 'critical'
        }
    },
    healthy: {
        early: {
            treatments: DISEASES.healthy.management,
            preventive: DISEASES.healthy.prevention,
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
