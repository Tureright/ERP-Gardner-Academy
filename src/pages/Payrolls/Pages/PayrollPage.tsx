import {
  usePayrolls,
  useCreatePayroll,
  useUpdatePayroll,
  useDeletePayroll,
} from "@/hooks/usePayroll";
import { PayrollResponse, PayrollData, PayrollFullTemplate } from "@/types";
import Button from "@/components/molecules/Button";
import { Plus } from "lucide-react";
import { Route, Routes, useNavigate } from "react-router-dom";
import NewPayroll_SelectTeacher from "./NewPayroll_SelectTeacher";
import NewPayroll_FillPayroll from "./NewPayroll_FillPayroll";
import NewPayroll_PayrollDetails from "./NewPayroll_PayrollDetails";
import PayrollPrintPage from "./PayrollPrintPage";
import Table from "../components/atoms/Table/Table";
import { useEmployee, useEmployees } from "@/hooks/useEmployee";
import { mathUtils } from "@/utils/math";

export default function PayrollPage() {
  return (
    <Routes>
      <Route index element={<PayrollMain />} />
      <Route path="selectTeacher" element={<NewPayroll_SelectTeacher />} />
      <Route path="fillPayroll" element={<NewPayroll_FillPayroll />} />
      <Route path="payrollDetails" element={<NewPayroll_PayrollDetails />} />
      <Route path="printPayroll" element={<PayrollPrintPage />} />
      {/* Puedes agregar más rutas aquí */}
    </Routes>
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
    <div className="flex flex-col min-h-screen bg-gray-100 gap-4">
      <h1>Roles de Pago</h1>
      <Table
      payrolls={payrollFullTemplates}
      />
      <ul>
        {data?.data.map((payroll: PayrollResponse) => (
          <li key={payroll.id}>
            {payroll.employeeId} - {payroll.payrollDate}
            <button
              onClick={() =>
                deletePayroll.mutate({
                  employeeId: payroll.employeeId,
                  payrollId: payroll.id,
                })
              }
            >
              Eliminar
            </button>
          </li>
        ))}
      </ul>
      <Button
        text="Añadir rol de pago"
        icon={<Plus size={20} strokeWidth={2} />}
        variant="text-icon"
        className="w-[250px]"
        onClick={() => navigate("/payrolls/selectTeacher")}
      />
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
        payrollMonth: payroll.payrollDate, // Suponiendo que payrollMonth sea igual a payrollDate (o lo puedes formatear)
      };
    }
    console.log("Employee found:", employee);
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
