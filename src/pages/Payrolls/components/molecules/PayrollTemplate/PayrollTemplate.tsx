import React, { useState } from "react";
import Calculations from "./Calculations";
import PayrollTemplateHeader from "./PayrollTemplateHeader";
import { mathUtils } from "@/utils/math";
import { PayrollFullTemplate } from "@/types";
import { useLocation } from "react-router-dom";
import Button from "@/components/molecules/Button";

type Props = {
  payrollFullTemplate: PayrollFullTemplate;
};

type LocationState = {
  fullPayrollData: PayrollFullTemplate;
  showDownload?: boolean;
};

export default function PayrollTemplate({ payrollFullTemplate }: Props) {
  const { state } = useLocation();
  const { fullPayrollData, showDownload } = state as LocationState;

  if (fullPayrollData) {
    payrollFullTemplate = fullPayrollData;
  }
  const totalEntregado =
    mathUtils.sumAmounts(payrollFullTemplate.earnings) -
    mathUtils.sumAmounts(payrollFullTemplate.deductions);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "24px",
        border: "1px solid black",
        padding: "24px",
        maxWidth: "895px",
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#fff",
      }}
    >
      <PayrollTemplateHeader payrollFullTemplate={payrollFullTemplate} />

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "8px",
          backgroundColor: "white",
        }}
      >
        <Calculations title="Ingresos" items={payrollFullTemplate.earnings} />
        <Calculations
          title="Deducciones"
          items={payrollFullTemplate.deductions}
        />

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            fontWeight: "bold",
            color: "#333",
            width: "100%",
            gap: "8px",
            backgroundColor: "#f2f2f2",
            padding: "16px",
          }}
        >
          <h3 style={{ fontSize: "24px" }}>Total entregado</h3>
          <p style={{ fontSize: "24px" }}>${totalEntregado.toFixed(2)}</p>
        </div>
      </div>

      <div style={{ padding: "16px" }}>
        <p>
          {`Yo, ${payrollFullTemplate.firstName} ${payrollFullTemplate.lastName}, con la cédula de identidad N.° ${payrollFullTemplate.nationalId}, declaro haber recibido a conformidad la cantidad de `}
          <span style={{ fontWeight: 600, color: "#333", fontStyle: "italic" }}>
            {mathUtils.numberToMoneyWords(totalEntregado.toFixed(2))}
          </span>
          .
        </p>
      </div>

      <div style={{ marginTop: "48px", textAlign: "center" }}>
        <div
          style={{
            borderTop: "1px solid #4a4a4a",
            width: "256px",
            margin: "0 auto 8px auto",
          }}
        ></div>
        <p style={{ color: "#4a4a4a", fontSize: "14px" }}>Recibí conforme</p>
      </div>
      {showDownload && (
        <div className="flex flex-row gap-2 w-full">
            <Button
            text="Regresar"
            variant="text"
            className="w-full no-print"
            onClick={() => window.history.back()}
            aria-label="Regresar a la lista de roles de pago"
          />
          <Button
            text="Descargar"
            variant="text"
            className="w-full no-print"
            onClick={() => window.print()}
            aria-label="Descargar rol de pago"
          />
        </div>
      )}
    </div>
  );
}
