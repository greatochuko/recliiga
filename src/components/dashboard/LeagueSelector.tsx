
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { League } from "@/types/dashboard";

interface LeagueSelectorProps {
  leagues: League[];
  onLeagueChange: (leagueId: string) => void;
}

export function LeagueSelector({ leagues, onLeagueChange }: LeagueSelectorProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Select League</h2>
      <Select
        defaultValue={leagues[0].id}
        onValueChange={onLeagueChange}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select League" />
        </SelectTrigger>
        <SelectContent>
          {leagues.map((league) => (
            <SelectItem key={league.id} value={league.id}>
              {league.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
