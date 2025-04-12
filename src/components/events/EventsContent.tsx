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
import ManageEventCard from "./ManageEventCard";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { fetchEventsByUser } from "@/api/events";
import { getPastEvents, getUpcomingEvents } from "@/lib/utils";

export const EventsContent: React.FC = () => {
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

  const filteredEvents = useMemo(() => {
    const filtered = selectedLeagueId
      ? events.filter((event) => event.leagueId === selectedLeagueId)
      : events;

    const upcomingEvents = getUpcomingEvents(filtered);

    const pastEvents = getPastEvents(filtered);

    return { upcoming: upcomingEvents, past: pastEvents };
  }, [events, selectedLeagueId]);

  const leagues = useMemo(() => {
    if (!events.length) return [];

    return Array.from(
      new Map(events.map((event) => [event.league.id, event.league])).values(),
    );
  }, [events]);

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
            {leagues.map((league) => (
              <SelectItem key={league.id} value={league.id}>
                {league.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          className="bg-accent-orange text-white hover:bg-[#E66900]"
          asChild
        >
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
                  <ManageEventCard
                    key={event.id}
                    event={event}
                    refetchEvents={refetchEvents}
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
                  <ManageEventCard
                    key={event.id}
                    event={event}
                    refetchEvents={refetchEvents}
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
