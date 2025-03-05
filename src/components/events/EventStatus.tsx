
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserPlus, Loader2 } from 'lucide-react';
import { Event } from '@/types/events';
import { CountdownClock } from "@/components/dashboard/CountdownClock";
import { useAuth } from '@/contexts/AuthContext';
import { fetchEventCaptains } from '@/api/captains';

interface EventStatusProps {
  event: Event;
}

export function EventStatus({
  event
}: EventStatusProps) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [captains, setCaptains] = useState<Event['captains']>(event.captains || {});
  const {
    user
  } = useAuth();
  const isOrganizer = user?.user_metadata?.role === 'organizer';

  // Fetch team captains if not provided
  useEffect(() => {
    const loadCaptains = async () => {
      if (!event.captains && event.id) {
        setIsLoading(true);
        try {
          const captainsData = await fetchEventCaptains(event.id);
          setCaptains(captainsData);
        } catch (error) {
          console.error('Error fetching captains:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadCaptains();
  }, [event.id, event.captains]);

  // Check if RSVP deadline is still active
  const isRsvpOpen = event.rsvpDeadline && new Date() < event.rsvpDeadline;
  
  const handleSelectCaptains = () => {
    navigate(`/select-captains/${event.id}`);
  };
  
  const handleBeginDraft = () => {
    console.log(`Navigating to team draft page for event ${event.id}`);
    navigate(`/team-draft/${event.id}`);
  };

  // Case 1: RSVP is still open - show countdown
  if (isRsvpOpen) {
    return <div className="flex justify-end items-center mt-2">
        <div className="flex items-center space-x-2">
          <span className="text-xs text-gray-500">RSVP in:</span>
          <CountdownClock deadline={event.rsvpDeadline} />
        </div>
      </div>;
  }

  // Case 2: RSVP closed, no captains selected yet
  if (!captains || Object.keys(captains).length === 0) {
    if (isLoading) {
      return <div className="flex justify-end items-center mt-2">
          <Button variant="outline" size="sm" disabled>
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
            Loading...
          </Button>
        </div>;
    }
    
    if (isOrganizer) {
      return <div className="flex justify-end items-center mt-2">
          <Button 
            onClick={handleSelectCaptains} 
            variant="outline" 
            size="sm" 
            className="text-[#FF7A00] border-[#FF7A00] hover:bg-[#FF7A00] hover:text-white"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Select Captains
          </Button>
        </div>;
    }
    
    return null;
  }

  // Case 3: Captains selected - show avatars and Begin Draft button or Draft Complete
  if (captains) {
    // Check if there are any captains assigned
    const hasCaptains = Object.values(captains).filter(Boolean).length > 0;
    return <div className="flex justify-end items-center mt-2">
        {hasCaptains && (event.draftStatus === 'completed' ? <Button variant="outline" size="sm" className="text-gray-500 border-gray-500 cursor-not-allowed" disabled={true}>
              {/* Display all captain avatars inside the button */}
              {Object.entries(captains).map(([teamKey, captain]) => {
          if (!captain) return null;
          return <Avatar key={teamKey} className="w-6 h-6 border-2 border-gray-500 mr-1">
                    <AvatarImage src={captain.avatar} alt={captain.name} />
                    <AvatarFallback>{captain.name.charAt(0)}</AvatarFallback>
                  </Avatar>;
        })}
              Draft Complete
            </Button> : <Button onClick={handleBeginDraft} variant="outline" size="sm" className="text-[#FF7A00] border-[#FF7A00] hover:bg-[#FF7A00] hover:text-white">
              {/* Display all captain avatars inside the button */}
              {Object.entries(captains).map(([teamKey, captain]) => {
          if (!captain) return null;
          return <Avatar key={teamKey} className="w-6 h-6 border-2 border-[#FF7A00] mr-1">
                    <AvatarImage src={captain.avatar} alt={captain.name} />
                    <AvatarFallback>{captain.name.charAt(0)}</AvatarFallback>
                  </Avatar>;
        })}
              Begin Draft
            </Button>)}
      </div>;
  }

  // Case 4: Default/fallback when no other case applies
  return null;
}
