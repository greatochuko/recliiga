
import { Button } from "@/components/ui/button";
import { EventsCard } from './EventsCard';
import { Event } from '@/types/events';

interface UpcomingEventsSectionProps {
  events: Event[];
}

export function UpcomingEventsSection({ events }: UpcomingEventsSectionProps) {
  return (
    <section className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Upcoming Events</h2>
        <Button variant="link" className="text-[#FF7A00] hover:text-[#FF7A00]/90">
          View all
        </Button>
      </div>
      <div className="space-y-4">
        {events.map(event => (
          <EventsCard 
            key={event.id} 
            event={event} 
            showLeagueName={true} 
          />
        ))}
      </div>
    </section>
  );
}
