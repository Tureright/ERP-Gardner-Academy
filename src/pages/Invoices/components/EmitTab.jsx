import { useState, useMemo } from "react";
import { Table } from "antd";
import PropTypes from 'prop-types';
import MonthSelector from "./MonthSelector";
import InvoiceForm from "./InvoiceForm";
import schema from "../schemas/schemaEmitTable";
import Filters from "./Filters";
import useStudentsRepresentatives from "../hooks/useStudentsRepresentatives";
import { getTableColumns } from "../config/tableConfig";
import { getFilteredData } from "../utils/filterUtils";
import { useFilters } from "../hooks/useFilters";

const EmitTab = ({ onInvoiceCreated }) => {
  const { isLoading, studentsRepresentatives, handleTableChange } = useStudentsRepresentatives();
  const [isMonthSelectorOpen, setIsMonthSelectorOpen] = useState(false);
  const [isInvoiceFormOpen, setIsInvoiceFormOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const { filters, handleFilterChange, clearFilters } = useFilters();

  const handleGenerateInvoice = (record) => {
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
    setIsInvoiceFormOpen(false);
    setSelectedRecord(null);
    setSelectedMonth(null);
        
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
        <Filters
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
        className="border border-gray-200 rounded-lg w-full"
        bordered
        onChange={handleTableChange}
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
