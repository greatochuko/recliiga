import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LeagueType } from "@/types/league";
import React from "react";

type LeagueSelectorProps = {
  leagues: LeagueType[];
  selectedLeagueId: string;
  setSelectedLeagueId: React.Dispatch<React.SetStateAction<string>>;
};

export const LeagueSelector = ({
  leagues,
  selectedLeagueId,
  setSelectedLeagueId,
}: LeagueSelectorProps) => {
  return (
    <div className="flex justify-end">
      <Select
        onValueChange={setSelectedLeagueId}
        defaultValue={selectedLeagueId}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select a league" />
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
};
