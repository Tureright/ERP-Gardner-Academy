export const API_ENDPOINTS = {
  GET_STUDENTS_REPRESENTATIVES:
    "INSERT_API_URL",
  GET_ITEMS:
    "INSERT_API_URL",
  GET_ITEM:
    "INSERT_API_URL",
  GET_BILLED_MONTHS:
    "INSERT_API_URL",
  GET_EMITTED_INVOICES:
    "INSERT_API_URL",
  UPDATE_ITEM:
    "INSERT_API_URL",
  GET_XLSXURL:
    "INSERT_API_URL"
  };

export const EXCEL_TYPE = "application/octet-stream";
export const XLSX_EXTENSION = "xlsx";
export const XLSX_TYPE = "array";

export const IVA_OPTIONS = [
  { value: "0", label: "0%" },
  { value: "2", label: "12%" },
  { value: "3", label: "14%" },
  { value: "4", label: "15%" },
  { value: "5", label: "5%" },
  { value: "6", label: "No Objeto de IVA" },
  { value: "7", label: "Exento" },
  { value: "8", label: "IVA Diferenciado" },
  { value: "10", label: "13%" },
];

export const TAX_RATES = {
  IVA_15: 0.15,
  IVA_12: 0.12,
  IVA_14: 0.14,
  IVA_5: 0.05,
  IVA_13: 0.13,
};

export const TAX_CODES = {
  IVA_15: "4",
  IVA_DIFERENCIADO: "8",
  IVA_0: "0",
  NO_OBJETO_IVA: "6",
  EXENTO_IVA: "7",
  IVA_12: "2",
  IVA_14: "3",
  IVA_5: "5",
  IVA_13: "10",
};

export const PAYMENT_CONSTANTS = {
  DEFAULT_PAYMENT_METHOD: "20",
  TIME_UNIT: "DIAS",
  CURRENCY: "USD",
};

export const DEFAULT_VALUES = {
  INITIAL_DISCOUNT: 0,
  INITIAL_QUANTITY: 1,
  ESTABLECIMIENTO: "001",
  PUNTO_EMISION: "001"
};

export const customButtonStyle = {
  backgroundColor: "#01969C",
  color: "white",
  border: "none",
  //padding: '8px',
  margin: "8px",
};

export const customButtonStyleCancel = {
  backgroundColor: "#EADBF0",
  color: "black",
  border: "none",
  //padding: '8px',
  margin: "8px",
};

export const customCircleButtonStyle = {
  backgroundColor: "#01969C",
  color: "white",
  border: "none",
};
