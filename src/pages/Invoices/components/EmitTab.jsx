import { useState, useMemo } from "react";
import { Table } from "antd";
import PropTypes from 'prop-types';
import MonthSelector from "./MonthSelector";
import InvoiceForm from "./InvoiceForm";
import schema from "../schemas/schemaEmitTable";
import ItemFilters from "./ItemFilters";
import useStudentsRepresentatives from "../hooks/useStudentsRepresentatives";
import { getTableColumns } from "../config/tableConfig";
import { getFilteredData } from "../utils/filterUtils";
import { useEmitFilter } from "../hooks/useEmitFilter";

const EmitTab = ({ onInvoiceCreated }) => {
  const { isLoading, studentsRepresentatives } = useStudentsRepresentatives();
  const [isMonthSelectorOpen, setIsMonthSelectorOpen] = useState(false);
  const [isInvoiceFormOpen, setIsInvoiceFormOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const { filters, handleFilterChange, clearFilters } = useEmitFilter();

  const handleGenerateInvoice = (record) => {
    {
      /*console.log("registro escogido de la tabla: ", record);*/
    }
    setSelectedRecord(record);
    setIsMonthSelectorOpen(true);
  };

  const handleMonthSelect = (month) => {
    setSelectedMonth(month);
    setIsMonthSelectorOpen(false);
    setIsInvoiceFormOpen(true);
  };

  const handleCloseInvoiceForm = () => {
    setIsInvoiceFormOpen(false);
    setSelectedRecord(null);
    setSelectedMonth(null);
  };

  const handleInvoiceCreated = (result) => {
    // Limpiar el estado del formulario
    setIsInvoiceFormOpen(false);
    setSelectedRecord(null);
    setSelectedMonth(null);
    
    // Notificar al componente padre que la factura fue creada
    if (onInvoiceCreated) {
      onInvoiceCreated(result);
    }
  };

  const filteredData = useMemo(() => {
    return getFilteredData(
      studentsRepresentatives,
      filters,
      schema.filterSchema
    );
  }, [studentsRepresentatives, filters]);

  // Columnas para la tabla de estudiantes y representantes
  const columns = getTableColumns(handleGenerateInvoice, isLoading);

  return (
    <div className="space-y-4">
      <div className="flex">
        <h2 className="text-xl font-semibold text-gray-800 mt-3 mb-3">
          Emitir Facturas
        </h2>
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

      <Table
        columns={columns}
        dataSource={filteredData}
        loading={isLoading}
        rowKey={(record) => `${record.representativeId}-${record.studentName}`}
        className="w-full"
      />

      <MonthSelector
        isOpen={isMonthSelectorOpen}
        onClose={() => setIsMonthSelectorOpen(false)}
        onSelectMonth={handleMonthSelect}
        record={selectedRecord}
      />

      {selectedRecord && selectedMonth && (
        <InvoiceForm
          isOpen={isInvoiceFormOpen}
          onClose={handleCloseInvoiceForm}
          data={selectedRecord}
          selectedMonth={selectedMonth}
          onInvoiceCreated={handleInvoiceCreated}
        />
      )}
    </div>
  );
};

EmitTab.propTypes = {
  onInvoiceCreated: PropTypes.func,
};

export default EmitTab;
