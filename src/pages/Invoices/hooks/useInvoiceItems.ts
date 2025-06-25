import { useState, useEffect } from "react";
import { Item } from "../types/items";
import { API_ENDPOINTS } from "../config/constants";

import { useQuery} from "@tanstack/react-query";
import { itemService } from "@/services/Invoices/itemService";


export const useInvoiceItems = () => {
  //const [items, setItems] = useState<Item[]>([]);
  //const [loading, setLoading] = useState<boolean>(false);
  //const [error, setError] = useState<Error | null>(null);

  /*
  const fetchItems = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(API_ENDPOINTS.GET_ITEMS);
      const result = await response.json();

      if (result.success) {
        const activeItems = result.data.filter((item: Item) => item.activo);
        setItems(activeItems);
      } else {
        throw new Error("Error al cargar los items");
      }
    } catch (err) {
      setError(error);
      console.error("Error al cargar los items:", err);
    } finally {
      setLoading(false);
    }
  };*/

    // Query para obtener items
    const {
      data: items = [],
      isLoading,
      error,
    } = useQuery({
      queryKey: ["items"],
      queryFn: itemService.getItems,
    });
/*
  useEffect(() => {
    fetchItems();
  }, []);*/

  return {
    items,
    isLoading,
  };
};

export default useInvoiceItems;
