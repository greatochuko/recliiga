
import { DashboardLeagueSelector } from "./DashboardLeagueSelector";
import { UpcomingEvents } from "./UpcomingEvents";
import { TeammatesToRate } from "./TeammatesToRate";
import { LeaguesSection } from "./LeaguesSection";
import { TeamRatingsSection } from "./TeamRatingsSection";
import { PlayerStatsSection } from "./PlayerStatsSection";

export function HomeScreen() {
  return (
    <div className="pt-20 p-4 max-w-6xl mx-auto">
      <DashboardLeagueSelector />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <UpcomingEvents />
          <LeaguesSection />
        </div>
        
        <div>
          <PlayerStatsSection />
          <TeammatesToRate />
          <TeamRatingsSection />
        </div>
      </div>
    </div>
  );
}
