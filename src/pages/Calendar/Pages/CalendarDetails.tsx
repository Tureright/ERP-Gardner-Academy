import { useState, useMemo, useEffect } from "react";
import {
  useCalendars,
  useDeleteCalendar,
  useGetCalendarById,
} from "@/hooks/useCalendar";
import Button from "@/components/molecules/Button";
import { useLocation, useNavigate } from "react-router-dom";
import { Mail, Share, Trash, Undo } from "lucide-react";
import AddEvent from "../components/molecules/AddEvent/AddEvent";
import ShareCalendar from "../components/molecules/ShareCalendar/ShareCalendar";
import { useEmployee, useUpdateEmployee } from "@/hooks/useEmployee";
type Props = {};

type LocationState = {
  employeeId: string;
  calendarId: string;
};
export default function CalendarDetails({}: Props) {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { employeeId, calendarId } = (state as LocationState) || {};

  useEffect(() => {
    if (!employeeId || !calendarId) {
      navigate("/calendar", { replace: true });
    }
  }, [employeeId, calendarId, navigate]);

  if (!employeeId || !calendarId) return null;

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [iframeKey, setIframeKey] = useState(0);

  const { data: calendar, isLoading: calendarIsLoading } =
    useGetCalendarById(calendarId);
  const [showShareModal, setShowShareModal] = useState(false);
  const { data: employee, isLoading: employeeLoading } =
    useEmployee(employeeId);
  const [copied, setCopied] = useState(false);
  const deleteCalendar = useDeleteCalendar();
  const updateEmployee = useUpdateEmployee();
  const [deletionIsLoading, setDeletionIsLoading] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(calendarIdFormatted).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Oculta el "copiado" luego de 2s
    });
  };

  const refreshIframe = () => {
    setIframeKey((prev) => prev + 1);
  };

  const confirmDelete = () => {
    if (!employee?.data) return;
    setShowConfirmModal(false);
    setDeletionIsLoading(true);
    console.log(employee.data);
    updateEmployee.mutate(
      {
        employeeId,
        employeeData: {
          ...employee.data,
          calendarId: "",
        },
      },
      {
        onSuccess: () => {
          deleteCalendar.mutate(calendarId, {
            onSuccess: () => {
              navigate("/calendar");
            },
            onError: (err) => {
              alert("Error al eliminar el calendario.");
              console.error(err);
              setDeletionIsLoading(false);
            },
          });
        },
        onError: (err) => {
          alert("Error al actualizar al empleado.");
          console.error(err);
          setDeletionIsLoading(false);
        },
      }
    );
  };

  const calendarIdFormatted =
    "https://calendar.google.com/calendar/embed?src=" +
    calendarId +
    "&mode=WEEK&ctz=America%2FGuayaquil";

  return (
    <div className="p-4 space-y-6 max-w-4xl mx-auto">
      <Button
        icon={<Undo size={20} />}
        variant="icon"
        onClick={() => window.history.back()}
        className=" mb-2"
      />
      <h1 className="text-[2.5rem] mb-4">Gestión de Horarios</h1>
      <h2 className="text-[2rem] mb-4">
        {calendarIsLoading ? "..." : calendar.data.calendar.summary}
      </h2>

      <div className="relative w-full p-4 bg-calendar border border-gray-200 rounded-lg">
        <div className="mb-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={calendarIdFormatted}
              readOnly
              className="flex-1 border p-2 rounded bg-gray-100 text-sm"
            />
            <Button
              text={copied ? "Copiado" : "Copiar"}
              className="bg-dark-cyan text-white px-4"
              onClick={handleCopy}
            />
          </div>
        </div>
        <iframe
          key={iframeKey}
          src={calendarIdFormatted}
          style={{ border: 0 }}
          width="100%"
          height="600"
          frameBorder="0"
          scrolling="no"
        ></iframe>

        <div className="flex items-center gap-2 justify-end mt-2">
          <Button
            text=""
            variant="text-icon"
            icon={<Mail />}
            className="bg-dark-cyan hover:bg-cyan-light hover:text-black text-white"
            onClick={() => setShowShareModal(true)}
          />
          <Button
            text=""
            variant="text-icon"
            icon={<Trash />}
            className="bg-dark-cyan hover:bg-cyan-light hover:text-black text-white"
            onClick={() => setShowConfirmModal(true)}
          />
        </div>
      </div>

      <h2 className="text-[2rem] mb-4">Eventos del horario</h2>
      <AddEvent calendarId={calendarId} onRefreshCalendar={refreshIframe} />

      {showShareModal && (
        <ShareCalendar
          employee={employee.data}
          calendarId={calendarId}
          onChange={(showShareModal) => setShowShareModal(showShareModal)}
        />
      )}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg space-y-4 max-w-md w-full">
            <h2 className="text-lg font-semibold">¿Eliminar calendario?</h2>
            <p>Estás a punto de eliminar este calendario</p>
            <div className="flex justify-end gap-2">
              <Button
                text="Cancelar"
                variant="text"
                className="bg-gray-300 text-gray-800"
                onClick={() => setShowConfirmModal(false)}
              />
              <Button text="Confirmar" variant="text" onClick={confirmDelete} />
            </div>
          </div>
        </div>
      )}

      {deletionIsLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center space-y-4">
            <div className="animate-spin h-10 w-10 border-4 border-dark-cyan border-t-transparent rounded-full"></div>
            <p className="text-xl font-semibold">Borrando Horario...</p>
          </div>
        </div>
      )}
    </div>
  );
}
