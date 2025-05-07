import { useState } from "react";
import { Tabs } from "antd";
import EmitTab from "./components/EmitTab";
import ItemTab from "./components/ItemTab";

const Invoices = () => {
  const [activeTab, setActiveTab] = useState("1");

  // Items para las pestañas
  const items = [
    {
      key: "1",
      label: "Ver",
      children: (
        <div className="p-4">
          <h2>Vista de Facturas</h2>
          {
            /* Aquí irá el componente para ver facturas*/
            <h2>Componente de vista de facturas</h2>
          }
        </div>
      ),
    },
    {
      key: "2",
      label: "Emitir",
      children: <EmitTab />,
    },
    {
      key: "3",
      label: "Items",
      children: <ItemTab />,
    },
  ];

  return (
    <Tabs
      defaultActiveKey="1"
      items={items}
      onChange={(key) => setActiveTab(key)}
    />
  );
};

export default Invoices;
