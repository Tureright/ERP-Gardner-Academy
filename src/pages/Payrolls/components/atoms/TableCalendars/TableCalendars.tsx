import React, { useState, useMemo } from "react";
import { Eye, Trash, SearchIcon } from "lucide-react";
import { useCalendars, useDeleteCalendar } from "@/hooks/useCalendar";
import { useEmployee, useUpdateEmployee } from "@/hooks/useEmployee"; // <-- Importa el hook de update
import Button from "@/components/molecules/Button";
import { useNavigate } from "react-router-dom";
import { Calendar } from "@/types";

function TableCalendars() {
  const { data, isLoading, error } = useCalendars();
  const deleteCalendar = useDeleteCalendar();
  const updateEmployee = useUpdateEmployee(); // <-- Instancia hook update employee
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [calendarToDelete, setCalendarToDelete] = useState<Calendar | null>(null);
  const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);
  const [deletionIsLoading, setDeletionIsLoading] = useState(false);
  const navigate = useNavigate();
  const employeeData = useEmployee(calendarToDelete?.employeeId);
  const calendars = data?.data?.calendars || [];
  const pageSize = 10;
  
  const filteredCalendars = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    return calendars.filter((calendar) =>
      calendar.summary.toLowerCase().includes(query)
    );
  }, [calendars, searchQuery]);

  const totalPages = Math.ceil(filteredCalendars.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const currentCalendars = filteredCalendars.slice(
    startIndex,
    startIndex + pageSize
  );

  const handlePrevious = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handleDeleteCalendar = () => {
    if (!calendarToDelete) return;
    setShowConfirmDeleteModal(false);
    setDeletionIsLoading(true);

    updateEmployee.mutate(
      {
        employeeId: calendarToDelete.employeeId,
        employeeData: {
          ...employeeData.data.data,
          calendarId: "",
        },
      },
      {
        onSuccess: () => {
          // 2. Luego eliminar calendario
          deleteCalendar.mutate(calendarToDelete.id, {
            onSuccess: () => {
              setCalendarToDelete(null);
              setDeletionIsLoading(false);
            },
            onError: (err) => {
              alert("Error al eliminar el calendario.");
              console.error(err);
              setDeletionIsLoading(false);
            },
          });
        },
        onError: (err) => {
          alert("Error al actualizar el empleado.");
          console.error(err);
          setDeletionIsLoading(false);
        },
      }
    );
  };

  if (isLoading) return <p>Cargando calendarios...</p>;
  if (error)
    return <p className="text-red-600">Error: {(error as Error).message}</p>;

  return (
    <div className="flex flex-col w-full space-y-4">
      {/* Búsqueda */}
      <div className="relative w-full max-w-md">
        <input
          type="text"
          placeholder="Buscar calendario..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full p-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <SearchIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="p-3 text-sm font-semibold">Calendario</th>
              <th className="p-3 text-sm font-semibold w-20 text-center">Editar</th>
              <th className="p-3 text-sm font-semibold w-20 text-center">Eliminar</th>
            </tr>
          </thead>
          <tbody>
            {currentCalendars.map((calendar: Calendar) => (
              <tr
                key={calendar.id}
                className="border-t border-gray-300 hover:bg-gray-50"
              >
                <td className="p-3 text-sm">{calendar.summary}</td>
                <td className="p-3 text-center">
                  <button
                    onClick={() => {
                      navigate("/calendar/CalendarDetails", {
                        state: { employeeId: calendar.employeeId, calendarId: calendar.id },
                      });
                    }}
                    className="text-blue-600 hover:text-dark-cyan transition-colors"
                    aria-label={`Editar calendario ${calendar.summary}`}
                  >
                    <Eye size={20} />
                  </button>
                </td>
                <td className="p-3 text-center">
                  <button
                    onClick={() => {
                      setCalendarToDelete(calendar);
                      setShowConfirmDeleteModal(true);
                    }}
                    className="text-red-600 hover:text-red-800 transition-colors"
                    aria-label={`Eliminar calendario ${calendar.summary}`}
                  >
                    <Trash size={20} />
                  </button>
                </td>
              </tr>
            ))}
            {currentCalendars.length === 0 && !deletionIsLoading && (
              <tr>
                <td colSpan={3} className="p-3 text-center text-gray-500">
                  No hay calendarios para mostrar.
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

      {/* Modal confirmación eliminar */}
      {showConfirmDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg space-y-4 max-w-md w-full">
            <h2 className="text-lg font-semibold">
              ¿Estás seguro de que quieres eliminar este calendario?
            </h2>
            <p>{calendarToDelete?.summary}</p>
            <div className="flex justify-end space-x-2">
              <Button
                text="Cancelar"
                variant="text"
                onClick={() => {
                  setCalendarToDelete(null);
                  setShowConfirmDeleteModal(false);
                }}
                className="bg-gray-300 text-gray-800"
              />
              <Button
                text="Confirmar"
                variant="text"
                onClick={handleDeleteCalendar}
                className="bg-dark-cyan text-white"
              />
            </div>
          </div>
        </div>
      )}

      {/* Animación eliminando */}
      {deletionIsLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center space-y-4">
            <div className="animate-spin h-10 w-10 border-4 border-dark-cyan border-t-transparent rounded-full"></div>
            <p className="text-xl font-semibold">Eliminando Horario...</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default TableCalendars;
