import { EventType } from "@/types/events";
import { UpcomingEventsSection } from "./UpcomingEventsSection";
import { PastEventsSection } from "./PastEventsSection";

interface EventsListProps {
  upcomingEvents: EventType[];
  pastEvents: EventType[];
}

export function EventsList({ upcomingEvents, pastEvents }: EventsListProps) {
  return (
    <div className="p-4 md:p-6">
      {/* Upcoming Events Section */}
      <UpcomingEventsSection events={upcomingEvents} />

      {/* Past Events Section */}
      <PastEventsSection events={pastEvents} />
    </div>
  );
}
