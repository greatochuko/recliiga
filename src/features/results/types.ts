
import { LeaderboardEntry, LeagueData, LeaguesData, ColumnExplanations } from '../leagues/types';
import { TeamData, Player, Team, Captain } from '../events/types';

export interface EventResult {
  id: string;
  eventId: string;
  team1Score: number;
  team2Score: number;
  winningTeam: 'team1' | 'team2' | 'tie';
  date: string;
}

export interface NotificationType {
  avatar: string;
  fallback: string;
  alt: string;
  message: string;
  time: string;
}

export type { LeaderboardEntry, LeagueData, LeaguesData, ColumnExplanations, TeamData, Player, Team, Captain };
