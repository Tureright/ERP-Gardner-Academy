import { useState, useMemo } from "react";
import { useCalendars, useDeleteCalendar } from "@/hooks/useCalendar";
import Button from "@/components/molecules/Button";
import { useNavigate } from "react-router-dom";
import TableCalendars from "@/pages/Payrolls/components/atoms/TableCalendars/TableCalendars";
import { Plus } from "lucide-react";

export default function CalendarManager() {
  const navigate = useNavigate();

  const handleNewCalendar = () => {
    navigate("/calendar/addCalendar");
  };
  return (
    <div className="p-4 space-y-6 max-w-4xl mx-auto">
      <h1 className="text-[2.5rem] mb-4">Gestión de Horarios</h1>

      <>
        <div className="flex items-center justify-end gap-4">
          <Button
            text="Nuevo horario"
            icon={<Plus size={20} strokeWidth={2} />}
            variant="text-icon"
            onClick={handleNewCalendar}
          />
        </div>
      </>
      <div className="w-auto flex-1 rounded-sm border border-gray-300 shadow-sm p-4 ">
        <TableCalendars />
      </div>
    </div>
  );
}
