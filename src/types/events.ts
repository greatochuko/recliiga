import { UserType } from "@/contexts/AuthContext";
import { LeagueType } from "./league";

export interface TeamType {
  id: string;
  name: string;
  logo: string;
  color: string;
  captainId: string;
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
  ratings: UserRatingType[];
  rosterSpots: number;
  startTime: Date;
  endTime: Date;
  rsvpDeadline: number;
  teams: TeamType[];
  creatorId: string;
  draftType: "alternating" | "snake";
  resultsEntered: boolean;
  players: UserType[];
  result?: ResultType;
}

export type ResultType = {
  id: string;
  team1Score: number;
  team2Score: number;
  leagueId: string;
  league: LeagueType;
  attendingPlayers: UserType[];
  events: EventType[];
};

export type LeaderboardDataType = {
  player: UserType;
  gamesPlayed: number;
  gamesWon: number;
  gamesLost: number;
  gamesTied: number;
  gamesWonAsCaptain: number;
  attendance: number;
  nonAttendance: number;
  points: number;
};

export type UserRatingType = {
  id: string;
  score: number;
  createdAt: string;
  userId: string;
  ratedById: string;
  eventId: string;
};
