import { fetchEventsByUser } from "@/api/events";
import { EventsList } from "@/components/events/EventsList";
import { useQuery } from "@tanstack/react-query";
import { isPast } from "date-fns";

export default function Events() {
  const {
    data: { data: events },
    isFetching,
  } = useQuery({
    queryKey: ["events"],
    queryFn: fetchEventsByUser,
    initialData: { data: [], error: null },
  });

  const upcomingEvents = events.filter((event) => {
    const eventDate =
      event.eventDates.length > 0 ? event.eventDates[0].date : undefined;
    return !isPast(eventDate);
  });

  const pastEvents = events.filter((event) => {
    const eventDate =
      event.eventDates.length > 0 ? event.eventDates[0].date : undefined;
    return isPast(eventDate);
  });

  return (
    <main className="flex-1 bg-background relative">
      <h1 className="ml-14 text-2xl font-bold">Events</h1>
      <div className="">
        <EventsList upcomingEvents={upcomingEvents} pastEvents={pastEvents} />
      </div>
    </main>
  );
}
