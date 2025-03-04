
import { LeaguesData, ColumnExplanations } from '../types';

export const columnExplanations: ColumnExplanations = {
  'GP': 'Games Played',
  'W': 'Wins',
  'L': 'Losses',
  'T': 'Ties',
  'CW': 'Captain Wins',
  'ATT': 'Attendance',
  'N-ATT': 'Non-Attendance',
  'PTS': 'Total Points'
};

export const mockLeaguesData: LeaguesData = {
  'premier-league': {
    name: 'Premier League',
    date: 'Jan 2023 - Jun 2023',
    players: 32,
    totalGames: 48,
    logo: '/placeholder.svg?height=64&width=64',
    leaderboardData: [
      { rank: 1, name: 'John Smith', gamesPlayed: 10, win: 7, loss: 2, tie: 1, captainWin: 2, attendance: 10, nonAttendance: 0, points: 35 },
      { rank: 2, name: 'Emma Johnson', gamesPlayed: 10, win: 6, loss: 3, tie: 1, captainWin: 3, attendance: 9, nonAttendance: 1, points: 33 },
      { rank: 3, name: 'Michael Brown', gamesPlayed: 10, win: 6, loss: 2, tie: 2, captainWin: 1, attendance: 10, nonAttendance: 0, points: 31 },
      { rank: 4, name: 'Sarah Davis', gamesPlayed: 9, win: 6, loss: 2, tie: 1, captainWin: 0, attendance: 9, nonAttendance: 1, points: 26 },
      { rank: 5, name: 'David Wilson', gamesPlayed: 9, win: 5, loss: 3, tie: 1, captainWin: 1, attendance: 8, nonAttendance: 2, points: 25 },
      { rank: 6, name: 'Lisa Anderson', gamesPlayed: 8, win: 5, loss: 2, tie: 1, captainWin: 0, attendance: 8, nonAttendance: 2, points: 23 },
      { rank: 7, name: 'Robert Taylor', gamesPlayed: 8, win: 4, loss: 3, tie: 1, captainWin: 1, attendance: 7, nonAttendance: 3, points: 20 },
      { rank: 8, name: 'Jennifer Martin', gamesPlayed: 7, win: 3, loss: 3, tie: 1, captainWin: 0, attendance: 7, nonAttendance: 3, points: 16 },
    ]
  },
  'championship': {
    name: 'Championship',
    date: 'Feb 2023 - Jul 2023',
    players: 24,
    totalGames: 36,
    logo: '/placeholder.svg?height=64&width=64',
    leaderboardData: [
      { rank: 1, name: 'Alex Thompson', gamesPlayed: 8, win: 6, loss: 1, tie: 1, captainWin: 2, attendance: 8, nonAttendance: 0, points: 30 },
      { rank: 2, name: 'Jessica Lee', gamesPlayed: 8, win: 5, loss: 2, tie: 1, captainWin: 1, attendance: 8, nonAttendance: 0, points: 25 },
      { rank: 3, name: 'Kevin Clark', gamesPlayed: 8, win: 5, loss: 2, tie: 1, captainWin: 0, attendance: 7, nonAttendance: 1, points: 22 },
      { rank: 4, name: 'Emily White', gamesPlayed: 7, win: 4, loss: 2, tie: 1, captainWin: 1, attendance: 7, nonAttendance: 1, points: 21 },
      { rank: 5, name: 'Nathan Hill', gamesPlayed: 7, win: 4, loss: 3, tie: 0, captainWin: 0, attendance: 7, nonAttendance: 1, points: 19 },
      { rank: 6, name: 'Rachel Green', gamesPlayed: 7, win: 3, loss: 3, tie: 1, captainWin: 1, attendance: 6, nonAttendance: 2, points: 18 },
    ]
  },
  'league-one': {
    name: 'League One',
    date: 'Mar 2023 - Aug 2023',
    players: 18,
    totalGames: 24,
    logo: '/placeholder.svg?height=64&width=64',
    leaderboardData: [
      { rank: 1, name: 'Daniel Cooper', gamesPlayed: 6, win: 5, loss: 0, tie: 1, captainWin: 1, attendance: 6, nonAttendance: 0, points: 23 },
      { rank: 2, name: 'Olivia Adams', gamesPlayed: 6, win: 4, loss: 1, tie: 1, captainWin: 1, attendance: 6, nonAttendance: 0, points: 21 },
      { rank: 3, name: 'Matthew Turner', gamesPlayed: 6, win: 4, loss: 2, tie: 0, captainWin: 0, attendance: 5, nonAttendance: 1, points: 17 },
      { rank: 4, name: 'Sophia Lewis', gamesPlayed: 5, win: 3, loss: 1, tie: 1, captainWin: 0, attendance: 5, nonAttendance: 1, points: 16 },
    ]
  }
};
