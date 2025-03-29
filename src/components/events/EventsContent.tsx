import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EventCard } from "./EventCard";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { fetchLeaguesByUser } from "@/api/league";
import { isPast } from "date-fns";

export const EventsContent: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [selectedLeagueId, setSelectedLeague] = useState<string | null>(null);

  const {
    data: { leagues },
    isFetching: isLoadingLeagues,
  } = useQuery({
    queryKey: ["leagues"],
    queryFn: fetchLeaguesByUser,
    initialData: { leagues: [], error: null },
  });

  const events = leagues.flatMap((league) =>
    league.events.flatMap((event) =>
      event.eventDates.map((eventDate) => ({
        ...event,
        id: `${event.id}_${new Date(eventDate.date).toISOString()}`,
        eventDates: [eventDate],
      }))
    )
  );

  const filteredEvents = useMemo(() => {
    const filtered = selectedLeagueId
      ? events.filter((event) => event.leagueId === selectedLeagueId)
      : events;

    const upcomingEvents = filtered.filter((event) => {
      const eventDate =
        event.eventDates.length > 0 ? event.eventDates[0].date : undefined;
      return !isPast(eventDate);
    });

    const pastEvents = filtered.filter((event) => {
      const eventDate =
        event.eventDates.length > 0 ? event.eventDates[0].date : undefined;
      return isPast(eventDate);
    });

    return { upcoming: upcomingEvents, past: pastEvents };
  }, [events, selectedLeagueId]);

  const handleSelectCaptains = (eventId: string) => {
    navigate(`/select-captains/${eventId}`);
  };

  const handleEditEvent = (eventId: string) => {
    toast({
      title: "Action initiated",
      description: `Editing event ${eventId}`,
    });
  };

  const handleDeleteEvent = (eventId: string) => {
    toast({
      title: "Action initiated",
      description: `Deleting event ${eventId}`,
    });
  };

  const handleEnterResults = (eventId: string) => {
    toast({
      title: "Action initiated",
      description: `Entering results for event ${eventId}`,
    });
  };

  return (
    <div className="mt-6 mx-auto flex flex-col gap-6 max-w-4xl">
      <div className="flex justify-between items-center">
        <Select
          onValueChange={(value) =>
            setSelectedLeague(value === "all" ? null : value)
          }
          disabled={isLoadingLeagues}
        >
          <SelectTrigger className="w-full md:w-[300px]">
            <SelectValue placeholder="Select a league" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Leagues</SelectItem>
            {leagues?.map((league) => (
              <SelectItem key={league.id} value={league.id}>
                {league.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button className="bg-[#FF7A00] hover:bg-[#E66900] text-white" asChild>
          <Link to="/add-event">
            <Plus className="mr-2 h-4 w-4" /> Create New Event
          </Link>
        </Button>
      </div>

      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upcoming">Upcoming Events</TabsTrigger>
          <TabsTrigger value="past">Past Events</TabsTrigger>
        </TabsList>
        {isLoadingLeagues ? (
          <div className="py-10 text-gray-500 text-center">Loading...</div>
        ) : (
          <>
            <TabsContent value="upcoming">
              {filteredEvents.upcoming.length === 0 ? (
                <div className="text-center py-10 text-gray-500">
                  No upcoming events found
                </div>
              ) : (
                filteredEvents.upcoming.map((event) => (
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
                <div className="text-center py-10 text-gray-500">
                  No past events found
                </div>
              ) : (
                filteredEvents.past.map((event) => (
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
          </>
        )}
      </Tabs>
    </div>
  );
};
