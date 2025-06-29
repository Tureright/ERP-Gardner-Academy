import { Button, Modal, Spin } from "antd";
import PropTypes from "prop-types";
import useMonths from "../hooks/useMonths";

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

const MonthSelector = ({ isOpen, onClose, onSelectMonth, record }) => {
  const { billedMonths, loading, error } = useMonths(record);

  const isMonthBilled = (monthIndex) => {
    if (!billedMonths?.months || billedMonths.months.length === 0) {
      // Si no hay meses facturados, solo deshabilitar meses anteriores al actual
      return monthIndex + 1 < new Date().getMonth() + 1;
    }
    
    // Obtener el mes actual (0-11)
    const currentMonth = new Date().getMonth() + 1;
    
    // Deshabilitar si:
    // 1. El mes ya está facturado
    // 2. El mes es anterior al mes actual
    // 3. El mes es menor al primer mes facturado
    return (
      billedMonths.months.includes(monthIndex + 1) ||
      monthIndex + 1 < currentMonth ||
      monthIndex + 1 < Math.min(...billedMonths.months)
    );
  };

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
          {loading ? (
            <div className="flex justify-center items-center p-4">
              <Spin />
            </div>
          ) : error ? (
            <div className="p-4 text-red-500 text-center">
              Error al cargar los meses {error.message}
            </div>
          ) : (
            months.map((month, index) => {
              const isDisabled = isMonthBilled(index);
              const isPastMonth =
                !billedMonths?.months?.includes(index + 1) &&
                index + 1 < Math.min(...(billedMonths?.months || [13]));

              return (
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
                    ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}
                  `}
                  disabled={isDisabled}
                  title={
                    isPastMonth
                      ? "Este mes ya pasó"
                      : isDisabled
                      ? billedMonths?.months?.includes(index + 1)
                        ? "Este mes ya está facturado"
                        : "No se puede facturar meses anteriores"
                      : ""
                  }
                >
                  {month}
                </Button>
              );
            })
          )}
        </div>
      </div>
    </Modal>
  );
};

MonthSelector.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSelectMonth: PropTypes.func.isRequired,
  record: PropTypes.shape({
    studentId: PropTypes.string.isRequired,
    representativeId: PropTypes.string.isRequired,
  }),
};

export default MonthSelector;
