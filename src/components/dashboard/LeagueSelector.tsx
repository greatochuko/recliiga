import { LeagueType } from "@/types/league";

interface LeagueSelectorProps {
  leagues: LeagueType[];
  selectedLeague: LeagueType;
  onLeagueChange: (leagueId: string) => void;
}

export function LeagueSelector({
  leagues,
  onLeagueChange,
  selectedLeague,
}: LeagueSelectorProps) {
  return (
    <div className="space-y-4">
      <select
        name="league"
        id="league"
        value={selectedLeague?.id}
        onChange={(e) => onLeagueChange(e.target.value)}
        className="w-full rounded-md border p-2 text-sm"
      >
        <option>All</option>
        {leagues.map((league) => (
          <option key={league.id} value={league.id}>
            {league.name}
          </option>
        ))}
      </select>
    </div>
  );
}
