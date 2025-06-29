import { API_ENDPOINTS } from "@/pages/Invoices/config/constants";
import { StudentRepresentative } from "@/pages/Invoices/types";

export const studentsRepresentativesService = {
  async getStudentsRepresentatives() {
    try {
      const response = await fetch(API_ENDPOINTS.GET_STUDENTS_REPRESENTATIVES);
      const data = await response.json();
      return data;
    } catch (error) {
      console.log("Error", error);
      throw Error(error.message);
    }
  },
};
