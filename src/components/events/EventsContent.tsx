import React, { useState, useMemo } from "react";
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
import { isPast } from "date-fns";
import { fetchEventsByUser } from "@/api/events";

export const EventsContent: React.FC = () => {
  const { toast } = useToast();
  const [selectedLeagueId, setSelectedLeague] = useState<string | null>(null);

  const {
    data: { data: events, error },
    isFetching: isLoadingEvents,
    refetch: refetchEvents,
  } = useQuery({
    queryKey: ["event"],
    queryFn: fetchEventsByUser,
    initialData: { data: [], error: null },
  });

  console.log({ events, error });

  const filteredEvents = useMemo(() => {
    const filtered = selectedLeagueId
      ? events.filter((event) => event.leagueId === selectedLeagueId)
      : events;

    const upcomingEvents = filtered.filter((event) => {
      const eventDate = new Date(event.startDate.date).setHours(
        event.startDate.startAmPm === "PM"
          ? event.startDate.startHour + 12
          : event.startDate.startHour,
        event.startDate.startMinute,
      );
      return !isPast(eventDate);
    });

    const pastEvents = filtered.filter((event) => {
      const eventDate = new Date(event.startDate.date).setHours(
        event.startDate.startAmPm === "PM"
          ? event.startDate.startHour + 12
          : event.startDate.startHour,
        event.startDate.startMinute,
      );
      return isPast(eventDate);
    });

    return { upcoming: upcomingEvents, past: pastEvents };
  }, [events, selectedLeagueId]);

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

  return (
    <div className="mx-auto mt-6 flex max-w-4xl flex-col gap-6">
      <div className="flex items-center justify-between">
        <Select
          onValueChange={(value) =>
            setSelectedLeague(value === "all" ? null : value)
          }
          disabled={isLoadingEvents}
        >
          <SelectTrigger className="w-full md:w-[300px]">
            <SelectValue placeholder="Select a league" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Leagues</SelectItem>
            {events.map((event) => (
              <SelectItem key={event.id} value={event.id}>
                {event.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button className="bg-[#FF7A00] text-white hover:bg-[#E66900]" asChild>
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
        {isLoadingEvents ? (
          <div className="py-10 text-center text-gray-500">Loading...</div>
        ) : (
          <>
            <TabsContent value="upcoming">
              {error ? (
                <div className="py-10 text-center text-gray-500">
                  An error occurred while fetching events{" "}
                  <button
                    onClick={() => refetchEvents()}
                    className="text-blue-500 hover:underline"
                  >
                    Retry
                  </button>
                </div>
              ) : filteredEvents.upcoming.length === 0 ? (
                <div className="py-10 text-center text-gray-500">
                  No upcoming events found
                </div>
              ) : (
                filteredEvents.upcoming.map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    onEdit={handleEditEvent}
                    onDelete={handleDeleteEvent}
                  />
                ))
              )}
            </TabsContent>
            <TabsContent value="past">
              {filteredEvents.past.length === 0 ? (
                <div className="py-10 text-center text-gray-500">
                  No past events found
                </div>
              ) : (
                filteredEvents.past.map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    onEdit={handleEditEvent}
                    onDelete={handleDeleteEvent}
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
