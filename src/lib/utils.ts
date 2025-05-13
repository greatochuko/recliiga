import {
  EventType,
  LeaderboardDataType,
  ResultType,
  UserRatingType,
} from "@/types/events";
import { LeagueType } from "@/types/league";
import { clsx, type ClassValue } from "clsx";
import { format, isPast, isToday, isYesterday } from "date-fns";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function fetchApi<T>(
  subURL: string,
  options?: Omit<RequestInit, "body"> & { body: Record<string, any> },
): Promise<
  | { data: T; error: null; token: string }
  | { data: null; error: string; token: null }
> {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}${subURL}`, {
      ...options,
      credentials: "include",

      body: options?.body ? JSON.stringify(options.body) : undefined,
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : undefined,
        ...(options?.headers || {}),
      },
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error);
    }

    return { data: result.data, error: null, token: result.token };
  } catch (err) {
    const error = err as Error;
    return { data: null, error: error.message, token: null };
  }
}

export function getUpcomingEvents(events: EventType[]) {
  return events
    .filter((event) => !isPast(event.startTime))
    .sort(
      (a, b) =>
        new Date(a.startTime).getTime() - new Date(b.startTime).getTime(),
    );
}

export function getPastEvents(events: EventType[]) {
  return events
    .filter((event) => isPast(event.startTime))
    .sort(
      (a, b) =>
        new Date(b.startTime).getTime() - new Date(a.startTime).getTime(),
    );
}

export function getDateIncrement(freq: string): number {
  switch (freq) {
    case "daily":
      return 1;
    case "weekly":
      return 7;
    case "bi-weekly":
      return 14;
    case "monthly":
      return 30; // Optional: customize for actual calendar months
    default:
      return 0;
  }
}

export function getLeaderBoardData(league: LeagueType, results: ResultType[]) {
  const leaderboardData: LeaderboardDataType[] = league.players.map(
    (player) => {
      const gamesPlayed = league.events.filter(
        (event) =>
          event.resultsEntered &&
          event.players.some((pl) => pl.id === player.id),
      ).length;

      const attendance = results.filter((result) =>
        result.attendingPlayers.some((pl) => pl.id === player.id),
      ).length;

      // const nonAttendance = 0;

      const nonAttendance = results.filter(
        (result) =>
          result.events.some((event) =>
            event.players.some((pl) => pl.id === player.id),
          ) && !result.attendingPlayers.some((pl) => pl.id === player.id),
      ).length;

      let gamesWon = 0;
      let gamesLost = 0;
      let gamesWonAsCaptain = 0;

      results.forEach((result) => {
        const attended = result.attendingPlayers.some(
          (pl) => pl.id === player.id,
        );
        if (!attended) return;

        const isTeam1 = result.events.some(
          (event) =>
            event.teams[0].players.some((pl) => pl.id === player.id) ||
            event.teams[0].captainId === player.id,
        );
        const isTeam2 = result.events.some(
          (event) =>
            event.teams[1].players.some((pl) => pl.id === player.id) ||
            event.teams[1].captainId === player.id,
        );

        if (isTeam1 || isTeam2) {
          const teamScore = isTeam1 ? result.team1Score : result.team2Score;
          const opponentScore = isTeam1 ? result.team2Score : result.team1Score;

          if (teamScore > opponentScore) gamesWon++;
          else if (teamScore < opponentScore) gamesLost++;

          const wasCaptain = result.events.some(
            (event) =>
              (event.teams[0].captain.id === player.id &&
                teamScore > opponentScore &&
                isTeam1) ||
              (event.teams[1].captain.id === player.id &&
                teamScore > opponentScore &&
                isTeam2),
          );
          if (wasCaptain) gamesWonAsCaptain++;
        }
      });

      const gamesTied = gamesPlayed - gamesWon - gamesLost;

      const points =
        gamesWon * league.stats.find((stat) => stat.name === "Win").points +
        gamesTied * league.stats.find((stat) => stat.name === "Tie").points +
        gamesWonAsCaptain *
          league.stats.find((stat) => stat.name === "Captain Win").points +
        attendance *
          league.stats.find((stat) => stat.name === "Attendance").points +
        nonAttendance *
          league.stats.find((stat) => stat.name === "Non-Attendance").points;

      return {
        player,
        gamesPlayed,
        gamesWon,
        gamesLost,
        gamesTied,
        gamesWonAsCaptain,
        attendance,
        nonAttendance,
        points,
      };
    },
  );

  return leaderboardData;
}

export function getCardinalSuffix(n: number): string {
  const remainder10 = n % 10;
  const remainder100 = n % 100;

  if (remainder100 >= 11 && remainder100 <= 13) {
    return "th";
  }

  switch (remainder10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
}

export function getUnratedTeammates(event: EventType, userId: string) {
  const eventTeam = event.teams.find(
    (team) =>
      team.captainId === userId ||
      team.players.some((player) => player.id === userId),
  );

  return [...eventTeam.players, eventTeam.captain].filter(
    (user) =>
      user.id !== userId &&
      !event.ratings.some(
        (rating) => rating.userId === user.id && rating.ratedById === userId,
      ),
  );
}

export function getUserRating(leagueId: string, userRatings: UserRatingType[]) {
  const filteredRatings = (userRatings || []).filter(
    (rating) => (rating.leagueId || rating.event.leagueId) === leagueId,
  );

  return filteredRatings.length > 0
    ? filteredRatings.reduce((acc, curr) => acc + curr.score, 0) /
        filteredRatings.length
    : 0;
}

export function handleImageResize(
  file: File,
  maxWidth = 256,
): Promise<{ dataUrl: string; resizedFile: File }> {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith("image/")) {
      return reject(new Error("Please upload a valid image file."));
    }

    const reader = new FileReader();
    reader.onload = function (e) {
      const img = new Image();
      img.onload = function () {
        const scale = Math.min(1, maxWidth / img.width);
        const canvas = document.createElement("canvas");
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        canvas.toBlob((blob) => {
          if (!blob) return reject(new Error("Image compression failed."));
          const resizedFile = new File([blob], file.name, { type: file.type });
          const dataUrl = canvas.toDataURL(file.type);
          resolve({ dataUrl, resizedFile });
        }, file.type);
      };
      img.onerror = () => reject(new Error("Failed to load image."));
      if (typeof e.target.result === "string") {
        img.src = e.target.result;
      } else {
        reject(new Error("Failed to read file as a string."));
      }
    };
    reader.onerror = () => reject(new Error("Failed to read file."));
    reader.readAsDataURL(file);
  });
}

export function getInitials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

export function formatMessageTime(time: string | Date) {
  const date = new Date(time);

  if (isToday(date)) {
    return format(date, "p"); // e.g., "1:45 PM"
  }

  if (isYesterday(date)) {
    return "Yesterday";
  }

  return format(date, "dd/MM/yy"); // e.g., "12/10/24"
}
