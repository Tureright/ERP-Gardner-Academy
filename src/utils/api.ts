// Helper común para todas las llamadas
export async function handleResponse(res: Response) {
  if (!res.ok) {
    console.error(`[NETWORK ERROR] ${res.status} ${res.statusText}`);
    throw new Error("Error de red al comunicarse con el servidor.");
  }
  const json = await res.json();

  if (!json.success) {
    console.error(`[API ERROR] ${json.error}`);
    throw new Error(json.error || "Error desconocido del API.");
  }
  return json;
}

export const defaultPostOpts = (body: any): RequestInit => ({
  method: "POST",
  body: JSON.stringify(body),
});

// Binary response helper
export async function handleBinaryResponse(res: Response): Promise<Blob> {
  if (!res.ok) {
    console.error(`[NETWORK ERROR] ${res.status} ${res.statusText}`);
    throw new Error("Error de red al obtener la imagen.");
  }
  return res.blob();
}
