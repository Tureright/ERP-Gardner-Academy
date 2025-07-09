import {
  usePayrolls,
  useCreatePayroll,
  useUpdatePayroll,
  useDeletePayroll,
} from "@/hooks/usePayroll";
import { PayrollResponse, PayrollData, PayrollFullTemplate } from "@/types";
import Button from "@/components/molecules/Button";
import { Plus, Users, TriangleAlert, UserSearch, Undo } from "lucide-react";
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
 

  if (isLoading) return <CenteredSpinner text="Cargando Roles de Pago" />;
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
        <h1 className="text-[2.5rem] mb-4">Profesores</h1>
        <p>
          Consulta toda la información relacionada con los profesores
          registrados en la nómina de la institución.
        </p>
        <Button
          text="Perfiles de Profesores"
          icon={<UserSearch size={20} strokeWidth={2} />}
          variant="text-icon"
          onClick={() => navigate("/payrolls/selectTeacherDetails")}
          aria-label="Lleva a la pantalla de selección de profesor"
          className="w-full"
        />
        <Button
          text="Decimotercer Remuneración"
          icon={
            <span className="w-7 h-7 flex items-center justify-center border-2 border-gray-700 text-gray-700 text-base font-bold rounded transition group-hover:bg-purple-primary group-hover:text-white group-hover:border-purple-primary">
              13
            </span>
          }
          variant="text-icon"
          onClick={() => navigate("/payrolls/decimotercerPage")}
          aria-label="Lleva a una página dedica a la decimotercera remuneración"
          className="w-full"
        />
        <Button
          text="Decimocuarta Remuneración"
          icon={
            <span className="w-7 h-7 flex items-center justify-center border-2 border-gray-700 text-gray-700 text-base font-bold rounded transition group-hover:bg-purple-primary group-hover:text-white group-hover:border-purple-primary">
              14
            </span>
          }
          variant="text-icon"
          onClick={() => navigate("/payrolls/decimocuartoPage")}
          aria-label="Lleva a una página dedica a la decimocuarta remuneración"
          className="w-full"
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
