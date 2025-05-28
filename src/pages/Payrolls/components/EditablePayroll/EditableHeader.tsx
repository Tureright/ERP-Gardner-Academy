// components/EditableDate.tsx
import React, { useState } from "react";

type EditableDateProps = {
  value: Date;
  type: "mes" | "fecha";
  onChange: (newDate: Date) => void;
};

export default function EditableDate({ value, type, onChange }: EditableDateProps) {
  const [isEditing, setIsEditing] = useState(false);



  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    const [year, monthOrDay] = newValue.split("-");

    if (type === "mes") {
      const newDate = new Date(Number(year), Number(monthOrDay) - 1);
      onChange(newDate);
    } else {
      const [_, day] = monthOrDay.split("-");
      const newDate = new Date(newValue);
      onChange(newDate);
    }

    setIsEditing(false);
  };

  return (
    <span className="ml-2">
      {isEditing ? (
        <input
          type={type === "mes" ? "month" : "date"}
          className="border px-2 py-1 rounded"
          value={
            type === "mes"
              ? `${value.getFullYear()}-${(value.getMonth() + 1).toString().padStart(2, "0")}`
              : `${value.getFullYear()}-${(value.getMonth() + 1)
                  .toString()
                  .padStart(2, "0")}-${value.getDate().toString().padStart(2, "0")}`
          }
          onChange={handleInputChange}
        />
      ) : (
        <button
          className="text-blue-600 underline text-sm ml-2"
          onClick={() => setIsEditing(true)}
        >
          editar
        </button>
      )}
    </span>
  );
}
