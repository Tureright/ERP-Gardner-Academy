import {
  useEmployees,
  useCreateEmployee,
  useUpdateEmployee,
  useDeleteEmployee,
} from "@/hooks/useEmployee";
import {
  usePayrolls,
  useCreatePayroll,
  useUpdatePayroll,
  useDeletePayroll,
  usePayrollsByEmployee
} from "@/hooks/usePayroll";

import React, { useState } from "react";
import Calculations from "./components/Calculations/Calculations";
import CardPager from "./components/CardPager/CardPager";

interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  nationalId: string;
  birthDate: string;
  workPeriods: [];
  instituionalEmail: string;
}

interface Payroll {
  id: string;
  employeeId: string;
  payrollDate: string;
  earnings: Array<{ description: string; amount: number }>;
  deductions: Array<{ description: string; amount: number }> | null;
}

export default function EmployeePage() {
  const { data: employees, isLoading: loadingEmployees } = useEmployees();
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [showPayrolls, setShowPayrolls] = useState(false);

  
  const { data: payrolls, isLoading: loadingPayrolls } = usePayrollsByEmployee(selectedEmployee?.id);

  return (
    <div>
      <h1 className="text-xl font-semibold mb-4">Seleccione un empleado</h1>
      
      <ul className="space-y-2 mb-6">
        {loadingEmployees && <li>Cargando empleados...</li>}
        {employees?.data.map((employee: Employee) => (
          <li key={employee.id} className="flex justify-between items-center border p-2 rounded">
            <span>{employee.firstName} {employee.lastName}</span>
            <button
              className={`px-3 py-1 rounded ${
                selectedEmployee?.id === employee.id ? "bg-blue-600 text-white" : "bg-gray-200"
              }`}
              onClick={() => {
                setSelectedEmployee(employee);
                setShowPayrolls(false);
              }}
            >
              {selectedEmployee?.id === employee.id ? "Seleccionado" : "Seleccionar"}
            </button>
          </li>
        ))}
      </ul>

      {selectedEmployee && (
        <div className="mb-4">
          <button
            className="px-4 py-2 bg-green-600 text-white rounded"
            onClick={() => setShowPayrolls(true)}
          >
            Mostrar Roles de Pago
          </button>
        </div>
      )}

      {showPayrolls && selectedEmployee && (
        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-2">Roles de Pago de {selectedEmployee.firstName}</h2>
          <ul className="space-y-2">
            {loadingPayrolls && <li>Cargando roles de pago...</li>}
            {payrolls?.data.map((payroll: Payroll) => (
              <li key={payroll.id} className="border p-2 rounded">
                <p>Fecha: {payroll.payrollDate}</p>
                <p>Ingresos: {JSON.stringify(payroll.earnings)}</p>
                <p>Deducciones: {JSON.stringify(payroll.deductions)}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {
        showPayrolls && selectedEmployee && (
          <button
            className="px-4 py-2 bg-red-600 text-white rounded"
            onClick={() => setShowPayrolls(false)}
          >
            Ocultar Roles de Pago
          </button>
      )
        
      }


      <h1>Roles de Pago</h1>
      <div className="flex flex-wrap max-w-4xl gap-2 bg-white p-5 ">
        <Calculations
          title={"Ingresos"}
          items={[
            { description: "lol", amount: 5 },
            { description: "pago", amount: 3 },
          ]}
        />
        <Calculations
          title={"Deducciones"}
          items={[
            { description: "lol", amount: 5 },
            { description: "lol", amount: 5 },
          ]}
        />
      </div>
    </div>
  );
}
