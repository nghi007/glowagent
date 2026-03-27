import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import type { AnalysisResult } from './analysis';

export async function exportToPDF(element: HTMLElement, result: AnalysisResult): Promise<void> {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 15;

  const clonedElement = element.cloneNode(true) as HTMLElement;
  clonedElement.style.position = 'absolute';
  clonedElement.style.left = '-9999px';
  clonedElement.style.width = '794px';
  clonedElement.style.backgroundColor = '#0a0a0a';
  document.body.appendChild(clonedElement);

  const buttons = clonedElement.querySelectorAll('button');
  buttons.forEach(button => button.remove());

  try {
    const canvas = await html2canvas(clonedElement, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#0a0a0a',
    });

    const imgData = canvas.toDataURL('image/png');
    const imgWidth = pageWidth - (margin * 2);
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'PNG', margin, margin, imgWidth, imgHeight);
    heightLeft -= (pageHeight - margin * 2);

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', margin, position + margin, imgWidth, imgHeight);
      heightLeft -= (pageHeight - margin * 2);
    }

    const fileName = `GlowAgent-Health-Report-${new Date().toISOString().split('T')[0]}.pdf`;
    pdf.save(fileName);
  } finally {
    document.body.removeChild(clonedElement);
  }
}
