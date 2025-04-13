import { usePayrolls, useCreatePayroll, useUpdatePayroll, useDeletePayroll } from "@/hooks/usePayroll";

export default function PayrollPage() {
  const { data, isLoading, error } = usePayrolls();
  const createPayroll = useCreatePayroll();
  const updatePayroll = useUpdatePayroll();
  const deletePayroll = useDeletePayroll();

  if (isLoading) return <p>Cargando...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h1>Roles de Pago</h1>
      <ul>
        {data?.data.map((payroll: any) => (
          <li key={payroll.id}>
            {payroll.employeeId} - {payroll.payrollDate}
            <button onClick={() => deletePayroll.mutate(payroll.id)}>Eliminar</button>
            <button onClick={()=> (console.log(payroll.id))}>CONSOLA</button>
          </li>
        ))}
      </ul>

      <button
        onClick={() =>
          createPayroll.mutate({
            employeeId: "12345",
            earnings: [{ description: "Salario", amount: 1000 }],
            deductions: [{ description: "Impuestos", amount: 100 }],
          })
        }
      >
        Crear Rol de Pago
      </button>
    </div>
  );
}
