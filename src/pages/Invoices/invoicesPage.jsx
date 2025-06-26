import { useState } from "react";
import { Tabs } from "antd";
import EmitTab from "./components/EmitTab";
import ItemTab from "./components/ItemTab";
import ViewTab from "./components/ViewTab";

const Invoices = () => {
  const [activeTab, setActiveTab] = useState("1");

  const items = [
    {
      key: "1",
      label: "Ver",
      children: <ViewTab />,
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
