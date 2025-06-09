// src/pages/Payroll/PayrollPrintPage.tsx
import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { PayrollFullTemplate } from "@/types";
import PayrollTemplate from "../components/molecules/PayrollTemplate/PayrollTemplate";

export default function PayrollPrintPage() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const dataParam = searchParams.get("data");

  if (!dataParam) {
    return <div>No hay datos para imprimir.</div>;
  }

  const fullPayrollData: PayrollFullTemplate = JSON.parse(decodeURIComponent(dataParam));

  useEffect(() => {
    // Imprimir automáticamente cuando cargue la página
    window.print();
  }, []);

  return (
    <div
      style={{
        padding: "2rem",
        background: "white",
        maxWidth: "1000px",
        margin: "0 auto",
      }}
    >
      <PayrollTemplate payrollFullTemplate={fullPayrollData} />
    </div>
  );
}
