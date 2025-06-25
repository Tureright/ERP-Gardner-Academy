import { Modal, Form, Input, Button } from "antd";
import PropTypes from "prop-types";
import { customButtonStyle, customButtonStyleCancel } from "../config/constants";
import '../config/GeneralStyles.css';

const AdditionalInfoModal = ({ isOpen, onClose, onAdd }) => {
  const [form] = Form.useForm();

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      onAdd(values);
      form.resetFields();
      onClose();
    });
  };

  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      title="Agregar Información Adicional"
      footer={[
        <Button
          key="cancel"
          onClick={onClose}
          style={{ ...customButtonStyleCancel }}
          className="border-none custom-button font-medium"
        >
          Cancelar
        </Button>,
        <Button
          key="submit"
          type="primary"
          onClick={handleSubmit}
          style={{ ...customButtonStyle}}
          className="border-none custom-button font-medium"
        >
          Agregar
        </Button>,
      ]}
      width={400}
      centered
    >
      <Form form={form} layout="vertical" className="mt-6">
        <Form.Item
          name="nombre"
          label="Nombre"
          rules={[{ required: true, message: "Por favor ingrese el nombre" }]}
        >
          <Input placeholder="Ingrese el nombre" />
        </Form.Item>
        <Form.Item
          name="valor"
          label="Valor"
          rules={[{ required: true, message: "Por favor ingrese el valor" }]}
        >
          <Input placeholder="Ingrese el valor" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

AdditionalInfoModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onAdd: PropTypes.func.isRequired,
};

export default AdditionalInfoModal;
