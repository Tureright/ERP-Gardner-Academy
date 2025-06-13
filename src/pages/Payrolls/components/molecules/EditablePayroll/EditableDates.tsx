// components/EditableDates.tsx
import { useState } from "react";
import { mathUtils } from "@/utils/math";

type EditableDatesProps = {
  label: string;
  value: string; // ISO string
  onChange: (newDate: Date) => void;
  type: "monthYear" | "fullDate";
};

export default function EditableDates({
  label,
  value,
  onChange,
  type,
}: EditableDatesProps) {
  const [isEditing, setIsEditing] = useState(false);

  // Parseamos el string a Date y validamos
  
  const parsedDate = new Date(value);
  const isValidDate = !isNaN(parsedDate.getTime());

  // Función para generar el valor del input según tipo
  const getInputValue = () => {
    if (!isValidDate) return "";

    const year = parsedDate.getFullYear();
    const month = String(parsedDate.getMonth() + 1).padStart(2, "0");
    const day = String(parsedDate.getDate()).padStart(2, "0");
    const hours = String(parsedDate.getHours()).padStart(2, "0");
    const minutes = String(parsedDate.getMinutes()).padStart(2, "0");

    return type === "monthYear"
      ? `${year}-${month}`
      : `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const [tempDate, setTempDate] = useState<string>(getInputValue());

  const handleSave = () => {
    if (!tempDate) return;

    let localDate: Date;

    if (type === "monthYear") {
      const [year, month] = tempDate.split("-");
      localDate = new Date(parseInt(year), parseInt(month) - 1, 1, 0, 0);
      console.log("Fecha de mes y año:", localDate);
    } else {
      localDate = new Date(tempDate);
      console.log("Fecha completa:", localDate);
    }

    if (!isNaN(localDate.getTime())) {
      onChange(localDate);
    }

    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempDate(getInputValue());
    setIsEditing(false);
  };

  const getDisplayValue = () => {
    if (!isValidDate) return "Fecha inválida";

    return type === "monthYear"
      ? mathUtils.formatMonthYear(parsedDate)
      : mathUtils.formatDateDDMMYYYY(parsedDate);
  };

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <p className="font-bold">{label}</p>
      {isEditing ? (
        <>
          <input
            type={type === "monthYear" ? "month" : "datetime-local"}
            className="border p-1 rounded text-sm"
            value={tempDate}
            onChange={(e) => setTempDate(e.target.value)}
          />
          <button
            onClick={handleSave}
            className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded text-sm"
          >
            Guardar
          </button>
          <button
            onClick={handleCancel}
            className="bg-gray-300 hover:bg-gray-400 text-black px-2 py-1 rounded text-sm"
          >
            Cancelar
          </button>
        </>
      ) : (
        <>
          <p>{getDisplayValue()}</p>
          <button
            onClick={() => setIsEditing(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-sm"
          >
            Editar
          </button>
        </>
      )}
    </div>
  );
}
