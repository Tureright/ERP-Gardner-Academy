import React, { useState } from "react";
import Button from "@/components/molecules/Button";
import { useSendCalendarToEmployee } from "@/hooks/useCalendar";
import { EmployeeResponse } from "@/types";
import { Loader2 } from "lucide-react"; // ícono para animación de carga

type Props = {
  employee: EmployeeResponse;
  calendarId: string;
  onChange?: (showShareModal: boolean) => void;
};

export default function ShareCalendar({ employee, calendarId, onChange }: Props) {
  const sendCalendar = useSendCalendarToEmployee();
  const [internalLoading, setInternalLoading] = useState(false);

  const handleAceptar = () => {
    setInternalLoading(true);
    sendCalendar.mutate(
      { to: employee.institutionalEmail, calendarId },
      {
        onSuccess: () => {
          setInternalLoading(false);
          onChange?.(false);
        },
        onError: (err) => {
          alert("Error al enviar el correo");
          console.error(err);
          setInternalLoading(false);
        },
      }
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-lg space-y-4 max-w-md w-full">
        <h2 className="text-lg font-semibold">Compartir horario</h2>
        <p>Se enviará un correo con la información del horario al siguiente correo:</p>
        <strong>{employee.institutionalEmail}</strong>

        <div className="flex flex-row gap-2 justify-end pt-4">
          <Button
            text="Cancelar"
            onClick={() => onChange?.(false)}
            className="bg-gray-200"
            disabled={internalLoading}
          />
          <Button
            onClick={handleAceptar}
            className="bg-dark-cyan text-white flex items-center gap-2"
            disabled={internalLoading}
            variant="text-icon"
            text={
              internalLoading ? (
                "Enviando..."
              ) : (
                "Aceptar"
              )
            }
            icon= {internalLoading ? <Loader2 className="animate-spin w-4 h-4" /> : ""}
          />
        </div>
      </div>
    </div>
  );
}
