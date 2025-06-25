import { useMemo } from "react";
import { useEmitFilter } from "../hooks/useEmitFilter";
import { Table, Button } from "antd";
import { getFilteredData } from "../utils/filterUtils";
import schema from "../schemas/schemaViewTable";
import ItemFilters from "./ItemFilters";
import useEmittedInvoices from "../hooks/useEmittedInvoices";
import { customButtonStyle } from "../config/constants";
import '../config/GeneralStyles.css';
//import { exportToExcel } from "../utils/exportToExcel";
import { useExportToExcel } from "../utils/exportToExcel";

const cleanColumns = schema.fields.map(({ title, dataIndex }) => ({
  title,
  dataIndex,
}));

const ViewTab = () => {
  const { filters, handleFilterChange, clearFilters } = useEmitFilter();
  const { emittedInvoices, isLoading, pagination, handleTableChange } =
    useEmittedInvoices();

  const filteredData = useMemo(() => {
    return getFilteredData(emittedInvoices, filters, schema.filterSchema);
  }, [emittedInvoices, filters]);
  const {isLoadingURL, fecthXLSXUrl} = useExportToExcel();


  const tablePagination = {
    current: pagination.page,
    pageSize: pagination.pageSize,
    total: pagination.totalItems,
    showSizeChanger: false,
    showTotal: (total, range) => `${range[0]}-${range[1]} de ${total} facturas`,
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">
          Facturas emitidas
        </h2>
        <Button
          type="primary"
          loading={isLoading || isLoadingURL}
          style={{...customButtonStyle}}
          className="border-none custom-button font-semibold"
          onClick={() => {fecthXLSXUrl(filteredData,cleanColumns)}}
        >
          {isLoadingURL? 'Exportando...': isLoading ? 'Generar Reporte':'Generar Reporte'}
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

      <Table
        columns={schema.fields}
        dataSource={filteredData}
        loading={isLoading}
        rowKey={(record) => record.numero}
        className="w-full"
        pagination={tablePagination}
        onChange={handleTableChange}
      />
    </div>
  );
};

export default ViewTab;
