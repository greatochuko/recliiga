import { useState, useEffect } from 'react';
import { League, Event, Teammate, PlayerStats } from '@/types/dashboard';

// Mock API functions
async function fetchPlayerStats(leagueId: string): Promise<PlayerStats> {
  // Simulating different stats for different leagues
  const leagueStats: Record<string, PlayerStats> = {
    premier: {
      name: "John Doe",
      position: 8,
      totalTeams: 15,
      league: "Premier League",
      points: 15,
      wins: 4,
      losses: 2,
      ties: 2,
      record: { wins: 4, losses: 2, ties: 2 }
    },
    division1: {
      name: "John Doe",
      position: 3,
      totalTeams: 12,
      league: "Division 1",
      points: 22,
      wins: 7,
      losses: 1,
      ties: 1,
      record: { wins: 7, losses: 1, ties: 1 }
    },
    casual: {
      name: "John Doe",
      position: 1,
      totalTeams: 8,
      league: "Casual League",
      points: 18,
      wins: 6,
      losses: 0,
      ties: 0,
      record: { wins: 6, losses: 0, ties: 0 }
    }
  };
  return leagueStats[leagueId] || leagueStats.premier;
}

async function fetchTeammates(): Promise<Teammate[]> {
  return [
    { id: '1', name: 'John Smith', position: 'Midfielder', rating: 3 },
    { id: '2', name: 'Emma Johnson', position: 'Midfielder', rating: 3 },
    { id: '3', name: 'Michael Brown', position: 'Midfielder', rating: 3 },
    { id: '4', name: 'Sarah Davis', position: 'Midfielder', rating: 3 },
    { id: '5', name: 'David Wilson', position: 'Midfielder', rating: 3 },
    { id: '6', name: 'Lisa Anderson', position: 'Midfielder', rating: 3 },
    { id: '7', name: 'Robert Taylor', position: 'Midfielder', rating: 3 },
    { id: '8', name: 'Jennifer Martin', position: 'Midfielder', rating: 3 },
  ];
}

const leagueData = {
  leagues: [
    {
      id: "premier",
      name: "Premier League",
      rating: 0.8
    },
    {
      id: "division1",
      name: "Division 1",
      rating: 0.6
    },
    {
      id: "casual",
      name: "Casual League",
      rating: 0.3
    },
  ],
  async fetchUpcomingEvents(): Promise<Event[]> {
    return [
      {
        id: "1",
        date: '20-Aug-2025',
        time: '6:00 PM',
        location: 'Allianz Arena',
        team1: { name: 'Eagle Claws', avatar: '/placeholder.svg?height=64&width=64', color: '#272D31' },
        team2: { name: 'Ravens', avatar: '/placeholder.svg?height=64&width=64', color: '#FFC700' },
        rsvpDeadline: new Date('2025-08-19T18:00:00'),
        rsvp_deadline: new Date('2025-08-19T18:00:00'), // Include both for compatibility
        status: 'attending',
        league: 'Premier League',
        hasResults: false,
        spotsLeft: 2
      },
      {
        id: "2",
        date: '25-Aug-2025',
        time: '7:30 PM',
        location: 'Stamford Bridge',
        team1: { name: 'Blue Lions', avatar: '/placeholder.svg?height=64&width=64', color: '#034694' },
        team2: { name: 'Red Devils', avatar: '/placeholder.svg?height=64&width=64', color: '#DA291C' },
        rsvpDeadline: new Date('2025-08-24T19:30:00'),
        rsvp_deadline: new Date('2025-08-24T19:30:00'), // Include both for compatibility
        status: null,
        spotsLeft: 2,
        league: 'Championship',
        hasResults: false
      },
      {
        id: "3",
        date: '01-Sep-2025',
        time: '5:00 PM',
        location: 'Camp Nou',
        team1: { name: 'Catalonia FC', avatar: '/placeholder.svg?height=64&width=64', color: '#A50044' },
        team2: { name: 'White Angels', avatar: '/placeholder.svg?height=64&width=64', color: '#FFFFFF' },
        rsvpDeadline: new Date('2025-08-31T17:00:00'),
        rsvp_deadline: new Date('2025-08-31T17:00:00'), // Include both for compatibility
        status: null,
        spotsLeft: 1,
        league: 'La Liga',
        hasResults: false
      }
    ];
  },
};

export function useLeagueData() {
  const [leagues, setLeagues] = useState<League[]>(leagueData.leagues);
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);

  useEffect(() => {
    leagueData.fetchUpcomingEvents().then(events => setUpcomingEvents(events));
  }, []);

  return {
    leagues,
    upcomingEvents,
    fetchUpcomingEvents: leagueData.fetchUpcomingEvents
  };
}
