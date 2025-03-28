import { Button } from "@/components/ui/button";
import { EventsCard } from "./EventsCard";
import { EventType } from "@/types/events";

interface PastEventsSectionProps {
  events: EventType[];
}

export function PastEventsSection({ events }: PastEventsSectionProps) {
  return (
    <section>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Past Events</h2>
        <Button
          variant="link"
          className="text-[#FF7A00] hover:text-[#FF7A00]/90"
        >
          View all
        </Button>
      </div>
      <div className="space-y-4">
        {events.map((event) => (
          <EventsCard
            key={event.id}
            event={event}
            isPastEvent={true}
            showLeagueName={true}
          />
        ))}
      </div>
    </section>
  );
}
