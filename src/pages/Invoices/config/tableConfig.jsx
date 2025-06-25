import schema from "../schemas/schemaEmitTable";
import InvoiceActionButton from "../components/InvoiceActionButton";

export const getTableColumns = (onGenerateInvoice, loading) => [
  ...schema.fields,
  {
    title: "Acción",
    key: "action",
    align: "center",
    render: (_, record) => (
      <InvoiceActionButton
        onGenerateInvoice={() => onGenerateInvoice(record)}
        loading={loading}
      />
    ),
  },
];
