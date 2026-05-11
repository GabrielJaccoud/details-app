import { jsPDF } from "jspdf";

interface FormExportData {
  editalTitle: string;
  editalOrgan: string;
  editalDeadline: string;
  submissionDate: string;
  formData: Record<string, any>;
  userInfo?: {
    name: string;
    email: string;
  };
}

export async function exportFormToPDF(data: FormExportData): Promise<void> {
  try {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 15;
    const contentWidth = pageWidth - 2 * margin;
    let yPosition = margin;

    // Helper function to add text with line breaks
    const addWrappedText = (text: string, x: number, y: number, maxWidth: number, fontSize: number = 10) => {
      doc.setFontSize(fontSize);
      const lines = doc.splitTextToSize(text, maxWidth);
      doc.text(lines, x, y);
      return y + lines.length * (fontSize / 2.5);
    };

    // Header with logo/title
    doc.setFontSize(20);
    doc.setTextColor(184, 134, 11); // Gold color
    doc.text("DETAILS", margin, yPosition);
    yPosition += 10;

    // Edital info
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`Edital: ${data.editalTitle}`, margin, yPosition);
    yPosition += 6;
    doc.setFontSize(10);
    doc.text(`Órgão: ${data.editalOrgan}`, margin, yPosition);
    yPosition += 5;
    doc.text(`Prazo: ${data.editalDeadline}`, margin, yPosition);
    yPosition += 5;
    doc.text(`Data de Preenchimento: ${data.submissionDate}`, margin, yPosition);
    yPosition += 10;

    // User info if available
    if (data.userInfo) {
      doc.setFontSize(11);
      doc.setTextColor(100, 100, 100);
      doc.text("Informações do Candidato", margin, yPosition);
      yPosition += 5;
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      doc.text(`Nome: ${data.userInfo.name}`, margin, yPosition as any);
      yPosition += 5;
      doc.text(`Email: ${data.userInfo.email}`, margin, yPosition as any);
      yPosition += 10;
    }

    // Separator line
    doc.setDrawColor(184, 134, 11);
    doc.line(margin, yPosition, pageWidth - margin, yPosition as any);
    yPosition += 8;

    // Form data
    doc.setFontSize(11);
    doc.setTextColor(100, 100, 100);
    doc.text("Dados do Formulário", margin, yPosition);
    yPosition += 7;

    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);

    for (const [fieldName, fieldValue] of Object.entries(data.formData)) {
      // Check if we need a new page
      if (yPosition > pageHeight - margin - 10) {
        doc.addPage();
        yPosition = margin;
      }

      // Field name
      doc.setFont(undefined as any, "bold");
      yPosition = addWrappedText(
        `${fieldName.replace(/_/g, " ").toUpperCase()}:`,
        margin,
        yPosition,
        contentWidth,
        10
      );

      // Field value
      doc.setFont(undefined as any, "normal");
      const displayValue = typeof fieldValue === "object" ? JSON.stringify(fieldValue, null, 2) : String(fieldValue);
      yPosition = addWrappedText(displayValue, margin + 5, yPosition, contentWidth - 5, 9);
      yPosition += 5;
    }

    // Footer
    yPosition = pageHeight - margin - 5;
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    const pageCount = (doc.internal.pages as any).length - 1;
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.text(`Página ${i} de ${pageCount}`, pageWidth / 2, yPosition, { align: "center" } as any);
    }

    // Save the PDF
    const filename = `formulario-${data.editalTitle.replace(/\s+/g, "-")}-${new Date().getTime()}.pdf`;
    doc.save(filename);
  } catch (error) {
    console.error("Erro ao exportar PDF:", error);
    throw new Error("Falha ao exportar formulário em PDF");
  }
}
