
import { useState, useMemo } from 'react';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, MapPin, Edit, Trash2, UserPlus, Trophy } from 'lucide-react';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";

// Types
interface Team {
  name: string
  avatar: string
  color: string
}

interface Event {
  id: number
  leagueId: number
  date: string
  time: string
  location: string
  team1: Team
  team2: Team
  rsvpDeadline?: Date
  status?: 'upcoming' | 'past'
  spotsLeft?: number
  resultsEntered?: boolean
}

interface League {
  id: number
  name: string
}

// Mock data
const mockLeagues: League[] = [
  { id: 1, name: "Premier League" },
  { id: 2, name: "Championship" },
  { id: 3, name: "League One" },
]

const mockEvents: Event[] = [
  {
    id: 1,
    leagueId: 1,
    date: '20-Aug-2024',
    time: '6:00 PM',
    location: 'Allianz Arena',
    team1: { name: 'Eagle Claws', avatar: '/placeholder.svg?height=64&width=64', color: '#272D31' },
    team2: { name: 'Ravens', avatar: '/placeholder.svg?height=64&width=64', color: '#FFC700' },
    rsvpDeadline: new Date('2024-08-19T18:00:00'),
    status: 'upcoming',
    spotsLeft: 2
  },
  {
    id: 2,
    leagueId: 1,
    date: '25-Aug-2024',
    time: '7:30 PM',
    location: 'Stamford Bridge',
    team1: { name: 'Blue Lions', avatar: '/placeholder.svg?height=64&width=64', color: '#034694' },
    team2: { name: 'Red Devils', avatar: '/placeholder.svg?height=64&width=64', color: '#DA291C' },
    rsvpDeadline: new Date('2024-08-24T19:30:00'),
    status: 'upcoming',
    spotsLeft: 1
  },
  {
    id: 3,
    leagueId: 1,
    date: '15-Jul-2024',
    time: '8:00 PM',
    location: 'Old Trafford',
    team1: { name: 'Red Devils', avatar: '/placeholder.svg?height=64&width=64', color: '#DA291C' },
    team2: { name: 'Sky Blues', avatar: '/placeholder.svg?height=64&width=64', color: '#6CABDD' },
    status: 'past',
    resultsEntered: true
  },
  {
    id: 4,
    leagueId: 2,
    date: '10-Jul-2024',
    time: '7:00 PM',
    location: 'Anfield',
    team1: { name: 'The Reds', avatar: '/placeholder.svg?height=64&width=64', color: '#C8102E' },
    team2: { name: 'Spurs', avatar: '/placeholder.svg?height=64&width=64', color: '#132257' },
    status: 'past',
    resultsEntered: false
  },
]

// API functions
const fetchEvents = async (): Promise<Event[]> => {
  // Simulating API call with a delay
  await new Promise(resolve => setTimeout(resolve, 1000))
  return mockEvents
}

const fetchLeagues = async (): Promise<League[]> => {
  // Simulating API call with a delay
  await new Promise(resolve => setTimeout(resolve, 500))
  return mockLeagues
}

// Sub-components
const EventCard = ({ 
  event, 
  onSelectCaptains, 
  onEdit, 
  onDelete, 
  onEnterResults 
}: { 
  event: Event; 
  onSelectCaptains: () => void; 
  onEdit: () => void; 
  onDelete: () => void; 
  onEnterResults: () => void 
}) => {
  return (
    <Card className="mb-4">
      <CardContent className="p-4 relative">
        <div className="flex justify-between items-start mb-2">
          <div className="flex flex-col">
            <div className="flex items-center mb-1">
              <Calendar className="w-4 h-4 text-gray-500 mr-2" aria-hidden="true" />
              <span className="text-xs text-gray-500 mr-4">{event.date}</span>
              <span className="text-xs text-gray-500 mr-4">{event.time}</span>
              <MapPin className="w-4 h-4 text-gray-500 mr-2" aria-hidden="true" />
              <span className="text-xs text-gray-500">{event.location}</span>
            </div>
          </div>
          {event.status === 'upcoming' && event.spotsLeft && (
            <span className="text-[#E43226] text-xs font-semibold">
              {event.spotsLeft === 1 ? '1 Spot Left' : `${event.spotsLeft} Spots Left`}
            </span>
          )}
        </div>
        <div className="grid grid-cols-3 items-center justify-items-center">
          <div className="flex flex-col items-center">
            <Avatar className="w-16 h-16" style={{ backgroundColor: event.team1.color }}>
              <AvatarImage src={event.team1.avatar} alt={`${event.team1.name} logo`} />
              <AvatarFallback>{event.team1.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <span className="text-sm font-semibold mt-2">{event.team1.name}</span>
          </div>
          <span className="text-lg font-semibold">vs</span>
          <div className="flex flex-col items-center">
            <Avatar className="w-16 h-16" style={{ backgroundColor: event.team2.color }}>
              <AvatarImage src={event.team2.avatar} alt={`${event.team2.name} logo`} />
              <AvatarFallback>{event.team2.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <span className="text-sm font-semibold mt-2">{event.team2.name}</span>
          </div>
        </div>
        <div className="flex justify-center mt-4 space-x-2">
          {event.status === 'upcoming' && (
            <>
              <Button onClick={onSelectCaptains} variant="outline" size="sm" className="flex items-center">
                <UserPlus className="w-4 h-4 mr-2" />
                Select Captains
              </Button>
              <Button onClick={onEdit} variant="outline" size="sm" className="flex items-center">
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
              <Button onClick={onDelete} variant="outline" size="sm" className="flex items-center text-red-500 hover:text-red-700">
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
            </>
          )}
          {event.status === 'past' && (
            <Button onClick={onEnterResults} variant="outline" size="sm" className="flex items-center">
              <Trophy className="w-4 h-4 mr-2" />
              {event.resultsEntered ? 'Edit Results' : 'Enter Results'}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// Main component contents
const EventsContent = () => {
  const [selectedLeague, setSelectedLeague] = useState<number | null>(null);
  const { data: leagues, isLoading: isLoadingLeagues } = useQuery({
    queryKey: ['leagues'],
    queryFn: fetchLeagues
  });
  const { data: events, isLoading: isLoadingEvents } = useQuery({
    queryKey: ['events'],
    queryFn: fetchEvents
  });

  const filteredEvents = useMemo(() => {
    if (!events) return { upcoming: [], past: [] };
    const filtered = selectedLeague
      ? events.filter(event => event.leagueId === selectedLeague)
      : events;
    return {
      upcoming: filtered.filter(event => event.status === 'upcoming'),
      past: filtered.filter(event => event.status === 'past')
    };
  }, [events, selectedLeague]);

  if (isLoadingLeagues || isLoadingEvents) {
    return <div className="flex justify-center items-center h-full">Loading...</div>;
  }

  const handleSelectCaptains = (eventId: number) => {
    console.log(`Select captains for event ${eventId}`);
  };

  const handleEditEvent = (eventId: number) => {
    console.log(`Edit event ${eventId}`);
  };

  const handleDeleteEvent = (eventId: number) => {
    console.log(`Delete event ${eventId}`);
  };

  const handleEnterResults = (eventId: number) => {
    console.log(`Enter/Edit results for event ${eventId}`);
  };

  const handleCreateNewEvent = () => {
    console.log('Create new event');
  };

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <Select onValueChange={(value) => setSelectedLeague(value === 'all' ? null : Number(value))}>
          <SelectTrigger className="w-full md:w-[300px]">
            <SelectValue placeholder="Select a league" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Leagues</SelectItem>
            {leagues?.map((league) => (
              <SelectItem key={league.id} value={league.id.toString()}>{league.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upcoming">Upcoming Events</TabsTrigger>
          <TabsTrigger value="past">Past Events</TabsTrigger>
        </TabsList>
        <TabsContent value="upcoming">
          <div className="mb-4 flex justify-end">
            <Button onClick={handleCreateNewEvent} className="bg-[#FF7A00] hover:bg-[#FF7A00]/90 text-white">
              Create New Event
            </Button>
          </div>
          {filteredEvents.upcoming.map(event => (
            <EventCard
              key={event.id}
              event={event}
              onSelectCaptains={() => handleSelectCaptains(event.id)}
              onEdit={() => handleEditEvent(event.id)}
              onDelete={() => handleDeleteEvent(event.id)}
              onEnterResults={() => handleEnterResults(event.id)}
            />
          ))}
        </TabsContent>
        <TabsContent value="past">
          {filteredEvents.past.map(event => (
            <EventCard
              key={event.id}
              event={event}
              onSelectCaptains={() => handleSelectCaptains(event.id)}
              onEdit={() => handleEditEvent(event.id)}
              onDelete={() => handleDeleteEvent(event.id)}
              onEnterResults={() => handleEnterResults(event.id)}
            />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Create a queryClient for the entire page
const queryClient = new QueryClient();

// Export the page with the necessary sidebar and layout structure
export default function ManageEvents() {
  return (
    <QueryClientProvider client={queryClient}>
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <AppSidebar />
          <main className="flex-1 bg-background relative">
            <div className="absolute top-4 left-4 z-50 flex items-center">
              <SidebarTrigger className="bg-white shadow-md" />
              <h1 className="ml-4 text-2xl font-bold">Manage Events</h1>
            </div>
            <div className="pt-16">
              <EventsContent />
            </div>
          </main>
        </div>
      </SidebarProvider>
    </QueryClientProvider>
  );
}
