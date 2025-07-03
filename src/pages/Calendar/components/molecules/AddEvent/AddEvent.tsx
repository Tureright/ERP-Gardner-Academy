import React, { useState } from "react";
import {
  useAddRecurringEvent,
  useDeleteEvent,
  useGetEvents,
} from "@/hooks/useCalendar";
import {
  formatToCalendarDateTime,
  formatUntilToUTC,
  getUniqueRecurringEvents,
} from "@/utils/calendar";
import { RecurringEvent } from "@/types";
import Button from "@/components/molecules/Button";
import EventInputs from "../../atoms/EventInputs/EventInputs";
import EventTable from "../../atoms/EventTable/EventTable";

type Props = {
  calendarId: string;
  onRefreshCalendar?: () => void;
};

const initialEventData = {
  summary: "",
  dayOfWeek: "Lunes",
  startHour: "02",
  startMinute: "00",
  startMeridiem: "pm",
  endHour: "03",
  endMinute: "00",
  endMeridiem: "pm",
  until: "",
};

export default function AddEvent({ calendarId, onRefreshCalendar }: Props) {
  const [eventData, setEventData] = useState(initialEventData);
  const [loading, setLoading] = useState(false);
  const [deletionIsLoading, setDeletionIsLoading] = useState(false);
  const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);
  const [eventIdSelected, setEventIdSelected] = useState("");

  const addRecurringEvent = useAddRecurringEvent();
  const deleteEvent = useDeleteEvent();
  const { data: events = [], refetch, isLoading } = useGetEvents(calendarId);

  const isEventValid = Object.values({
    summary: eventData.summary.trim(),
    dayOfWeek: eventData.dayOfWeek,
    startHour: eventData.startHour,
    startMinute: eventData.startMinute,
    startMeridiem: eventData.startMeridiem,
    endHour: eventData.endHour,
    endMinute: eventData.endMinute,
    endMeridiem: eventData.endMeridiem,
    until: eventData.until,
  }).every(Boolean);

  function getNextDateForDay(dayOfWeek: string): Date {
    const dayMap: Record<string, number> = {
      Domingo: 0,
      Lunes: 1,
      Martes: 2,
      Miércoles: 3,
      Jueves: 4,
      Viernes: 5,
      Sábado: 6,
    };
    const today = new Date();
    const targetDay = dayMap[dayOfWeek];
    const delta = (targetDay + 7 - today.getDay()) % 7;
    const nextDate = new Date(today);
    nextDate.setDate(today.getDate() + delta);
    return nextDate;
  }

  function to24Hour(hour: string, meridiem: string): number {
    const h = parseInt(hour, 10);
    return meridiem === "pm" && h !== 12
      ? h + 12
      : meridiem === "am" && h === 12
      ? 0
      : h;
  }

  const handleAddEvent = async () => {
    if (!isEventValid || !calendarId) return;
    setLoading(true);

    try {
      const baseDate = getNextDateForDay(eventData.dayOfWeek);

      const startDate = new Date(baseDate);
      startDate.setHours(
        to24Hour(eventData.startHour, eventData.startMeridiem),
        parseInt(eventData.startMinute),
        0
      );

      const endDate = new Date(baseDate);
      endDate.setHours(
        to24Hour(eventData.endHour, eventData.endMeridiem),
        parseInt(eventData.endMinute),
        0
      );

      if (endDate <= startDate) {
        alert("La hora de fin debe ser posterior a la hora de inicio.");
        setLoading(false);
        return;
      }

      const newEvent: RecurringEvent = {
        summary: eventData.summary.trim(),
        startDate: formatToCalendarDateTime(startDate.toISOString()),
        endDate: formatToCalendarDateTime(endDate.toISOString()),
        until: formatUntilToUTC(eventData.until),
      };

      await addRecurringEvent.mutateAsync({ calendarId, eventData: newEvent });
      setEventData(initialEventData);
      await refetch();
      if (onRefreshCalendar) onRefreshCalendar();
    } catch (error) {
      console.error("Error al agregar evento:", error);
      alert("No se pudo agregar el evento.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (eventId: string) => {
    setShowConfirmDeleteModal(false);
    setDeletionIsLoading(true);
    try {
      await deleteEvent.mutateAsync({ calendarId, eventId });
      await refetch();
      if (onRefreshCalendar) onRefreshCalendar();
    } catch (error) {
      console.error("Error al eliminar evento:", error);
      alert("No se pudo eliminar el evento.");
    } finally {
      setDeletionIsLoading(false);
      setEventIdSelected("");
    }
  };

  if (isLoading) return <>Cargando eventos...</>;

  return (
    <div className="flex flex-wrap gap-6">
      {/* Formulario */}
      <div className="flex-1 min-w-[320px] space-y-4 bg-calendar p-4 border border-gray-200 rounded-lg">
        <h3 className="text-2xl">Agrega asignatura</h3>

        <EventInputs eventData={eventData} setEventData={setEventData} />

        <button
          onClick={handleAddEvent}
          disabled={!isEventValid || loading}
          className="mt-2 bg-dark-cyan text-white px-4 py-2 rounded hover:bg-teal-700 transition disabled:opacity-50"
        >
          {loading ? "Agregando..." : "Agregar asignatura"}
        </button>
      </div>

      {/* Tabla de eventos */}
      <div className="flex-1 min-w-[320px] bg-calendar p-4 border border-gray-200 rounded-lg">
        <EventTable
          events={events.data.events}
          onDeleteRequest={(eventId) => {
            setEventIdSelected(eventId);
            setShowConfirmDeleteModal(true);
          }}
        />
      </div>

      {/* Modal de confirmación */}
      {showConfirmDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg space-y-4 max-w-md w-full">
            <h2 className="text-lg font-semibold">¿Eliminar asignatura?</h2>
            <p>Estás a punto de eliminar esta asignatura</p>
            <div className="flex justify-end gap-2">
              <Button
                text="Cancelar"
                variant="text"
                className="bg-gray-300 text-gray-800"
                onClick={() => setShowConfirmDeleteModal(false)}
              />
              <Button
                text="Confirmar"
                variant="text"
                onClick={() => handleDelete(eventIdSelected)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Modal de cargando */}
      {deletionIsLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center space-y-4">
            <div className="animate-spin h-10 w-10 border-4 border-dark-cyan border-t-transparent rounded-full"></div>
            <p className="text-xl font-semibold">Eliminando asignatura...</p>
          </div>
        </div>
      )}
    </div>
  );
}
