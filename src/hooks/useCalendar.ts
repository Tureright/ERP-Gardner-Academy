import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  listCalendars,
  createCalendar,
  addRecurringEvent,
  deleteCalendar,
  getEvents,
  deleteEvent,
  getCalendarById,
  sendCalendarToEmployee,
} from "../services/calendarService";

export function useCalendars() {
  return useQuery({ queryKey: ["calendars"], queryFn: listCalendars });
}

export function useGetCalendarById(calendarId: string) {
  return useQuery({
    queryKey: ["calendar", calendarId],
    queryFn: () => getCalendarById(calendarId),
    enabled: !!calendarId,
  });
}

export function useGetEvents(calendarId: string) {
  return useQuery({
    queryKey: ["events", calendarId],
    queryFn: () => getEvents(calendarId),
    enabled: !!calendarId,
  });
}

export function useCreateCalendar() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      summary,
      description,
    }: {
      summary: string;
      description: string;
    }) => createCalendar(summary, description),

    onMutate: async ({ summary, description }) => {
      await queryClient.cancelQueries({ queryKey: ["calendars"] });

      const previousCalendars = queryClient.getQueryData(["calendars"]);

      queryClient.setQueryData(["calendars"], (old: any) => ({
        ...old,
        data: [
          ...(old?.data.calendars || []),
          {
            id: Date.now(), // ID temporal
            summary,
            description,
          },
        ],
      }));

      return { previousCalendars };
    },

    onError: (error, newCalendar, context) => {
      queryClient.setQueryData(["calendars"], context?.previousCalendars);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["calendars"] });
    },
  });
}

export function useAddRecurringEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      calendarId,
      eventData,
    }: {
      calendarId: string;
      eventData: any;
    }) => addRecurringEvent(calendarId, eventData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["calendars"] });
    },
  });
}

export function useDeleteCalendar() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (calendarId: string) => deleteCalendar(calendarId),
    onMutate: async (calendarId: string) => {
      await queryClient.cancelQueries({ queryKey: ["calendars"] });

      const previousCalendars = queryClient.getQueryData(["calendars"]);
      queryClient.setQueryData(["calendars"], (old: any) => {
        const calendars = old?.data?.calendars ?? [];

        return {
          ...old,
          data: {
            ...old?.data,
            calendars: calendars.filter((cal: any) => cal.id !== calendarId),
          },
        };
      });

      return { previousCalendars };
    },
    onError: (err, _, context) => {
      queryClient.setQueryData(["calendars"], context?.previousCalendars);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["calendars"] });
    },
  });
}

export function useDeleteEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      calendarId,
      eventId,
    }: {
      calendarId: string;
      eventId: string;
    }) => deleteEvent(calendarId, eventId),
    onMutate: async ({
      calendarId,
      eventId,
    }: {
      calendarId: string;
      eventId: string;
    }) => {
      await queryClient.cancelQueries({ queryKey: ["events", calendarId] });

      const previousEvents = queryClient.getQueryData(["events", calendarId]);
      queryClient.setQueryData(["events", calendarId], (old: any) => {
        if (!old?.events) return old;

        return {
          ...old,
          events: old.events.filter((ev: any) => ev.id !== eventId),
        };
      });

      return { previousEvents };
    },
    onError: (_err, vars, context) => {
      if (context?.previousEvents) {
        queryClient.setQueryData(
          ["events", vars.calendarId],
          context.previousEvents
        );
      }
    },
    onSettled: (_data, _error, vars) => {
      queryClient.invalidateQueries({ queryKey: ["events", vars.calendarId] });
    },
  });
}

export function useSendCalendarToEmployee() {
  return useMutation({
    mutationFn: ({ to, calendarId }: { to: string; calendarId: string }) =>
      sendCalendarToEmployee(to, calendarId),
    onSuccess: () => {},
    onError: (error) => {
      console.error("Error al enviar el correo:", error);
    },
  });
}
