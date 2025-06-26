export const API_ENDPOINTS = {
  GET_STUDENTS_REPRESENTATIVES:
    "https://script.google.com/macros/s/AKfycbzBX-pRQ432e9EWNHIMRK4Z12yKR_sAWjHhilL46kcCkVp1J-z-NuB6QQpDPkj_O0yKgw/exec?path=getRepStudents",
  GET_ITEMS:
    "https://script.google.com/macros/s/AKfycbzCYtgpGctnf2R61bMpy_mmrLTn6v0MjKTa0zgGMfzOij8kt882E_VHreWmy6XHpCvA2w/exec?path=getItems",
  GET_ITEM:
    "https://script.google.com/macros/s/AKfycbzCYtgpGctnf2R61bMpy_mmrLTn6v0MjKTa0zgGMfzOij8kt882E_VHreWmy6XHpCvA2w/exec?path=getItem",
  GET_BILLED_MONTHS:
    "https://script.google.com/macros/s/AKfycbzjWMMqRREV0TAz-2_OkvKnzPZh3axHv8mMAmBThqFuTO0TEBOHIwtZkrjiawe_nG_8KA/exec?path=getBilledMonths",
  GET_EMITTED_INVOICES:
    "https://script.google.com/macros/s/AKfycbx2odZBM133mu7Fafoe6A0D6M1EIpwZg5vL_wJNDe9MBHapRQGldtEzlQVgBs3I3MPHmA/exec?path=getInvoices",
  UPDATE_ITEM:
    "https://script.google.com/macros/s/AKfycbx2odZBM133mu7Fafoe6A0D6M1EIpwZg5vL_wJNDe9MBHapRQGldtEzlQVgBs3I3MPHmA/exec?path=updateItem&method=PATCH",
  GET_XLSXURL:
    "https://script.google.com/macros/s/AKfycbz0FfgxeIWUJrQKPu5B0GdxzwXIUhOMZA7VEPEBdF4FNblAtofrS5aqiBz3I__1AdRzDg/exec?path=getInvoiceSummaryURL"
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
