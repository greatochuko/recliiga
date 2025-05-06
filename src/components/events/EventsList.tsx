import { EventType } from "@/types/events";
import { Button } from "../ui/button";
import EventCard from "./EventCard";
import { Loader2Icon } from "lucide-react";

interface EventsListProps {
  upcomingEvents: EventType[];
  pastEvents: EventType[];
  loading: boolean;
}

export function EventsList({
  upcomingEvents,
  pastEvents,
  loading,
}: EventsListProps) {
  return (
    <div className="p-4 md:p-6">
      {/* Upcoming Events Section */}
      <section className="mb-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Upcoming Events</h2>
          <Button
            variant="link"
            className="text-accent-orange hover:text-accent-orange/90"
          >
            View all
          </Button>
        </div>
        <div className="space-y-4">
          {loading ? (
            <div className="flex items-center justify-center gap-2 py-4 text-gray-500">
              <Loader2Icon className="text-accent-orange h-4 w-4 animate-spin" />{" "}
              Loading upcoming events...
            </div>
          ) : upcomingEvents.length === 0 ? (
            <div className="flex items-center justify-center py-4 text-gray-500">
              No upcoming events found
            </div>
          ) : (
            upcomingEvents.map((event) => (
              <EventCard key={event.id} event={event} showLeagueName={true} />
            ))
          )}
        </div>
      </section>

      {/* Past Events Section */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Past Events</h2>
          <Button
            variant="link"
            className="text-accent-orange hover:text-accent-orange/90"
          >
            View all
          </Button>
        </div>
        <div className="space-y-4">
          {loading ? (
            <div className="flex items-center justify-center gap-2 py-4 text-gray-500">
              <Loader2Icon className="text-accent-orange h-4 w-4 animate-spin" />{" "}
              Loading past events...
            </div>
          ) : pastEvents.length === 0 ? (
            <div className="flex items-center justify-center py-4 text-gray-500">
              No past events found
            </div>
          ) : (
            pastEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                isPastEvent={true}
                showLeagueName={true}
              />
            ))
          )}
        </div>
      </section>
    </div>
  );
}
