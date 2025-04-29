import { useState, useEffect } from "react";
import { Button, Table, Space } from "antd";
import schema from "../schemas/schemaEmitTable";
import MonthSelector from "./MonthSelector";
import InvoiceForm from "./InvoiceForm";

const EmitTab = () => {
  const [loading, setLoading] = useState(false);
  const [studentsRepresentatives, setStudentsRepresentatives] = useState([]);
  const [isMonthSelectorOpen, setIsMonthSelectorOpen] = useState(false);
  const [isInvoiceFormOpen, setIsInvoiceFormOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);

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

  const getStudentsRepresentatives = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "https://script.google.com/macros/s/AKfycbzBX-pRQ432e9EWNHIMRK4Z12yKR_sAWjHhilL46kcCkVp1J-z-NuB6QQpDPkj_O0yKgw/exec?path=getRepStudents"
      );
      const data = await response.json();
      setStudentsRepresentatives(data.data);
      setLoading(false);
    } catch (error) {
      console.error("Error al obtener representantes de estudiantes:", error);
    }
  };
  useEffect(() => {
    getStudentsRepresentatives();
  }, []);
  /*
  const handleGenerateInvoice = async (record) => {
    try {
      setLoading(true);
      console.log(record);
      // Manejar la respuesta
    } catch (error) {
      console.error("Error al generar factura:", error);
    } finally {
      setLoading(false);
    }
  };*/

  // Columnas para la tabla de estudiantes y representantes
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
            onClick={() => handleGenerateInvoice(record)}
            loading={loading}
          >
            Generar Factura
          </Button>
        </Space>
      ),
    },
  ];
  return (
    <div className="p-4">
      <Table
        columns={columns}
        dataSource={studentsRepresentatives}
        loading={loading}
        rowKey="studentId"
        className="w-full"
      />

      <MonthSelector
        isOpen={isMonthSelectorOpen}
        onClose={() => setIsMonthSelectorOpen(false)}
        onSelectMonth={handleMonthSelect}
      />

      {selectedRecord && selectedMonth && (
        <InvoiceForm
          isOpen={isInvoiceFormOpen}
          onClose={handleCloseInvoiceForm}
          data={selectedRecord}
          selectedMonth={selectedMonth}
        />
      )}
    </div>
  );
};

export default EmitTab;
