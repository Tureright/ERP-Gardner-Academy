import { Button, Space } from "antd";
import PropTypes from "prop-types";
import { customButtonStyle } from "../config/constants";
import "../config/GeneralStyles.css";

const InvoiceActionButton = ({ onGenerateInvoice, loading }) => {
  return (
    <Space size="middle">
      <Button
        type="primary"
        onClick={onGenerateInvoice}
        loading={loading}
        style={{ ...customButtonStyle }}
        className="border-none custom-button font-semibold"
      >
        Generar Factura
      </Button>
    </Space>
  );
};

InvoiceActionButton.propTypes = {
  onGenerateInvoice: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
};

export default InvoiceActionButton;
