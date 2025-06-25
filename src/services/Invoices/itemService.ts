import { API_ENDPOINTS } from "@/pages/Invoices/config/constants";

export const itemService = {
  async getItems() {
    try {
      const response = await fetch(`${API_ENDPOINTS.GET_ITEMS}`);
      const data = await response.json();
      if (data.errorResponse) {
        throw new Error(data.errorResponse.message);
      }
      return data.data.filter((item) => item.activo);
    } catch (error) {
      console.log(error);
      throw error;
    }
  },

  async getItem(itemCode: string) {
    try {
      const response = await fetch(
        `${API_ENDPOINTS.GET_ITEM}&itemCode=${itemCode}`
      );
      const data = await response.json();
      if (data.errorResponse) {
        throw new Error(data.errorResponse.message);
      }
      return data.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },

  async createItem(itemData) {
    try {
      const response = await fetch(
        `${API_ENDPOINTS.GET_ITEMS.replace("getItems", "createItem")}`,
        {
          method: "POST",
          body: JSON.stringify(itemData),
        }
      );
      const result = await response.json();
      if (result.errorResponse) {
        throw new Error(result.errorResponse.message);
      }
      return result;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },

  async updateItem(id: string, itemData) {
    try {
      const response = await fetch(
        `https://script.google.com/macros/s/AKfycbx2odZBM133mu7Fafoe6A0D6M1EIpwZg5vL_wJNDe9MBHapRQGldtEzlQVgBs3I3MPHmA/exec?path=updateItem&method=PATCH&idItem=${id}`,
        {
          method: "POST",
          body: JSON.stringify(itemData),
        }
      );
      const result = await response.json();
      if (result.errorResponse) {
        throw new Error(result.errorResponse.message);
      }
      return result;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
};
