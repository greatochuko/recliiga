
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Event } from '@/types/events';

interface TeamsDisplayProps {
  event: Event;
  isRsvpOpen: boolean;
}

export const TeamsDisplay: React.FC<TeamsDisplayProps> = ({ event, isRsvpOpen }) => {
  const getTeamName = (team: { name: string; }, index: number) => {
    if (isRsvpOpen) {
      return `Team ${index + 1}`;
    }
    return team.name;
  };

  const getTeamAvatarFallback = (team: { name: string; }, index: number) => {
    if (isRsvpOpen) {
      return `T${index + 1}`;
    }
    return team.name.split(' ').map(n => n[0]).join('');
  };

  return (
    <div className="grid grid-cols-3 items-center justify-items-center mb-4">
      <div className="flex flex-col items-center">
        <Avatar className="w-16 h-16" style={{
          backgroundColor: event.team1.color
        }}>
          <AvatarImage src={event.team1.avatar} alt={getTeamName(event.team1, 0)} />
          <AvatarFallback>{getTeamAvatarFallback(event.team1, 0)}</AvatarFallback>
        </Avatar>
        <span className="text-sm font-semibold mt-2">{getTeamName(event.team1, 0)}</span>
      </div>
      <span className="text-lg font-semibold">vs</span>
      <div className="flex flex-col items-center">
        <Avatar className="w-16 h-16" style={{
          backgroundColor: event.team2.color
        }}>
          <AvatarImage src={event.team2.avatar} alt={getTeamName(event.team2, 1)} />
          <AvatarFallback>{getTeamAvatarFallback(event.team2, 1)}</AvatarFallback>
        </Avatar>
        <span className="text-sm font-semibold mt-2">{getTeamName(event.team2, 1)}</span>
      </div>
    </div>
  );
};
