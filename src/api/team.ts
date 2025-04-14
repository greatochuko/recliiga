import { fetchApi } from "@/lib/utils";
import { TeamType } from "@/types/events";

export async function updateTeam(teamId: string, teamData: TeamType) {
  const data = await fetchApi<TeamType>(`/team/${teamId}`, {
    method: "PATCH",
    body: teamData,
  });
  return data;
}
