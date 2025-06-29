export interface InvoiceItem {
    id: number;
    codigoPrincipal: string;
    descripcion: string;
    precioUnitario: number;
    cantidad: number;
    descuento: number;
    precioTotal: number;
    codigoIva: string;
    tipo: string;
  }
  
  export interface AdditionalInfo {
    mes: string;
    alumno: string;
    [key: string]: string;
  }
  
  export interface PaymentInfo {
    otros: number;
    plazo: number;
  }
  
  export interface InvoiceFormProps {
    isOpen: boolean;
    onClose: () => void;
    data: {
      studentId: string;
      studentName: string;
      representativeId: string;
      representativeName: string;
      representativeAddress: string;
      representativePhone: string;
      representativeEmail: string;
      itemCode: string;
      discount: number;
    };
    selectedMonth: string;
  }