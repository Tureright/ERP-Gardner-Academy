// src/types/Employee.ts
export interface EmployeeBase {
  adminId?: string;
  firstName: string;
  lastName: string;
  nationalId: string;
  birthDate: string;
  workPeriods: workPeriods[]; // De momento `any[]`, luego podemos definir mejor este tipo.
  institutionalEmail: string;
  suspended?: boolean;
  calendarId?: string;
}

export interface EmployeeData extends EmployeeBase {}

// Para manejar la respuesta de la API (con id)
export interface EmployeeResponse extends EmployeeBase {
  id: string;
}

export interface workPeriods {
  jobPosition: string;
  startDate: string;
  endDate: string;
}
