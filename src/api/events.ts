import { fetchApi } from "@/lib/utils";
import { EventType } from "@/types/events";

export async function fetchEventsByUser() {
  try {
    const data = await fetchApi<EventType[]>("/event");
    return { events: data.data, error: null };
  } catch (err) {
    const error = err as Error;
    return { events: [], error: error.message };
  }
}
