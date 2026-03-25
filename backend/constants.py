# Disease information database
DISEASES = {
    'early_blight': {
        'id': 'early_blight',
        'name': 'Early Blight',
        'description': 'Early blight, caused by Alternaria fungus, is the most common type of leaf spot disease on tomatoes. It is more prevalent in hot, humid regions and remains in the soil for one year.',
        'symptoms': [
            'Dark brown spots encircled with rings starting on lowest leaves',
            'Foliage shrivels, dries up, and falls off',
            'Lesions develop on stems and fruits',
            'Defoliation leading to sunscald'
        ],
        'management': [
            'Remove lower leaves, including up to a third of infected foliage',
            'Apply tomato fungicide at first sign of infection',
            'Do not compost affected plants'
        ],
        'prevention': [
            'Water at soil level and use mulch',
            'Keep adequate space between plants and rows',
            'Rotate tomato plants and other nightshades every two years',
            'Use copper and/or sulfur sprays as a deterrent'
        ]
    },
    'late_blight': {
        'id': 'late_blight',
        'name': 'Late Blight',
        'description': 'Late blight is a mold disease affecting tomato leaves, stems, and fruit. It develops in cool, wet weather and spreads rapidly.',
        'symptoms': [
            'Greasy-looking, irregularly shaped dark brown blotches with green-gray edges',
            'White mold rings around spots in wet weather',
            'Spots eventually turn dry and papery',
            'Blackened areas may appear on the stems',
            'Fruit develops large, greasy gray spots'
        ],
        'management': [
            'Apply copper sprays for some control',
            'Use Serenade fungicide as a deterrent',
            'Remove all debris and rotate crops'
        ],
        'prevention': [
            'Rotate crops each year',
            'Plant blight-resistant varieties',
            'Promote air circulation between plants',
            'Prune leaves that touch'
        ]
    },
    'leaf_mold': {
        'id': 'leaf_mold',
        'name': 'Leaf Mold',
        'description': 'Leaf mold is a fungus caused by Passalora fulva and it occurs most frequently in humid conditions.',
        'symptoms': [
            'Pale green or yellowish spots on the upper leaves',
            'Olive-green to brown velvety growth on lower surface',
            'Leathery, blackish rot near the stem on fruits'
        ],
        'management': [
            'Increase air circulation by pruning, spacing, and staking',
            'Avoid watering overhead to keep leaves dry'
        ],
        'prevention': [
            'Implement strict crop rotation',
            'Use preventive fungicides',
            'Provide proper spacing'
        ]
    },
    'septoria_leaf_spot': {
        'id': 'septoria_leaf_spot',
        'name': 'Septoria Leaf Spot',
        'description': 'The Septoria fungus causes septoria leaf spot, affecting leaves but not the fruit. This fungus thrives in warm, wet weather.',
        'symptoms': [
            'Multiple small, dark circles (1/8 to 1/4 inch diameter)',
            'Spots develop a tan or gray center',
            'Leaves eventually wilt and fall off',
            'Spreads rapidly from older to new leaves'
        ],
        'management': [
            'Repeated applications with a tomato fungicide or biofungicide',
            'Use copper sprays or Serenade fungicide',
            'Remove infected leaves immediately'
        ],
        'prevention': [
            'Maintain good garden sanitation',
            'Clean tools before and after working with plants',
            'Water at ground level',
            'Rotate tomato crops every three years'
        ]
    },
    'bacterial_spot': {
        'id': 'bacterial_spot',
        'name': 'Bacterial Spot',
        'description': 'Bacterial spot is a disease that affects tomatoes and peppers in particularly hot, humid conditions, resulting in spotty and pitted fruits.',
        'symptoms': [
            'Small brown spots with a yellow ring around them on leaves',
            'Spots often fall away and leave holes behind',
            'Fruits have scabby spots'
        ],
        'management': [
            'Do not eat infected tomatoes',
            'Remove infected plants',
            'Rotate crops'
        ],
        'prevention': [
            'Choose resistant varieties',
            'Water in the morning to allow drying time',
            'Space out plants properly'
        ]
    },
    'healthy': {
        'id': 'healthy',
        'name': 'Healthy Plant',
        'description': 'The plant appears healthy with no visible signs of disease.',
        'symptoms': [
            'Vibrant green leaves',
            'No discoloration or spots',
            'Strong stem structure',
            'Normal growth pattern'
        ],
        'management': ['Continue regular maintenance'],
        'prevention': ['Monitor regularly for any changes']
    }
}

# Severity levels configuration
SEVERITY_LEVELS = {
    'EARLY': {
        'label': 'Early Stage',
        'color': '#10b981',
        'icon': '🟢'
    },
    'MID': {
        'label': 'Mid Stage',
        'color': '#f59e0b',
        'icon': '🟡'
    },
    'LATE': {
        'label': 'Late Stage',
        'color': '#ef4444',
        'icon': '🔴'
    }
}
