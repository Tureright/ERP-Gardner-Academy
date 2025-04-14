const API_URL =
  "https://script.google.com/macros/s/AKfycbxDBOfSUnhWKrcvVYN6WpJTEjBOHXfXYC_1wY91u2mufHPrV8FdAJKgf2lJF7rueA-K/exec"; // Reemplaza con la URL de tu API

export async function getAllPayrolls() {
  const response = await fetch(`${API_URL}?action=getAllPayrolls`);
  if (!response.ok) throw new Error("Error al obtener los roles de pago");
  return response.json();
}

export async function getPayrollById(id: string) {
  const response = await fetch(`${API_URL}?action=getPayrollById&id=${id}`);
  if (!response.ok) throw new Error("Error al obtener el rol de pago");
  return response.json();
}

export async function createPayroll(payrollData: any) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "createPayroll", payrollData: payrollData }),
  });
  if (!response.ok) throw new Error("Error al crear el rol de pago");
  return response.json();
}

export async function updatePayroll(payrollId: string, payrollData: any) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action: "updatePayroll",
      payrollId: payrollId,
      payrollData: payrollData,
    }),
  });
  if (!response.ok) throw new Error("Error al actualizar el rol de pago");
  return response.json();
}

export async function deletePayroll(payrollId: string) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "deletePayroll", payrollId: payrollId }),
    mode: "no-cors",
  });
  if (!response.ok) throw new Error("Error al eliminar el rol de pago");
  return response.json();
}
