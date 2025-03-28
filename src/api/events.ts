import { fetchApi } from "@/lib/utils";
import { EventType } from "@/types/events";

export interface EventDateType {
  date: Date | undefined;
  startHour: string;
  startMinute: string;
  startAmPm: string;
  endHour: string;
  endMinute: string;
  endAmPm: string;
}

export interface EventDataType {
  leagueId: string;
  title: string;
  location: string;
  numTeams: number;
  rosterSpots: number;
  isRepeatingEvent: boolean;
  repeatFrequency?: string;
  repeatStartDate?: Date;
  repeatEndDate?: Date;
  rsvpDeadline: string;
  customRsvpHours: number;
  eventDates: EventDateType[];
}

export async function createEvent(eventData: EventDataType) {
  const data = await fetchApi<EventType[]>("/event", {
    method: "POST",
    body: eventData,
  });
  return data;
}
