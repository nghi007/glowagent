import type { AnalysisResult } from './analysis';

export async function exportToPDF(element: HTMLElement, result: AnalysisResult): Promise<void> {
  const originalTitle = document.title;
  const fileName = `GlowAgent-Health-Report-${new Date().toISOString().split('T')[0]}`;
  document.title = fileName;

  const printStyles = document.createElement('style');
  printStyles.id = 'print-styles';
  printStyles.textContent = `
    @media print {
      * {
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }

      body {
        background: white !important;
      }

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
        background: white;
        padding: 0;
        margin: 0;
      }

      button, .exportBtn, .ctaBtnGroup {
        display: none !important;
      }

      /* Prevent page breaks inside important elements */
      .chartCard, .card, .scoreSection, .dimBarItem {
        page-break-inside: avoid;
        break-inside: avoid;
      }

      /* Add spacing to prevent content overlap */
      .chartsSection {
        margin-top: 20px;
        margin-bottom: 20px;
      }

      .chartsGrid {
        display: grid;
        gap: 30px;
        page-break-inside: avoid;
      }

      .chartCard {
        margin-bottom: 30px;
      }

      /* Ensure SVG charts render properly */
      svg {
        max-width: 100%;
        height: auto;
        page-break-inside: avoid;
        overflow: visible !important;
      }

      .radarChart {
        width: 340px !important;
        height: auto !important;
        margin: 30px auto !important;
        padding: 20px !important;
        overflow: visible !important;
      }

      /* Fix text colors for print */
      .radarChart text, .radarLabel {
        fill: #0f0e0c !important;
        font-size: 10px !important;
      }

      /* Ensure benchmark charts are readable */
      .benchmarkChart {
        page-break-inside: avoid;
      }

      .benchmarkItem {
        margin-bottom: 20px;
        page-break-inside: avoid;
      }

      .benchmarkRow {
        margin-bottom: 12px;
      }

      .benchmarkBarTrack {
        overflow: visible !important;
      }

      @page {
        size: A4;
        margin: 2cm 1.5cm;
      }

      /* First page */
      @page :first {
        margin-top: 1.5cm;
      }

      /* Ensure content doesn't overflow */
      #report-content {
        max-width: 100%;
        overflow: visible;
      }

      /* Section spacing */
      .analysisSection {
        page-break-before: auto;
        margin-top: 20px;
        margin-bottom: 20px;
      }

      .card {
        margin-bottom: 15px;
      }
    }
  `;
  document.head.appendChild(printStyles);

  element.id = 'report-content';

  try {
    await new Promise(resolve => setTimeout(resolve, 300));
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
