import { fetchEventsByUser } from "@/api/events";
import { getUpcomingEvents, getPastEvents } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EventCard from "@/components/events/EventCard";

export default function Events() {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["events"],
    queryFn: fetchEventsByUser,
  });

  const events = data?.data;
  const error = data?.error;

  const upcomingEvents = getUpcomingEvents(events || []);

  const pastEvents = getPastEvents(events || []);

  return (
    <main className="relative flex flex-1 flex-col gap-4 bg-background">
      <h1 className="ml-14 text-2xl font-bold">Events</h1>
      <div className="mx-auto w-full max-w-4xl px-4">
        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upcoming">Upcoming Events</TabsTrigger>
            <TabsTrigger value="past">Past Events</TabsTrigger>
          </TabsList>

          {isLoading || !data ? (
            <div className="py-10 text-center text-gray-500">Loading...</div>
          ) : (
            <>
              <TabsContent value="upcoming">
                {error ? (
                  <div className="py-10 text-center text-gray-500">
                    An error occurred while fetching events{" "}
                    <button
                      onClick={() => refetch()}
                      className="text-accent-orange hover:underline"
                    >
                      Retry
                    </button>
                  </div>
                ) : upcomingEvents.length === 0 ? (
                  <div className="py-10 text-center text-gray-500">
                    No upcoming events found
                  </div>
                ) : (
                  upcomingEvents.map((event) => (
                    <EventCard
                      key={event.id}
                      event={event}
                      showLeagueName={true}
                    />
                  ))
                )}
              </TabsContent>
              <TabsContent value="past">
                {pastEvents.length === 0 ? (
                  <div className="py-10 text-center text-gray-500">
                    No past events found
                  </div>
                ) : (
                  pastEvents.map((event) => (
                    <EventCard
                      key={event.id}
                      event={event}
                      showLeagueName={true}
                      isPastEvent={true}
                    />
                  ))
                )}
              </TabsContent>
            </>
          )}
        </Tabs>
      </div>
    </main>
  );
}
