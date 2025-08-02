import { handleResponse, defaultPostOpts } from "@/utils/api";

const API_URL_CAL =
  "INSERT_API_URL"; 

// --- DO GET ---
export async function listCalendars() {
  const res = await fetch(`${API_URL_CAL}?action=listCalendars`);
  return handleResponse(res);
}

export async function getCalendarById(calendarId: string) {
  const res = await fetch(
    `${API_URL_CAL}?action=getCalendarById&calendarId=${calendarId}`
  );
  return handleResponse(res);
}

export async function getEvents(calendarId: string) {
  const res = await fetch(
    `${API_URL_CAL}?action=getAllEvents&calendarId=${calendarId}`
  );
  return handleResponse(res);
}

export async function getGoogleEvents(calendarId: string) {
  const res = await fetch(
    `${API_URL_CAL}?action=listEvents&calendarId=${calendarId}`
  );
  return handleResponse(res);
}

// --- DO POST ---
export async function createCalendar(summary: string, description: string) {
  const res = await fetch(
    API_URL_CAL,
    defaultPostOpts({
      action: "createCalendar",
      summary,
      description,
    })
  );
  return handleResponse(res);
}

export async function addRecurringEvent(calendarId: string, eventData: any) {
  const res = await fetch(
    API_URL_CAL,
    defaultPostOpts({
      action: "addRecurringEvent",
      calendarId,
      eventData,
    })
  );
  return handleResponse(res);
}

export async function deleteCalendar(calendarId: string) {
  const res = await fetch(
    API_URL_CAL,
    defaultPostOpts({
      action: "deleteCalendar",
      calendarId,
    })
  );
  return handleResponse(res);
}

export async function deleteEvent(calendarId: string, eventId: string) {
  const res = await fetch(
    API_URL_CAL,
    defaultPostOpts({
      action: "deleteEvent",
      calendarId,
      eventId,
    })
  );
  return handleResponse(res);
}

export async function sendCalendarToEmployee(to: string, calendarId: string) {
  const res = await fetch(
    API_URL_CAL,
    defaultPostOpts({
      action: "sendCalendarToEmployee",
      to: to,
      calendarId: calendarId,
    })
  );
  return handleResponse(res);
}
