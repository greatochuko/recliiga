
import { useQuery } from '@tanstack/react-query';
import { fetchEvents, fetchLeagues } from '@/api/events';

export function useEvents() {
  const { 
    data: events, 
    isLoading: isLoadingEvents,
    error: eventsError,
    refetch: refetchEvents
  } = useQuery({
    queryKey: ['events'],
    queryFn: fetchEvents
  });

  const { 
    data: leagues, 
    isLoading: isLoadingLeagues,
    error: leaguesError,
    refetch: refetchLeagues
  } = useQuery({
    queryKey: ['leagues'],
    queryFn: fetchLeagues
  });

  const isLoading = isLoadingEvents || isLoadingLeagues;
  const error = eventsError || leaguesError;

  return {
    events: events || [],
    leagues: leagues || [],
    isLoading,
    error,
    refetchEvents,
    refetchLeagues
  };
}
