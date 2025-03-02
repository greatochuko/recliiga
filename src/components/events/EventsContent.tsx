
import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EventCard } from './EventCard';
import { Event, League } from '@/types/events';
import { fetchEvents, fetchLeagues } from '@/api/events';

export const EventsContent: React.FC = () => {
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
              onSelectCaptains={handleSelectCaptains}
              onEdit={handleEditEvent}
              onDelete={handleDeleteEvent}
              onEnterResults={handleEnterResults}
            />
          ))}
        </TabsContent>
        <TabsContent value="past">
          {filteredEvents.past.map(event => (
            <EventCard
              key={event.id}
              event={event}
              onSelectCaptains={handleSelectCaptains}
              onEdit={handleEditEvent}
              onDelete={handleDeleteEvent}
              onEnterResults={handleEnterResults}
            />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};
