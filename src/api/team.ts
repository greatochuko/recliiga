import { fetchApi } from "@/lib/utils";
import { TeamType } from "@/types/events";

export async function updateTeam(teamId: string, teamData: TeamType) {
  const data = await fetchApi<TeamType>(`/team/${teamId}`, {
    method: "PATCH",
    body: teamData,
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
