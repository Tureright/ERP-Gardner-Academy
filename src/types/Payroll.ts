// src/types/payroll.ts
export interface PayrollBase {
  earnings: Array<{ description: string; amount: number }>;
  deductions: Array<{ description: string; amount: number }> | null;
  payrollDate: string;
}

// Payload para crear/actualizar
export interface PayrollData extends PayrollBase {}

// Objeto completo que devuelve la API
export interface PayrollResponse extends PayrollBase {
  id: string;
  employeeId: string;
}
