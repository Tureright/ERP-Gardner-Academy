// src/pages/Invoices/components/ItemEditModal.jsx
import { Modal, Form, Input, Select, Checkbox, Button } from "antd";
import PropTypes from "prop-types";
import { useState, useEffect, useMemo } from "react";
import { useItems } from "@/hooks/useItems";
import { IVA_OPTIONS } from "@/pages/Invoices/config/constants";
import { customButtonStyle, customButtonStyleCancel } from "../config/constants";
import '../config/GeneralStyles.css';


const TIPO_OPTIONS = [
  { value: "SERVICIO", label: "Servicio" },
  { value: "PRODUCTO", label: "Producto" },
];

const DEFAULT_FORM_VALUES = {
  tipo: "SERVICIO",
  es_para_venta: false,
  es_para_inventario: false,
};

const DEFAULT_CREATE_DATA = {
  codigo_ice: null,
  factor: 1,
  stock_minimo: null,
  stock_minimo_critico: null,
  comportamiento: {
    lote: { obligatorio: false },
    fecha_caducidad: { obligatorio: false },
  },
  proveedores: [],
};

const ItemEditModal = ({ open, onClose, initialValues, mode, onItemCreated }) => {
  const [form] = Form.useForm();
  const [additionalDetails, setAdditionalDetails] = useState([]);
  const [showAddDetail, setShowAddDetail] = useState(false);
  const [newDetail, setNewDetail] = useState({ nombre: "", valor: "" });
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const { updateItem, createItem, isUpdating, isCreating } = useItems();

  const isEditMode = mode === "edit";
  const isLoading = isUpdating || isCreating;
  const modalTitle = isEditMode ? "Editar Item" : "Crear Nuevo Item";
  const confirmTitle = isEditMode
    ? "Confirmar Actualización"
    : "Confirmar Creación";
  const confirmMessage = isEditMode
    ? "¿Estás seguro que deseas actualizar este item?"
    : "¿Estás seguro que deseas crear este nuevo item?";
  const confirmDescription = isEditMode
    ? "Esta acción actualizará la información del item. Por favor, verifica que todos los cambios sean correctos antes de continuar."
    : "Esta acción creará un nuevo item en el sistema. Por favor, verifica que toda la información sea correcta antes de continuar.";

  useEffect(() => {
    if (open) {
      form.resetFields();
      setIsConfirmModalOpen(false);
      if (mode === "edit" && initialValues) {
        console.log("initialValues", initialValues);
        form.setFieldsValue(initialValues);
        setAdditionalDetails(initialValues.detalles || []);
      } else {
        form.setFieldsValue(DEFAULT_FORM_VALUES);
        setAdditionalDetails([]);
      }
    }
  }, [open, initialValues, mode, form]);

  // Posiblemente quitar por compatibilidad con CastorDocs
  const handleAddDetail = () => {
    if (newDetail.nombre && newDetail.valor) {
      setAdditionalDetails([...additionalDetails, newDetail]);
      setNewDetail({ nombre: "", valor: "" });
      setShowAddDetail(false);
    }
  };

  // Posiblemente quitar por compatibilidad con CastorDocs
  const handleRemoveDetail = (index) => {
    setAdditionalDetails(additionalDetails.filter((_, i) => i !== index));
  };

  const handleCancel = () => {
    form.resetFields();
    setAdditionalDetails([]);
    setShowAddDetail(false);
    setIsConfirmModalOpen(false);
    onClose();
  };

  const handleCancelConfirmModal = () => {
    setIsConfirmModalOpen(false);
  };

  const handleSubmit = async () => {
    try {
      await form.validateFields();
      setIsConfirmModalOpen(true);
    } catch (error) {
      console.error("Error:", error);
      throw Error(error.message);
    }
  };

  const handleConfirmSubmit = async () => {
    try {
      const formValues = await form.validateFields();

      if (mode === "edit" && initialValues?.id) {
        const data = {
          ...initialValues,
          ...formValues,
          detalles_adicionales: additionalDetails,
        };
        console.log("data para actualizar", data);
        
        const result = await updateItem({
          id: initialValues.id,
          data,
        });
        handleCancel();
        console.log("result en handle confirm item: ", result)

        // Si la actualización fue exitosa, cerrar el modal y notificar
        if (result && result.success == true) {
          
          // Notificar al componente padre que el item fue actualizado
          if (onItemCreated) {
            onItemCreated(result);
          }
        }
        if (result && result.errorResponse) {
          throw new Error(result.errorResponse.message);
        }
      } else {
        const data = {
          ...formValues,
          ...DEFAULT_CREATE_DATA,
          detalles_adicionales: additionalDetails,
        };
        console.log("data para crear", data);

        const result = await createItem(data);
        handleCancel();

        // Si la creación fue exitosa, cerrar el modal y notificar
        if (result && result.success == true) {          
          // Notificar al componente padre que el item fue creado
          if (onItemCreated) {
            onItemCreated(result);
          }
        }
        if (result && result.errorResponse) {
          throw new Error(result.errorResponse.message);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const validationRules = useMemo(
    () => ({
      tipo: [{ required: true, message: "Seleccione el tipo" }],
      descripcion: [{ required: true, message: "Ingrese la descripción" }],
      precio_unitario: [
        { required: true, message: "Ingrese el precio" },
        {
          type: "number",
          transform: (value) => Number(value),
          validator: (_, value) => {
            if (value <= 0) {
              return Promise.reject(new Error("El precio debe ser mayor a 0"));
            }
            return Promise.resolve();
          },
        },
      ],
      codigo_iva: [{ required: true, message: "Seleccione el IVA" }],
      tarifa_iva: [
        {
          type: "number",
          min: 0,
          message: "La tarifa debe ser mayor o igual a 0",
        },
      ],
    }),
    []
  );

  return (
    <>
      <Modal
        open={open}
        onCancel={handleCancel}
        footer={null}
        width={900}
        title={modalTitle}
        centered
        destroyOnClose={true}
        className="rounded-lg"
        zIndex={1000}
      >
        <Form form={form} layout="vertical" className="space-y-6">
          {/* Datos principales */}
          <div className="border shadow-sm border border-gray-200 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              Información General
            </h3>
            {/* Primera fila de campos */}
            <div className="grid grid-cols-6 gap-4 mb-4">
              <Form.Item
                label="Tipo"
                name="tipo"
                className="col-span-1"
                rules={validationRules.tipo}
              >
                <Select
                  placeholder="Seleccione"
                  className="border-yellow-300"
                  options={TIPO_OPTIONS}
                />
              </Form.Item>
              <Form.Item
                label="Código Principal"
                name="codigo_principal"
                className="col-span-1"
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Código Auxiliar"
                name="codigo_auxiliar"
                className="col-span-1"
              >
                <Input placeholder="Auxiliar" />
              </Form.Item>
              <Form.Item
                label="Descripción"
                name="descripcion"
                className="col-span-3"
                rules={validationRules.descripcion}
              >
                <Input placeholder="Descripción del item" />
              </Form.Item>
            </div>

            {/* Segunda fila de campos */}
            <div className="grid grid-cols-5 gap-4 mb-2">
              <Form.Item
                label="Precio unitario"
                name="precio_unitario"
                className="col-span-1"
                rules={validationRules.precio_unitario}
              >
                <Input type="number" min={0} step="0.01" />
              </Form.Item>
              <Form.Item
                label="Unidad de medida"
                name="unidad_medida"
                className="col-span-1"
              >
                <Input placeholder="Ej: kg, metros, etc." />
              </Form.Item>
              <Form.Item
                label="IVA"
                name="codigo_iva"
                className="col-span-1"
                rules={validationRules.codigo_iva}
              >
                <Select
                  placeholder="Seleccione"
                  options={IVA_OPTIONS}
                  className="border-yellow-300"
                />
              </Form.Item>
              <Form.Item
                label="Tarifa IVA"
                name="tarifa_iva"
                className="col-span-1"
                rules={validationRules.tarifa_iva}
              >
                <Input placeholder="15.00" value={15.0} disabled />
              </Form.Item>
            </div>

            {/* Fila de checkboxes */}
            <div className="grid grid-cols-5 gap-4 mt-2 pt-4 border-t border-gray-100">
              <Form.Item
                name="es_para_venta"
                valuePropName="checked"
                className="col-span-1"
              >
                <Checkbox>Ítem para venta</Checkbox>
              </Form.Item>
              <Form.Item
                name="es_para_inventario"
                valuePropName="checked"
                className="col-span-2"
              >
                <Checkbox>Disponible para inventario</Checkbox>
              </Form.Item>
            </div>
          </div>

          {/* Detalles adicionales */}
          {/* Posiblemente quitar por compatibilidad con CastorDocs */}
          {/*
          <div className="border border-yellow-300 rounded-lg p-4 mb-6 relative">
            <div className="flex items-center mb-2">
              <span className="font-bold text-gray-700 text-lg mr-2">
                DETALLES ADICIONALES
              </span>
              <Button
                type="primary"
                shape="circle"
                icon={<PlusCircleOutlined />}
                className="bg-yellow-500 hover:bg-yellow-600 border-none ml-2"
                onClick={() => setShowAddDetail(true)}
              />
            </div>
            <div className="flex flex-col gap-2">
              {additionalDetails.map((detail, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <Input value={detail.nombre} disabled className="w-32" />
                  <Input value={detail.valor} disabled className="w-32" />
                  <Button
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => handleRemoveDetail(idx)}
                    className="ml-2"
                  />
                </div>
              ))}
              {showAddDetail && (
                <div className="flex items-center gap-2 mt-2">
                  <Input
                    placeholder="Nombre"
                    value={newDetail.nombre}
                    onChange={(e) =>
                      setNewDetail({ ...newDetail, nombre: e.target.value })
                    }
                    className="w-32"
                  />
                  <Input
                    placeholder="Valor"
                    value={newDetail.valor}
                    onChange={(e) =>
                      setNewDetail({ ...newDetail, valor: e.target.value })
                    }
                    className="w-32"
                  />
                  <Button
                    type="primary"
                    shape="circle"
                    icon={<PlusCircleOutlined />}
                    className="bg-yellow-500 hover:bg-yellow-600 border-none"
                    onClick={handleAddDetail}
                  />
                  <Button
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => setShowAddDetail(false)}
                  />
                </div>
              )}
            </div>
          </div>*/}
          <hr className="my-6" />
          {/* Botones de acción */}
          <div className="flex justify-end gap-4">
            <Button
              onClick={handleCancel}
              style={{...customButtonStyleCancel}}
              className="h-10 px-8 custom-button rounded-md font-semibold"
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button
              type="primary"
              onClick={handleSubmit}
              style={{...customButtonStyle}}
              className="h-10 px-8 border-none custom-button rounded-md font-semibold"
              loading={isLoading}
              disabled={isLoading}
            >
              {isLoading ? "Guardando..." : "Guardar"}
            </Button>
          </div>
        </Form>
      </Modal>

      <Modal
        title={confirmTitle}
        open={isConfirmModalOpen}
        onCancel={handleCancelConfirmModal}
        footer={[
          <Button
            key="cancel"
            onClick={handleCancelConfirmModal}
            style={{...customButtonStyleCancel}}
            className="h-10 px-8 custom-button rounded-md font-semibold"
            disabled={isLoading}
          >
            Cancelar
          </Button>,
          <Button
            key="confirm"
            type="primary"
            onClick={handleConfirmSubmit}
            style={{...customButtonStyle}}
            className="h-10 px-8 custom-button border-none rounded-md font-semibold"
            loading={isLoading}
            disabled={isLoading}
          >
            {isLoading
              ? isEditMode
                ? "Actualizando..."
                : "Creando..."
              : isEditMode
              ? "Sí, Actualizar Item"
              : "Sí, Crear Item"}
          </Button>,
        ]}
        width={500}
        centered
        zIndex={1001}
        destroyOnClose={true}
      >
        <div className="py-4">
          <p className="text-base mb-4">{confirmMessage}</p>
          <p className="text-sm text-gray-500">{confirmDescription}</p>
        </div>
      </Modal>
    </>
  );
};

ItemEditModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  initialValues: PropTypes.object,
  mode: PropTypes.oneOf(["create", "edit"]),
  onItemCreated: PropTypes.func,
};

export default ItemEditModal;
