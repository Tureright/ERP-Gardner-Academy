import {
  usePayrolls,
  useCreatePayroll,
  useUpdatePayroll,
  useDeletePayroll,
} from "@/hooks/usePayroll";
import { PayrollResponse, PayrollData, PayrollFullTemplate } from "@/types";
import Button from "@/components/molecules/Button";
import { Plus, Users, TriangleAlert } from "lucide-react";
import { Route, Routes, useNavigate } from "react-router-dom";
import Table from "../components/atoms/Table/Table";
import { useEmployee, useEmployees } from "@/hooks/useEmployee";
import { mathUtils } from "@/utils/math";
import Table13er from "../components/molecules/Table13er/Table13er";
import MoreInfo from "@/components/atoms/MoreInfo";
import Table14to from "../components/molecules/Table14to/Table14to";
import { useState } from "react";
import CenteredSpinner from "@/components/atoms/CenteredSpinner";

export default function PayrollPage() {
  return <PayrollMain />;
}

// Vista principal como componente separado
function PayrollMain() {
  const { data, isLoading, error } = usePayrolls();
  const { data: employeesData, isLoading: isLoadingEmployees } = useEmployees();
  const createPayroll = useCreatePayroll();
  const deletePayroll = useDeletePayroll();
  const navigate = useNavigate();
  const [numEmployees, setNumEmployees] = useState("");

  if (isLoading) return (<CenteredSpinner text="Cargando Roles de Pago"/>);
  if (error) return <p>Error: {error.message}</p>;

  const payrollFullTemplates = formatToFullTemplate(
    data?.data ?? [],
    employeesData?.data ?? []
  );

  const endDate14to = () => {
    const today = new Date();
    const currentYear = today.getFullYear();
    const lastYear = currentYear - 1;
    return { currentYear, lastYear };
  };

  return (
    <div className="p-4 space-y-11 max-w-4xl mx-auto">
      <div className="space-y-4">
        <h1 className="text-[2.5rem] mb-4">Roles de Pago</h1>
        <div className="flex items-center justify-end gap-4">
          <Button
            text="Añadir rol de pago"
            icon={<Plus size={20} strokeWidth={2} />}
            variant="text-icon"
            onClick={() => navigate("/payrolls/selectTeacher")}
            aria-label="Añadir rol de pago"
          />
        </div>
        <div className="w-auto flex-1 rounded-sm border border-gray-300 shadow-sm p-4 ">
          <Table payrolls={payrollFullTemplates} />
        </div>
      </div>
      <hr className="border-t-2 border-gray-300 my-4" />
      <div className="space-y-4">
        <div className="flex flex-row items-center gap-2">
          <h2 className="text-[2rem]">Décimo Tercer Sueldo </h2>
        </div>
        <p>
          Esta sección muestra el valor estimado del Décimo Tercer Sueldo para
          cada docente que cumple con los requisitos para recibirlo.
        </p>
        <div>
          El décimo tercer sueldo se calcula tomando la doceava parte de todos
          los ingresos registrados desde el{" "}
          <strong>1 de diciembre de {endDate14to().lastYear}</strong> (año
          anterior){" "}
          <strong>
            hasta el 30 de noviembre de {endDate14to().currentYear}
          </strong>{" "}
          (año actual).{" "}
          <MoreInfo message="No se tomarán ingresos externos, como el Fondo de Reserva." />
        </div>

        <p>
          <strong>Fecha límite de pago:</strong> 24 de diciembre de{" "}
          {endDate14to().currentYear}.
        </p>

        <Table13er />
      </div>
              <hr className="border-t-2 border-gray-300 my-4" />
      <div className="space-y-4">
        <div className="flex flex-row items-center gap-2">
          <h2 className="text-[2rem]">Décimo Cuarto Sueldo </h2>
        </div>
        <p>
          Calcula aquí el valor aproximado del Décimo Cuarto Sueldo para los
          docentes registrados. Este monto se basa en el{" "}
          <strong>Sueldo Básico Unificado (SBU)</strong> vigente en Ecuador
          hasta la fecha de pago.
        </p>
        <p>
          <strong>Fecha límite de pago:</strong> 15 de agosto de{" "}
          {endDate14to().currentYear}.
        </p>
        <div className="space-x-1">
          <strong>Docentes registrados:</strong> {numEmployees}.
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
              1 de agosto de {endDate14to().lastYear} al 31 de julio de{" "}
              {endDate14to().currentYear}
            </strong>
            .
          </p>
        </div>

        <Table14to
          onNumEmployees={(numEmployees) => setNumEmployees(numEmployees)}
        />
      </div>
    </div>
  );
}

function formatToFullTemplate(
  payrollResponses: PayrollResponse[],
  employees: any[]
): PayrollFullTemplate[] {
  return payrollResponses
    .filter((payroll) => payroll.volatile !== true)
    .map((payroll) => {
      const employee = employees.find((emp) => emp.id === payroll.employeeId);
      let [year, month] = payroll.payrollMonth.split("-");
      if (!employee) {
        console.warn(
          `No se encontró empleado para employeeId=${payroll.employeeId}`
        );
        return {
          ...payroll,
          firstName: "",
          lastName: "",
          nationalId: "",
          birthDate: "",
          jobPosition: "",
        };
      }
      return {
        ...payroll,
        firstName: employee.firstName,
        lastName: employee.lastName,
        nationalId: employee.nationalId,
        birthDate: employee.birthDate,
        jobPosition: employee.workPeriods?.[0]?.jobPosition ?? "",
        payrollMonth: mathUtils.formatMonthYear(
          new Date(Number(year), Number(month) - 1)
        ),
      };
    });
}
