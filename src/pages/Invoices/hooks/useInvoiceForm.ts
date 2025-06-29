import { useState, useEffect } from "react";
import { useForm } from "antd/lib/form/Form";
import { getInvoiceTableColumns } from "../config/invoiceTableConfig";
import {
  TAX_RATES,
  TAX_CODES,
  DEFAULT_VALUES,
  API_ENDPOINTS,
} from "../config/constants";

export const useInvoiceForm = (initialData, selectedMonth) => {
  const [form] = useForm();
  const [items, setItems] = useState([]);
  const [editingKey, setEditingKey] = useState("");
  const [loading, setLoading] = useState(false);

  const [totals, setTotals] = useState({
    subtotalIva15: 0,
    subtotalIvaDiferenciado: 0,
    subtotal0: 0,
    subtotalNoObjetoIva: 0,
    subtotalExentoIva: 0,
    subtotalSinImpuestos: 0,
    totalDescuento: 0,
    ice: 0,
    iva15: 0,
    propina: 0,
    valorTotal: 0,
  });

  const [additionalInfo, setAdditionalInfo] = useState({
    Mes: selectedMonth,
    Alumno: initialData?.studentName,
  });

  const [paymentInfo, setPaymentInfo] = useState({
    otros: 200,
    plazo: 0,
  });

  const calculateTotals = (itemsList) => {
    let newTotals = {
      subtotalIva15: 0,
      subtotalIvaDiferenciado: 0,
      subtotal0: 0,
      subtotalNoObjetoIva: 0,
      subtotalExentoIva: 0,
      subtotalSinImpuestos: 0,
      totalDescuento: 0,
      ice: 0,
      iva15: 0,
      propina: 0,
      valorTotal: 0,
    };

    itemsList.forEach((item) => {
      const subtotal = item.cantidad * item.precioUnitario;
      //const descuento = (item.descuento / 100) * subtotal;
      //const total = subtotal - descuento;
      const descuento = item.descuento;
      const total = subtotal;

      switch (item.codigoIva) {
        case TAX_CODES.IVA_15:
          newTotals.subtotalIva15 += total;
          newTotals.iva15 += total * TAX_RATES.IVA_15;
          break;
        case TAX_CODES.IVA_DIFERENCIADO:
          newTotals.subtotalIvaDiferenciado += total;
          break;
        case TAX_CODES.IVA_0:
          newTotals.subtotal0 += total;
          break;
        case TAX_CODES.NO_OBJETO_IVA:
          newTotals.subtotalNoObjetoIva += total;
          break;
        case TAX_CODES.EXENTO_IVA:
          newTotals.subtotalExentoIva += total;
          break;
        case TAX_CODES.IVA_12:
          newTotals.subtotalIva15 += total;
          newTotals.iva15 += total * TAX_RATES.IVA_12;
          break;
        case TAX_CODES.IVA_14:
          newTotals.subtotalIva15 += total;
          newTotals.iva15 += total * TAX_RATES.IVA_14;
          break;
        case TAX_CODES.IVA_5:
          newTotals.subtotalIva15 += total;
          newTotals.iva15 += total * TAX_RATES.IVA_5;
          break;
        case TAX_CODES.IVA_13:
          newTotals.subtotalIva15 += total;
          newTotals.iva15 += total * TAX_RATES.IVA_13;
          break;
      }

      newTotals.totalDescuento += descuento;
      newTotals.subtotalSinImpuestos += total;
    });

    // Calcular el valor total
    newTotals.valorTotal =
      newTotals.subtotalSinImpuestos +
      newTotals.iva15 +
      newTotals.ice +
      newTotals.propina -
      newTotals.totalDescuento;
    setPaymentInfo({ otros: newTotals.valorTotal, plazo: 0 });
    return newTotals;
  };

  // Efecto para recalcular totales cuando cambian los items
  useEffect(() => {
    const newTotals = calculateTotals(items);
    setTotals(newTotals);
  }, [items]);

  useEffect(() => {
    if (initialData && selectedMonth) {
      form.setFieldsValue({
        razonSocial: initialData.representativeName,
        identificacion: initialData.representativeId,
        direccion: initialData.representativeAddress,
        telefono: initialData.representativePhone,
        correo: initialData.representativeEmail,
        Mes: selectedMonth,
        Alumno: initialData.studentName,
      });
    }
  }, [initialData, selectedMonth, form]);

  const isEditing = (record) => record.id === editingKey;

  const edit = (record) => {
    form.setFieldsValue({
      cantidad: record.cantidad,
      descuento: record.descuento,
    });
    setEditingKey(record.id);
  };

  const cancel = () => {
    setEditingKey("");
  };

  const save = async (id) => {
    try {
      const row = await form.validateFields();
      const newData = [...items];
      const index = newData.findIndex((item) => id === item.id);
      if (index > -1) {
        const item = newData[index];
        const updatedItem = {
          ...item,
          cantidad: row.cantidad,
          descuento: row.descuento,
          precioTotal: (
            row.cantidad * item.precioUnitario -
            row.descuento
          ).toFixed(2),
        };
        newData.splice(index, 1, updatedItem);
        setItems(newData);
        setEditingKey("");
        form.resetFields();
      }
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };

  const handleAddAdditionalInfo = (newInfo) => {
    setAdditionalInfo((prev) => ({
      ...prev,
      [newInfo.nombre]: newInfo.valor,
    }));
  };

  const handleRemoveAdditionalInfo = (key) => {
    setAdditionalInfo((prev) => {
      const newInfo = { ...prev };
      delete newInfo[key];
      return newInfo;
    });
  };

  const handleAddItem = (newItem) => {
    setItems((prev) => [...prev, newItem]);
  };

  const handleRemoveItem = (itemId) => {
    setItems((prev) => prev.filter((item) => item.id !== itemId));
  };

  // Función para obtener el item del API
  const fetchItem = async (itemCode) => {
    try {
      setLoading(true);
      const response = await fetch(
        `${API_ENDPOINTS.GET_ITEM}&itemCode=${itemCode}`
      );
      const result = await response.json();

      if (result.success && result.data) {
        const itemData = result.data;
        console.log("itemData asociado al estudiante", itemData);
        const newItem = {
          id: itemData.id,
          codigoPrincipal: itemData.codigo_principal,
          codigoAuxiliar: itemData.codigo_auxiliar,
          esParaInventario: itemData.es_para_inventario,
          esParaVenta: itemData.es_para_venta,
          factor: itemData.factor,
          categoria: itemData.categoria,
          descripcion: itemData.descripcion,
          unidadMedida: itemData.unidad_medida,
          precioUnitario: itemData.precio_unitario,
          cantidad: DEFAULT_VALUES.INITIAL_QUANTITY,
          descuento: initialData.discount || DEFAULT_VALUES.INITIAL_DISCOUNT,
          precioTotal:
            itemData.precio_unitario -
            (initialData?.discount || DEFAULT_VALUES.INITIAL_DISCOUNT), //!!Cambiar proximamente a solo la resta del precio con el descuento
          codigoIva: itemData.codigo_iva,
          codigoIce: itemData.codigo_ice,
          tarifaIva: itemData.tarifa_iva,
          tipo: itemData.tipo,
          comportamiento: {
            lote: itemData.comportamiento.lote,
            fecha_caducidad: itemData.comportamiento.fecha_caducidad,
          },
        };
        setItems([newItem]);
      } else {
        console.error(`No se pudo obtener el item`);
      }
    } catch (error) {
      console.error("Error al obtener el item:", error);
    } finally {
      setLoading(false);
    }
  };

  const itemColumns = getInvoiceTableColumns(
    isEditing,
    edit,
    save,
    cancel,
    handleRemoveItem
  );

  const mergedColumns = itemColumns.map((col) => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: "number",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  return {
    form,
    items,
    loading,
    totals,
    additionalInfo,
    paymentInfo,
    editingKey,
    isEditing,
    edit,
    cancel,
    save,
    handleAddAdditionalInfo,
    handleRemoveAdditionalInfo,
    handleAddItem,
    handleRemoveItem,
    fetchItem,
    mergedColumns,
  };
};
