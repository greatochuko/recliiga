import { fetchApi } from "@/lib/utils";
import { LeagueType } from "@/types/league";

export async function fetchLeaguesByUser(): Promise<{
  leagues: LeagueType[];
  error: string | null;
}> {
  try {
    const data = await fetchApi<LeagueType[]>("/league");
    return { leagues: data.data, error: null };
  } catch (err) {
    const error = err as Error;
    return { leagues: [], error: error.message };
  }
}

export type LeagueDataType = Omit<LeagueType, "id" | "owner_id" | "players">;

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
