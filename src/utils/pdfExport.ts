import type { AnalysisResult } from './analysis';

export async function exportToPDF(element: HTMLElement, result: AnalysisResult): Promise<void> {
  const originalTitle = document.title;
  const fileName = `GlowAgent-Health-Report-${new Date().toISOString().split('T')[0]}`;
  document.title = fileName;

  const printStyles = document.createElement('style');
  printStyles.id = 'print-styles';
  printStyles.textContent = `
    @media print {
      body * {
        visibility: hidden;
      }
      #report-content, #report-content * {
        visibility: visible;
      }
      #report-content {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
      }
      button {
        display: none !important;
      }
      @page {
        size: A4;
        margin: 1cm;
      }
    }
  `;
  document.head.appendChild(printStyles);

  element.id = 'report-content';

  try {
    window.print();
  } finally {
    setTimeout(() => {
      document.title = originalTitle;
      const styles = document.getElementById('print-styles');
      if (styles) {
        styles.remove();
      }
      element.id = '';
    }, 100);
  }
}
