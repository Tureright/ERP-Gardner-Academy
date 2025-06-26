import PropTypes from 'prop-types';
import { Form, InputNumber, Input } from 'antd';

const EditableCell = ({
  // Props con valores por defecto directamente en la destructuración
  children = null,
  editing = false,
  inputType = 'text',
  
  // Resto de props (sin valores por defecto)
  dataIndex,
  record,
  form,
  isEditing,
  edit,
  save,
  cancel,
  handleRemoveItem,
  ...restProps
}) => {
  // Filtramos props que no deben ir al elemento td
  const { inputType: _, ...tdProps } = restProps;

  const inputNode = inputType === 'number' ? (
    <InputNumber className="w-full" min={0} />
  ) : (
    <Input />
  );

  const getValidationRules = () => {
    const rules = [
      {
        required: true,
        message: `Por favor ingrese ${dataIndex}`,
      },
    ];

    if (inputType === 'number') {
      rules.push({
        type: 'number',
        min: dataIndex === 'descuento' ? 0 : 1,
        message: dataIndex === 'descuento'
          ? 'El descuento no puede ser negativo'
          : 'La cantidad debe ser mayor a 0',
      });
    }

    return rules;
  };

  return (
    <td {...tdProps} className="relative">
      {editing ? (
        <Form.Item
          name={dataIndex}
          className="mb-0"
          rules={getValidationRules()}
          initialValue={record[dataIndex]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        <div className="py-2">{children}</div>
      )}
    </td>
  );
};

// Mantenemos PropTypes para documentación y validación en desarrollo
EditableCell.propTypes = {
  children: PropTypes.node,
  form: PropTypes.object.isRequired,
  isEditing: PropTypes.func.isRequired,
  edit: PropTypes.func.isRequired,
  save: PropTypes.func.isRequired,
  cancel: PropTypes.func.isRequired,
  handleRemoveItem: PropTypes.func.isRequired,
  inputType: PropTypes.oneOf(['text', 'number']),
};


export default EditableCell;