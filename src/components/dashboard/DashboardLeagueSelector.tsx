
import { useState } from "react";
import { Check } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function DashboardLeagueSelector() {
  const [selectedLeague, setSelectedLeague] = useState<string>("all");

  return (
    <div className="mb-6">
      <Select defaultValue={selectedLeague} onValueChange={setSelectedLeague}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select League" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Leagues</SelectItem>
          <SelectItem value="soccer">Soccer League</SelectItem>
          <SelectItem value="volleyball">Volleyball League</SelectItem>
          <SelectItem value="basketball">Basketball League</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
