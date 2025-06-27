import { Table, Space, Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import PropTypes from "prop-types";
import schema from "../schemas/schemaItemTable";
import ItemFilters from "./ItemFilters";
import ItemEditModal from "./ItemEditModal";
import { getFilteredData } from "../utils/filterUtils";
import { useItems } from "@/hooks/useItems";
import { useMemo, useState, useCallback } from "react";
import { useEmitFilter } from "../hooks/useEmitFilter";
import { customButtonStyle } from "../config/constants";
import "../config/GeneralStyles.css";

const ItemTab = ({ onItemCreated, highlightItemId }) => {
  const { items, isLoading } = useItems();
  const { filters, handleFilterChange, clearFilters } = useEmitFilter();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState(null); // 'create' o 'edit'
  const [selectedItem, setSelectedItem] = useState(null);

  const handleCreateItem = useCallback(() => {
    setModalMode("create");
    setSelectedItem(null);
    setModalOpen(true);
  }, []);

  const handleEditItem = useCallback((record) => {
    setModalMode("edit");
    setSelectedItem(record);
    setModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setModalOpen(false);
    setModalMode(null);
    setSelectedItem(null);
  }, []);

  const handleItemCreated = useCallback(
    (result) => {
      // Limpiar el estado del modal
      setModalOpen(false);
      setModalMode(null);
      setSelectedItem(null);

      // Notificar al componente padre que el item fue creado/actualizado
      if (onItemCreated) {
        onItemCreated(result);
      }

      console.log("Item creado/actualizado exitosamente:", result);
    },
    [onItemCreated]
  );

  const filteredData = useMemo(() => {
    return getFilteredData(items, filters, schema.filterSchema);
  }, [items, filters]);

  // Función para asignar la clase de resaltado
  const getRowClassName = (record) => {
    if (highlightItemId && record.id == highlightItemId) {
      return "highlighted-row";
    }
    return "";
  };
  // Columna para editar el item
  const columns = [
    ...schema.fields,
    {
      title: "Acción",
      key: "action",
      align: "center",
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="primary"
            onClick={() => handleEditItem(record)}
            loading={isLoading}
            style={{ ...customButtonStyle }}
            className="border-none custom-button font-semibold"
          >
            ✏️ Editar
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      {/* Header con botón de crear */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">
          Gestión de Items
        </h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleCreateItem}
          style={{ ...customButtonStyle }}
          className="border-none custom-button font-semibold"
        >
          Crear Nuevo Item
        </Button>
      </div>

      {/* Filtros */}
      {schema.filterSchema && (
        <ItemFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearFilters={clearFilters}
          filterSchema={schema.filterSchema}
        />
      )}

      {/* Tabla */}
      <Table
        columns={columns}
        dataSource={filteredData}
        loading={isLoading}
        rowKey="id"
        className="w-full"
        rowClassName={getRowClassName}
      />

      {/* Modal */}
      <ItemEditModal
        open={modalOpen}
        onClose={handleCloseModal}
        initialValues={selectedItem}
        mode={modalMode}
        onItemCreated={handleItemCreated}
      />
    </div>
  );
};

ItemTab.propTypes = {
  onItemCreated: PropTypes.func,
  highlightItemId: PropTypes.string,
};

export default ItemTab;
