import {
  usePayrolls,
  useCreatePayroll,
  useUpdatePayroll,
  useDeletePayroll,
} from "@/hooks/usePayroll";
import { PayrollResponse, PayrollData } from "@/types";
import Button from "@/components/molecules/Button";
import { Plus } from "lucide-react";
import { Route, Routes, useNavigate } from "react-router-dom";
import NewPayroll_SelectTeacher from "./NewPayroll_SelectTeacher";
import NewPayroll_FillPayroll from "./NewPayroll_FillPayroll";

export default function PayrollPage() {
  return (
    <Routes>
      <Route index element={<PayrollMain />} />
      <Route path="selectTeacher" element={<NewPayroll_SelectTeacher />} />
      <Route path="fillPayroll" element={<NewPayroll_FillPayroll />} /> 
      {/* Puedes agregar más rutas aquí */}
    </Routes>
  );
}

// Vista principal como componente separado
function PayrollMain() {
  const { data, isLoading, error } = usePayrolls();
  const createPayroll = useCreatePayroll();
  const deletePayroll = useDeletePayroll();
  const navigate = useNavigate();

  const payrollMock: PayrollData = {
    earnings: [
      { description: "Sueldo", amount: 1000 },
      { description: "Bono", amount: 200 },
    ],
    deductions: [
      { description: "Impuesto", amount: 100 },
      { description: "Seguro", amount: 50 },
    ],
    payrollDate: "2023-10-01",
  };

  if (isLoading) return <p>Cargando...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 gap-4">
      <h1>Roles de Pago</h1>

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
        text="Crear Rol de Pago"
        variant="text"
        onClick={() => {
          createPayroll.mutate({
            employeeId: "LKAVuPKxzobnkMPbUWrW",
            payrollData: payrollMock,
          });
        }}
      />

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
