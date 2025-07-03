import { PayrollFullTemplate } from "@/types";
import { handleResponse } from "@/utils/api";
const API_URL =
  "https://script.google.com/macros/s/AKfycbxDBOfSUnhWKrcvVYN6WpJTEjBOHXfXYC_1wY91u2mufHPrV8FdAJKgf2lJF7rueA-K/exec"; // Reemplaza con la URL de tu API

// --- DO GET ---
export async function getAllPayrolls() {
  const res = await fetch(`${API_URL}?action=getAllPayrolls`);
  return handleResponse(res);
}

export async function getPayrollById(employeeId: string, payrollId: string) {
  const res = await fetch(
    `${API_URL}?action=getPayrollById&employeeId=${employeeId}&id=${payrollId}`
  );
  return handleResponse(res);
}

export async function getAllPayrollsByEmployee(employeeId: string) {
  const res = await fetch(
    `${API_URL}?action=getAllPayrollsByEmployee&employeeId=${employeeId}`
  );
  return handleResponse(res);
}

export async function getPayrollsByAdmin(adminId: string) {
  const res = await fetch(
    `${API_URL}?action=getPayrollsByAdmin&adminId=${adminId}`
  );
  return handleResponse(res);
}

export async function getLatestPayroll(employeeId: string) {
  const res = await fetch(
    `${API_URL}?action=getLatestPayroll&employeeId=${employeeId}`
  );
  return handleResponse(res);
}
export async function downloadPayroll(employeeId: string, payrollId: string) {
  const res = await fetch(
    `${API_URL}?action=downloadPayroll&employeeId=${employeeId}&payrollId=${payrollId}`
  );
  return handleResponse(res);
}

// --- DO POST ---
const defaultPostOptions = (body: any): RequestInit => ({
  method: "POST",
  body: JSON.stringify(body),
});

export async function createPayroll(employeeId: string, payrollData: any) {
  const res = await fetch(
    API_URL,
    defaultPostOptions({ action: "createPayroll", employeeId, payrollData })
  );
  return handleResponse(res);
}

export async function updatePayroll(
  employeeId: string,
  payrollId: string,
  payrollData: any
) {
  const res = await fetch(
    API_URL,
    defaultPostOptions({
      action: "updatePayroll",
      employeeId,
      payrollId,
      payrollData,
    })
  );
  return handleResponse(res);
}

export async function deletePayroll(employeeId: string, payrollId: string) {
  const res = await fetch(
    API_URL,
    defaultPostOptions({
      action: "deletePayroll",
      employeeId,
      payrollId,
    })
  );
  return handleResponse(res);
}

export async function setPayrollTemplate(newPayroll: PayrollFullTemplate) {
  const res = await fetch(
    API_URL,
    defaultPostOptions({
      action: "setPayrollTemplate",
      newPayroll,
    })
  );
  return handleResponse(res);
}
