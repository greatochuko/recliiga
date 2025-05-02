import { UserType } from "@/contexts/AuthContext";
import { LeagueType } from "./league";
import { EventType, TeamType } from "./events";

export type NotificationType = {
  id: string;
  type:
    | "LEAGUE_REQUEST"
    | "JOIN_LEAGUE"
    | "PLAYER_DRAFTED"
    | "RESULT_READY"
    | "RATE_TEAMMATES"
    | "SELECT_CAPTAIN";
  isRead: boolean;
  scheduleTime: string;
  initiator: UserType;
  leagueId: string;
  league: LeagueType;
  eventId: string;
  event: EventType;
  teamId: string;
  team: TeamType;
};
