import { useState } from "react";
import { useCreateCalendar } from "@/hooks/useCalendar";
import Button from "@/components/molecules/Button";
import { useNavigate } from "react-router-dom";
import { Undo } from "lucide-react";
import { useEmployees, useUpdateEmployee } from "@/hooks/useEmployee";
import { EmployeeResponse } from "@/types";
import SyncEmployees from "../components/atoms/SyncEmployees/SyncEmployees";

export default function NewCalendar_Calendar() {
  const [summary, setSummary] = useState("");
  const [description, setDescription] = useState("");
  const createCalendar = useCreateCalendar();
  const navigate = useNavigate();
  const { data, isLoading } = useEmployees();
  const updateEmployee = useUpdateEmployee();
  const [selectedTeacher, setSelectedTeacher] =
    useState<EmployeeResponse | null>(null);
  const isSummaryValid = summary.trim() !== "";
  const [creationIsLoading, setCreationIsLoading] = useState(false);

  const employeesData = data?.data || [];

  const handleCreate = () => {
    if (!isSummaryValid || !selectedTeacher) return;
    setCreationIsLoading(true);

    createCalendar.mutate(
      { summary: summary.trim(), description },
      {
        onSuccess: (response) => {
          const calendarId = response.data.calendarId;
          // Update the selected employee with the new calendarId
          updateEmployee.mutate(
            {
              employeeId: selectedTeacher.id,
              employeeData: {
                ...selectedTeacher,
                calendarId,
              },
            },
            {
              onSuccess: () => {
                setCreationIsLoading(false);
                navigate("/calendar/CalendarDetails", {
                  state: { employeeId: selectedTeacher.id, calendarId },
                });
              },
              onError: (err) => {
                alert("Error al asignar calendario al docente");
                console.error(err);
              },
            }
          );
        },
        onError: (err) => {
          setCreationIsLoading(false);
          alert("Error al crear calendario");
          console.error(err);
        },
      }
    );
  };

  return (
    <div className=" relative max-w-2xl mx-auto p-6 space-y-6">
      <Button
        icon={<Undo size={20} />}
        variant="icon"
        onClick={() => window.history.back()}
        className=" mb-2"
      />

      <h2 className="text-2xl font-bold">Nuevo Horario</h2>
      <div className="space-y-4">
        <div className="flex flex-row flex-wrap items-end gap-4">
          <div className="flex-1 space-y-4">
            <label className="block mb-1 font-medium">
              Selección de docente *
            </label>
            <select
              value={selectedTeacher?.id || ""}
              onChange={(e) => {
                const selected = employeesData.find(
                  (emp) => emp.id === e.target.value
                );
                if (selected) {
                  setSelectedTeacher(selected);
                  setSummary(
                    `Horario de ${selected.firstName} ${selected.lastName}`
                  );
                }
              }}
              className="w-full border p-2 rounded bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-dark-cyan"
            >
              <option value="" disabled>
                Selecciona un docente
              </option>
              {employeesData
                .filter((emp) => !emp.suspended)
                .slice()
                .sort((a, b) => a.firstName.localeCompare(b.firstName))
                .map((employee) => (
                  <option key={employee.id} value={employee.id}>
                    {employee.firstName + " " + employee.lastName}
                  </option>
                ))}
            </select>
          </div>
          <div className="flex items-center justify-end gap-4">
            <SyncEmployees className="w-full bg-dark-cyan text-white" />
          </div>
        </div>
        <div>
          <label className="block mb-1 font-medium">Nombre del horario *</label>
          <input
            type="text"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder="Ej. Horario de Cristina"
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Descripción</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Ej. Horario oficial del periodo 202X"
            className="w-full border p-2 rounded"
          />
        </div>

        <div className="flex justify-end gap-2">
          <Button
            text="Cancelar"
            variant="text"
            className="bg-gray-300 text-black"
            onClick={() => navigate("/calendar")}
          />
          <Button
            text="Crear"
            className={`text-white ${
              isSummaryValid
                ? "bg-dark-cyan hover:bg-cyan-light"
                : "bg-gray-300 cursor-not-allowed"
            }`}
            onClick={handleCreate}
            disabled={!isSummaryValid}
          />
        </div>
      </div>

      {creationIsLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center space-y-4">
            <div className="animate-spin h-10 w-10 border-4 border-dark-cyan border-t-transparent rounded-full"></div>
            <p className="text-xl font-semibold">Creando Horario...</p>
          </div>
        </div>
      )}
    </div>
  );
}
