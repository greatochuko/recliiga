import { fetchApi } from "@/lib/utils";
import { EventDateType, EventType } from "@/types/events";

export type EventDataType = {
  leagueId: string;
  title: string;
  location: string;
  numTeams: number;
  rosterSpots: number;
  rsvpDeadline: number;
  startDate: EventDateType;
  eventDates: Date[];
};

export async function fetchEventsByUser() {
  const { data, error } = await fetchApi<EventType[]>("/event");
  return { data: data || [], error };
}

export async function fetchEventById(eventId: string) {
  const { data, error } = await fetchApi<EventType>(`/event/${eventId}`);
  return { data, error };
}

export async function createEvent(eventData: EventDataType) {
  const data = await fetchApi<EventType[]>("/event", {
    method: "POST",
    body: eventData,
  });
  return data;
}

export async function editEvent(eventId: string, eventData: EventDataType) {
  const data = await fetchApi<EventType[]>(`/event/${eventId}`, {
    method: "PATCH",
    body: eventData,
  });
  return data;
}
