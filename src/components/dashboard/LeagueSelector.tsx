import { League } from "@/types/dashboard";

interface LeagueSelectorProps {
  leagues: League[];
  onLeagueChange: (leagueId: string) => void;
}

export function LeagueSelector({
  leagues,
  onLeagueChange,
}: LeagueSelectorProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Select League</h2>
      <select
        name="league"
        id="league"
        defaultValue={leagues[0].id}
        onChange={(e) => onLeagueChange(e.target.value)}
        className="p-2 rounded-md border w-full text-sm"
      >
        {leagues.map((league) => (
          <option key={league.id} value={league.id}>
            {league.name}
          </option>
        ))}
      </select>
    </div>
  );
}
