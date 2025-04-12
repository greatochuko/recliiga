import { useState } from "react";
import { Link } from "react-router-dom";
import { User } from "lucide-react";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import { LeagueSelector } from "./LeagueSelector";
import { StarRating } from "./StarRating";
import { PlayerRankCard } from "./PlayerRankCard";
import {
  League,
  PlayerStats,
  Teammate,
  getLeagueName,
} from "@/types/dashboard";
import EventCard from "../events/EventCard";
import { fetchEventsByUser } from "@/api/events";
import { getUpcomingEvents } from "@/lib/utils";

async function fetchPlayerStats(leagueId: string): Promise<PlayerStats> {
  // Simulating different stats for different leagues
  const leagueStats: Record<string, PlayerStats> = {
    premier: {
      name: "John Doe",
      position: 8,
      totalTeams: 15,
      league: "Premier League",
      points: 15,
      wins: 4,
      losses: 2,
      ties: 2,
      record: { wins: 4, losses: 2, ties: 2 },
    },
    division1: {
      name: "John Doe",
      position: 3,
      totalTeams: 12,
      league: "Division 1",
      points: 22,
      wins: 7,
      losses: 1,
      ties: 1,
      record: { wins: 7, losses: 1, ties: 1 },
    },
    casual: {
      name: "John Doe",
      position: 1,
      totalTeams: 8,
      league: "Casual League",
      points: 18,
      wins: 6,
      losses: 0,
      ties: 0,
      record: { wins: 6, losses: 0, ties: 0 },
    },
  };
  return leagueStats[leagueId] || leagueStats.premier;
}

async function fetchTeammates(): Promise<Teammate[]> {
  return [
    { id: "1", name: "John Smith", position: "Midfielder", rating: 3 },
    { id: "2", name: "Emma Johnson", position: "Midfielder", rating: 3 },
    { id: "3", name: "Michael Brown", position: "Midfielder", rating: 3 },
    { id: "4", name: "Sarah Davis", position: "Midfielder", rating: 3 },
    { id: "5", name: "David Wilson", position: "Midfielder", rating: 3 },
    { id: "6", name: "Lisa Anderson", position: "Midfielder", rating: 3 },
    { id: "7", name: "Robert Taylor", position: "Midfielder", rating: 3 },
    { id: "8", name: "Jennifer Martin", position: "Midfielder", rating: 3 },
  ];
}

const queryClient = new QueryClient();

export default function PlayerDashboard() {
  const leagues: League[] = [
    { id: "premier", name: "Premier League", rating: 0.8 },
    { id: "division1", name: "Division 1", rating: 0.6 },
    { id: "casual", name: "Casual League", rating: 0.3 },
  ];
  const [selectedLeagueId, setSelectedLeagueId] = useState("premier");
  const [selectedLeague, setSelectedLeague] = useState<League>({
    id: "premier",
    name: "Premier League",
    rating: 0.8,
  });

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["playerStats", selectedLeagueId],
    queryFn: () => fetchPlayerStats(selectedLeagueId),
  });

  const { data: teammates, isLoading: teammatesLoading } = useQuery({
    queryKey: ["teammates"],
    queryFn: fetchTeammates,
  });

  const {
    data: { data: events },
    isLoading: eventsLoading,
  } = useQuery({
    queryKey: ["upcomingEvents"],
    queryFn: fetchEventsByUser,
    initialData: { data: [], error: null },
  });

  const upcomingEvents = getUpcomingEvents(events);

  const handleLeagueChange = (leagueId: string) => {
    setSelectedLeagueId(leagueId);
    const newLeague =
      leagues.find((league) => league.id === leagueId) || leagues[0];
    setSelectedLeague(newLeague);
  };

  if (statsLoading || teammatesLoading || eventsLoading) {
    return (
      <div className="animate-pulse space-y-8">
        <div className="h-64 rounded-lg bg-muted" />
        <div className="h-64 rounded-lg bg-muted" />
        <div className="h-64 rounded-lg bg-muted" />
      </div>
    );
  }

  if (!stats) return null;

  const totalGames = stats.wins + stats.losses + stats.ties;
  const winFraction = stats.wins / totalGames || 0;
  const lossFraction = stats.losses / totalGames || 0;
  const tieFraction = stats.ties / totalGames || 0;

  return (
    <QueryClientProvider client={queryClient}>
      <div className="space-y-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold md:ml-8">Your Stats</h2>
              <LeagueSelector
                leagues={leagues}
                onLeagueChange={handleLeagueChange}
              />
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {/* Profile Card */}
              <PlayerRankCard
                league={{
                  name: getLeagueName(stats.league),
                  rank: stats.position,
                  totalPlayers: stats.totalTeams,
                  rating: Math.max(
                    0.5,
                    Math.min(3.0, (selectedLeague.rating || 0) * 3),
                  ),
                }}
              />

              {/* Record Card */}
              <div className="rounded-lg border border-gray-100 bg-white p-4 shadow-sm">
                <h3 className="mb-4 text-lg font-bold">Record</h3>
                <div className="space-y-4">
                  {/* Points Circle */}
                  <div className="flex justify-center">
                    <div className="relative h-24 w-24">
                      <svg className="h-full w-full" viewBox="0 0 100 100">
                        <circle
                          cx="50"
                          cy="50"
                          r="45"
                          fill="none"
                          stroke="#E5E7EB"
                          strokeWidth="10"
                        />
                        <circle
                          cx="50"
                          cy="50"
                          r="45"
                          fill="none"
                          stroke="#22C55E"
                          strokeWidth="10"
                          strokeDasharray={`${winFraction * 283} ${
                            283 - winFraction * 283
                          }`}
                          strokeDashoffset="0"
                          transform="rotate(-90 50 50)"
                        />
                        <circle
                          cx="50"
                          cy="50"
                          r="45"
                          fill="none"
                          stroke="#EF4444"
                          strokeWidth="10"
                          strokeDasharray={`${lossFraction * 283} ${
                            283 - lossFraction * 283
                          }`}
                          strokeDashoffset={`${-winFraction * 283}`}
                          transform="rotate(-90 50 50)"
                        />
                        <circle
                          cx="50"
                          cy="50"
                          r="45"
                          fill="none"
                          stroke="#F97316"
                          strokeWidth="10"
                          strokeDasharray={`${tieFraction * 283} ${
                            283 - tieFraction * 283
                          }`}
                          strokeDashoffset={`${
                            -(winFraction + lossFraction) * 283
                          }`}
                          transform="rotate(-90 50 50)"
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-3xl font-bold">
                          {stats.points}
                        </span>
                        <span className="text-gray-500">PTS</span>
                      </div>
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="rounded bg-emerald-100 p-2">
                      <div className="text-lg font-bold text-emerald-700">
                        {stats.wins}
                      </div>
                      <div className="text-xs text-emerald-600">Won</div>
                    </div>
                    <div className="rounded bg-red-100 p-2">
                      <div className="text-lg font-bold text-red-700">
                        {stats.losses}
                      </div>
                      <div className="text-xs text-red-600">Loss</div>
                    </div>
                    <div className="rounded bg-orange-100 p-2">
                      <div className="text-lg font-bold text-orange-700">
                        {stats.ties}
                      </div>
                      <div className="text-xs text-orange-600">Tied</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Teammates Section */}
          <div className="flex h-full flex-col">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold">Rate Your Teammates</h2>
              <Link
                to="/rate-teammates"
                className="text-[#FF5533] hover:underline"
              >
                View all
              </Link>
            </div>
            <div className="grid flex-grow gap-4 sm:grid-cols-2">
              {teammates &&
                teammates.slice(0, 8).map((teammate) => (
                  <Link
                    to="/rate-teammates"
                    key={teammate.id}
                    className="flex items-center justify-between rounded-lg border border-gray-100 bg-white p-3 shadow-sm duration-200 hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100">
                        <User className="h-4 w-4 text-gray-400" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold">
                          {teammate.name}
                        </h3>
                        <p className="text-xs text-gray-500">
                          {teammate.position}
                        </p>
                      </div>
                    </div>
                    <StarRating rating={teammate.rating} />
                  </Link>
                ))}
            </div>
          </div>
        </div>

        {/* Upcoming Events Section */}
        <section className="mb-8">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Upcoming Events</h2>
            <Link
              to="/events"
              className="text-sm text-accent-orange hover:underline"
            >
              View all
            </Link>
          </div>
          <div className="space-y-4">
            {upcomingEvents &&
              upcomingEvents.map((event) => (
                <EventCard key={event.id} event={event} showLeagueName={true} />
                // <div key={event.id} className="mb-4">
                //   {/* We'll create a separate EventCard component */}
                //   <div className="card p-4 bg-white rounded-lg border border-gray-100">
                //     <div className="flex justify-between items-center mb-2">
                //       <div>
                //         <p className="font-semibold">
                //           {event.date} - {event.time}
                //         </p>
                //         <p className="text-sm text-gray-500">{event.location}</p>
                //       </div>
                //       {event.status === "attending" && (
                //         <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                //           Attending
                //         </span>
                //       )}
                //     </div>
                //     <div className="flex items-center justify-between mt-3">
                //       <div className="flex items-center">
                //         <div className="mr-4 text-center">
                //           <div className="font-semibold">{event.team1.name}</div>
                //         </div>
                //         <div className="text-xl font-bold">vs</div>
                //         <div className="ml-4 text-center">
                //           <div className="font-semibold">{event.team2.name}</div>
                //         </div>
                //       </div>
                //       <Button
                //         variant="outline"
                //         className="text-accent-orange border-accent-orange"
                //       >
                //         View Details
                //       </Button>
                //     </div>
                //   </div>
                // </div>
              ))}
          </div>
        </section>
      </div>
    </QueryClientProvider>
  );
}
