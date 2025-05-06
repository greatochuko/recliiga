import { fetchApi } from "@/lib/utils";
import { TeamType } from "@/types/events";

export async function updateTeam(
  teamId: string,
  teamData: Omit<TeamType, "logo"> & { logo?: string },
  otherTeamId: string,
) {
  const data = await fetchApi<TeamType>(`/team/${teamId}`, {
    method: "PATCH",
    body: { ...teamData, otherTeamId },
  });
  return data;
}

export async function draftPlayer({
  teamId,
  playerId,
  eventId,
}: {
  teamId: string;
  playerId: string;
  eventId: string;
}) {
  const data = await fetchApi<TeamType>(`/team/${teamId}/draft`, {
    method: "POST",
    body: { playerId, eventId },
  });
  return data;
}

export async function confirmRoster(teamId: string) {
  const data = await fetchApi<TeamType>(`/team/${teamId}/confirmRoster`, {
    method: "POST",
    body: {},
  });
  return data;
}
