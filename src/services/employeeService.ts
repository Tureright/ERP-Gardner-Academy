const API_URL_EMP =
  "https://script.google.com/macros/s/AKfycbxDBOfSUnhWKrcvVYN6WpJTEjBOHXfXYC_1wY91u2mufHPrV8FdAJKgf2lJF7rueA-K/exec";

// --- DO GET ---
export async function getAllEmployees() {
  const res = await fetch(`${API_URL_EMP}?action=getAllEmployees`);
  if (!res.ok) throw new Error("Error al obtener los empleados");
  return res.json();
}

export async function getEmployeeById(employeeId: string) {
  const res = await fetch(
    `${API_URL_EMP}?action=getEmployeeById&id=${employeeId}`
  );
  if (!res.ok) throw new Error("Error al obtener el empleado por ID");
  return res.json();
}

// --- DO POST ---
const defaultPostOpts = (body: any): RequestInit => ({
  method: "POST",
  //headers: { "Content-Type": "application/json" },
  body: JSON.stringify(body),
});

export async function createEmployee(employeeData: any) {
  const res = await fetch(
    API_URL_EMP,
    defaultPostOpts({ action: "createEmployee", employeeData })
  );
  if (!res.ok) throw new Error("Error al crear el empleado");
  return res.json();
}

export async function updateEmployee(employeeId: string, employeeData: any) {
  const res = await fetch(
    API_URL_EMP,
    defaultPostOpts({ action: "updateEmployee", employeeId, employeeData })
  );
  if (!res.ok) throw new Error("Error al actualizar el empleado");
  return res.json();
}

export async function deleteEmployee(employeeId: string) {
  const res = await fetch(
    API_URL_EMP,
    defaultPostOpts({ action: "deleteEmployee", employeeId })
  );
  if (!res.ok) throw new Error("Error al eliminar el empleado");
  return res.json();
}
