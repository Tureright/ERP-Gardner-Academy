import { Modal, Form, Button, Input } from 'antd';
import { PlusCircleOutlined, DeleteOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

import AdditionalInfoModal from './AdditionalInfoModal';
import ItemSelectionModal from './ItemSelectionModal';
import ClientInfoForm from './ClientInfoForm';
import InvoiceItemsTable from './InvoiceItemsTable';
import InvoiceTotalsPanel from './InvoiceTotalsPanel';
import { useInvoiceForm } from '../hooks/useInvoiceForm';
import { useInvoiceCreation } from '../hooks/useInvoiceCreation';
import { customButtonStyle, customButtonStyleCancel, customCircleButtonStyle } from '../config/constants';
import '../config/GeneralStyles.css';

const InvoiceForm = ({ isOpen, onClose, data, selectedMonth, onInvoiceCreated }) => {
  const {
    form,
    items,
    loading,
    totals,
    additionalInfo,
    paymentInfo,
    handleAddAdditionalInfo,
    handleRemoveAdditionalInfo,
    handleAddItem,
    fetchItem,
    mergedColumns
  } = useInvoiceForm(data, selectedMonth);

  const { createInvoice, isCreating } = useInvoiceCreation();

  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [isAdditionalInfoModalOpen, setIsAdditionalInfoModalOpen] = useState(false);

  useEffect(() => {
    if (isOpen && data?.itemCode) {
      console.log("data",data);
      const loadItem = async () => {
        try {
          fetchItem(data.itemCode);
        } catch (error) {
          console.error('Error loading item:', error);
          throw Error(error.message);
        }
      };
      loadItem();
    }
  }, [isOpen, data?.itemCode]);

  const handleEmitInvoice = async () => {
    try {
      const result = await createInvoice(data, items, additionalInfo, paymentInfo, totals);

      // Si la factura se creó exitosamente, cerrar el modal y notificar al componente padre
      if (result && result.success) {
        //onClose();
        
        // Notificar al componente padre que la factura fue creada
        if (onInvoiceCreated) {
          onInvoiceCreated(result);
        }
      }else{
        onClose();
      }
    } catch (error) {
      console.error('Error emitting invoice:', error);
    }
  };

  const renderAdditionalInfoFields = () => {
    return Object.entries(additionalInfo).map(([key, value]) => {
      if (key === 'Mes' || key === 'Alumno') return null;
      return (
        <div key={key} className="flex items-center justify-center space-x-4">
          <Form.Item label={key.toUpperCase()} className="mb-0 flex-1">
            <Input value={value} disabled className="w-48" />
          </Form.Item>
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleRemoveAdditionalInfo(key)}
            className="mt-2"
          />
        </div>
      );
    });
  };

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
        <ClientInfoForm data={data} />
        
        {/* Items Section */}
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 relative">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-700">ITEMS</h3>
          </div>
          <Form form={form} component={false}>
            <InvoiceItemsTable
              items={items}
              loading={loading}
              mergedColumns={mergedColumns}
            />
          </Form>
          <AddButton 
            onClick={() => setIsItemModalOpen(true)}
            label="Agregar"
          />
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-6">
            {/* Additional Info */}
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 relative">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">INFORMACIÓN ADICIONAL</h3>
              </div>
              <div className="space-y-4">
                <Form.Item label="Mes" className="mb-0">
                  <Input value={selectedMonth} disabled className="w-48" />
                </Form.Item>
                <Form.Item label="Alumno" className="mb-0">
                  <Input value={data?.studentName} disabled className="w-48" />
                </Form.Item>
                {renderAdditionalInfoFields()}
              </div>
              <AddButton 
                onClick={() => setIsAdditionalInfoModalOpen(true)}
                label="Agregar"
              />
            </div>

            {/* Payment Methods */}
            <PaymentMethodsPanel paymentInfo={paymentInfo} />

            {/* Action Buttons */}
            <ActionButtons 
              onClose={onClose}
              onEmit={handleEmitInvoice}
              isCreating={isCreating}
            />
          </div>

          {/* Totals Panel */}
          <InvoiceTotalsPanel totals={totals} />
        </div>
      </div>

      {/* Modals */}
      <AdditionalInfoModal
        isOpen={isAdditionalInfoModalOpen}
        onClose={() => setIsAdditionalInfoModalOpen(false)}
        onAdd={handleAddAdditionalInfo}
      />
      <ItemSelectionModal
        isOpen={isItemModalOpen}
        onClose={() => setIsItemModalOpen(false)}
        onSelect={handleAddItem}
        currentItems={items}
      />
    </Modal>
  );
};

// Componentes pequeños adicionales
const AddButton = ({ onClick, label }) => (
  <div className="absolute top-2 right-4 flex flex-col items-center">
    <Button
      type="primary"
      shape="circle"
      icon={<PlusCircleOutlined className="text-xl" />}
      onClick={onClick}
      style={{...customCircleButtonStyle}}
      className="w-12 h-8 border-none custom-button shadow-md flex items-center justify-center"
    />
    <span className="text-sm text-gray-600 font-medium">{label}</span>
  </div>
);

const PaymentMethodsPanel = ({ paymentInfo }) => (
  <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
    <h3 className="text-lg font-medium mb-4">FORMAS DE PAGO</h3>
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <span>OTROS CON UTILIZACIÓN DEL SISTEMA FINANCIERO:</span>
        <span>${paymentInfo.otros.toFixed(2)}</span>
      </div>
      <div className="flex justify-between items-center">
        <span>PLAZO:</span>
        <span>{paymentInfo.plazo} DÍAS</span>
      </div>
    </div>
  </div>
);

const ActionButtons = ({ onClose, onEmit, isCreating }) => {
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  const handleConfirm = async () => {
    setIsConfirmModalOpen(false);
    await onEmit();
  };

  return (
    <div className="flex space-x-4">
      <Button
        onClick={onClose}
        style={{...customButtonStyleCancel}}
        className="w-1/2 h-10 border-none custom-button font-semibold"
        disabled={isCreating}
      >
        Cancelar
      </Button>
      <Button
        type="primary"
        onClick={() => setIsConfirmModalOpen(true)}
        style={{...customButtonStyle}}
        className="w-1/2 h-10 border-none custom-button font-semibold"
        loading={isCreating}
        disabled={isCreating}
      >
        {isCreating ? 'Emitiendo...' : 'Emitir'}
      </Button>

      <Modal
        title="Confirmar Emisión de Factura"
        open={isConfirmModalOpen}
        onCancel={() => setIsConfirmModalOpen(false)}
        footer={[
          <Button 
            key="cancel" 
            onClick={() => setIsConfirmModalOpen(false)}
            style={{...customButtonStyleCancel}}
            className="border-none custom-button font-medium"
          >
            Cancelar
          </Button>,
          <Button
            key="confirm"
            type="primary"
            onClick={handleConfirm}
            style={{...customButtonStyle}}
            className="border-none custom-button font-medium"
            loading={isCreating}
          >
            {isCreating ? 'Emitiendo...' : 'Sí, Emitir Factura'}
          </Button>
        ]}
        width={500}
        centered
      >
        <div className="py-4">
          <p className="text-base mb-4">¿Estás seguro que deseas emitir esta factura?</p>
          <p className="text-sm text-gray-500">
            Esta acción no se puede deshacer. Por favor, verifica que toda la información sea correcta antes de continuar.
          </p>
        </div>
      </Modal>
    </div>
  );
};

// PropTypes para los componentes pequeños
AddButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
};

PaymentMethodsPanel.propTypes = {
  paymentInfo: PropTypes.shape({
    otros: PropTypes.number.isRequired,
    plazo: PropTypes.number.isRequired,
  }).isRequired,
};

ActionButtons.propTypes = {
  onClose: PropTypes.func.isRequired,
  onEmit: PropTypes.func.isRequired,
  isCreating: PropTypes.bool.isRequired,
};

InvoiceForm.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  data: PropTypes.shape({
    representativeName: PropTypes.string,
    representativeId: PropTypes.string,
    representativeAddress: PropTypes.string,
    representativePhone: PropTypes.string,
    representativeEmail: PropTypes.string,
    studentName: PropTypes.string,
    itemCode: PropTypes.string,
  }).isRequired,
  selectedMonth: PropTypes.string.isRequired,
  onInvoiceCreated: PropTypes.func,
};

export default InvoiceForm;