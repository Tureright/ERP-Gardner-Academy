import PropTypes from 'prop-types';
import { Form, InputNumber, Input } from 'antd';

const EditableCell = ({
  children = null,
  editing = false,
  inputType = 'text',
  dataIndex,
  record,
  ...restProps
}) => {
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

EditableCell.propTypes = {
  children: PropTypes.node,
  inputType: PropTypes.oneOf(['text', 'number']),
};

export default EditableCell;