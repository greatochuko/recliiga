import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LeaderboardDataType } from "@/types/events";
import { TableCell, TableRow } from "@/components/ui/table";
import { getInitials } from "@/lib/utils";

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
      <TableCell className="border-l p-3 font-medium">
        <Link
          to={`/profile/${data.player.id}`}
          className="group flex cursor-pointer items-center transition-colors"
        >
          <Avatar className="mr-2 h-8 w-8">
            <AvatarImage
              src={data.player.avatar_url}
              alt={data.player.full_name}
              className="object-cover"
            />
            <AvatarFallback>
              {getInitials(data.player.full_name)}
            </AvatarFallback>
          </Avatar>
          <span className="group-hover:text-accent-orange group-hover:underline">
            {data.player.full_name}
          </span>
        </Link>
      </TableCell>
      <TableCell className="border-l p-3 text-center">
        {data.gamesPlayed}
      </TableCell>
      <TableCell className="border-l p-3 text-center">
        {data.gamesWon}
      </TableCell>
      <TableCell className="border-l p-3 text-center">
        {data.gamesLost}
      </TableCell>
      <TableCell className="border-l p-3 text-center">
        {data.gamesTied}
      </TableCell>
      <TableCell className="border-l p-3 text-center">
        {data.gamesWonAsCaptain}
      </TableCell>
      <TableCell className="border-l p-3 text-center">
        {data.attendance}
      </TableCell>
      <TableCell className="border-l p-3 text-center">
        {data.nonAttendance}
      </TableCell>
      <TableCell className="border-l p-3 text-center font-bold">
        {data.points}
      </TableCell>
    </TableRow>
  );
}
