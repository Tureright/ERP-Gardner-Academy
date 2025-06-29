import { Form, Button, InputNumber } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { customButtonStyle, customButtonStyleCancel } from "./constants";
import '../config/GeneralStyles.css';

export const getInvoiceTableColumns = (
  isEditing,
  edit,
  save,
  cancel,
  removeItem
) => [
  {
    title: "CÓDIGO PRINCIPAL",
    dataIndex: "codigoPrincipal",
    key: "codigoPrincipal",
    align: "center",
    width: "12%",
    className: "bg-gray-50",
  },
  {
    title: "CANTIDAD",
    dataIndex: "cantidad",
    key: "cantidad",
    align: "center",
    width: "10%",
    editable: true,
    className: "bg-gray-50",
    render: (_, record) => {
      const editable = isEditing(record);
      return editable ? (
        <Form.Item
          name="cantidad"
          initialValue={record.cantidad}
          style={{ margin: 0 }}
          rules={[
            {
              required: true,
              message: "Por favor ingrese la cantidad!",
            },
            {
              type: "number",
              min: 1,
              message: "La cantidad debe ser mayor a 0!",
            },
          ]}
        >
          <InputNumber min={1} className="w-full" />
        </Form.Item>
      ) : (
        <span>{record.cantidad}</span>
      );
    },
  },
  {
    title: "DESCRIPCIÓN",
    dataIndex: "descripcion",
    align: "center",
    key: "descripcion",
    width: "25%",
    className: "bg-gray-50",
  },
  /*
  {
    title: "DETALLE ADICIONAL",
    dataIndex: "detalleAdicional",
    key: "detalleAdicional",
    align: "center",
    width: "15%",
  },*/
  {
    title: "PRECIO UNITARIO",
    dataIndex: "precioUnitario",
    key: "precioUnitario",
    align: "center",
    width: "15%",
    className: "bg-gray-50",
    render: (value) => (
      <span className="text-gray-700">${value.toFixed(2)}</span>
    ),
  },
  {
    title: "DESCUENTO",
    dataIndex: "descuento",
    key: "descuento",
    align: "center",
    width: "12%",
    editable: true,
    className: "bg-gray-50",
    render: (_, record) => {
      const editable = isEditing(record);
      return editable ? (
        <Form.Item
          name="descuento"
          initialValue={record.descuento}
          className="mb-0"
          rules={[
            {
              required: true,
              message: "Por favor ingrese el descuento!",
            },
            {
              type: "number",
              min: 0,
              message: "El descuento no puede ser negativo!",
            },
          ]}
        >
          <InputNumber min={0} className="w-full" />
        </Form.Item>
      ) : (
        <span className="text-gray-700">${record.descuento.toFixed(2)}</span>
      );
    },
  },
  {
    title: "PRECIO TOTAL",
    dataIndex: "precioTotal",
    key: "precioTotal",
    align: "center",
    width: "15%",
    className: "bg-gray-50",
    render: (_, record) => (
      <span className="text-gray-700 font-medium">
        $
        {(record.cantidad * record.precioUnitario - record.descuento).toFixed(
          2
        )}
      </span>
    ),
  },
  {
    title: "ACCIÓN",
    key: "action",
    align: "center",
    width: "11%",
    className: "bg-gray-50",
    render: (_, record) => {
      const editable = isEditing(record);
      return editable ? (
        <div className="flex justify-center space-x-2">
          <Button
            type="link"
            onClick={() => save(record.id)}
            style={{...customButtonStyle}}
            className="border-none custom-button font-semibold"
          >
            Guardar
          </Button>
          <Button
            type="link"
            onClick={cancel}
            style={{...customButtonStyleCancel}}
            className="border-none custom-button font-semibold"
          >
            Cancelar
          </Button>
        </div>
      ) : (
        <div className="flex justify-center space-x-2">
          <Button
            type="text"
            onClick={() => edit(record)}
            style={{...customButtonStyle}}
            className="border-none custom-button font-semibold"
          >
            Editar
          </Button>
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            style={{...customButtonStyleCancel}}
            onClick={() => removeItem(record.id)}
            className="border-none custom-button font-semibold"
          />
        </div>
      );
    },
  },
];