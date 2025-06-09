import React, { useState } from 'react';
import { PayrollFullTemplate } from '@/types';
import { Eye } from 'lucide-react';

type Props = {
  payrolls?: PayrollFullTemplate[];
};

function Table({ payrolls = [] }: Props) {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5; // Puedes cambiarlo si quieres (por ejemplo: 10)

  const totalPages = Math.ceil(payrolls.length / pageSize);

  // Cálculo de los elementos para la página actual
  const startIndex = (currentPage - 1) * pageSize;
  const currentPayrolls = payrolls.slice(startIndex, startIndex + pageSize);

  const handlePrevious = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  return (
    <div className="flex flex-col w-full space-y-2">
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="p-3 text-sm font-semibold">Rol de Pagos</th>
              <th className="p-3 text-sm font-semibold w-20 text-center">Acción</th>
            </tr>
          </thead>
          <tbody>
            {currentPayrolls.map((payroll) => (
              <tr
                key={payroll.id}
                className="border-t border-gray-300 hover:bg-gray-50"
              >
                <td className="p-3 text-sm">
                  {payroll.firstName} {payroll.lastName} - {payroll.payrollMonth}
                </td>
                <td className="p-3 text-center">
                  <button
                    onClick={() => {
                      window.location.href = `/rol-pagos/${payroll.id}`;
                    }}
                    className="text-blue-600 hover:text-blue-800 transition-colors"
                    aria-label={`Ver rol de pago de ${payroll.firstName} ${payroll.lastName}`}
                  >
                    <Eye size={20} />
                  </button>
                </td>
              </tr>
            ))}
            {currentPayrolls.length === 0 && (
              <tr>
                <td colSpan={2} className="p-3 text-center text-gray-500">
                  No hay roles de pago para mostrar.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Paginador */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2 mt-2">
          <button
            onClick={handlePrevious}
            disabled={currentPage === 1}
            className={`px-3 py-1 border rounded ${
              currentPage === 1
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : 'bg-white text-blue-600 hover:bg-blue-50'
            }`}
          >
            Anterior
          </button>
          <span className="text-sm text-gray-700">
            Página {currentPage} de {totalPages}
          </span>
          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 border rounded ${
              currentPage === totalPages
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : 'bg-white text-blue-600 hover:bg-blue-50'
            }`}
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
}

export default Table;
