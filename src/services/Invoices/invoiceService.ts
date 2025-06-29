import { API_ENDPOINTS } from "@/pages/Invoices/config/constants";

export const invoiceService = {
  async createInvoice(formData: any, items: any, additionalInfo: any, paymentInfo: any, totals: any) {
    const response = await fetch(
      `${API_ENDPOINTS.GET_EMITTED_INVOICES.replace(
        "getInvoices",
        "createInvoice"
      )}`,
      {
        method: "POST",
        body: JSON.stringify({
          formData,
          items,
          additionalInfo,
          paymentInfo,
          totals,
        }),
      }
    );
    const result = await response.json();
    if (result.errorResponse) {
      throw new Error(result.errorResponse.message);
    }
    return result;
  },

  async getEmittedInvoices(page: number = 1, pageSize: number = 10) {
    const response = await fetch(
      `${API_ENDPOINTS.GET_EMITTED_INVOICES}&page=${page}&pageSize=${pageSize}`
    );
    const result = await response.json();
    if (result.errorResponse) {
      throw new Error(result.errorResponse.message);
    }
    return result;
  },
};
