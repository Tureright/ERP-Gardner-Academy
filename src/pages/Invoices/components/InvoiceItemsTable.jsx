// components/InvoiceItemsTable.jsx
import { Table } from "antd";
import PropTypes from "prop-types";
import EditableCell from "./EditableCellVF";

const InvoiceItemsTable = ({ items, loading, mergedColumns }) => {
  // Configurar los componentes de la tabla con EditableCell
  const tableComponents = {
    body: {
      cell: (props) => <EditableCell {...props} />,
    },
  };

  return (
    <div className="w-full overflow-x-auto">
      <Table
        components={tableComponents}
        rowKey="id"
        columns={mergedColumns}
        dataSource={items}
        pagination={false}
        size="middle"
        rowClassName="editable-row hover:bg-gray-50"
        className="border border-gray-200 rounded-lg w-full"
        loading={loading}
        bordered
      />
    </div>
  );
};

InvoiceItemsTable.propTypes = {
  items: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
  mergedColumns: PropTypes.array.isRequired,
};

export default InvoiceItemsTable;
