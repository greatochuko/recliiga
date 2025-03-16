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
import { Event } from "@/types/events";
import { EventsCard } from "../events/EventsCard";
import { upcomingEvents } from "../events/MockEventData";

// Mock API functions
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

async function fetchUpcomingEvents(): Promise<Event[]> {
  return upcomingEvents;
  // return [
  //   {
  //     id: 1,
  //     date: "20-Aug-2025",
  //     time: "6:00 PM",
  //     location: "Allianz Arena",
  //     team1: {
  //       name: "Eagle Claws",
  //       avatar: "/placeholder.svg?height=64&width=64",
  //       color: "#272D31",
  //     },
  //     team2: {
  //       name: "Ravens",
  //       avatar: "/placeholder.svg?height=64&width=64",
  //       color: "#FFC700",
  //     },
  //     rsvpDeadline: new Date("2025-08-19T18:00:00"),
  //     status: "attending",
  //     league: "Premier League",
  //     hasResults: false,
  //   },
  //   {
  //     id: 2,
  //     date: "25-Aug-2025",
  //     time: "7:30 PM",
  //     location: "Stamford Bridge",
  //     team1: {
  //       name: "Blue Lions",
  //       avatar: "/placeholder.svg?height=64&width=64",
  //       color: "#034694",
  //     },
  //     team2: {
  //       name: "Red Devils",
  //       avatar: "/placeholder.svg?height=64&width=64",
  //       color: "#DA291C",
  //     },
  //     rsvpDeadline: new Date("2025-08-24T19:30:00"),
  //     status: null,
  //     spotsLeft: 2,
  //     league: "Championship",
  //     hasResults: false,
  //   },
  //   {
  //     id: 3,
  //     date: "01-Sep-2025",
  //     time: "5:00 PM",
  //     location: "Camp Nou",
  //     team1: {
  //       name: "Catalonia FC",
  //       avatar: "/placeholder.svg?height=64&width=64",
  //       color: "#A50044",
  //     },
  //     team2: {
  //       name: "White Angels",
  //       avatar: "/placeholder.svg?height=64&width=64",
  //       color: "#FFFFFF",
  //     },
  //     rsvpDeadline: new Date("2025-08-31T17:00:00"),
  //     status: null,
  //     spotsLeft: 1,
  //     league: "La Liga",
  //     hasResults: false,
  //   },
  // ];
}

function PlayerDashboardContent() {
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

  const { data: upcomingEvents, isLoading: eventsLoading } = useQuery({
    queryKey: ["upcomingEvents"],
    queryFn: fetchUpcomingEvents,
  });

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
    <div className="space-y-8 ">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Your Stats</h2>
            <LeagueSelector
              leagues={leagues}
              onLeagueChange={handleLeagueChange}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Profile Card */}
            <PlayerRankCard
              league={{
                name: getLeagueName(stats.league),
                rank: stats.position,
                totalPlayers: stats.totalTeams,
                rating: Math.max(
                  0.5,
                  Math.min(3.0, (selectedLeague.rating || 0) * 3)
                ),
              }}
            />

            {/* Record Card */}
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold mb-4">Record</h3>
              <div className="space-y-4">
                {/* Points Circle */}
                <div className="flex justify-center">
                  <div className="relative w-24 h-24">
                    <svg className="w-full h-full" viewBox="0 0 100 100">
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
                      <span className="text-3xl font-bold">{stats.points}</span>
                      <span className="text-gray-500">PTS</span>
                    </div>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-emerald-100 rounded p-2">
                    <div className="text-emerald-700 font-bold text-lg">
                      {stats.wins}
                    </div>
                    <div className="text-emerald-600 text-xs">Won</div>
                  </div>
                  <div className="bg-red-100 rounded p-2">
                    <div className="text-red-700 font-bold text-lg">
                      {stats.losses}
                    </div>
                    <div className="text-red-600 text-xs">Loss</div>
                  </div>
                  <div className="bg-orange-100 rounded p-2">
                    <div className="text-orange-700 font-bold text-lg">
                      {stats.ties}
                    </div>
                    <div className="text-orange-600 text-xs">Tied</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Teammates Section */}
        <div className="flex flex-col h-full">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Rate Your Teammates</h2>
            <Link
              to="/rate-teammates"
              className="text-[#FF5533] hover:underline"
            >
              View all
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 gap-4 flex-grow">
            {teammates &&
              teammates.slice(0, 8).map((teammate) => (
                <Link
                  to="/rate-teammates"
                  key={teammate.id}
                  className="bg-white rounded-lg p-3 shadow-sm border border-gray-100 flex items-center justify-between hover:bg-gray-50 duration-200"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-gray-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm">{teammate.name}</h3>
                      <p className="text-gray-500 text-xs">
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
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Upcoming Events</h2>
          <Link to="/events" className="text-[#FF7A00] hover:underline text-sm">
            View all
          </Link>
        </div>
        <div className="space-y-4">
          {upcomingEvents &&
            upcomingEvents.map((event) => (
              <EventsCard key={event.id} event={event} showLeagueName={true} />
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
              //         className="text-[#FF7A00] border-[#FF7A00]"
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
  );
}

const queryClient = new QueryClient();

export default function PlayerDashboard() {
  return (
    <QueryClientProvider client={queryClient}>
      <PlayerDashboardContent />
    </QueryClientProvider>
  );
}
