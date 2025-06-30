import React from "react";
import { Trash, CalendarDays, Clock } from "lucide-react";
import {
  getUniqueRecurringEvents,
  getFormattedDayAndTime,
} from "@/utils/calendar";
import { RecurringEventResponse } from "@/types";

type Props = {
  events: RecurringEventResponse[];
  onDeleteRequest: (eventId: string) => void;
};

export default function EventTable({ events, onDeleteRequest }: Props) {
  const uniqueEvents = getUniqueRecurringEvents(events);

  if (uniqueEvents.length === 0) {
    return (
      <p className="text-sm text-center text-gray-500">
        No hay eventos registrados aún.
      </p>
    );
  }

  return (
    <table className="w-full border border-gray-300 table-auto">
      <thead className="bg-gray-100">
        <tr>
          <th className="p-2 text-left text-sm font-semibold">Asignatura</th>
          <th className="p-2 text-left text-sm font-semibold">Inicio</th>
          <th className="p-2 text-left text-sm font-semibold">Fin</th>
          <th className="p-2 text-center text-sm font-semibold">Acción</th>
        </tr>
      </thead>
      <tbody>
        {uniqueEvents.map((event, index) => {
          const start = getFormattedDayAndTime(event.startDate);
          const end = getFormattedDayAndTime(event.endDate);

          return (
            <tr key={index} className="border-t border-gray-300 hover:bg-gray-50">
              <td className="p-2 text-sm">{event.summary}</td>
              <td className="p-2 text-sm">
                <div className="flex items-center gap-1 text-gray-700">
                  <CalendarDays size={14} className="text-dark-cyan" />
                  <span>{start.day}</span>
                </div>
                <div className="flex items-center gap-1 text-gray-600 text-xs mt-1">
                  <Clock size={14} className="text-dark-cyan" />
                  <span>{start.time}</span>
                </div>
              </td>
              <td className="p-2 text-sm">
                <div className="flex items-center gap-1 text-gray-700">
                  <CalendarDays size={14} className="text-dark-cyan" />
                  <span>{end.day}</span>
                </div>
                <div className="flex items-center gap-1 text-gray-600 text-xs mt-1">
                  <Clock size={14} className="text-dark-cyan" />
                  <span>{end.time}</span>
                </div>
              </td>
              <td className="p-2 text-center">
                <button
                  onClick={() => onDeleteRequest(event.id)}
                  className="text-red-600 hover:text-red-800 transition-colors"
                  aria-label="Eliminar asignatura"
                >
                  <Trash size={18} />
                </button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
