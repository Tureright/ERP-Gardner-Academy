import { Modal, Form, Input, Button, Table } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import PropTypes from "prop-types";

const InvoiceForm = ({ isOpen, onClose, data, selectedMonth }) => {
  const [form] = Form.useForm();
  const [items, setItems] = useState([]);
  const [totals, setTotals] = useState({
    subtotalIva15: 0,
    subtotalIvaDiferenciado: 0,
    subtotal0: 0,
    subtotalNoObjetoIva: 0,
    subtotalExentoIva: 0,
    subtotalSinImpuestos: 0,
    totalDescuento: 0,
    ice: 0,
    iva15: 0,
    propina: 0,
    valorTotal: 0
  });

  const [additionalInfo, setAdditionalInfo] = useState({
    mes: "",
    alumno: "",
  });

  const [paymentInfo, setPaymentInfo] = useState({
    otros: 200,
    plazo: 0
  });
  // Efecto para actualizar el formulario cuando cambian los datos
  useEffect(() => {
    if (data && selectedMonth) {
      form.setFieldsValue({
        razonSocial: data.representativeName,
        identificacion: data.representativeId,
        direccion: data.representativeAddress,
        telefono: data.representativePhone,
        correo: data.representativeEmail,
        mes: selectedMonth,
        alumno: data.studentName,
      });
    }
  }, [data, selectedMonth, form]);

  const handleEmitInvoice = () => {
    // Obtener todos los datos necesarios para la factura
    const invoiceData = {
      // Información del cliente/representante
      clientInfo: {
        razonSocial: data.representativeName,
        identificacion: data.representativeId,
        direccion: data.address,
        telefono: data.phone,
        correo: data.email,
        fechaEmision: new Date().toISOString(),
        guiaRemision: form.getFieldValue('guiaRemision') || ''
      },

      // Información del estudiante
      studentInfo: {
        nombre: data.studentName,
        mes: selectedMonth
      },

      // Items de la factura
      items: items,

      // Información adicional
      additionalInfo: {
        mes: selectedMonth,
        alumno: data.studentName,
        // Aquí puedes agregar más información adicional si es necesario
      },

      // Formas de pago
      paymentInfo: {
        otros: paymentInfo.otros,
        plazo: paymentInfo.plazo
      },

      // Totales
      totals: {
        subtotalIva15: totals.subtotalIva15,
        subtotalIvaDiferenciado: totals.subtotalIvaDiferenciado,
        subtotal0: totals.subtotal0,
        subtotalNoObjetoIva: totals.subtotalNoObjetoIva,
        subtotalExentoIva: totals.subtotalExentoIva,
        subtotalSinImpuestos: totals.subtotalSinImpuestos,
        totalDescuento: totals.totalDescuento,
        ice: totals.ice,
        iva15: totals.iva15,
        propina: totals.propina,
        valorTotal: totals.valorTotal
      }
    };

    // Log para verificar los datos
    console.log('Datos de la factura:', invoiceData);

    // Aquí puedes agregar la lógica para enviar los datos al servidor
    try {
      // Ejemplo de llamada a API

    } catch (error) {
      console.error('Error al emitir la factura:', error);
    }
  };


  // Columnas para la tabla de items
  const itemColumns = [
    {
      title: "CÓDIGO PRINCIPAL",
      dataIndex: "codigoPrincipal",
      key: "codigoPrincipal",
      width: "15%",
    },
    {
      title: "CANTIDAD",
      dataIndex: "cantidad",
      key: "cantidad",
      width: "10%",
    },
    {
      title: "DESCRIPCIÓN",
      dataIndex: "descripcion",
      align:"center",
      key: "descripcion",
      width: "30%",
    },
    {
      title: "DETALLE ADICIONAL",
      dataIndex: "detalleAdicional",
      key: "detalleAdicional",
      width: "15%",
    },
    {
      title: "PRECIO UNITARIO",
      dataIndex: "precioUnitario",
      key: "precioUnitario",
      width: "15%",
    },
    {
      title: "DESCUENTO",
      dataIndex: "descuento",
      key: "descuento",
      width: "10%",
    },
    {
      title: "PRECIO TOTAL",
      dataIndex: "precioTotal",
      key: "precioTotal",
      width: "15%",
    },
  ];
  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={1000}
      className="invoice-form-modal"
      destroyOnClose={true}
    >
      <div className="flex flex-col space-y-6 p-4">
        {/* Sección de información principal */}
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
              <Input />
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

        {/* Sección de items */}
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Items</h3>
            <Button
              type="primary"
              icon={<PlusCircleOutlined />}
              className="bg-blue-500"
            >
              Agregar Item
            </Button>
          </div>
          <Table
            columns={itemColumns}
            dataSource={items}
            pagination={false}
            size="small"
          />
        </div>

        {/* Grid de 2 columnas para información adicional, totales y formas de pago */}
        <div className="grid grid-cols-2 gap-6">
          {/* Columna izquierda */}
          <div className="space-y-6">
            {/* Información Adicional */}
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">INFORMACIÓN ADICIONAL</h3>
                <Button
                  type="text"
                  icon={<PlusCircleOutlined />}
                  className="text-blue-500"
                />
              </div>
              <div className="space-y-4">
                <Form.Item label="MES">
                  <Input value={selectedMonth} disabled />
                </Form.Item>
                <Form.Item label="ALUMNO">
                  <Input value={data?.studentName} disabled />
                </Form.Item>
              </div>
            </div>

            {/* Formas de Pago */}
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
              <h3 className="text-lg font-medium mb-4">FORMAS DE PAGO</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>OTROS:</span>
                  <span>$200</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>PLAZO:</span>
                  <span>0 DÍAS</span>
                </div>
              </div>
            </div>

            {/* Botones de acción */}
            <div className="flex space-x-4">
              <Button
                onClick={onClose}
                className="w-1/2 h-10 text-gray-700 border-gray-300 hover:bg-gray-50"
              >
                Cancelar
              </Button>
              <Button
                type="primary"
                onClick={handleEmitInvoice}
                className="w-1/2 h-10 bg-yellow-500 hover:bg-yellow-600 border-none"
              >
                Emitir
              </Button>
            </div>
          </div>

          {/* Columna derecha - Totales */}
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">SUBTOTAL IVA 15%</span>
                <span className="font-medium">$0.00</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">SUBTOTAL IVA DIFERENCIADO</span>
                <span className="font-medium">$0.00</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">SUBTOTAL 0%</span>
                <span className="font-medium">$0.00</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">SUBTOTAL NO OBJETO IVA</span>
                <span className="font-medium">$0.00</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">SUBTOTAL EXENTO DE IVA</span>
                <span className="font-medium">$0.00</span>
              </div>
              <div className="flex justify-between text-sm font-medium border-t border-b border-gray-200 py-2 my-2">
                <span>SUBTOTAL SIN IMPUESTOS</span>
                <span>$0.00</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">TOTAL DESCUENTO</span>
                <span className="font-medium">$0.00</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">ICE</span>
                <span className="font-medium">$0.00</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">IVA 15%</span>
                <span className="font-medium">$0.00</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">PROPINA</span>
                <span className="font-medium">$0.00</span>
              </div>
              <div className="flex justify-between text-lg font-bold border-t border-gray-200 pt-2 mt-2">
                <span>VALOR TOTAL</span>
                <span>$0.00</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

InvoiceForm.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  data: PropTypes.shape({
    representativeName: PropTypes.string,
    representativeId: PropTypes.string,
    address: PropTypes.string,
    phone: PropTypes.string,
    email: PropTypes.string,
    studentName: PropTypes.string,
  }).isRequired,
  selectedMonth: PropTypes.string.isRequired,
};

export default InvoiceForm;
