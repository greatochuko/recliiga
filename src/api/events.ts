import { fetchApi } from "@/lib/utils";
import { EventType } from "@/types/events";

export type EventDataType = Omit<EventType, "id" | "teams" | "creatorId"> & {
  eventDates: Date[];
};

export async function fetchEventsByUser() {
  const { data, error } = await fetchApi<EventType[]>("/event");
  return { data: data || [], error };
}

export async function createEvent(eventData: EventDataType) {
  const data = await fetchApi<EventType[]>("/event", {
    method: "POST",
    body: eventData,
  });
  return data;
}
