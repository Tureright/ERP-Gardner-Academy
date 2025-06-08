import React, { useRef } from "react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import PayrollTemplate from "./PayrollTemplate";
import { EmployeeResponse } from "@/types";
type Props = {
  teacher: EmployeeResponse;
};
export default function PayrollPrintable({ teacher }: Props) {
  const printRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (!printRef.current) return;

    // 1) Renderizo el div como canvas
    const canvas = await html2canvas(printRef.current, {
      scale: 2,           // mejora la calidad
      useCORS: true,      // si tu logo viene de otra ruta
    });

    // 2) Paso a imagen
    const imgData = canvas.toDataURL("image/png");

    // 3) Creo el PDF
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = (canvas.height * pageWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pageWidth, pageHeight);
    pdf.save(`rol_de_pagos_${teacher.lastName}.pdf`);
  };

  return (
    <>
      <div ref={printRef}>
        <PayrollTemplate teacher={teacher} />
      </div>
      <button
        onClick={handleDownload}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
      >
        Descargar PDF
      </button>
    </>
  );
}
