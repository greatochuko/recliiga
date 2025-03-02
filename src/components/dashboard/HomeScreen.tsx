
import { useAuth } from '@/contexts/AuthContext';
import PlayerDashboard from './PlayerDashboardContent';

export function HomeScreen() {
  const { user } = useAuth();
  
  return (
    <div className="pt-20 p-4 max-w-6xl mx-auto">
      <PlayerDashboard />
    </div>
  );
}
