export interface Item {
    id: number;
    codigo_principal: string;
    descripcion: string;
    precio_unitario: number;
    codigo_iva: string;
    activo: boolean;
  }
  
  export interface SelectedItem {
    id: number;
    codigoPrincipal: string;
    cantidad: number;
    descripcion: string;
    detalleAdicional: string;
    precioUnitario: number;
    descuento: number;
    precioTotal: number;
    codigoIva: string;
  }
  
  export interface ItemSelectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (item: SelectedItem) => void;
  }