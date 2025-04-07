import { EventType } from "@/types/events";
import { clsx, type ClassValue } from "clsx";
import { isPast } from "date-fns";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function fetchApi<T>(
  subURL: string,
  options?: Omit<RequestInit, "body"> & { body: Record<string, any> },
): Promise<{ data: T; error: null } | { data: null; error: string }> {
  try {
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}${subURL}`, {
      ...options,
      credentials: "include",
      body: options?.body ? JSON.stringify(options.body) : undefined,
      headers: options
        ? { ...options.headers, "Content-Type": "application/json" }
        : undefined,
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error);
    }

    return { data: result.data, error: null };
  } catch (err) {
    const error = err as Error;
    // console.log(error.message);
    return { data: null, error: error.message };
  }
}

export function getUpcomingEvents(events: EventType[]) {
  return events.filter((event) => {
    const eventDate = new Date(event.startDate.date).setHours(
      event.startDate.startAmPm === "PM"
        ? event.startDate.startHour + 12
        : event.startDate.startHour,
      event.startDate.startMinute,
    );
    return !isPast(eventDate);
  });
}

export function getPastEvents(events: EventType[]) {
  return events.filter((event) => {
    const eventDate = new Date(event.startDate.date).setHours(
      event.startDate.startAmPm === "PM"
        ? event.startDate.startHour + 12
        : event.startDate.startHour,
      event.startDate.startMinute,
    );
    return isPast(eventDate);
  });
}
