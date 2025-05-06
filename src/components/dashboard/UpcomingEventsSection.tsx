import { EventType } from "@/types/events";
import EventCard from "../events/EventCard";
import { Link } from "react-router-dom";
import FullScreenLoader from "../FullScreenLoader";

export default function UpcomingEventsSection({
  events,
  isLoading,
}: {
  events: EventType[];
  isLoading: boolean;
}) {
  return (
    <section>
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
        {isLoading ? (
          <div className="py-8">
            <FullScreenLoader />
          </div>
        ) : events.length > 0 ? (
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
