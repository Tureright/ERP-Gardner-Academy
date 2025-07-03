// types/index.ts
export interface Calendar {
  id: string;
  summary: string;
  description: string;
  employeeId?: string;
}

export interface RecurringEvent {
  summary: string;
  startDate: string; // ISO string
  endDate: string;
  until: string;
}

export interface RecurringEventResponse extends RecurringEvent {
  id: string;
}
