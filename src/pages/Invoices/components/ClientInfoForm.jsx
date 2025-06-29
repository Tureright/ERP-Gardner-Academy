import { Form, Input } from 'antd';
import PropTypes from 'prop-types';

const ClientInfoForm = ({ data }) => {
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-3">
          <Form.Item label="RAZÓN SOCIAL/NOMBRES Y APELLIDOS">
            <Input value={data?.representativeName} disabled />
          </Form.Item>
        </div>
        <Form.Item label="IDENTIFICACIÓN">
          <Input value={data?.representativeId} disabled />
        </Form.Item>
        <Form.Item label="FECHA EMISIÓN">
          <Input value={new Date().toLocaleDateString()} disabled />
        </Form.Item>
        <Form.Item label="GUÍA REMISIÓN">
          <Input name="guiaRemision" />
        </Form.Item>
        <Form.Item label="DIRECCIÓN">
          <Input value={data?.representativeAddress} disabled />
        </Form.Item>
        <Form.Item label="TELÉFONO">
          <Input value={data?.representativePhone} disabled />
        </Form.Item>
        <Form.Item label="CORREO">
          <Input value={data?.representativeEmail} disabled />
        </Form.Item>
      </div>
    </div>
  );
};

ClientInfoForm.propTypes = {
  data: PropTypes.shape({
    representativeName: PropTypes.string,
    representativeId: PropTypes.string,
    representativeAddress: PropTypes.string,
    representativePhone: PropTypes.string,
    representativeEmail: PropTypes.string,
  }).isRequired,
};

export default ClientInfoForm;