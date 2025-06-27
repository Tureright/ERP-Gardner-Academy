import { useState } from "react";
import { Tabs } from "antd";
import EmitTab from "./components/EmitTab";
import ItemTab from "./components/ItemTab";
import ViewTab from "./components/ViewTab";

const Invoices = () => {
  const [activeTab, setActiveTab] = useState("1");
  const [highlightInvoiceId, setHighlightInvoiceId] = useState(null);

  const handleInvoiceCreated = (result) => {
    // Redirigir al ViewTab para mostrar la nueva factura creada
    setActiveTab("1");
    
    // Establecer el ID de la factura para resaltarla
    if (result && result.invoiceId) {
      setHighlightInvoiceId(result.invoiceId);
      
      // Limpiar el ID de resaltado después de 5 segundos
      setTimeout(() => {
        setHighlightInvoiceId(null);
      }, 5000);
    }
    
    // Opcional: Mostrar un mensaje adicional o realizar otras acciones
    console.log("Factura creada exitosamente:", result);
  };

  const handleItemCreated = (result) => {
    // Opcional: Mostrar un mensaje adicional o realizar otras acciones
    console.log("Item creado/actualizado exitosamente:", result);
    
    // lógica adicional como:
    // - Mostrar un toast adicional
    // - Refrescar datos específicos
    // - Registrar la acción en logs
  };

  const items = [
    {
      key: "1",
      label: "Ver",
      children: <ViewTab highlightInvoiceId={highlightInvoiceId} />,
    },
    {
      key: "2",
      label: "Emitir",
      children: <EmitTab onInvoiceCreated={handleInvoiceCreated} />,
    },
    {
      key: "3",
      label: "Items",
      children: <ItemTab onItemCreated={handleItemCreated} />,
    },
  ];

  return (
    <Tabs
      activeKey={activeTab}
      items={items}
      onChange={(key) => setActiveTab(key)}
    />
  );
};

export default Invoices;
