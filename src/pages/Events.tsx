import { fetchEventsByUser } from "@/api/events";
import { EventsList } from "@/components/events/EventsList";
import { getUpcomingEvents, getPastEvents } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";

export default function Events() {
  const {
    data: { data: events },
    isFetching,
  } = useQuery({
    queryKey: ["events"],
    queryFn: fetchEventsByUser,
    initialData: { data: [], error: null },
  });

  const upcomingEvents = getUpcomingEvents(events);

  const pastEvents = getPastEvents(events);

  return (
    <main className="relative flex-1 bg-background">
      <h1 className="ml-14 text-2xl font-bold">Events</h1>
      <div className="">
        <EventsList
          loading={isFetching}
          upcomingEvents={upcomingEvents}
          pastEvents={pastEvents}
        />
      </div>
    </main>
  );
}
