// src/types/payroll.ts
export interface PayrollBase {
  earnings: Array<{ description: string; amount: number }>;
  deductions: Array<{ description: string; amount: number }> | null;
  payrollDate: string;
  payrollMonth?: string; // Opcional, si no se envía se calcula automáticamente
  summary?: string;
  volatile?: boolean;
  driveId?: string;
  type?: string;
}

// Payload para crear/actualizar
export interface PayrollData extends PayrollBase {}

// Objeto completo que devuelve la API
export interface PayrollResponse extends PayrollBase {
  id: string;
  employeeId: string;
}

export interface PayrollFullTemplate extends PayrollResponse {
  firstName: string;
  lastName: string;
  nationalId: string;
  birthDate: string;
  jobPosition: string;
}
