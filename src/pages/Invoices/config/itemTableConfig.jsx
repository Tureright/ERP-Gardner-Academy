import { Button } from "antd";
import { customButtonStyle } from "./constants";
import './GeneralStyles.css';


export const getItemTableColumns = (onSelectItem, isItemAlreadyAdded) => [
    {
      title: "CÓDIGO",
      dataIndex: "codigo_principal",
      key: "codigo_principal",
      align: "center",
      width: "15%",
    },
    {
      title: "DESCRIPCIÓN",
      dataIndex: "descripcion",
      key: "descripcion",
      align: "center",
      width: "50%",
    },
    {
      title: "PRECIO UNITARIO",
      dataIndex: "precio_unitario",
      key: "precio_unitario",
      align: "center",
      width: "20%",
      render: (value) => `$${value.toFixed(2)}`,
    },
    {
      title: "ACCIÓN",
      key: "action",
      align: "center",
      width: "15%",
      render: (_, record) => {
        const isDisabled = isItemAlreadyAdded(record);
        return (
          <Button
            type="primary"
            style={{...customButtonStyle}}
            className={`${isDisabled ? 'custom-button-added custom-button-addedV' : 'custom-button borden-none font-semibold'}`}
            onClick={() => onSelectItem(record)}
            disabled={isDisabled}
          >
            {isDisabled ? 'Agregado' : 'Agregar'}
          </Button>
        );
      },
    },
  ];