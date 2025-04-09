import { fetchApi } from "@/lib/utils";
import { LeagueType } from "@/types/league";

export async function fetchLeaguesByUser(): Promise<{
  leagues: LeagueType[];
  error: string | null;
}> {
  const data = await fetchApi<LeagueType[]>("/league");
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
  const leagueDataBody = {
    ...leagueData,
    stats: leagueData.stats.map((stat) => ({
      name: stat.name,
      abbr: stat.abbr,
      points: stat.points,
    })),
  };
  const data = await fetchApi<LeagueType>("/league", {
    body: leagueDataBody,
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
