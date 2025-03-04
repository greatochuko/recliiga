
export interface Player {
  id: number
  name: string
  avatar: string
  position: string
}

export interface Captain {
  name: string
  avatar: string
  position: string
}

export interface Team {
  name: string
  avatar: string
  color: string
  captain: Captain
  players: Player[]
}

export interface TeamData {
  team1: Team
  team2: Team
}

export interface Event {
  date: string
  time: string
  location: string
  league: string
}

// Add missing types for the league data
export interface LeaderboardEntry {
  rank: number
  name: string
  gamesPlayed: number
  win: number
  loss: number
  tie: number
  captainWin: number
  attendance: number
  nonAttendance: number
  points: number
}

export interface LeagueData {
  name: string
  date: string
  players: number
  totalGames: number
  logo: string
  leaderboardData: LeaderboardEntry[]
}

export interface LeaguesData {
  [key: string]: LeagueData
}

export interface ColumnExplanations {
  [key: string]: string
}

export interface NotificationType {
  avatar: string
  fallback: string
  alt: string
  message: string
  time: string
}
