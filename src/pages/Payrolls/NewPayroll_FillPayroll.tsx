import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ProgressBreadcrumb from "@/components/molecules/ProgressBreadcrumb";
import Button from "@/components/molecules/Button";
import { EmployeeResponse } from "@/types";
import PayrollTemplate from "./components/PayrollTemplate/PayrollTemplate";
import { exportRefToPdf } from "@/utils/pdf";
import exp from "constants";
import EditablePayroll from "./components/EditablePayroll/EditablePayroll";
import { useCreatePayroll } from "@/hooks/usePayroll";
import { PayrollData } from "@/types";

type LocationState = {
  teacher: EmployeeResponse;
};

type Props = {};

export default function NewPayroll_FillPayroll({}: Props) {
  const navigate = useNavigate();
  const { state } = useLocation();
  const teacher = state?.teacher;
  const printRef = useRef<HTMLDivElement>(null);

  const [earnings, setEarnings] = useState<PayrollData["earnings"]>([]);
  const [deductions, setDeductions] = useState<PayrollData["deductions"]>([]);
  const [jobPosition, setJobPosition] = useState<string>("");

  const { mutate: createPayroll } = useCreatePayroll();

  const steps = [
    "Selección de Profesor",
    "Completar Rol de Pagos",
    "Detalles de Rol de Pagos",
  ];
  const hiddenPrintRef = useRef<HTMLDivElement>(null);

  // Redirigir si no hay profesor en estado, usando useEffect
  useEffect(() => {
    if (!teacher) {
      console.error("No se encontró el profesor en el estado de la ubicación.");
      navigate("/payrolls/selectTeacher");
    }
  }, [teacher, navigate]);

  if (!teacher) return null;

  // Manejador de continuar al resumen
  const handleContinue = () => {
    const payrollData: PayrollData = {
      earnings,
      deductions,
      payrollDate: new Date().toISOString().split("T")[0],
    };

    createPayroll(
      { employeeId: teacher.id, payrollData },
      {
        onSuccess: () => {
          navigate("/payrolls/fillPayroll/summary", { state: { teacher } });
        },
        onError: (error) => {
          console.error("Error al crear el payroll:", error);
          alert("Ocurrió un error al crear el payroll. Inténtalo nuevamente.");
        },
      }
    );
  };

  return (
    <div className="max-w-4x2 mx-auto flex flex-col space-y-8 px-4">
      <header className="space-y-4">
        <h1 className="text-[2.5rem] mb-4">Nuevo rol de pagos</h1>
        <ProgressBreadcrumb steps={steps} currentStep={1} />
      </header>

      <section className="bg-white p-6 rounded-lg shadow-md space-y-6">
        <EditablePayroll
          teacher={teacher}
          onChange={({ earnings, deductions, jobPosition }) => {
            setEarnings(earnings);
            setDeductions(deductions);
            setJobPosition(jobPosition);
          }}
        />
      </section>

      {/* <section className="bg-white p-6 rounded-lg shadow-md space-y-6">
        <PayrollTemplate teacher={teacher} />

        <Button
          text="Descargar Rol de Pagos"
          onClick={() => {
            exportRefToPdf(hiddenPrintRef, `rol_de_pagos_${teacher.lastName}`);
          }}
          className="bg-dark-cyan text-white"
        />
      </section>

      <div
        ref={hiddenPrintRef}
        style={{
          position: "absolute",
          top: "-9999px",
          left: "-9999px",
          width: "1000px", // Tamaño deseado
          padding: "2rem",
          background: "white",
        }}
      >
        <PayrollTemplate teacher={teacher} />
      </div> */}

      {/* Aquí puedes agregar más campos/input para detalles del rol de pagos */}

      <div className="flex justify-end space-x-4">
        <Button
          text="Volver"
          variant="text"
          onClick={() => navigate(-1)}
          className="bg-gray-300 text-gray-800"
        />
        <Button
          text="Continuar"
          variant="text"
          onClick={handleContinue}
          className="bg-dark-cyan text-white"
        />
      </div>
    </div>
  );
}
