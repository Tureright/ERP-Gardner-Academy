import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import {
  API_ENDPOINTS,
  PAYMENT_CONSTANTS,
  TAX_RATES,
  TAX_CODES,
  DEFAULT_VALUES,
} from "../config/constants";

const getTaxInfo = (codigoIva) => {
  const taxCode =
    codigoIva === TAX_CODES.IVA_0
      ? "2"
      : codigoIva === TAX_CODES.IVA_12
      ? TAX_CODES.IVA_12
      : codigoIva === TAX_CODES.IVA_14
      ? TAX_CODES.IVA_14
      : codigoIva === TAX_CODES.IVA_15
      ? TAX_CODES.IVA_15
      : codigoIva === TAX_CODES.IVA_5
      ? TAX_CODES.IVA_5
      : codigoIva === TAX_CODES.IVA_13
      ? TAX_CODES.IVA_13
      : codigoIva === TAX_CODES.IVA_DIFERENCIADO
      ? TAX_CODES.IVA_DIFERENCIADO
      : codigoIva === TAX_CODES.NO_OBJETO_IVA
      ? TAX_CODES.NO_OBJETO_IVA
      : TAX_CODES.EXENTO_IVA;

  const taxRate =
    codigoIva === TAX_CODES.IVA_0
      ? 0
      : codigoIva === TAX_CODES.IVA_12
      ? TAX_RATES.IVA_12
      : codigoIva === TAX_CODES.IVA_14
      ? TAX_RATES.IVA_14
      : codigoIva === TAX_CODES.IVA_15
      ? TAX_RATES.IVA_15
      : codigoIva === TAX_CODES.IVA_5
      ? TAX_RATES.IVA_5
      : codigoIva === TAX_CODES.IVA_13
      ? TAX_RATES.IVA_13
      : 0; // For IVA_DIFERENCIADO, NO_OBJETO_IVA, y EXENTO_IVA

  return { taxCode, taxRate };
};

const createInvoiceEP = async (data, studentId) => {
  try {
    console.log("Desde create invoice EP: ", studentId, data);
    const response = await fetch(
      `${API_ENDPOINTS.GET_EMITTED_INVOICES.replace(
        "getInvoices",
        "createInvoice"
      )}&studentId=${studentId}`,
      {
        method: "POST",
        body: JSON.stringify(data),
      }
    );
    const result = await response.json();

    return result;
  } catch (err) {
    console.error("Error creating invoice:", err);
  }
};

export const useInvoiceCreation = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ data, studentId }) => createInvoiceEP(data, studentId),
    onSuccess: (response) => {
      if (response.success && response.data) {
        const { message, id } = response.data;

        toast({
          title: "✅ Estado",
          description: `${message} - ID: ${id}`,
        });

        queryClient.invalidateQueries({ queryKey: ["emittedInvoices"] });

        return { success: true, invoiceId: id, message };
      } else {
        // Fallback
        // let message = '';
        // if(response.errorResponse.message == "Bad Request"){
        //   message = "Algo ha ocurrido mal"
        // }
        toast({
          variant: "destructive",
          title: "❌ Estado",
          description: "Ha ocurrido un error inesperado",
        });

        return { success: false, message: "Ha ocurrido un error inesperado" };
      }
    },
  });

  const createInvoice = async (
    formData,
    items,
    additionalInfo,
    paymentInfo,
    totals
  ) => {
    console.log("items", items);
    console.log("totals", totals);
    console.log("adittional info", additionalInfo);
    console.log("form data", formData);

    const invoiceData = {
      // establecimiento: DEFAULT_VALUES.ESTABLECIMIENTO,
      // punto_emision: DEFAULT_VALUES.PUNTO_EMISION,
      fecha_emision: new Date().toLocaleDateString("en-CA"),
      guia_remision: null,
      moneda: PAYMENT_CONSTANTS.CURRENCY,
      comprador: {
        tipo_identificacion: formData.representativeIdType,
        razon_social: formData.representativeName,
        identificacion: formData.representativeId,
        direccion: formData.representativeAddress,
        correo_electronico: formData.representativeEmail,
        telefono: formData.representativePhone,
      },
      totales: {
        total_sin_impuestos: totals.subtotalSinImpuestos,
        descuento: totals.totalDescuento,
        propina: totals.propina,
        importe_total: totals.valorTotal,
        // impuestos: [
        //   {
        //     codigo: TAX_CODES.IVA_12,
        //     codigo_porcentaje: TAX_CODES.IVA_15,
        //     base_imponible: paymentInfo.otros,
        //     valor: paymentInfo.otros * TAX_RATES.IVA_15,
        //   },
        // ],
        impuestos: items.map((item) => {
          const { taxCode } = getTaxInfo(item.codigoIva);
          return {
            codigo: taxCode,
            codigo_porcentaje: item.codigoIva,
            base_imponible: item.precioTotal,
            valor: item.precioTotal,
          };
        }),
      },
      detalles: items.map((item) => ({
        es_para_inventario: item.esParaInventario,
        item_id: item.id,
        tipo: item.tipo,
        codigo_principal: item.codigoPrincipal,
        codigo_auxiliar: item.codigoAuxiliar,
        descripcion: item.descripcion,
        unidad_medida: item.unidadMedida,
        cantidad: item.cantidad,
        precio_unitario: item.precioUnitario,
        descuento: item.descuento,
        precio_total_sin_impuesto: item.precioTotal,
        impuestos: [
          {
            codigo: getTaxInfo(item.codigoIva).taxCode,
            codigo_porcentaje: item.codigoIva,
            tarifa: TAX_RATES.IVA_15 * 100,
            base_imponible: item.precioTotal,
            valor: item.precioTotal,
          },
        ],
        detalles_adicionales: [],
        movimientos_item: {
          item_id: item.id,
          serie: null,
          lote:
            item.comportamiento?.lote?.obligatorio == false
              ? null
              : item.comportamiento?.lote?.obligatorio,
          fecha_caducidad:
            item.comportamiento?.fecha_caducidad?.obligatorio == false
              ? null
              : item.comportamiento?.fecha_caducidad?.obligatorio,
          es_para_inventario: item.esParaInventario,
          cantidad: item.cantidad,
          bodega_id: null,
        },
      })),
      pagos: [
        {
          forma_pago: PAYMENT_CONSTANTS.DEFAULT_PAYMENT_METHOD,
          total: paymentInfo.otros,
          plazo: paymentInfo.plazo,
          unidad_tiempo: PAYMENT_CONSTANTS.TIME_UNIT,
        },
      ],
      informacion_adicional: Object.entries(additionalInfo).map(
        ([nombre, valor]) => ({
          nombre,
          valor,
        })
      ),
      es_borrador: false,
    };

    console.log("invoiceData", invoiceData);
    return mutation.mutateAsync({
      data: invoiceData,
      studentId: formData.studentId,
    });
  };

  return {
    createInvoice,
    isCreating: mutation.isPending,
    error: mutation.error,
  };
};
