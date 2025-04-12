import React, { useState } from "react";
import { Tabs, Button, Table, Space } from "antd";
import SmartTable from "@/components/SmartTable";
import schema from "./schema";
import { executeAction } from "@/server/gas";

const Invoices = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("1");
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);

  // Función para generar factura
  const handleGenerateInvoice = async (record) => {
    try {
      setLoading(true);
      const response = await executeAction({
        action: "generateInvoice",
        data: record
      });
      // Manejar la respuesta
      console.log("Factura generada:", response);
    } catch (error) {
      console.error("Error al generar factura:", error);
    } finally {
      setLoading(false);
    }
  };

  // Columnas para la tabla de facturas
  const columns = [
    ...schema.fields,
    {
      title: "Acción",
      key: "action",
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

  // Items para las pestañas
  const items = [
    {
      key: "1",
      label: "Ver",
      children: (
        <div className="p-4">
          <h2>Vista de Facturas</h2>
          {/* Aquí irá el componente para ver facturas*/ 
            <h2>Componente de vista de facturas</h2>
          }
        </div>
      ),
    },
    {
      key: "2",
      label: "Emitir",
      children: (
        <div className="p-4">
          <Table
            columns={columns}
            dataSource={invoices}
            loading={loading}
            rowKey="id"
          />
        </div>
      ),
    },
    {
      key: "3",
      label: "Items",
      children: (
        <div className="p-4">
          <h2>Gestor de Items</h2>
          {/* Aquí irá el componente para gestionar items */
            <h2>Componente de items</h2>
          }
        </div>
      ),
    },
  ];

  return (
    <div className="container mx-auto p-6">
      <Tabs
        defaultActiveKey="1"
        items={items}
        onChange={(key) => setActiveTab(key)}
      />
    </div>
  );
};

export default Invoices;