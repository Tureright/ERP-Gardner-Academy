import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import {
  API_ENDPOINTS,
  PAYMENT_CONSTANTS,
  TAX_RATES,
  TAX_CODES,
} from "../config/constants";

const getTaxInfo = (codigoIva) => {
  const taxCode = codigoIva === TAX_CODES.IVA_0 ? TAX_CODES.IVA_0 :
                 codigoIva === TAX_CODES.IVA_12 ? TAX_CODES.IVA_12 :
                 codigoIva === TAX_CODES.IVA_14 ? TAX_CODES.IVA_14 :
                 codigoIva === TAX_CODES.IVA_15 ? TAX_CODES.IVA_15 :
                 codigoIva === TAX_CODES.IVA_5 ? TAX_CODES.IVA_5 :
                 codigoIva === TAX_CODES.IVA_13 ? TAX_CODES.IVA_13 :
                 codigoIva === TAX_CODES.IVA_DIFERENCIADO ? TAX_CODES.IVA_DIFERENCIADO :
                 codigoIva === TAX_CODES.NO_OBJETO_IVA ? TAX_CODES.NO_OBJETO_IVA :
                 TAX_CODES.EXENTO_IVA;

  const taxRate = codigoIva === TAX_CODES.IVA_0 ? 0 :
                 codigoIva === TAX_CODES.IVA_12 ? TAX_RATES.IVA_12 :
                 codigoIva === TAX_CODES.IVA_14 ? TAX_RATES.IVA_14 :
                 codigoIva === TAX_CODES.IVA_15 ? TAX_RATES.IVA_15 :
                 codigoIva === TAX_CODES.IVA_5 ? TAX_RATES.IVA_5 :
                 codigoIva === TAX_CODES.IVA_13 ? TAX_RATES.IVA_13 :
                 0; // For IVA_DIFERENCIADO, NO_OBJETO_IVA, and EXENTO_IVA

  return { taxCode, taxRate };
};

const createInvoiceEP = async (data, studentId) => {
  try {
    console.log("Desde create invoice EP: ", studentId, data)
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
    if (result.errorResponse) {
      console.log("result", result.errorResponse);
      throw new Error(result.errorResponse.message);
    }
    return result;
  } catch (err) {
    console.log("Error creating invoice:", err);
    //console.error("Error creating invoice:", err);
    throw err;
  }
};

export const useInvoiceCreation = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ data, studentId }) => createInvoiceEP(data, studentId),
    onSuccess: (response) => {
      // Verificar si la respuesta tiene el formato esperado
      if (response.success && response.data) {
        const { message, id } = response.data;
        
        // Mostrar toast de éxito con información de la factura
        toast({
          title: "✅ Factura creada exitosamente",
          description: `${message} - ID: ${id}`,
        });

        // Invalidar la query de facturas emitidas para refrescar los datos
        queryClient.invalidateQueries({ queryKey: ["emittedInvoices"] });
        
        // Retornar el ID de la factura para uso posterior
        return { success: true, invoiceId: id, message };
      } else {
        // Fallback para respuestas que no siguen el formato esperado
        toast({
          title: "✅ Factura creada",
          description: "La factura se ha creado correctamente",
        });
        
        // Invalidar la query de facturas emitidas
        queryClient.invalidateQueries({ queryKey: ["emittedInvoices"] });
        
        return { success: true, message: "Factura creada correctamente" };
      }
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "❌ Error al crear la factura",
        description: error.message || "Ha ocurrido un error inesperado",
      });
      
      return { success: false, error: error.message };
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
    console.log("form data", formData)
    // Prepare the invoice data
    const invoiceData = {
      //establecimiento: "001",
      //punto_emision: "001",
      fecha_emision: new Date().toLocaleDateString('en-CA'),
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
        //aplicado en la factura
        total_sin_impuestos: totals.subtotalSinImpuestos,
        descuento: totals.totalDescuento,
        propina: totals.propina,
        importe_total: totals.valorTotal,
        impuestos: [
          {
            codigo: TAX_CODES.IVA_12,
            codigo_porcentaje: TAX_CODES.IVA_15,
            base_imponible: paymentInfo.otros,
            valor: paymentInfo.otros * TAX_RATES.IVA_15,
          },
        ],
        impuestos2: items.map((item) => {
            const { taxCode, taxRate } = getTaxInfo(item.codigoIva);
            return {
                codigo: taxCode,
                codigo_porcentaje: item.codigoIva,
                base_imponible: item.precioTotal,
                valor: item.precioTotal * taxRate,
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
        precio_total_sin_impuesto: item.precioTotal, //revisar!!!
        impuestos: [
          {
            codigo: TAX_CODES.IVA_12,
            codigo_porcentaje: item.codigoIva,
            tarifa: TAX_RATES.IVA_15 * 100,
            base_imponible: item.precioTotal,
            valor: item.precioTotal * TAX_RATES.IVA_15,
          },
        ],
        detalles_adicionales: [],
        movimientos_item: {
          item_id: item.id,
          serie: null,
          lote: item.comportamiento.lote.obligatorio,
          fecha_caducidad: item.comportamiento.fecha_caducidad.obligatorio,
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
    console.log("id del estudiante: ", formData.studentId)
    return mutation.mutateAsync({ data: invoiceData, studentId: formData.studentId });
  };

  return {
    createInvoice,
    isCreating: mutation.isPending,
    error: mutation.error,
  };
};
