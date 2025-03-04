
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
