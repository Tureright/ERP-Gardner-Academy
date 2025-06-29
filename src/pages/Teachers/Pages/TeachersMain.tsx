import Button from "@/components/molecules/Button";
import { useEmployees } from "@/hooks/useEmployee";
import { useCreatePayroll, useDeletePayroll, usePayrolls } from "@/hooks/usePayroll";
import { PayrollFullTemplate, PayrollResponse } from "@/types";   
import { useNavigate } from "react-router-dom";
import { mathUtils } from "@/utils/math";
import TeachersTable from "../components/molecules/TeachersTable";

type Props = {};

export default function TeachersMain({}: Props) {
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
  const teachersName = "Teachers Name"
  return (
    <div className="p-4 space-y-6 max-w-4xl mx-auto">
      <h1 className="text-[2.5rem] mb-4">Roles de Pago de {teachersName}</h1>

      <div className="w-auto flex-1 rounded-sm border border-gray-300 shadow-sm p-4 ">
        <TeachersTable payrolls={payrollFullTemplates} />
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
