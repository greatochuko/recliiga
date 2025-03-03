
import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EventCard } from './EventCard';
import { fetchEvents, fetchLeagues } from '@/api/events';
import { useToast } from '@/components/ui/use-toast';
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";

export const EventsContent: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [selectedLeague, setSelectedLeague] = useState<number | null>(null);
  
  const { data: leagues, isLoading: isLoadingLeagues } = useQuery({
    queryKey: ['leagues'],
    queryFn: fetchLeagues
  });
  
  const { data: events, isLoading: isLoadingEvents } = useQuery({
    queryKey: ['events'],
    queryFn: fetchEvents
  });

  useEffect(() => {
    console.log('Events data loaded:', events);
    console.log('Leagues data loaded:', leagues);
  }, [events, leagues]);

  const filteredEvents = useMemo(() => {
    if (!events) return { upcoming: [], past: [] };
    
    console.log('Filtering events with selectedLeague:', selectedLeague);
    const filtered = selectedLeague
      ? events.filter(event => event.leagueId === selectedLeague)
      : events;
    
    const upcoming = filtered.filter(event => event.status === 'upcoming');
    const past = filtered.filter(event => event.status === 'past');
    
    console.log('Filtered events:', { upcoming, past });
    return { upcoming, past };
  }, [events, selectedLeague]);

  if (isLoadingLeagues || isLoadingEvents) {
    return <div className="flex justify-center items-center h-full">Loading...</div>;
  }

  const handleSelectCaptains = (eventId: number) => {
    console.log(`Select captains for event ${eventId}`);
    navigate(`/select-captains/${eventId}`);
  };

  const handleEditEvent = (eventId: number) => {
    console.log(`Edit event ${eventId}`);
    toast({
      title: "Action initiated",
      description: `Editing event ${eventId}`,
    });
  };

  const handleDeleteEvent = (eventId: number) => {
    console.log(`Delete event ${eventId}`);
    toast({
      title: "Action initiated",
      description: `Deleting event ${eventId}`,
    });
  };

  const handleEnterResults = (eventId: number) => {
    console.log(`Enter/Edit results for event ${eventId}`);
    navigate(`/events/${eventId}/edit-results`);
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
            <Button 
              className="bg-[#FF7A00] hover:bg-[#E66900] text-white" 
              asChild
            >
              <Link to="/add-event">
                <Plus className="mr-2 h-4 w-4" /> Create New Event
              </Link>
            </Button>
          </div>
          {filteredEvents.upcoming.length === 0 ? (
            <div className="text-center py-10 text-gray-500">No upcoming events found</div>
          ) : (
            filteredEvents.upcoming.map(event => (
              <EventCard
                key={event.id}
                event={event}
                onSelectCaptains={handleSelectCaptains}
                onEdit={handleEditEvent}
                onDelete={handleDeleteEvent}
                onEnterResults={handleEnterResults}
              />
            ))
          )}
        </TabsContent>
        <TabsContent value="past">
          {filteredEvents.past.length === 0 ? (
            <div className="text-center py-10 text-gray-500">No past events found</div>
          ) : (
            filteredEvents.past.map(event => (
              <EventCard
                key={event.id}
                event={event}
                onSelectCaptains={handleSelectCaptains}
                onEdit={handleEditEvent}
                onDelete={handleDeleteEvent}
                onEnterResults={handleEnterResults}
              />
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
