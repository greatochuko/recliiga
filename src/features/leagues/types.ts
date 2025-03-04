
export interface League {
  id: string;
  name: string;
  sport?: string;
  leagueCode?: string;
  playerCount?: number;
  date?: string;
  status?: "joinable" | "member";
  image?: string;
  city?: string;
  rating?: number;
  is_private?: boolean;
  start_date?: string;
  owner_id?: string;
}

export interface LeagueData {
  name: string;
  date: string;
  players: number;
  totalGames: number;
  logo: string;
  leaderboardData: LeaderboardEntry[];
}

export interface LeaguesData {
  [key: string]: LeagueData;
}

export interface LeaderboardEntry {
  rank: number;
  name: string;
  gamesPlayed: number;
  win: number;
  loss: number;
  tie: number;
  captainWin: number;
  attendance: number;
  nonAttendance: number;
  points: number;
}

export interface ColumnExplanations {
  [key: string]: string;
}
