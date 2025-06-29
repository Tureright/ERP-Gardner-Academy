import { API_ENDPOINTS } from "@/pages/Invoices/config/constants";

export const monthsService = {
  async getBilledMonths(studentId: string, representativeId: string) {
    try {
      const response = await fetch(
        `${API_ENDPOINTS.GET_BILLED_MONTHS}&studentId=${studentId}&representativeId=${representativeId}`
      );
      const result = await response.json();

      if (!result.success) {
        throw new Error(
          result.errorResponse?.details ||
            result.errorResponse?.message ||
            "Error al obtener los meses facturados"
        );
      }

      return result;
    } catch (error) {
      console.error("Error en monthsService:", error);
      throw error instanceof Error
        ? error
        : new Error("Error desconocido al obtener los meses facturados");
    }
  },
};
