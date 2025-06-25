// components/EditableDates.tsx
import { useState } from "react";

type EditableDatesProps = {
  label: string;
  value: Date;
  onChange: (newDate: Date) => void;
  type: "monthYear" | "fullDate";
};

const formatMonthYear = (date: Date) => {
  return date.toLocaleString("es-EC", {
    month: "long",
    year: "numeric",
  });
};

const formatDateDDMMYYYY = (date: Date) => {
  return date.toLocaleDateString("es-EC", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

export default function EditableDates({ label, value, onChange, type }: EditableDatesProps) {
  const [isEditing, setIsEditing] = useState(false);

  // Inicializamos el valor temporal basado en el tipo de input
const initialValue =
  type === "monthYear"
    ? `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, "0")}`
    : `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, "0")}-${String(value.getDate()).padStart(2, "0")}`;


  const [tempDate, setTempDate] = useState<string>(initialValue);

  const handleSave = () => {
    if (type === "monthYear") {
      const [year, month] = tempDate.split("-");
      const newDate = new Date(parseInt(year), parseInt(month) - 1, 1);
      onChange(newDate);
    } else {
      onChange(new Date(tempDate));
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempDate(initialValue);
    setIsEditing(false);
  };

  const displayValue = type === "monthYear" ? formatMonthYear(value) : formatDateDDMMYYYY(value);

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
          <p>{displayValue}</p>
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
