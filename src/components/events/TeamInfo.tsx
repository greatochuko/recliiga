import { JerseyIcon } from "@/components/draft/DraftUIComponents";
import { TeamType } from "@/types/events";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { getInitials } from "@/lib/utils";

export default function TeamInfo({ team }: { team: TeamType }) {
  return (
    <div className="flex flex-1 flex-col items-center gap-2">
      <Avatar
        className="h-16 w-16 border-2"
        style={{ borderColor: team.color }}
      >
        <AvatarImage src={team.logo} alt={team.name} />
        <AvatarFallback>{getInitials(team.name)}</AvatarFallback>
      </Avatar>
      <span className="text-sm font-semibold">{team.name}</span>
      <div className="mt-2 flex flex-col items-center">
        <JerseyIcon color={team.color} size={48} />
      </div>
    </div>
  );
}
