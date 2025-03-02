
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LeaguesData } from "./types";

type LeagueSelectorProps = {
  leaguesData: LeaguesData;
  selectedLeague: string;
  setSelectedLeague: (value: string) => void;
};

export const LeagueSelector = ({ leaguesData, selectedLeague, setSelectedLeague }: LeagueSelectorProps) => {
  return (
    <div className="flex justify-end mb-4">
      <Select onValueChange={setSelectedLeague} defaultValue={selectedLeague}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select a league" />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(leaguesData).map(([key, league]) => (
            <SelectItem key={key} value={key}>{league.name}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
