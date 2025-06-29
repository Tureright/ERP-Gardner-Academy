/*import ExcelJS from "exceljs";
import { saveAs } from "file-saver";*/
import { formatDate } from "../schemas/schemaViewTable";
import { useState} from "react";
import { API_ENDPOINTS } from "@/pages/Invoices/config/constants";


function getValueByDataIndex(row, dataIndex) {
  if (Array.isArray(dataIndex)) {
    return dataIndex.reduce((acc, key) => (acc ? acc[key] : undefined), row);
  }
  return row[dataIndex];
}


/*
export async function exportToExcel(data, columns) {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Facturas");

  const headers = [
    'Número Factura',
    'Fecha',
    'Cliente',
    'Total',
    'Estado',
  ];

  worksheet.addRow(headers);

  data.forEach(row => {
    const rowData = columns.map(col => {
      if (col.key === "fecha_emision") {
        return formatDate(row.fecha_emision);
      } else if (col.dataIndex && Array.isArray(col.dataIndex)) {
        return getValueByDataIndex(row, col.dataIndex);
      } else if (col.dataIndex) {
        return getValueByDataIndex(row, col.dataIndex);
      } else if (col.key === "totales") {
        return row.totales?.importe_total?.toFixed(2) ?? "";
      } else if (col.key === "estado") {
        return row.estado;
      } else {
        return "";
      }
    });
    worksheet.addRow(rowData);
  });

  // Aplica estilos a la cabecera
  worksheet.getRow(1).eachCell(cell => {
    cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF0070C0" }
    };
    cell.alignment = { vertical: "middle", horizontal: "center" };
  });

  // Aplica bordes a todas las celdas
  worksheet.eachRow(row => {
    row.eachCell(cell => {
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" }
      };
    });
  });
  worksheet.columns.forEach((column, index) => {
    let maxLenght = 0;
    worksheet.getColumn(index+1).eachCell({includeEmpty:true}, (cell) => {
      const columnLenght = cell.value ? cell.value.toString().length : 10;
      if(columnLenght > maxLenght){
        maxLenght = columnLenght;
      }
    });
    column.width = Math.min(maxLenght + 10);
  });

  // Generar el archivo y descargarlo
  const fecha = new Date();
  const fechaStr = `${fecha.getDate().toString().padStart(2, '0')}-${(fecha.getMonth() + 1).toString().padStart(2, '0')}-${fecha.getFullYear().toString().slice(-2)}`;
  const fileName = `Reporte_Facturas_${fechaStr}.xlsx`;
  // Genera el archivo y lo descarga
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
  saveAs(blob, fileName);
}*/

export async function handleGenerarFactura(url) {
  try{
    console.log("URL generado: ", url);
    // Descarga automática
    window.open(url.data, "_blank");
    // O muestra un enlace para descargar manualmente
    // window.location.href = url;
  } catch (error) {
    alert("Error al generar la factura");
    console.log("Error al generar la factura", error);
  }
}


export const useExportToExcel = () => {
  const [xlsxURL, setXSLXURL] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  async function fecthXLSXUrl(data, columns) {
    try {
      console.log("Pulsado: ", data, columns)
      setLoading(true);
      const payload = {
        data: data,
        columns: columns,
      };
      const response = await fetch(`${API_ENDPOINTS.GET_XLSXURL}`, {
        method: "POST",
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (result.errorResponse) {
        throw new Error(result.errorResponse.message);
      }
      handleGenerarFactura(result);
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }
  return {
    fecthXLSXUrl,
    xlsxURL,
    isLoadingURL: loading,
  };
};

export default useExportToExcel;