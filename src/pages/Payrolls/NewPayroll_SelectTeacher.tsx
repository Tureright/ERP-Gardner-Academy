import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CardPager from "./components/CardPager/CardPager";
import ProgressBreadcrumb from "@/components/molecules/ProgressBreadcrumb";
import Button from "@/components/molecules/Button";
import { EmployeeResponse } from "@/types";

export default function NewPayroll_SelectTeacher() {
  const navigate = useNavigate();
  const [selectedTeacher, setSelectedTeacher] = useState<EmployeeResponse | null>(null);

  const steps = [
    "Selección de Profesor",
    "Completar Rol de Pagos",
    "Detalles de Rol de Pagos",
  ];

  const handleContinue = () => {
    if (!selectedTeacher) return;
    navigate("/payrolls/fillPayroll", { state: { teacher: selectedTeacher } });
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col space-y-8 px-4">
      <header className="space-y-4">
        <h1 className="text-[2.5rem] mb-4 ">Nuevo rol de pagos</h1>
        <ProgressBreadcrumb steps={steps} currentStep={0} />
      </header>

      <CardPager
        title="Selecciona un profesor"
        selectedId={selectedTeacher?.id}
        onSelect={(emp) => setSelectedTeacher(emp)}
      />

      <Button
        text="Continuar"
        variant="text"
        className={`bg-dark-cyan text-white ${!selectedTeacher ? "opacity-50 cursor-not-allowed" : ""}`}
        onClick={handleContinue}
        // deshabilitado visualmente si no hay selección
      />
    </div>
  );
}
