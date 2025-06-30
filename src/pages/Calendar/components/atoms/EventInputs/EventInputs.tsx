import React from "react";

type EventData = {
  summary: string;
  dayOfWeek: string;
  startHour: string;
  startMinute: string;
  startMeridiem: string;
  endHour: string;
  endMinute: string;
  endMeridiem: string;
  until: string;
};

type Props = {
  eventData: EventData;
  setEventData: (data: EventData) => void;
};

const days = [
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
  "Domingo",
];

const hours = Array.from({ length: 12 }, (_, i) =>
  String(i + 1).padStart(2, "0")
);
const minutes = Array.from({ length: 60 }, (_, i) =>
  String(i).padStart(2, "0")
);

export default function EventInputs({ eventData, setEventData }: Props) {
  const handleChange = (field: keyof EventData, value: string) => {
    setEventData({ ...eventData, [field]: value });
  };

  return (
    <div className="space-y-4">
      {/* Asignatura */}
      <div>
        <label className="block mb-1 font-medium">Asignatura *</label>
        <input
          type="text"
          value={eventData.summary}
          onChange={(e) => handleChange("summary", e.target.value)}
          className="w-full border p-2 rounded"
          placeholder="Ej. Matemáticas"
        />
      </div>

      {/* Día de la semana */}
      <div>
        <label className="block mb-1 font-medium">Día de la semana *</label>
        <select
          value={eventData.dayOfWeek}
          onChange={(e) => handleChange("dayOfWeek", e.target.value)}
          className="w-full border p-2 rounded"
        >
          {days.map((day) => (
            <option key={day} value={day}>
              {day}
            </option>
          ))}
        </select>
      </div>

      {/* Hora de inicio */}
      <div>
        <label className="block mb-1 font-medium">Hora de inicio *</label>
        <div className="flex gap-2">
          <select
            value={eventData.startHour}
            onChange={(e) => handleChange("startHour", e.target.value)}
            className="w-1/3 border p-2 rounded"
          >
            {hours.map((h) => (
              <option key={h} value={h}>
                {h}
              </option>
            ))}
          </select>
          <span className="text-xl font-medium">:</span>
          <select
            value={eventData.startMinute}
            onChange={(e) => handleChange("startMinute", e.target.value)}
            className="w-1/3 border p-2 rounded"
          >
            {minutes.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
          <select
            value={eventData.startMeridiem}
            onChange={(e) => handleChange("startMeridiem", e.target.value)}
            className="w-1/3 border p-2 rounded"
          >
            <option value="am">AM</option>
            <option value="pm">PM</option>
          </select>
        </div>
      </div>

      {/* Hora de fin */}
      <div>
        <label className="block mb-1 font-medium">Hora de fin *</label>
        <div className="flex gap-2">
          <select
            value={eventData.endHour}
            onChange={(e) => handleChange("endHour", e.target.value)}
            className="w-1/3 border p-2 rounded"
          >
            {hours.map((h) => (
              <option key={h} value={h}>
                {h}
              </option>
            ))}
          </select>
          <span className="text-xl font-medium">:</span>
          <select
            value={eventData.endMinute}
            onChange={(e) => handleChange("endMinute", e.target.value)}
            className="w-1/3 border p-2 rounded"
          >
            {minutes.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
          <select
            value={eventData.endMeridiem}
            onChange={(e) => handleChange("endMeridiem", e.target.value)}
            className="w-1/3 border p-2 rounded"
          >
            <option value="am">AM</option>
            <option value="pm">PM</option>
          </select>
        </div>
      </div>

      {/* Hasta cuándo se repite */}
      <div>
        <label className="block mb-1 font-medium">Repetir hasta *</label>
        <input
          type="date"
          value={eventData.until}
          onChange={(e) => handleChange("until", e.target.value)}
          className="w-full border p-2 rounded"
        />
      </div>
    </div>
  );
}
