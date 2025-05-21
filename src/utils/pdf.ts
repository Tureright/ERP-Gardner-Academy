// src/utils/pdf.ts
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

/**
 * Captura el contenido de un elemento y lo descarga como PDF.
 *
 * @param ref React.RefObject<HTMLElement> – referencia al contenedor a imprimir.
 * @param filename string – nombre del archivo PDF (sin extensión).
 * @param options opcionales para html2canvas/jsPDF
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

  // Valores por defecto
  const html2canvasOpts = {
    scale: 2,
    useCORS: true,
    ...(options?.html2canvas || {}),
  };
  const jsPDFOpts = {
    orientation: "portrait" as const,
    unit: "mm" as const,
    format: "a4" as const,
    ...(options?.jsPDF || {}),
  };

  // 1) Renderiza a canvas
  const canvas = await html2canvas(ref.current, html2canvasOpts);
  const imgData = canvas.toDataURL("image/png");

  // 2) Crea el PDF
  const pdf = new jsPDF(jsPDFOpts);
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = (canvas.height * pageWidth) / canvas.width;

  pdf.addImage(imgData, "PNG", 0, 0, pageWidth, pageHeight);
  pdf.save(`${filename}.pdf`);
}
