
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserPlus, Trophy } from 'lucide-react';
import { Event } from '@/types/events';
import { CountdownClock } from "@/components/dashboard/CountdownClock";
import { useAuth } from '@/contexts/AuthContext';

interface EventStatusProps {
  event: Event;
}

export function EventStatus({ event }: EventStatusProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isOrganizer = user?.user_metadata?.role === 'organizer';
  
  // Check if RSVP deadline is still active
  const isRsvpOpen = event.rsvpDeadline && new Date() < event.rsvpDeadline;
  
  const handleSelectCaptains = () => {
    navigate(`/select-captains/${event.id}`);
  };
  
  const handleBeginDraft = () => {
    // Will be implemented in future
    console.log("Begin draft for event", event.id);
    // navigate(`/begin-draft/${event.id}`);
  };
  
  // Case 1: RSVP is still open - show countdown
  if (isRsvpOpen) {
    return (
      <div className="flex justify-end items-center mt-2">
        <div className="flex items-center space-x-2">
          <span className="text-xs text-gray-500">RSVP in:</span>
          <CountdownClock deadline={event.rsvpDeadline} />
        </div>
      </div>
    );
  }
  
  // Case 2: RSVP closed, no captains selected yet
  if (!event.captains && isOrganizer) {
    return (
      <div className="flex justify-end items-center mt-2">
        <Button 
          onClick={handleSelectCaptains}
          variant="outline" 
          size="sm"
          className="text-[#FF7A00] border-[#FF7A00] hover:bg-[#FF7A00] hover:text-white"
        >
          <UserPlus className="w-4 h-4 mr-2" />
          Select Captains
        </Button>
      </div>
    );
  }
  
  // Case 3: Captains selected - show avatars and Begin Draft button
  if (event.captains) {
    const hasBothCaptains = event.captains.team1 && event.captains.team2;
    
    return (
      <div className="flex justify-between items-center mt-2">
        <div className="flex items-center space-x-2">
          {event.captains.team1 && (
            <Avatar className="w-6 h-6 border-2 border-[#FF7A00]">
              <AvatarImage src={event.captains.team1.avatar} alt={event.captains.team1.name} />
              <AvatarFallback>{event.captains.team1.name.charAt(0)}</AvatarFallback>
            </Avatar>
          )}
          {event.captains.team2 && (
            <Avatar className="w-6 h-6 border-2 border-[#FF7A00]">
              <AvatarImage src={event.captains.team2.avatar} alt={event.captains.team2.name} />
              <AvatarFallback>{event.captains.team2.name.charAt(0)}</AvatarFallback>
            </Avatar>
          )}
          <span className="text-xs text-gray-500">Captains</span>
        </div>
        
        <Button
          onClick={handleBeginDraft}
          variant="outline"
          size="sm"
          disabled={!hasBothCaptains}
          className={`${hasBothCaptains ? "text-[#FF7A00] border-[#FF7A00] hover:bg-[#FF7A00] hover:text-white" : "text-gray-400 border-gray-300"}`}
        >
          <Trophy className="w-4 h-4 mr-2" />
          Begin Draft
        </Button>
      </div>
    );
  }
  
  // Case 4: Default/fallback when no other case applies
  return null;
}
