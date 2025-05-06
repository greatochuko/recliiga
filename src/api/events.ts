import { fetchApi } from "@/lib/utils";
import { EventType } from "@/types/events";

export type EventDataType = {
  leagueId: string;
  title: string;
  location: string;
  draftType: string;
  numTeams: number;
  rosterSpots: number;
  rsvpDeadline: number;
  startTime: Date;
  endTime: Date;
  eventDates: { startTime: Date; endTime: Date }[];
};

export async function fetchEventsByUser() {
  const { data, error } = await fetchApi<EventType[]>("/event");
  return { data: data || [], error };
}

export async function fetchEventsByCreator() {
  const { data, error } = await fetchApi<EventType[]>("/event?type=creator");
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
  const data = await fetchApi<EventType>(`/event/${eventId}`, {
    method: "PATCH",
    body: eventData,
  });
  return data;
}

export async function attendEvent(eventId: string) {
  const data = await fetchApi<EventType>(`/event/${eventId}/attend`, {
    method: "PATCH",
    body: {},
  });
  return data;
}

export async function declineEvent(eventId: string) {
  const data = await fetchApi<EventType>(`/event/${eventId}/decline`, {
    method: "PATCH",
    body: {},
  });
  return data;
}

export async function selectCaptains(eventId: string, captains: string[]) {
  const data = await fetchApi<EventType>(`/event/${eventId}/select-captain`, {
    method: "PATCH",
    body: { captains },
  });
  return data;
}

export async function deleteEvent(eventId: string) {
  const data = await fetchApi<EventType>(`/event/${eventId}`, {
    method: "DELETE",
    body: {},
  });
  return data;
}

type CreateResultDataType = {
  eventId: string;
  team1Score: number;
  team2Score: number;
  attendingPlayers: string[];
  leagueId: string;
};

export async function submitResult({
  eventId,
  team1Score,
  team2Score,
  attendingPlayers,
  leagueId,
}: CreateResultDataType) {
  const data = await fetchApi<EventType>(`/event/${eventId}/result`, {
    method: "POST",
    body: { team1Score, team2Score, attendingPlayers, leagueId },
  });
  return data;
}

type UpdateResultDataType = Omit<CreateResultDataType, "leagueId"> & {
  resultId: string;
};

export async function updateResult({
  eventId,
  team1Score,
  team2Score,
  attendingPlayers,
  resultId,
}: UpdateResultDataType) {
  const data = await fetchApi<EventType>(`/event/${eventId}/result`, {
    method: "PATCH",
    body: { team1Score, team2Score, attendingPlayers, resultId },
  });
  return data;
}

export async function rateTeammate(
  eventId: string,
  userId: string,
  score: number,
) {
  const data = await fetchApi<EventType>(`/event/${eventId}/rate-teammate`, {
    method: "POST",
    body: { userId, score },
  });
  return data;
}
