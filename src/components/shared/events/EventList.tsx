
import React, { useMemo } from 'react';
import { EventCard } from './EventCard';
import { Event } from '@/types/events';

interface EventListProps {
  events: Event[];
  filter?: 'upcoming' | 'past' | 'all';
  leagueId?: number | null;
  onSelectCaptains?: (eventId: number) => void;
  onEdit?: (eventId: number) => void;
  onDelete?: (eventId: number) => void;
  onEnterResults?: (eventId: number) => void;
  showActions?: boolean;
  variant?: 'default' | 'compact';
  emptyMessage?: string;
  maxItems?: number;
}

export const EventList: React.FC<EventListProps> = ({
  events,
  filter = 'all',
  leagueId = null,
  onSelectCaptains,
  onEdit,
  onDelete,
  onEnterResults,
  showActions = true,
  variant = 'default',
  emptyMessage = 'No events found',
  maxItems
}) => {
  const filteredEvents = useMemo(() => {
    let filtered = events;
    
    // Filter by league if specified
    if (leagueId !== null) {
      filtered = filtered.filter(event => event.leagueId === leagueId);
    }
    
    // Filter by event status
    if (filter === 'upcoming') {
      filtered = filtered.filter(event => event.status === 'upcoming');
    } else if (filter === 'past') {
      filtered = filtered.filter(event => event.status === 'past');
    }
    
    // Limit items if maxItems is specified
    if (maxItems && filtered.length > maxItems) {
      filtered = filtered.slice(0, maxItems);
    }
    
    return filtered;
  }, [events, filter, leagueId, maxItems]);

  if (filteredEvents.length === 0) {
    return <div className="text-center py-10 text-gray-500">{emptyMessage}</div>;
  }

  return (
    <div className="space-y-4">
      {filteredEvents.map(event => (
        <EventCard
          key={event.id}
          event={event}
          onSelectCaptains={onSelectCaptains}
          onEdit={onEdit}
          onDelete={onDelete}
          onEnterResults={onEnterResults}
          showActions={showActions}
          variant={variant}
        />
      ))}
    </div>
  );
};
