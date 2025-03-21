import { fetchApi } from "@/lib/utils";
import { LeagueType } from "@/types/league";

export type LeagueDataType = {
  name: string;
  sport: string;
  is_private: boolean;
  stats: {
    name: string;
    abbr: string;
    isEditing: boolean;
    points: number;
  }[];
};

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
