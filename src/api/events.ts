import { fetchApi } from "@/lib/utils";
import { EventType } from "@/types/events";

export type EventDataType = Omit<EventType, "id">;

export async function fetchEventsByUser() {
  const data = await fetchApi<EventType[]>("/event");
  return data;
}

export async function createEvent(eventData: EventDataType) {
  const data = await fetchApi<EventType[]>("/event", {
    method: "POST",
    body: eventData,
  });
  return data;
}
