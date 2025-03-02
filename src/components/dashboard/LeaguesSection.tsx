
import { LeagueCard } from "./LeagueCard";

export function LeaguesSection() {
  const leagues = [
    {
      id: "1",
      name: "Soccer League",
      sport: "Soccer",
      city: "New York",
      location: "Central Park",
      description: "Weekly soccer games in Central Park",
      logo_url: null,
      is_private: false,
      requires_approval: false,
      league_code: "SOCCER123",
      member_count: 24,
      created_at: "2023-01-15",
      start_date: "2023-02-01",
    },
    {
      id: "2",
      name: "Basketball League",
      sport: "Basketball",
      city: "New York",
      location: "Downtown Courts",
      description: "Competitive basketball league",
      logo_url: null,
      is_private: true,
      requires_approval: true,
      league_code: "BBALL456",
      member_count: 18,
      created_at: "2023-01-20",
      start_date: "2023-02-15",
    },
  ];

  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold mb-4">Your Leagues</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {leagues.map((league) => (
          <LeagueCard key={league.id} league={league} />
        ))}
      </div>
    </div>
  );
}
