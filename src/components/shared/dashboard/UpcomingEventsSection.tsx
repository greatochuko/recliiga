
import { Link } from 'react-router-dom';
import { EventList } from '../events/EventList';
import { useEvents } from '@/hooks/use-events';

interface UpcomingEventsSectionProps {
  maxItems?: number;
  leagueId?: number | null;
  title?: string;
  showViewAll?: boolean;
}

export const UpcomingEventsSection = ({
  maxItems = 3,
  leagueId = null,
  title = "Upcoming Events",
  showViewAll = true
}: UpcomingEventsSectionProps) => {
  const { events, isLoading } = useEvents();
  
  if (isLoading) {
    return <div className="animate-pulse space-y-8">
      <div className="h-24 rounded-lg bg-gray-200" />
      <div className="h-24 rounded-lg bg-gray-200" />
      <div className="h-24 rounded-lg bg-gray-200" />
    </div>;
  }
  
  return (
    <section className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">{title}</h2>
        {showViewAll && (
          <Link to="/events" className="text-[#FF7A00] hover:underline text-sm">View all</Link>
        )}
      </div>
      <EventList 
        events={events} 
        filter="upcoming" 
        leagueId={leagueId}
        variant="compact"
        showActions={false}
        maxItems={maxItems}
        emptyMessage="No upcoming events found"
      />
    </section>
  );
};
