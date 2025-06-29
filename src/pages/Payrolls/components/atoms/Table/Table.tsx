import React, { useState, useMemo } from "react";
import { PayrollFullTemplate } from "@/types";
import { Eye, SearchIcon, Trash } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDeletePayroll } from "@/hooks/usePayroll";
import Button from "@/components/molecules/Button";
import SyncEmployees from "@/pages/Calendar/components/atoms/SyncEmployees/SyncEmployees";

type Props = {
  payrolls?: PayrollFullTemplate[];
};

function Table({ payrolls = [] }: Props) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);
  const [payrollToDelete, setPayrollToDelete] =
    useState<PayrollFullTemplate | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const navigate = useNavigate();
  const deletePayroll = useDeletePayroll();

  const pageSize = 10;

  const filteredPayrolls = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return payrolls;

    return payrolls.filter((payroll) => {
      const fullText =
        `${payroll.firstName} ${payroll.lastName} ${payroll.payrollMonth}`.toLowerCase();
      return fullText.includes(query);
    });
  }, [payrolls, searchQuery]);

  const totalPages = Math.ceil(filteredPayrolls.length / pageSize);

  const startIndex = (currentPage - 1) * pageSize;
  const currentPayrolls = filteredPayrolls.slice(
    startIndex,
    startIndex + pageSize
  );

  const handlePrevious = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleDeletePayroll = () => {
    if (!payrollToDelete) return;
    setShowConfirmDeleteModal(false);
    setIsDeleting(true);
    deletePayroll.mutate(
      { employeeId: payrollToDelete.employeeId, payrollId: payrollToDelete.id },
      {
        onSuccess: () => {
          console.log("Rol de pago eliminado exitosamente");
          setPayrollToDelete(null);
          setIsDeleting(false);
        },
        onError: (error) => {
          console.error("Error al eliminar el rol de pago:", error);
          setPayrollToDelete(null);
        },
      }
    );
  };

  return (
    <div className="flex flex-col w-full space-y-4">
      <div className="flex flex-row flex-wrap gap-4  justify-between">
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

      {/* Tabla */}
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="p-3 text-sm font-semibold">Rol de Pagos</th>
              <th className="p-3 text-sm font-semibold w-20 text-center">
                Editar
              </th>
              <th className="p-3 text-sm font-semibold w-20 text-center">
                Eliminar
              </th>
            </tr>
          </thead>
          <tbody>
            {currentPayrolls.map((payroll) => (
              <tr
                key={payroll.id}
                className="border-t border-gray-300 hover:bg-gray-50"
              >
                <td className="p-3 text-sm">
                  <div className="flex flex-row justify-between">
                    <span>
                      {payroll.firstName} {payroll.lastName}
                    </span>
                    <span className="text-gray-500">
                      {payroll.payrollMonth}
                    </span>
                  </div>
                </td>
                <td className="p-3 text-center">
                  <button
                    onClick={() => {
                      navigate("/payrolls/payrollDetails", {
                        state: { fullPayrollData: payroll },
                      });
                    }}
                    className="text-pink-tertiary hover:text-dark-cyan transition-colors"
                    aria-label={`Ver rol de pago de ${payroll.firstName} ${payroll.lastName}`}
                  >
                    <Eye size={20} />
                  </button>
                </td>
                <td className="p-3 text-center">
                  <button
                    onClick={() => {
                      setPayrollToDelete(payroll);
                      setShowConfirmDeleteModal(true);
                    }}
                    className="text-pink-tertiary hover:text-dark-cyan transition-colors"
                    aria-label={`Ver rol de pago de ${payroll.firstName} ${payroll.lastName}`}
                  >
                    <Trash size={20} />
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
      {/* Modal de confirmación de eliminación */}
      {showConfirmDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg space-y-4">
            <h2 className="text-lg font-semibold">
              ¿Estás seguro de que quieres eliminar este rol de pagos?
            </h2>
            <p>
              {payrollToDelete.firstName} {payrollToDelete.lastName} -{" "}
              {payrollToDelete.payrollMonth}
            </p>
            <div className="flex justify-end space-x-2">
              <Button
                text="Cancelar"
                variant="text"
                onClick={() => {
                  setPayrollToDelete(null);
                  setShowConfirmDeleteModal(false);
                }}
                className="bg-gray-300 text-gray-800"
              />
              <Button
                text="Confirmar"
                variant="text"
                onClick={handleDeletePayroll}
                className="bg-dark-cyan text-white"
              />
            </div>
          </div>
        </div>
      )}

      {isDeleting && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg flex items-center space-x-4">
            <svg
              className="animate-spin h-5 w-5 text-dark-cyan"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 11-8 8z"
              />
            </svg>
            <span className="text-dark-cyan font-medium">
              Eliminando rol de pagos...
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export default Table;
