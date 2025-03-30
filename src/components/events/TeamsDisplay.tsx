import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { EventType } from "@/types/events";

interface TeamsDisplayProps {
  event: EventType;
  isRsvpOpen: boolean;
}

export default function TeamsDisplay({ event }: TeamsDisplayProps) {
  return (
    <div className="grid grid-cols-3 items-center justify-items-center mb-4">
      <div className="flex flex-col items-center">
        <Avatar className="w-16 h-16 border-2 border-red-500">
          <AvatarImage src={""} alt={""} />
          <AvatarFallback>T1</AvatarFallback>
        </Avatar>
        <span className="text-sm font-semibold mt-2">TEAM 1</span>
      </div>
      <span className="text-lg font-semibold">vs</span>
      <div className="flex flex-col items-center">
        <Avatar className="w-16 h-16 border-2 border-blue-500">
          <AvatarImage src={""} alt={""} />
          <AvatarFallback>T2</AvatarFallback>
        </Avatar>
        <span className="text-sm font-semibold mt-2">TEAM 2</span>
      </div>
    </div>
  );
}
