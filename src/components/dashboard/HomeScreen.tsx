import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import { Star, User, Calendar, MapPin, Edit } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StarRating } from './StarRating';
import { PlayerStats } from './PlayerStats';
import { EventCard } from './EventCard';
import { useState } from 'react';

interface League {
  id: string;
  name: string;
  rating: number;
}

interface Teammate {
  id: string;
  name: string;
  position: string;
  rating: number;
  avatarUrl: string;
}

const leagues: League[] = [
  { id: 'premier', name: 'Premier League', rating: 0.8 },
  { id: 'division1', name: 'Division 1', rating: 0.6 },
  { id: 'casual', name: 'Casual League', rating: 0.3 },
];

const mockTeammates: Teammate[] = [
  { id: '1', name: 'John Smith', position: 'Midfielder', rating: 3, avatarUrl: '' },
  { id: '2', name: 'Emma Johnson', position: 'Midfielder', rating: 3, avatarUrl: '' },
  { id: '3', name: 'Michael Brown', position: 'Midfielder', rating: 3, avatarUrl: '' },
  { id: '4', name: 'Sarah Davis', position: 'Midfielder', rating: 3, avatarUrl: '' },
];

const mockStats = {
  wins: 4,
  losses: 2,
  ties: 2,
  points: 15,
  league: {
    name: "Premier League"
  }
};

const mockEvents = [
  {
    id: 1,
    date: '20-Aug-2025',
    time: '6:00 PM',
    location: 'Allianz Arena',
    team1: { name: 'Eagle Claws', avatar: '/placeholder.svg?height=64&width=64', color: '#272D31' },
    team2: { name: 'Ravens', avatar: '/placeholder.svg?height=64&width=64', color: '#FFC700' },
    rsvpDeadline: new Date('2025-08-19T18:00:00'),
    status: 'attending',
    league: 'Premier League',
    hasResults: false
  },
  {
    id: 2,
    date: '25-Aug-2025',
    time: '7:30 PM',
    location: 'Stamford Bridge',
    team1: { name: 'Blue Lions', avatar: '/placeholder.svg?height=64&width=64', color: '#034694' },
    team2: { name: 'Red Devils', avatar: '/placeholder.svg?height=64&width=64', color: '#DA291C' },
    rsvpDeadline: new Date('2025-08-24T19:30:00'),
    status: null,
    spotsLeft: 2,
    league: 'Championship',
    hasResults: false
  }
];

const LeagueSelector = ({ leagues, onLeagueChange }: { leagues: League[], onLeagueChange: (leagueId: string) => void }) => {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Select League</h2>
      <Select
        defaultValue={leagues[0].id}
        onValueChange={onLeagueChange}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select League" />
        </SelectTrigger>
        <SelectContent>
          {leagues.map((league) => (
            <SelectItem key={league.id} value={league.id}>
              {league.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

const TeammatesToRate = () => {
  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Rate Your Teammates</h2>
        <Button variant="link" className="text-[#FF7A00] hover:text-[#FF7A00]/90">
          View all
        </Button>
      </div>
      <div className="grid grid-cols-2 gap-4 flex-grow">
        {mockTeammates.map((teammate) => (
          <div
            key={teammate.id}
            className="bg-white rounded-lg p-3 shadow-sm border border-gray-100 flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-gray-400" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">{teammate.name}</h3>
                <p className="text-gray-500 text-xs">{teammate.position}</p>
              </div>
            </div>
            <StarRating rating={teammate.rating} />
          </div>
        ))}
      </div>
    </div>
  );
};

function HomeScreenContent() {
  const [selectedLeagueId, setSelectedLeagueId] = useState('premier');

  const handleLeagueChange = (leagueId: string) => {
    setSelectedLeagueId(leagueId);
  };

  return (
    <div className="space-y-8 p-4 md:p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Your Stats</h2>
            <LeagueSelector leagues={leagues} onLeagueChange={handleLeagueChange} />
          </div>
          <PlayerStats stats={mockStats} userName="John Doe" />
        </div>
        <TeammatesToRate />
      </div>
      
      <section className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Upcoming Events</h2>
          <Button variant="link" className="text-[#FF7A00] hover:text-[#FF7A00]/90">
            View all
          </Button>
        </div>
        <div className="space-y-4">
          {mockEvents.map(event => (
            <EventCard key={event.id} event={event} showLeagueName={true} />
          ))}
        </div>
      </section>
    </div>
  );
}

const queryClient = new QueryClient();

export function HomeScreen() {
  return (
    <QueryClientProvider client={queryClient}>
      <HomeScreenContent />
    </QueryClientProvider>
  );
}
