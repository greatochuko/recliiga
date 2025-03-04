
// Importing from the new paths
import { LeagueData } from '../types';
import { Trophy, Users, Calendar } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface LeagueCardProps {
  league: LeagueData;
}

export const LeagueCard = ({ league }: LeagueCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 overflow-hidden">
      <div className="p-4 md:p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
          <Avatar className="w-16 h-16">
            <AvatarImage src={league.logo} alt={league.name} />
            <AvatarFallback>{league.name.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          
          <div className="flex-grow">
            <h2 className="text-xl font-bold mb-1">{league.name}</h2>
            
            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
              <div className="flex items-center">
                <Users className="w-4 h-4 mr-1" />
                <span>{league.players} Players</span>
              </div>
              <div className="flex items-center">
                <Trophy className="w-4 h-4 mr-1" />
                <span>{league.totalGames} Games</span>
              </div>
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                <span>{league.date}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
