const API_URL =
  "https://script.google.com/macros/s/AKfycbxDBOfSUnhWKrcvVYN6WpJTEjBOHXfXYC_1wY91u2mufHPrV8FdAJKgf2lJF7rueA-K/exec"; // Reemplaza con la URL de tu API

// --- DO GET ---
export async function getAllPayrolls() {
  const res = await fetch(`${API_URL}?action=getAllPayrolls`);
  if (!res.ok) throw new Error("Error al obtener todos los roles de pago");
  return res.json();
}

export async function getPayrollById(employeeId: string, payrollId: string) {
  const res = await fetch(
    `${API_URL}?action=getPayrollById&employeeId=${employeeId}&id=${payrollId}`
  );
  if (!res.ok) throw new Error("Error al obtener el rol de pago por ID");
  return res.json();
}

export async function getAllPayrollsByEmployee(employeeId: string) {
  const res = await fetch(
    `${API_URL}?action=getAllPayrollsByEmployee&employeeId=${employeeId}`
  );
  if (!res.ok) throw new Error("Error al obtener roles de pago de un empleado");
  return res.json();
}

export async function getLatestPayroll(employeeId: string) {
  const res = await fetch(
    `${API_URL}?action=getLatestPayroll&employeeId=${employeeId}`
  );
  if (!res.ok) throw new Error("Error al obtener el último rol de pago");
  return res.json();
}

// --- DO POST ---

const defaultPostOptions = (body: any): RequestInit => ({
  method: "POST",
  //headers: { "Content-Type": "application/json" },
  body: JSON.stringify(body),
});

export async function createPayroll(employeeId: string, payrollData: any) {
  const res = await fetch(
    API_URL,
    defaultPostOptions({ action: "createPayroll", employeeId, payrollData })
  );
  if (!res.ok) throw new Error("Error al crear el rol de pago");
  return res.json();
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
  if (!res.ok) throw new Error("Error al actualizar el rol de pago");
  return res.json();
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
  if (!res.ok) throw new Error("Error al eliminar el rol de pago");
  return res.json();
}
