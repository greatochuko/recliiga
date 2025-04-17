import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LeaderboardDataType } from "@/types/events";
import { TableCell, TableRow } from "@/components/ui/table";

export default function LeaderboradDataRow({
  data,
  rank,
}: {
  data: LeaderboardDataType;
  rank: number;
}) {
  return (
    <TableRow>
      <TableCell className="p-3 text-center font-medium">{rank}</TableCell>
      <TableCell className="p-3 font-medium">
        <Link
          to={`/player-profile`}
          className="flex cursor-pointer items-center transition-colors hover:text-accent-orange"
        >
          <Avatar className="mr-2 h-8 w-8">
            <AvatarImage
              src={data.player.avatar_url}
              alt={data.player.full_name}
            />
            <AvatarFallback>
              {data.player.full_name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          {data.player.full_name}
        </Link>
      </TableCell>
      <TableCell className="p-3 text-center">{data.gamesPlayed}</TableCell>
      <TableCell className="p-3 text-center">{data.gamesWon}</TableCell>
      <TableCell className="p-3 text-center">{data.gamesLost}</TableCell>
      <TableCell className="p-3 text-center">{data.gamesTied}</TableCell>
      <TableCell className="p-3 text-center">
        {data.gamesWonAsCaptain}
      </TableCell>
      <TableCell className="p-3 text-center">{data.attendance}</TableCell>
      <TableCell className="p-3 text-center">{data.nonAttendance}</TableCell>
      <TableCell className="p-3 text-center font-bold">{data.points}</TableCell>
    </TableRow>
  );
}
