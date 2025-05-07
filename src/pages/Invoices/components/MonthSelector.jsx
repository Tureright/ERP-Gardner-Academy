import { Button, Modal } from "antd";
import { DownOutlined } from "@ant-design/icons";
import PropTypes from "prop-types";

const months = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

const MonthSelector = ({ isOpen, onClose, onSelectMonth }) => {
  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={250}
      centered
      closable={false}
      className="[&_.ant-modal-content]:!p-0 [&_.ant-modal-content]:!rounded-lg [&_.ant-modal-body]:!p-0"
      maskClosable={true}
    >
      <div className="flex flex-col rounded-lg overflow-hidden">
        {/* Header */}
        <div className="p-3 border-b border-gray-200 bg-white">
          <span className="text-gray-700 font-medium text-center block">
            Selecciona un mes
          </span>
        </div>

        {/* Lista de meses */}
        <div className="max-h-[400px] overflow-y-auto bg-white">
          {months.map((month, index) => (
            <Button
              key={month}
              type="text"
              onClick={() => onSelectMonth(month)}
              className={`
                w-full px-4 py-2 h-[40px] text-left text-gray-700
                hover:bg-gray-100 hover:text-gray-900
                focus:outline-none border-0
                transition-colors duration-200
                ${index === months.length - 1 ? "rounded-b-lg" : ""}
              `}
            >
              {month}
            </Button>
          ))}
        </div>
      </div>
    </Modal>
  );
};

MonthSelector.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSelectMonth: PropTypes.func.isRequired,
};

export default MonthSelector;
