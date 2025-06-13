import { useMutation } from "@tanstack/react-query";
import { generatePDF } from "../services/pdfService";

export function useGeneratePDF() {
  return useMutation({
    mutationFn: generatePDF,
    onSuccess: (data) => {
      // Abrimos la URL del archivo en Drive
      window.open(data.url, "_blank");
    },
    onError: (error: any) => {
      alert("Error al generar PDF: " + error.message);
    },
  });
}
