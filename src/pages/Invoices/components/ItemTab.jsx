import { Table, Space, Button, Card, Row, Col, Input } from "antd";
import { useState, useEffect } from "react";
import schema from "../schemas/schemaITemTable";
import { SearchOutlined, ClearOutlined } from "@ant-design/icons";

const ItemTab = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({});

  const getItems = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "https://script.google.com/macros/s/AKfycbzBX-pRQ432e9EWNHIMRK4Z12yKR_sAWjHhilL46kcCkVp1J-z-NuB6QQpDPkj_O0yKgw/exec?path=getItems"
      );
      const data = await response.json();
      const activeItems = data.data.filter((item) => item.activo === true);
      console.log("items activos: ", activeItems);
      console.log("Se hace la peticion al renderizar el componente");
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

  const renderFilterInput = (field, config) => {
    switch (config.type) {
      case "text":
        return (
          <Input
            placeholder={config.placeholder}
            value={filters[field]}
            onChange={(e) => handleFilterChange(field, e.target.value)}
            prefix={<SearchOutlined />}
          />
        );

      default:
        return null;
    }
  };

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const clearFilters = () => {
    setFilters({});
  };

  const getFilteredData = () => {
    return items.filter((record) => {
      return Object.entries(filters).every(([field, value]) => {
        if (!value) return true;

        const filterConfig = schema.filterSchema[field];
        const recordValue = record[field];

        switch (filterConfig.type) {
          case "text":
            console.log(recordValue?.toLowerCase().includes(value.toLowerCase()));
            return recordValue?.toLowerCase().includes(value.toLowerCase());

          case "select":
            return recordValue === value;

          default:
            return true;
        }
      });
    });
  };
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
    <>
      {schema.filterSchema && (
        <Card style={{ marginBottom: 16 }}>
          <Row gutter={[16, 16]} align="middle">
            {Object.entries(schema.filterSchema).map(([field, config]) => (
              <Col key={field} xs={12} sm={8} md={6} lg={4}>
                {renderFilterInput(field, config)}
              </Col>
            ))}
            <Col xs={2} sm={2} md={2} lg={2}>
              <ClearOutlined
                onClick={clearFilters}
                style={{ fontSize: "20px", cursor: "pointer", color: "#999" }}
              />
            </Col>
          </Row>
        </Card>
      )}

        <Table
          columns={columns}
          dataSource={getFilteredData()}
          loading={loading}
          rowKey="id"
          className="w-full"
        />
    </>
  );
};

export default ItemTab;
