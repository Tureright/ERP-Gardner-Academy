import { RecurringEventResponse } from "@/types";

export const formatToCalendarDateTime = (input: string): string => {
  const date = new Date(input);
  const offset = -5; // Ecuador
  const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);

  const yyyy = date.getFullYear();
  const MM = pad(date.getMonth() + 1);
  const dd = pad(date.getDate());
  const hh = pad(date.getHours());
  const mm = pad(date.getMinutes());
  const ss = "00";

  return `${yyyy}-${MM}-${dd}T${hh}:${mm}:${ss}-05:00`;
};

export const formatToReadableDate = (isoString: string): string => {
  const date = new Date(isoString);
  return date.toLocaleString("es-EC", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "America/Guayaquil",
  });
};

export const formatUntilToUTC = (input: string): string => {
  const date = new Date(input);
  const yyyy = date.getUTCFullYear();
  const MM = String(date.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(date.getUTCDate()).padStart(2, "0");
  const hh = String(date.getUTCHours()).padStart(2, "0");
  const mm = String(date.getUTCMinutes()).padStart(2, "0");
  const ss = String(date.getUTCSeconds()).padStart(2, "0");

  return `${yyyy}${MM}${dd}T${hh}${mm}${ss}Z`;
};

export function getFormattedDayAndTime(isoString: string): { day: string; time: string } {
  const date = new Date(isoString);

  const day = capitalize(
    date.toLocaleDateString("es-EC", {
      weekday: "long",
      timeZone: "America/Guayaquil",
    })
  );

  const time = date.toLocaleTimeString("es-EC", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: "America/Guayaquil",
  });

  return { day, time };
}

function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}



export function getUniqueRecurringEvents(events: RecurringEventResponse[]) {
  const seen = new Map<string, RecurringEventResponse>();

  for (const event of events) {
    const baseId = event.id?.split("_")[0] || event.id;

    if (!seen.has(baseId)) {
      seen.set(baseId, event);
    }
  }

  return Array.from(seen.values());
}
