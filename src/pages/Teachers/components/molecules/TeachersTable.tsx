import React, { useState, useMemo } from "react";
import { PayrollFullTemplate } from "@/types";
import { Eye, SearchIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Button from "@/components/molecules/Button";

type Props = {
  payrolls?: PayrollFullTemplate[];
};

function TeachersTable({ payrolls = [] }: Props) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const pageSize = 10;

  // 🔍 Filtrado por nombre o mes
  const filteredPayrolls = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return payrolls;

    return payrolls.filter((payroll) => {
      const fullText = `${payroll.firstName} ${payroll.lastName} ${payroll.payrollMonth}`.toLowerCase();
      return fullText.includes(query);
    });
  }, [payrolls, searchQuery]);

  const totalPages = Math.ceil(filteredPayrolls.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const currentPayrolls = filteredPayrolls.slice(startIndex, startIndex + pageSize);

  const handlePrevious = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNext = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="flex flex-col w-full space-y-4">
      {/* 🔍 Barra de búsqueda */}
      <div className="flex flex-row flex-wrap gap-4 justify-between">
        <div className="relative w-full max-w-md">
          <input
            type="text"
            placeholder="Buscar rol de pagos por nombre o mes..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full p-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <SearchIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* 📋 Tabla */}
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="p-3 text-sm font-semibold">Rol de Pagos</th>
              <th className="p-3 text-sm font-semibold w-20 text-center">Visualizar</th>
            </tr>
          </thead>
          <tbody>
            {currentPayrolls.map((payroll) => (
              <tr key={payroll.id} className="border-t border-gray-300 hover:bg-gray-50">
                <td className="p-3 text-sm">
                  <div className="flex flex-row justify-between">
                    <span>{payroll.firstName} {payroll.lastName}</span>
                    <span className="text-gray-500">{payroll.payrollMonth}</span>
                  </div>
                </td>
                <td className="p-3 text-center">
                  <button
                    onClick={() => {
                      navigate("/teachersProfile/payrollDetails", {
                        state: { fullPayrollData: payroll },
                      });
                    }}
                    className="text-pink-tertiary hover:text-dark-cyan transition-colors"
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

      {/* 📄 Paginador */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2 mt-2">
          <button
            onClick={handlePrevious}
            disabled={currentPage === 1}
            className={`px-3 py-1 border rounded ${
              currentPage === 1
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-white text-dark-cyan hover:bg-blue-50"
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
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-white text-dark-cyan hover:bg-blue-50"
            }`}
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
}

export default TeachersTable;
