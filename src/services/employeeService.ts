const API_URL = "/api";

export async function getAllEmployees() {
  const response = await fetch(`${API_URL}?action=getAllEmployees`);
  if (!response.ok) throw new Error("Error al obtener los empleados");
  return response.json();
}

export async function getEmployeeById(employeeId: string) {
  const response = await fetch(`${API_URL}?action=getEmployeeById&id=${employeeId}`);
  if (!response.ok) throw new Error("Error al obtener el empleado");
  return response.json();
}

export async function createEmployee(employeeData: any) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action: "createEmployee",
      employeeData: employeeData,
    }),
  });
  if (!response.ok) throw new Error("Error al crear el empleado");
  return response.json();
}

export async function updateEmployee(employeeId: string, employeeData: any) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action: "updateEmployee",
      employeeId: employeeId,
      employeeData: employeeData,
    }),
  });
  if (!response.ok) throw new Error("Error al crear el empleado");
  return response.json();
}

export async function deleteEmployee(employeeId: string) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "deleteEmployee", employeeId: employeeId }),
  });
  if (!response.ok) throw new Error("Error al crear el empleado");
  return response.json();
}
