import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * Generate PDF report from analysis results
 */
export const generatePDFReport = async (analysisData) => {
    const { disease, severity, confidence, image, timestamp, recommendations } = analysisData;

    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    let yPosition = 20;

    // Title
    pdf.setFontSize(24);
    pdf.setTextColor(34, 139, 34);
    pdf.text('Plant Disease Analysis Report', pageWidth / 2, yPosition, { align: 'center' });

    yPosition += 15;

    // Date
    pdf.setFontSize(10);
    pdf.setTextColor(100, 100, 100);
    pdf.text(`Generated on: ${new Date(timestamp).toLocaleString()}`, pageWidth / 2, yPosition, { align: 'center' });

    yPosition += 15;

    // Disease Information
    pdf.setFontSize(16);
    pdf.setTextColor(0, 0, 0);
    pdf.text('Disease Detection', 20, yPosition);

    yPosition += 10;
    pdf.setFontSize(12);
    pdf.text(`Disease: ${disease.name}`, 20, yPosition);

    yPosition += 7;
    pdf.text(`Confidence: ${confidence}%`, 20, yPosition);

    yPosition += 7;
    pdf.text(`Severity: ${severity.label} (${severity.percentage}%)`, 20, yPosition);

    yPosition += 12;

    // Disease Description
    pdf.setFontSize(14);
    pdf.text('Description', 20, yPosition);

    yPosition += 8;
    pdf.setFontSize(10);
    const descriptionLines = pdf.splitTextToSize(disease.description, pageWidth - 40);
    pdf.text(descriptionLines, 20, yPosition);

    yPosition += descriptionLines.length * 5 + 10;

    // Symptoms
    if (disease.symptoms && disease.symptoms.length > 0) {
        pdf.setFontSize(14);
        pdf.text('Symptoms', 20, yPosition);

        yPosition += 8;
        pdf.setFontSize(10);
        disease.symptoms.forEach((symptom, index) => {
            pdf.text(`${index + 1}. ${symptom}`, 25, yPosition);
            yPosition += 6;
        });

        yPosition += 5;
    }

    // Check if we need a new page
    if (yPosition > pageHeight - 60) {
        pdf.addPage();
        yPosition = 20;
    }

    // Recommendations
    if (recommendations) {
        pdf.setFontSize(14);
        pdf.text('Treatment Recommendations', 20, yPosition);

        yPosition += 8;
        pdf.setFontSize(10);

        if (recommendations.treatments) {
            pdf.setFont(undefined, 'bold');
            pdf.text('Immediate Actions:', 25, yPosition);
            pdf.setFont(undefined, 'normal');
            yPosition += 6;

            recommendations.treatments.forEach((treatment, index) => {
                const lines = pdf.splitTextToSize(`${index + 1}. ${treatment}`, pageWidth - 50);
                pdf.text(lines, 30, yPosition);
                yPosition += lines.length * 5;
            });

            yPosition += 5;
        }

        if (recommendations.preventive) {
            pdf.setFont(undefined, 'bold');
            pdf.text('Preventive Measures:', 25, yPosition);
            pdf.setFont(undefined, 'normal');
            yPosition += 6;

            recommendations.preventive.forEach((measure, index) => {
                const lines = pdf.splitTextToSize(`${index + 1}. ${measure}`, pageWidth - 50);
                pdf.text(lines, 30, yPosition);
                yPosition += lines.length * 5;
            });
        }
    }

    // Add image if available
    if (image) {
        pdf.addPage();
        pdf.setFontSize(14);
        pdf.text('Analyzed Image', pageWidth / 2, 20, { align: 'center' });

        try {
            // Add image to PDF
            const imgWidth = pageWidth - 40;
            const imgHeight = (imgWidth * 3) / 4; // Maintain aspect ratio
            pdf.addImage(image, 'JPEG', 20, 30, imgWidth, imgHeight);
        } catch (error) {
            console.error('Error adding image to PDF:', error);
        }
    }

    // Footer
    const footerY = pageHeight - 10;
    pdf.setFontSize(8);
    pdf.setTextColor(150, 150, 150);
    pdf.text('Plant Disease Detection System', pageWidth / 2, footerY, { align: 'center' });

    return pdf;
};

/**
 * Export analysis results to PDF
 */
export const exportToPDF = async (analysisData, filename = 'disease-analysis-report.pdf') => {
    try {
        const pdf = await generatePDFReport(analysisData);
        pdf.save(filename);
        return { success: true };
    } catch (error) {
        console.error('Error generating PDF:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Export element to PDF (for custom layouts)
 */
export const exportElementToPDF = async (elementId, filename = 'report.pdf') => {
    try {
        const element = document.getElementById(elementId);
        if (!element) {
            throw new Error('Element not found');
        }

        const canvas = await html2canvas(element, {
            scale: 2,
            useCORS: true,
            logging: false
        });

        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');

        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();

        const imgWidth = pageWidth - 20;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        let heightLeft = imgHeight;
        let position = 10;

        pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft >= 0) {
            position = heightLeft - imgHeight + 10;
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
        }

        pdf.save(filename);
        return { success: true };
    } catch (error) {
        console.error('Error exporting to PDF:', error);
        return { success: false, error: error.message };
    }
};
