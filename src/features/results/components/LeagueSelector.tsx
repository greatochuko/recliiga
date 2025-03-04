
import { LeaguesData } from '../types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface LeagueSelectorProps {
  leaguesData: LeaguesData;
  selectedLeague: string;
  setSelectedLeague: (league: string) => void;
}

export const LeagueSelector = ({ leaguesData, selectedLeague, setSelectedLeague }: LeagueSelectorProps) => {
  return (
    <div className="mb-6">
      <label htmlFor="league-select" className="block text-sm font-medium text-gray-700 mb-2">
        Select League
      </label>
      <Select value={selectedLeague} onValueChange={setSelectedLeague}>
        <SelectTrigger id="league-select" className="w-full md:w-[250px]">
          <SelectValue placeholder="Select a league" />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(leaguesData).map(([id, league]) => (
            <SelectItem key={id} value={id}>
              {league.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
