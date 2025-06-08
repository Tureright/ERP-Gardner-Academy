import {
  handleResponse,
  defaultPostOpts,
  handleBinaryResponse,
} from "@/utils/api";
const API_URL_EMP =
  "https://script.google.com/macros/s/AKfycbxDBOfSUnhWKrcvVYN6WpJTEjBOHXfXYC_1wY91u2mufHPrV8FdAJKgf2lJF7rueA-K/exec";

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

export async function getProfilePicture(employeeId: string) {
  const res = await fetch(
    `${API_URL_EMP}?action=getProfilePicture&employeeId=${employeeId}`
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
