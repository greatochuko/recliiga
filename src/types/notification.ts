import { UserType } from "@/contexts/AuthContext";
import { LeagueType } from "./league";

export type NotificationType = {
  id: string;
  type: "LEAGUE_REQUEST" | "JOIN_LEAGUE";
  isRead: boolean;
  initiator: UserType;
  league: LeagueType;
};
