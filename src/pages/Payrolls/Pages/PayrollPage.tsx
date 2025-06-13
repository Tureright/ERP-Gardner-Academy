import {
  usePayrolls,
  useCreatePayroll,
  useUpdatePayroll,
  useDeletePayroll,
} from "@/hooks/usePayroll";
import { PayrollResponse, PayrollData, PayrollFullTemplate } from "@/types";
import Button from "@/components/molecules/Button";
import { Plus, Users } from "lucide-react";
import { Route, Routes, useNavigate } from "react-router-dom";
import NewPayroll_SelectTeacher from "./NewPayroll_SelectTeacher";
import NewPayroll_FillPayroll from "./NewPayroll_FillPayroll";
import NewPayroll_PayrollDetails from "./NewPayroll_PayrollDetails";
import Table from "../components/atoms/Table/Table";
import { useEmployee, useEmployees } from "@/hooks/useEmployee";
import { mathUtils } from "@/utils/math";

export default function PayrollPage() {
  return (
    <PayrollMain />
  );
}

// Vista principal como componente separado
function PayrollMain() {
  const { data, isLoading, error } = usePayrolls();
  const { data: employeesData, isLoading: isLoadingEmployees } = useEmployees();
  const createPayroll = useCreatePayroll();
  const deletePayroll = useDeletePayroll();
  const navigate = useNavigate();
  //Imprimir el resultado de la función formatToFullTemplate()

  if (isLoading) return <p>Cargando...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const payrollFullTemplates = formatToFullTemplate(
    data?.data ?? [],
    employeesData?.data ?? []
  );

  return (
    <div className="max-w-screen-xl mx-auto flex flex-col space-y-8 px-4">
      <h1 className="text-[2.5rem] mb-4">Roles de Pago</h1>
      <div className="flex flex-row flex-wrap items-start gap-4">
        <div className="w-auto flex-1 rounded-sm border border-gray-300 shadow-sm p-4 ">
          <Table payrolls={payrollFullTemplates} />
        </div>

        <div className="space-y-4 w-auto w-max-[300px]">
          <Button
            text="Añadir rol de pago"
            icon={<Plus size={20} strokeWidth={2} />}
            variant="text-icon"
            className="w-full"
            onClick={() => navigate("/payrolls/selectTeacher")}
            aria-label="Añadir rol de pago"
          />
          <Button
            text="Gestionar profesores"
            icon={<Users size={20} strokeWidth={2} />}
            variant="text-icon"
            className="w-full"
            onClick={() => ""}
            aria-label="Gestionar profesores"
          />
        </div>
      </div>
    </div>
  );
}

function formatToFullTemplate(
  payrollResponses: PayrollResponse[],
  employees: any[]
): PayrollFullTemplate[] {
  return payrollResponses.map((payroll) => {
    // Buscar el empleado correspondiente
    const employee = employees.find((emp) => emp.id === payroll.employeeId);

    if (!employee) {
      console.warn(
        `No se encontró empleado para employeeId=${payroll.employeeId}`
      );
      // Si no se encuentra, podemos devolver valores vacíos o default
      return {
        ...payroll,
        firstName: "",
        lastName: "",
        nationalId: "",
        birthDate: "",
        jobPosition: "", // Puedes definir cómo sacar el jobPosition
        payrollMonth: "", // Suponiendo que payrollMonth sea igual a payrollDate (o lo puedes formatear)
      };
    }
    return {
      ...payroll,
      firstName: employee.firstName,
      lastName: employee.lastName,
      nationalId: employee.nationalId,
      birthDate: employee.birthDate,
      jobPosition: employee.workPeriods?.[0]?.jobPosition ?? "", // ejemplo si tienes workPeriods con jobPosition
      payrollMonth: mathUtils.formatMonthYear(new Date(payroll.payrollDate)), // o aquí puedes formatear si lo prefieres
    };
  });
}
