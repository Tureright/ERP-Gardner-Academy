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
      console.error("Error fetching item:",error);
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

      return result;
    } catch (error) {
      console.error("Error creating item:",error);
    }
  },

  async updateItem(id: string, itemData) {
    try {
      const response = await fetch(
        `${API_ENDPOINTS.UPDATE_ITEM}&idItem=${id}`,
        {
          method: "POST",
          body: JSON.stringify(itemData),
        }
      );
      const result = await response.json();
console.log("result desde EP update item:", result)
      return result;
    } catch (error) {
      console.error("Error updating item:",error);
    }
  },
};
