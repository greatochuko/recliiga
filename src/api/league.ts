import { fetchApi } from "@/lib/utils";
import { ResultType } from "@/types/events";
import { LeagueType } from "@/types/league";

export async function fetchLeaguesByUser(): Promise<{
  leagues: LeagueType[];
  error: string | null;
}> {
  const data = await fetchApi<LeagueType[]>("/league");
  return { leagues: data.data || [], error: data.error };
}

export async function fetchLeaguesByCode(leagueCode: string): Promise<{
  league: LeagueType;
  error: string | null;
}> {
  const data = await fetchApi<LeagueType>(`/league/code/${leagueCode}`);
  return { league: data.data, error: data.error };
}

export async function fetchLeaguesByCreator(): Promise<{
  leagues: LeagueType[];
  error: string | null;
}> {
  const data = await fetchApi<LeagueType[]>("/league?type=creator");
  return { leagues: data.data || [], error: data.error };
}

export async function fetchLeagueById(leagueId: string): Promise<{
  league: LeagueType | null;
  error: string | null;
}> {
  try {
    const data = await fetchApi<LeagueType | null>(`/league/${leagueId}`);
    if (!data.data) throw new Error(data.error);

    return { league: data.data, error: null };
  } catch (err) {
    const error = err as Error;
    return { league: null, error: error.message };
  }
}

export type LeagueDataType = Omit<
  LeagueType,
  "id" | "owner_id" | "players" | "leagueCode"
>;

export async function createLeague(leagueData: LeagueDataType) {
  const data = await fetchApi<LeagueType>("/league", {
    body: leagueData,
    method: "POST",
  });
  return data;
}

export async function joinLeague(leagueCode: string) {
  const data = await fetchApi("/league/join", {
    method: "POST",
    body: { leagueCode },
  });

  return data;
}

export async function acceptLeagueRequest(
  notificationId: string,
  playerId: string,
  leagueId: string,
) {
  const data = await fetchApi(`/league/${leagueId}/accept`, {
    method: "POST",
    body: { playerId, notificationId },
  });

  return data;
}

export async function declineLeagueRequest(
  notificationId: string,
  playerId: string,
  leagueId: string,
) {
  const data = await fetchApi(`/league/${leagueId}/decline`, {
    method: "POST",
    body: { playerId, notificationId },
  });

  return data;
}

export async function fetchResultsByLeague(leagueId: string) {
  if (!leagueId) {
    return { data: [], error: "Invalid league ID" };
  }
  const data = await fetchApi<ResultType[]>(`/league/${leagueId}/results`);
  return { data: data.data || [], error: data.error };
}
