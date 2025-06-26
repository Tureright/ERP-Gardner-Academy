// components/InvoiceTotalsPanel.jsx
import PropTypes from "prop-types";

const InvoiceTotalsPanel = ({ totals }) => {
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">SUBTOTAL IVA 15%</span>
          <span className="font-medium">
            ${totals.subtotalIva15.toFixed(2)}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">SUBTOTAL IVA DIFERENCIADO</span>
          <span className="font-medium">${totals.subtotalIvaDiferenciado.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">SUBTOTAL 0%</span>
          <span className="font-medium">${totals.subtotal0.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">SUBTOTAL NO OBJETO IVA</span>
          <span className="font-medium">${totals.subtotalNoObjetoIva.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">SUBTOTAL EXENTO DE IVA</span>
          <span className="font-medium">${totals.subtotalExentoIva.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm font-medium border-t border-b border-gray-200 py-2 my-2">
          <span>SUBTOTAL SIN IMPUESTOS</span>
          <span>${totals.subtotalSinImpuestos.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">TOTAL DESCUENTO</span>
          <span className="font-medium">${totals.totalDescuento.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">ICE</span>
          <span className="font-medium">${totals.ice.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">IVA 15%</span>
          <span className="font-medium">${totals.iva15.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">PROPINA</span>
          <span className="font-medium">${totals.propina.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-lg font-bold border-t border-gray-200 pt-2 mt-2">
          <span>VALOR TOTAL</span>
          <span>${totals.valorTotal.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

InvoiceTotalsPanel.propTypes = {
  totals: PropTypes.shape({
    subtotalIva15: PropTypes.number,
    subtotalIvaDiferenciado: PropTypes.number,
    subtotal0: PropTypes.number,
    subtotalNoObjetoIva: PropTypes.number,
    subtotalExentoIva: PropTypes.number,
    subtotalSinImpuestos: PropTypes.number,
    totalDescuento: PropTypes.number,
    ice: PropTypes.number,
    iva15: PropTypes.number,
    propina: PropTypes.number,
    valorTotal: PropTypes.number,
  }).isRequired,
};

export default InvoiceTotalsPanel;
