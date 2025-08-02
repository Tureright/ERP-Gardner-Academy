import {
  handleResponse,
  defaultPostOpts,
  handleBinaryResponse,
} from "@/utils/api";
const API_URL_EMP =
  "INSERT_API_URL";

// --- DO GET ---
export async function getAllEmployees() {
  const res = await fetch(`${API_URL_EMP}?action=getAllEmployees`);
  return handleResponse(res);
}

export async function getEmployeeById(employeeId: string) {
  const res = await fetch(
    `${API_URL_EMP}?action=getEmployeeById&id=${employeeId}`
  );
  return handleResponse(res);
}
export async function getEmployeeByAdminId(adminId: string) {
  const res = await fetch(
    `${API_URL_EMP}?action=getEmployeeByAdminId&adminId=${adminId}`
  );
  return handleResponse(res);
}

export async function getProfilePicture(employeeId: string) {
  const res = await fetch(
    `${API_URL_EMP}?action=getProfilePicture&employeeId=${employeeId}`
  );
  return handleResponse(res);
}

export async function getEmployees13erSueldo() {
  const res = await fetch(`${API_URL_EMP}?action=getEmployees13erSueldo`);
  return handleResponse(res);
}

export async function get13erSueldoByEmployeeId(employeeId: string) {
  const res = await fetch(
    `${API_URL_EMP}?action=get13erSueldoByEmployeeId&employeeId=${employeeId}`
  );
  return handleResponse(res);
}

export async function getMonthsFor14Sueldo(employeeId: string) {
  const res = await fetch(
    `${API_URL_EMP}?action=getMonthsFor14Sueldo&employeeId=${employeeId}`
  );
  return handleResponse(res);
}

// --- DO POST ---
export async function createEmployee(employeeData: any) {
  const res = await fetch(
    API_URL_EMP,
    defaultPostOpts({ action: "createEmployee", employeeData })
  );
  return handleResponse(res);
}

export async function updateEmployee(employeeId: string, employeeData: any) {
  const res = await fetch(
    API_URL_EMP,
    defaultPostOpts({
      action: "updateEmployee",
      employeeId,
      employeeData,
    })
  );
  return handleResponse(res);
}

export async function deleteEmployee(employeeId: string) {
  const res = await fetch(
    API_URL_EMP,
    defaultPostOpts({ action: "deleteEmployee", employeeId })
  );
  return handleResponse(res);
}

export async function uploadProfilePicture(
  employeeId: string,
  base64Data: string
) {
  const res = await fetch(
    API_URL_EMP,
    defaultPostOpts({
      action: "setProfilePicture",
      employeeId,
      base64Data,
    })
  );
  return handleResponse(res);
}
// --- NUEVA FUNCIÓN DE SINCRONIZACIÓN ---
export async function syncNewDocentes() {
  const res = await fetch(
    API_URL_EMP,
    defaultPostOpts({
      action: "syncNewDocentes",
    })
  );
  return handleResponse(res);
}
