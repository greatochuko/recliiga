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
  return events.filter((event) => !isPast(event.startTime));
}

export function getPastEvents(events: EventType[]) {
  return events.filter((event) => isPast(event.startTime));
}

export function getDateIncrement(freq: string): number {
  switch (freq) {
    case "daily":
      return 1;
    case "weekly":
      return 7;
    case "bi-weekly":
      return 14;
    case "monthly":
      return 30; // Optional: customize for actual calendar months
    default:
      return 0;
  }
}
