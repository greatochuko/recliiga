
import { useAuth } from '@/contexts/AuthContext';
import PlayerDashboard from './PlayerDashboardContent';
import { UpcomingEventsSection } from '@/components/shared/dashboard/UpcomingEventsSection';

export function HomeScreen() {
  const { user } = useAuth();
  
  return (
    <div className="pt-20 p-4 max-w-6xl mx-auto">
      <PlayerDashboard />
      {/* You can include the shared upcoming events section if needed */}
      {/* <UpcomingEventsSection /> */}
    </div>
  );
}
