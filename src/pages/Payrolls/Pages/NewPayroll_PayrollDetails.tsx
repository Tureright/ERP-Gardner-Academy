import React, { useRef, useState } from "react";
import PayrollTemplate from "../components/molecules/PayrollTemplate/PayrollTemplate";
import { PayrollFullTemplate } from "@/types";
import Button from "@/components/molecules/Button";
import { exportRefToPdf } from "@/utils/pdf";
import { useLocation, useNavigate } from "react-router-dom";
import { Download, Pencil, Trash } from "lucide-react";
import { useDeletePayroll } from "@/hooks/usePayroll";

type LocationState = {
  fullPayrollData: PayrollFullTemplate;
};

type Props = {};

export default function NewPayroll_PayrollDetails({}: Props) {
  const { state } = useLocation();
  const { fullPayrollData } = state as LocationState;
  const [loading, setLoading] = useState(false);
  const deletePayroll = useDeletePayroll();
  const navigate = useNavigate();
  const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);

  const hiddenPrintRef = useRef<HTMLDivElement>(null);
  console.log("Full Payroll Data:", fullPayrollData);
  return (
    <div className="max-w-4x1 mx-auto flex flex-col space-y-8 px-4">
      <header className="space-y-4">
        <h1 className="text-[2.5rem] mb-4">Detalles del Rol de Pagos</h1>
      </header>
      <section className="bg-white p-6 rounded-lg shadow-md space-y-2 w-fit mx-auto">
        <div className="flex flex-row text-center justify-end text-gray-500 mt-4 gap-2">
          <Button
            text={loading ? "Generando PDF..." : "Descargar Rol de Pagos"}
            icon={<Download />}
            variant="icon"
            onClick={async () => {
              setLoading(true);
              await exportRefToPdf(
                hiddenPrintRef,
                `rol_de_pagos_${fullPayrollData.lastName}`
              );
              setLoading(false);
            }}
            className="bg-dark-cyan text-white"
          />
          <Button
            text="Editar Rol de Pagos"
            icon={<Pencil />}
            variant="icon"
            onClick={() => {
              // Aquí puedes implementar la lógica para editar el rol de pagos
              console.log("Editar Rol de Pagos");
            }}
            className="bg-dark-cyan text-white"
          />
          <Button
            text="Eliminar Rol de Pagos"
            icon={<Trash />}
            variant="icon"
            onClick={() => { setShowConfirmDeleteModal(true);}}
            className="bg-dark-cyan text-white"
          />
        </div>

        <PayrollTemplate payrollFullTemplate={fullPayrollData} />
      </section>
      {showConfirmDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-bold mb-4">Confirmar Eliminación</h2>
            <p className="mb-6">¿Estás seguro de que deseas eliminar este rol de pagos?</p>
            <div className="mt-4 flex justify-end gap-2">
              <Button
                text="Cancelar"
                variant="text"
                onClick={() => setShowConfirmDeleteModal(false)}
                className="bg-gray-300 text-gray-800"
              />
              <Button
                text="Eliminar"
                variant="text"
                onClick={() => {
                  deletePayroll.mutate(
                    {
                      employeeId: fullPayrollData.employeeId,
                      payrollId: fullPayrollData.id,
                    },
                    {
                      onSuccess: () => {
                        console.log("Rol de pagos eliminado exitosamente");
                        navigate("/payrolls");
                      },
                      onError: (error) => {
                        console.error("Error al eliminar el rol de pagos:", error);
                        alert("Ocurrió un error al eliminar el rol de pagos.");
                      },
                    }
                  );
                }}
                className="bg-dark-cyan text-white"
              />
            </div>
          </div>
        </div>
      )}
      <div
        ref={hiddenPrintRef}
        style={{
          position: "absolute",
          top: "-9999px",
          left: "-9999px",
          width: "1000px",
          padding: "2rem",
          background: "white",
        }}
      >
        <PayrollTemplate payrollFullTemplate={fullPayrollData} />
      </div>
    </div>
  );
}
