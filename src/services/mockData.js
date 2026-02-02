// Mock data for development and testing

// Sample disease analysis results
export const mockAnalysisResult = {
    disease: {
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
    confidence: 92.5,
    severity: {
        label: 'Mid Stage',
        percentage: 45,
        level: 'MID',
        color: '#f59e0b',
        icon: '🟡'
    },
    gradcam: {
        original: '/sample-leaf.jpg',
        heatmap: '/sample-heatmap.jpg',
        overlay: '/sample-overlay.jpg'
    },
    timestamp: new Date().toISOString(),
    imageUrl: '/sample-leaf.jpg'
};

// Sample history data
export const mockHistory = [
    {
        id: '1',
        date: '2026-01-15T10:30:00',
        disease: 'Early Blight',
        severity: 'Mid Stage',
        severityPercentage: 45,
        confidence: 92.5,
        thumbnail: '/sample-leaf.jpg'
    },
    {
        id: '2',
        date: '2026-01-14T15:20:00',
        disease: 'Late Blight',
        severity: 'Early Stage',
        severityPercentage: 25,
        confidence: 88.3,
        thumbnail: '/sample-leaf-2.jpg'
    },
    {
        id: '3',
        date: '2026-01-13T09:15:00',
        disease: 'Healthy',
        severity: 'N/A',
        severityPercentage: 0,
        confidence: 95.7,
        thumbnail: '/sample-leaf-3.jpg'
    },
    {
        id: '4',
        date: '2026-01-12T14:45:00',
        disease: 'Septoria Leaf Spot',
        severity: 'Late Stage',
        severityPercentage: 78,
        confidence: 90.2,
        thumbnail: '/sample-leaf-4.jpg'
    },
    {
        id: '5',
        date: '2026-01-11T11:00:00',
        disease: 'Bacterial Spot',
        severity: 'Mid Stage',
        severityPercentage: 52,
        confidence: 87.9,
        thumbnail: '/sample-leaf-5.jpg'
    }
];

// Mock API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Mock API functions
export const mockAPI = {
    /**
     * Analyze uploaded image
     */
    analyzeImage: async (imageFile) => {
        await delay(2000); // Simulate API call

        // Generate random results for demo
        const diseases = [
            'early_blight',
            'late_blight',
            'leaf_mold',
            'septoria_leaf_spot',
            'bacterial_spot',
            'healthy'
        ];

        const randomDisease = diseases[Math.floor(Math.random() * diseases.length)];
        const randomConfidence = 85 + Math.random() * 15; // 85-100%
        const randomSeverity = Math.floor(Math.random() * 100);

        let severityLevel = 'EARLY';
        let severityLabel = 'Early Stage';
        let severityColor = '#10b981';
        let severityIcon = '🟢';

        if (randomSeverity > 66) {
            severityLevel = 'LATE';
            severityLabel = 'Late Stage';
            severityColor = '#ef4444';
            severityIcon = '🔴';
        } else if (randomSeverity > 33) {
            severityLevel = 'MID';
            severityLabel = 'Mid Stage';
            severityColor = '#f59e0b';
            severityIcon = '🟡';
        }

        // Create object URL for the uploaded image
        const imageUrl = URL.createObjectURL(imageFile);

        return {
            success: true,
            data: {
                disease: {
                    id: randomDisease,
                    name: randomDisease.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
                    description: `This is ${randomDisease.replace(/_/g, ' ')}. Detailed information would come from the backend.`,
                    symptoms: [
                        'Symptom 1 from backend',
                        'Symptom 2 from backend',
                        'Symptom 3 from backend'
                    ],
                    causes: [
                        'Cause 1 from backend',
                        'Cause 2 from backend'
                    ]
                },
                confidence: parseFloat(randomConfidence.toFixed(1)),
                severity: {
                    label: severityLabel,
                    percentage: randomSeverity,
                    level: severityLevel,
                    color: severityColor,
                    icon: severityIcon
                },
                gradcam: {
                    original: imageUrl,
                    heatmap: imageUrl, // In real app, this would be the heatmap from backend
                    overlay: imageUrl
                },
                timestamp: new Date().toISOString(),
                imageUrl: imageUrl
            }
        };
    },

    /**
     * Get analysis history
     */
    getHistory: async () => {
        await delay(500);
        return {
            success: true,
            data: mockHistory
        };
    },

    /**
     * Get disease information
     */
    getDiseaseInfo: async (diseaseId) => {
        await delay(300);
        return {
            success: true,
            data: {
                id: diseaseId,
                name: diseaseId.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
                description: 'Detailed disease information from backend',
                treatments: [
                    'Treatment option 1',
                    'Treatment option 2',
                    'Treatment option 3'
                ],
                preventive: [
                    'Preventive measure 1',
                    'Preventive measure 2'
                ]
            }
        };
    },

    /**
     * Save analysis to history
     */
    saveToHistory: async (analysisData) => {
        await delay(500);
        return {
            success: true,
            message: 'Analysis saved to history'
        };
    }
};

export default mockAPI;
