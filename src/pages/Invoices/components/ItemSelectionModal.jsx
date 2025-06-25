import { Modal, Table } from "antd";
import { useEffect } from "react";
import { useInvoiceItems } from "../hooks/useInvoiceItems";
import PropTypes from "prop-types";
import { getItemTableColumns } from "../config/itemTableConfig";
import { DEFAULT_VALUES } from "../config/constants";

const ItemSelectionModal = ({ isOpen, onClose, onSelect, currentItems }) => {
  const { items, isLoading, refetch } = useInvoiceItems();

  /*
  useEffect(() => {
    if (isOpen) {
      refetch();
    }
  }, [isOpen]);*/

  const handleSelectItem = (item) => {
    const newItem = {
      id: item.id,
      codigoPrincipal: item.codigo_principal,
      codigoAuxiliar: item.codigo_auxiliar,
      esParaInventario: item.es_para_inventario,
      esParaVenta: item.es_para_venta,
      factor: item.factor,
      categoria: item.categoria,
      descripcion: item.descripcion,
      unidadMedida: item.unidad_medida,
      precioUnitario: item.precio_unitario,
      cantidad:  DEFAULT_VALUES.INITIAL_QUANTITY,
      descuento: DEFAULT_VALUES.INITIAL_DISCOUNT,
      precioTotal: item.precio_unitario,
      //detalleAdicional: "",
      codigoIva: item.codigo_iva,
      codigoIce: item.codigo_ice,
      tarifaIva: item.tarifa_iva,
      tipo: item.tipo,
      comportamiento: {
        lote: item.comportamiento.lote,
        fecha_caducidad: item.comportamiento.fecha_caducidad
      }
    };
    onSelect(newItem);
  };

  const isItemAlreadyAdded = (item) => {
    return currentItems.some(currentItem => currentItem.codigoPrincipal === item.codigo_principal);
  };

  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      title="Items disponibles"
      footer={null}
      width={800}
      centered
      className="rounded-lg shadow-lg"
    >
      <Table
        columns={getItemTableColumns(handleSelectItem, isItemAlreadyAdded)}
        dataSource={items}
        loading={{
          spinning: isLoading,
          tip: "Cargando items...",
          className: "text-gray-600 font-semibold",
        }}
        rowKey="id"
        pagination={{ pageSize: 5 }}
        className="mt-4 border border-gray-200 rounded-lg"
      />
    </Modal>
  );
};

ItemSelectionModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSelect: PropTypes.func.isRequired,
  currentItems: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    codigoPrincipal: PropTypes.string.isRequired,
  })),
};

export default ItemSelectionModal;
