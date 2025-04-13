import { Table, Space, Button } from "antd";
import { useState, useEffect } from "react";
import schema  from "../schemas/schemaITemTable";

const ItemTab = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const getItems = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "https://script.google.com/macros/s/AKfycbzBX-pRQ432e9EWNHIMRK4Z12yKR_sAWjHhilL46kcCkVp1J-z-NuB6QQpDPkj_O0yKgw/exec?path=getItems"
      );
      const data = await response.json();
      const activeItems = data.data.filter((item) => item.activo === true);
      console.log('items activos: ',activeItems);
      console.log('Se hace la peticion al renderizar el componente');
      setItems(activeItems);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditItem = async (record) => {
    try {
      setLoading(true);
      console.log(record);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getItems();
  }, []);

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
            onClick={() => handleEditItem(record)}
            loading={loading}
          >
            ✏️ Editar
          </Button>
        </Space>
      ),
    },
  ];
  return (
    <div className="p-4">
      <Table
        columns={columns}
        dataSource={items}
        loading={loading}
        rowKey="id"
        className="w-full"
      />
    </div>
  );
};

export default ItemTab;
