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
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { fetchEventsByCreator } from "@/api/events";
import { getPastEvents, getUpcomingEvents } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import FullScreenLoader from "../FullScreenLoader";

export const EventsContent: React.FC = () => {
  const { user } = useAuth();

  const [selectedLeagueId, setSelectedLeague] = useState<string | null>(null);

  const {
    data,
    isLoading: isLoadingEvents,
    refetch: refetchEvents,
  } = useQuery({
    queryKey: ["eventsByCreator"],
    queryFn: fetchEventsByCreator,
  });

  const events = useMemo(() => data?.data || [], [data?.data]);
  const error = data?.error;

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
    <div className="mt-6 flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <Select
          onValueChange={(value) =>
            setSelectedLeague(value === "all" ? null : value)
          }
          disabled={isLoadingEvents}
        >
          <SelectTrigger className="w-fit sm:w-40">
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
        {user.role === "organizer" && (
          <Link
            to="/dashboard/add-event"
            className="flex items-center gap-1 rounded-md bg-accent-orange px-3 py-2 font-medium text-white hover:bg-[#E66900] sm:px-4"
          >
            <Plus className="h-4 w-4" /> Create New Event
          </Link>
        )}
      </div>

      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upcoming">Upcoming Events</TabsTrigger>
          <TabsTrigger value="past">Past Events</TabsTrigger>
        </TabsList>
        {isLoadingEvents ? (
          // <div className="py-10 text-center text-gray-500">Loading...</div>
          <FullScreenLoader className="h-40" />
        ) : (
          <>
            <TabsContent value="upcoming">
              {error ? (
                <div className="py-10 text-center text-gray-500">
                  An error occurred while fetching events{" "}
                  <button
                    onClick={() => refetchEvents()}
                    className="text-accent-orange hover:underline"
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
              {error ? (
                <div className="py-10 text-center text-gray-500">
                  An error occurred while fetching events{" "}
                  <button
                    onClick={() => refetchEvents()}
                    className="text-accent-orange hover:underline"
                  >
                    Retry
                  </button>
                </div>
              ) : filteredEvents.past.length === 0 ? (
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
