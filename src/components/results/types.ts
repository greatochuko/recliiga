
export type PlayerData = {
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
};

export type LeagueData = {
  name: string;
  date: string;
  players: number;
  totalGames: number;
  logo: string;
  leaderboardData: PlayerData[];
};

export type LeaguesData = {
  [key: string]: LeagueData;
};

export type ColumnExplanations = {
  [key: string]: string;
};

export type NotificationType = {
  avatar: string;
  fallback: string;
  alt: string;
  message: string;
  time: string;
};
