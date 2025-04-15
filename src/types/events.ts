import { UserType } from "@/contexts/AuthContext";
import { LeagueType } from "./league";

export interface TeamType {
  id: string;
  name: string;
  logo: string;
  color: string;
  captain?: UserType;
  players: UserType[];
  draftCompleted: boolean;
}

export interface Captain {
  id: string;
  name: string;
  avatar: string;
}

export type EventTimeDataType = {
  date: Date;
  hour: number;
  minute: number;
  meridiem: "AM" | "PM";
};

export interface EventType {
  id: string;
  leagueId: string;
  league: LeagueType;
  title: string;
  location: string;
  numTeams: number;
  rosterSpots: number;
  startTime: Date;
  endTime: Date;
  rsvpDeadline: number;
  teams: TeamType[];
  creatorId: string;
  resultsEntered: boolean;
  players: UserType[];
}
