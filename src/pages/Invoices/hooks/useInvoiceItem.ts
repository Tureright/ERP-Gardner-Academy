import { useState, useEffect } from "react";
import { InvoiceItem } from "../types/invoice";
import { API_ENDPOINTS } from "../config/constants";

const useInvoiceItem = () => {
  const [items, setItems] = useState<InvoiceItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const addItem = (item: InvoiceItem) => {
    setItems((prev) => [...prev, item]);
  };

  const removeItem = (id: number) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const updateItem = (id: number, updates: Partial<InvoiceItem>) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  };

  const fetchItem = async (itemCode, data): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_ENDPOINTS.GET_ITEM}&itemCode=${itemCode}`);
       const result = await response.json();
      console.log(result);

      if (result.success && result.data) {
        const itemData = result.data;
        const newItem : InvoiceItem = {
          id: itemData.id,
          codigoPrincipal: itemData.codigo_principal,
          descripcion: itemData.descripcion,
          precioUnitario: itemData.precio_unitario,
          cantidad: 1,
          descuento: data.discount || 0,
          precioTotal: itemData.precio_unitario - (data.discount || 0),
          codigoIva: itemData.codigo_iva,
          tipo: itemData.tipo,
        };
        setItems([newItem]);
      } else {
        console.error(`No se pudo obtener el item ${error}`);
      }
    } catch (error) {
      console.error("Error al obtener el item:", error);
    } finally {
      setLoading(false);
    }
  };

  return {
    items,
    loading,
    error,
    addItem,
    removeItem,
    updateItem,
    setLoading,
    setItems
  };
};

export default useInvoiceItem;
