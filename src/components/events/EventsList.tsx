
import React, { useState } from 'react';
import { Event, League } from '@/types/events';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EventsCard } from './EventsCard';
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";

interface EventsListProps {
  upcomingEvents: Event[];
  pastEvents: Event[];
}

export function EventsList({ upcomingEvents, pastEvents }: EventsListProps) {
  const [selectedLeague, setSelectedLeague] = useState<string | null>(null);
  
  // Filter events by selected league (placeholder for future implementation)
  const filteredUpcomingEvents = upcomingEvents;
  const filteredPastEvents = pastEvents;

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <Select onValueChange={(value) => setSelectedLeague(value === 'all' ? null : value)}>
          <SelectTrigger className="w-full md:w-[300px]">
            <SelectValue placeholder="Select a league" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Leagues</SelectItem>
            {/* This would be populated with real leagues data */}
            <SelectItem value="league1">Basketball League</SelectItem>
            <SelectItem value="league2">Soccer League</SelectItem>
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
          {filteredUpcomingEvents.length === 0 ? (
            <div className="text-center py-10 text-gray-500">No upcoming events found</div>
          ) : (
            <div className="space-y-4">
              {filteredUpcomingEvents.map(event => (
                <EventsCard
                  key={event.id}
                  event={event}
                  showLeagueName={true}
                />
              ))}
            </div>
          )}
        </TabsContent>
        <TabsContent value="past">
          {filteredPastEvents.length === 0 ? (
            <div className="text-center py-10 text-gray-500">No past events found</div>
          ) : (
            <div className="space-y-4">
              {filteredPastEvents.map(event => (
                <EventsCard
                  key={event.id}
                  event={event}
                  isPastEvent={true}
                  showLeagueName={true}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
