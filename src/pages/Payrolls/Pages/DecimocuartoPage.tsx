import MoreInfo from "@/components/atoms/MoreInfo";
import { TriangleAlert, Undo } from "lucide-react";
import React, { useState } from "react";
import Table14to from "../components/molecules/Table14to/Table14to";
import Button from "@/components/molecules/Button";
import { useNavigate } from "react-router-dom";

type Props = {};

export default function DecimocuartoPage({}: Props) {
  const [numEmployees, setNumEmployees] = useState("");
  const navigate = useNavigate();
  const today = new Date();
  const currentYear =
    today.getMonth() < 7 ? today.getFullYear() : today.getFullYear() + 1;
  const lastYear = currentYear - 1;

  return (
    <div className="p-4 space-y-5 max-w-4xl mx-auto">
      <div>
        <Button
          icon={<Undo size={20} />}
          variant="icon"
          onClick={() => window.history.back()}
          className="mb-2 "
        />
      </div>
      <div className="space-y-4">
        <div className="flex flex-row items-center gap-2">
          <h2 className="text-[2rem]">Décimo Cuarto Sueldo </h2>
        </div>
        <p>
          Calcula aquí el valor aproximado del Décimo Cuarto Sueldo para los
          docentes registrados. Este monto se basa en el{" "}
          <strong className="text-purple-primary">
            Sueldo Básico Unificado (SBU)
          </strong>{" "}
          vigente en Ecuador hasta la fecha de pago.
        </p>
        <p>
          <strong className="text-purple-primary">Fecha límite de pago:</strong>{" "}
          15 de agosto de {currentYear}.
        </p>
        <div className="space-x-1">
          <strong className="text-purple-primary">Docentes registrados:</strong>{" "}
          {numEmployees}.
          <MoreInfo message="Docentes registrados en Workspace para recibir un Rol de Pagos" />
        </div>
        <div className="flex items-start gap-4 bg-yellow-50 border border-yellow-500 rounded-2xl p-4 text-gray-700">
          <div className="w-10 h-10 flex items-center justify-center">
            <TriangleAlert className="text-yellow-600 w-6 h-6" />
          </div>
          <p>
            Este es un valor aproximado, teniendo en cuenta que todos los
            docentes asalariados han trabajado durante todo el año estipulado
            para el régimen sierra:{" "}
            <strong>
              1 de agosto de {lastYear} al 31 de julio de {currentYear}
            </strong>
            .
          </p>
        </div>

        <Table14to onNumEmployees={(num) => setNumEmployees(num)} />
      </div>

  <Button
    className="w-full"
    text="Calcular Individualmente"
    icon={
      <div className="flex items-center gap-2">
        <span className="w-7 h-7 flex items-center justify-center border-2 border-gray-700 text-gray-700 text-base font-bold rounded transition group-hover:bg-purple-primary group-hover:text-white group-hover:border-purple-primary">
          14
        </span>
      </div>
    }
    variant="text-icon"
    onClick={() => navigate("/payrolls/selectTeacherDetails")}
    aria-label="Genera un rol de pagos para la decimocuarta remunración"
  />



    </div>
  );
}
