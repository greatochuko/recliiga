import { EventType } from "@/types/events";
import EventCard from "../events/EventCard";
import { Link } from "react-router-dom";

export default function UpcomingEventsSection({
  events,
}: {
  events: EventType[];
}) {
  return (
    <section className="mb-8">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold">Upcoming Events</h2>
        <Link
          to="/events"
          className="text-sm text-accent-orange hover:underline"
        >
          View all
        </Link>
      </div>
      <div className="space-y-4">
        {events.length > 0 ? (
          events.map((event) => <EventCard key={event.id} event={event} />)
        ) : (
          <div className="flex items-center justify-center p-6">
            <p className="text-gray-500">No upcoming events found.</p>
          </div>
        )}
      </div>
    </section>
  );
}
