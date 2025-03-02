
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { LeagueData, ColumnExplanations } from "./types";

type ResultsLeaderboardProps = {
  leagueData: LeagueData;
  columnExplanations: ColumnExplanations;
};

export const ResultsLeaderboard = ({ leagueData, columnExplanations }: ResultsLeaderboardProps) => {
  const navigate = useNavigate();
  
  const handleViewProfile = () => {
    navigate('/player-profile');
  };
  
  return (
    <div className="container mx-auto px-4">
      <h2 className="text-2xl font-bold mb-6">Results Leaderboard</h2>
      <Card>
        <CardContent className="p-0">
          <TooltipProvider delayDuration={300}>
            <Table>
              <TableHeader className="bg-gray-100">
                <TableRow>
                  <TableHead className="text-center w-16">Rank</TableHead>
                  <TableHead className="w-48">Name</TableHead>
                  {Object.entries(columnExplanations).map(([abbr, explanation]) => (
                    <TableHead key={abbr} className="text-center w-16 relative">
                      <Tooltip>
                        <TooltipTrigger className="w-full cursor-help">
                          {abbr}
                        </TooltipTrigger>
                        <TooltipContent side="top" align="center" className="z-50" sideOffset={5}>
                          <p>{explanation}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {leagueData.leaderboardData.map((player) => (
                  <TableRow key={player.rank}>
                    <TableCell className="text-center font-medium">{player.rank}</TableCell>
                    <TableCell>
                      <div className="flex items-center cursor-pointer hover:text-[#FF7A00] transition-colors" onClick={handleViewProfile}>
                        <Avatar className="h-6 w-6 mr-2">
                          <AvatarImage src={`/placeholder.svg?height=24&width=24`} alt={player.name} />
                          <AvatarFallback>{player.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        {player.name}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">{player.gamesPlayed}</TableCell>
                    <TableCell className="text-center">{player.win}</TableCell>
                    <TableCell className="text-center">{player.loss}</TableCell>
                    <TableCell className="text-center">{player.tie}</TableCell>
                    <TableCell className="text-center">{player.captainWin}</TableCell>
                    <TableCell className="text-center">{player.attendance}</TableCell>
                    <TableCell className="text-center">{player.nonAttendance}</TableCell>
                    <TableCell className="text-center font-bold">{player.points}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TooltipProvider>
        </CardContent>
      </Card>
    </div>
  );
};
