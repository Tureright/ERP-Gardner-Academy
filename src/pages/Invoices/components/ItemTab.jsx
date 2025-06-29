import { Table, Space, Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import PropTypes from "prop-types";
import schema from "../schemas/schemaItemTable";
import Filters from "./Filters";
import ItemEditModal from "./ItemEditModal";
import { getFilteredData } from "../utils/filterUtils";
import { useItems } from "@/hooks/useItems";
import { useMemo, useState, useCallback } from "react";
import { useFilters } from "../hooks/useFilters";
import { customButtonStyle } from "../config/constants";
import "../config/GeneralStyles.css";

const ItemTab = ({ onItemCreated, highlightItemId }) => {
  const { items, isLoading, handleTableChange } = useItems();
  const { filters, handleFilterChange, clearFilters } = useFilters();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState(null);
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
      setModalOpen(false);
      setModalMode(null);
      setSelectedItem(null)

      if (onItemCreated) {
        onItemCreated(result);
      }
    },
    [onItemCreated]
  );

  const filteredData = useMemo(() => {
    return getFilteredData(items, filters, schema.filterSchema);
  }, [items, filters]);

  const getRowClassName = (record) => {
    if (highlightItemId && record.id == highlightItemId) {
      return "highlighted-row";
    }
    return "";
  };

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
        <Filters
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
        className="border border-gray-200 rounded-lg w-full"
        rowClassName={getRowClassName}
        bordered
        onChange={handleTableChange}
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
