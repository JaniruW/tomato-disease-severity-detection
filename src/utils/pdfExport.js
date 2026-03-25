import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';


export const generatePDFReport = async (analysisData) => {
    const { disease, severity, confidence, timestamp } = analysisData;

    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 20;
    let y = 0;

    // ----- HEADER BANNER -----
    pdf.setFillColor(16, 185, 129); // Primary green
    pdf.rect(0, 0, pageWidth, 40, 'F');

    pdf.setFontSize(22);
    pdf.setTextColor(255, 255, 255);
    pdf.setFont('helvetica', 'bold');
    pdf.text('DISEASE ANALYSIS REPORT', pageWidth / 2, 20, { align: 'center' });

    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`REPORT ID: ${Date.now()}`, pageWidth / 2, 28, { align: 'center' });
    pdf.text(`GENERATED: ${new Date(timestamp).toLocaleString()}`, pageWidth / 2, 33, { align: 'center' });

    y = 52;

    // ----- SUMMARY DASHBOARD -----
    const cardWidth = (pageWidth - 2 * margin - 15) / 2;
    const cardHeight = 32;

    if (disease.id === 'healthy') {
        // Single Centered Card for Healthy Plants
        const centeredWidth = pageWidth - 2 * margin;
        pdf.setFillColor(249, 250, 251);
        pdf.roundedRect(margin, y, centeredWidth, cardHeight, 3, 3, 'F');
        pdf.setDrawColor(229, 231, 235);
        pdf.roundedRect(margin, y, centeredWidth, cardHeight, 3, 3, 'D');

        pdf.setFontSize(8);
        pdf.setTextColor(107, 114, 128);
        pdf.text('STATUS', margin + 8, y + 8);

        pdf.setFontSize(14);
        pdf.setTextColor(16, 185, 129); // Use primary green for "Healthy"
        pdf.setFont('helvetica', 'bold');
        pdf.text(disease.name, margin + 8, y + 18);

        pdf.setFontSize(9);
        pdf.setTextColor(107, 114, 128);
        pdf.text(`Confidence: ${confidence}%`, margin + 8, y + 26);
    } else {
        // Two-Card Layout for Diseased Plants
        // Disease Card
        pdf.setFillColor(249, 250, 251);
        pdf.roundedRect(margin, y, cardWidth, cardHeight, 3, 3, 'F');
        pdf.setDrawColor(229, 231, 235);
        pdf.roundedRect(margin, y, cardWidth, cardHeight, 3, 3, 'D');

        pdf.setFontSize(8);
        pdf.setTextColor(107, 114, 128);
        pdf.text('DETECTED DISEASE', margin + 8, y + 8);

        pdf.setFontSize(14);
        pdf.setTextColor(17, 24, 39);
        pdf.setFont('helvetica', 'bold');
        pdf.text(disease.name, margin + 8, y + 18);

        pdf.setFontSize(9);
        pdf.setTextColor(16, 185, 129);
        pdf.text(`Confidence: ${confidence}%`, margin + 8, y + 26);

        // Severity Card
        const severityX = margin + cardWidth + 15;
        pdf.setFillColor(249, 250, 251);
        pdf.roundedRect(severityX, y, cardWidth, cardHeight, 3, 3, 'F');
        pdf.roundedRect(severityX, y, cardWidth, cardHeight, 3, 3, 'D');

        pdf.setFontSize(8);
        pdf.setTextColor(107, 114, 128);
        pdf.text('SEVERITY ASSESSMENT', severityX + 8, y + 8);

        pdf.setFontSize(14);
        const sevColor = severity.color || '#f59e0b';
        const r = parseInt(sevColor.slice(1, 3), 16);
        const g = parseInt(sevColor.slice(3, 5), 16);
        const b = parseInt(sevColor.slice(5, 7), 16);
        pdf.setTextColor(r, g, b);
        pdf.setFont('helvetica', 'bold');
        pdf.text(severity.label, severityX + 8, y + 18);

        pdf.setFontSize(9);
        pdf.text(`Affected Area: ${severity.percentage}%`, severityX + 8, y + 26);
    }

    y += cardHeight + 12;

    // ----- DETAILED INFORMATION -----
    const drawSection = (title, contentLines, iconColor) => {
        pdf.setFillColor(iconColor[0], iconColor[1], iconColor[2]);
        pdf.rect(margin, y - 5, 4, 6, 'F');

        pdf.setFontSize(15);
        pdf.setTextColor(17, 24, 39);
        pdf.setFont('helvetica', 'bold');
        pdf.text(title, margin + 8, y);

        y += 11; // Increased gap under topics
        pdf.setFontSize(10);
        pdf.setTextColor(55, 65, 81);
        pdf.setFont('helvetica', 'normal');

        const lines = pdf.splitTextToSize(contentLines, pageWidth - 2 * margin);
        pdf.text(lines, margin, y);
        y += (lines.length * 5) + 8;
    };

    drawSection('Disease Description', disease.description, [59, 130, 246]);

    if (disease.symptoms && disease.symptoms.length > 0) {
        drawSection('Observable Symptoms', disease.symptoms.map(s => `• ${s}`).join('\n'), [245, 158, 11]);
    }

    // Recommendations
    const management = disease.management || [];
    const prevention = disease.prevention || [];

    if (management.length > 0 || prevention.length > 0) {
        pdf.setFillColor(16, 185, 129);
        pdf.rect(margin, y - 5, 4, 6, 'F');
        pdf.setFontSize(15);
        pdf.setTextColor(17, 24, 39);
        pdf.setFont('helvetica', 'bold');
        pdf.text('Action Plan & Treatment', margin + 8, y);

        y += 11; // Increased gap under Action Plan topic
        if (management.length > 0) {
            pdf.setFontSize(10.5);
            pdf.setFont('helvetica', 'bold');
            pdf.text('Immediate Field Management:', margin, y);
            y += 8; // Increased gap under subtopic
            pdf.setFontSize(10);
            pdf.setFont('helvetica', 'normal');
            management.forEach(m => {
                const lines = pdf.splitTextToSize(`- ${m}`, pageWidth - 2 * margin);
                pdf.text(lines, margin + 5, y);
                y += lines.length * 5.5;
            });
            y += 3;
        }

        if (prevention.length > 0) {
            pdf.setFontSize(10.5);
            pdf.setFont('helvetica', 'bold');
            pdf.text('Long-term Preventive Measures:', margin, y);
            y += 8; // Increased gap under subtopic
            pdf.setFontSize(10);
            pdf.setFont('helvetica', 'normal');
            prevention.forEach(p => {
                const lines = pdf.splitTextToSize(`- ${p}`, pageWidth - 2 * margin);
                pdf.text(lines, margin + 5, y);
                y += lines.length * 5.5;
            });
        }
    }

    // Footer
    pdf.setFontSize(8);
    pdf.setTextColor(156, 163, 175);
    pdf.text('Plant Disease Detection System - Final Year Project Output', pageWidth / 2, pageHeight - 10, { align: 'center' });

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
 * Export element to PDF 
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
