import Button from "@/components/molecules/Button";
import { useEmployees, useGetEmployeeByAdminId } from "@/hooks/useEmployee";
import {
  useCreatePayroll,
  useDeletePayroll,
  useGetPayrollsByAdmin,
  usePayrolls,
} from "@/hooks/usePayroll";
import { PayrollFullTemplate, PayrollResponse } from "@/types";
import { useNavigate } from "react-router-dom";
import { mathUtils } from "@/utils/math";
import TeachersTable from "../components/molecules/TeachersTable";
import { useAuth } from "@/context/AuthContext";
type Props = {};

export default function TeachersMain({}: Props) {
  const navigate = useNavigate();
  //Imprimir el resultado de la función formatToFullTemplate()

  const { userData } = useAuth();
  const adminId = userData?.adminId; // 👈 Aquí tienes el ID del usuario
  const userName = userData?.nombre;
  console.log("AdminId:", adminId);
  const {data: payrolls, isLoading: payrollsLoading, error: payrollsError,} = useGetPayrollsByAdmin(adminId);
  const {data:employee, isLoading: employeeIsLoading, error: employeeError,} = useGetEmployeeByAdminId(adminId);

  if (payrollsLoading || employeeIsLoading) return <p>Cargando...</p>;
  if (payrollsError || employeeError)
    return <p>Error: {payrollsError?.message || employeeError?.message}</p>;


  // const payrollFullTemplates = formatToFullTemplate(
  //   data?.data ?? [],
  //   employeesData?.data ?? []
  // );
  console.log("payrollsData:",payrolls.data)
  console.log("EmployeeData", employee.data)
const payrollFullTemplates = formatToFullTemplate(
  payrolls.data ?? [],
  employee.data
);


  console.log(payrollFullTemplates)
  const teachersName = userName;
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
  employee: any
): PayrollFullTemplate[] {
  return payrollResponses
    .filter((payroll) => payroll.volatile !== true)
    .map((payroll) => {
      // Validamos si el payroll es del empleado actual
      if (!employee || payroll.employeeId !== employee.id) {
        console.warn(`No se encontró empleado para employeeId=${payroll.employeeId}`);
        return {
          ...payroll,
          firstName: "",
          lastName: "",
          nationalId: "",
          birthDate: "",
          jobPosition: "",
        };
      }

      let [year, month] = payroll.payrollMonth?.split("-") ?? ["", ""];

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
