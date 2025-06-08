import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

/**
 * Exporta un ref a PDF, con soporte para múltiples páginas.
 */
export async function exportRefToPdf(
  ref: React.RefObject<HTMLElement>,
  filename: string,
  options?: {
    html2canvas?: {
      scale?: number;
      useCORS?: boolean;
    };
    jsPDF?: {
      orientation?: "portrait" | "landscape";
      unit?: "mm" | "pt" | "px";
      format?: "a4" | "letter" | number[];
    };
  }
) {
  if (!ref.current) {
    console.warn("exportRefToPdf: ref.current es null");
    return;
  }

  const html2canvasOpts = {
    scale: 3, // mayor calidad
    useCORS: true,
    ...(options?.html2canvas || {}),
  };

  const jsPDFOpts = {
    orientation: "portrait" as const,
    unit: "mm" as const,
    format: "a4" as const,
    ...(options?.jsPDF || {}),
  };

  const canvas = await html2canvas(ref.current, html2canvasOpts);
  const imgData = canvas.toDataURL("image/png");

  const pdf = new jsPDF(jsPDFOpts);
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  const imgWidth = pageWidth;
  const imgHeight = (canvas.height * pageWidth) / canvas.width;

  let heightLeft = imgHeight;
  let position = 0;

  pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
  heightLeft -= pageHeight;

  while (heightLeft > 0) {
    position = position - pageHeight;
    pdf.addPage();
    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
  }

  pdf.save(`${filename}.pdf`);
}
