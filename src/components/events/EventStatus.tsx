import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserPlus, Loader2 } from "lucide-react";
import { EventType } from "@/types/events";
import { CountdownClock } from "@/components/dashboard/CountdownClock";
import { useAuth } from "@/contexts/AuthContext";
import { fetchEventCaptains } from "@/api/captains";

interface EventStatusProps {
  event: EventType;
}

export function EventStatus({ event }: EventStatusProps) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [captains, setCaptains] = useState<EventType["captains"]>(
    event.captains || {},
  );
  const { user } = useAuth();

  const isEventOrganizer = user.id === event.creatorId;

  // Fetch team captains if not provided
  useEffect(() => {
    const loadCaptains = async () => {
      if (!event.captains && event.id) {
        setIsLoading(true);
        try {
          const captainsData = await fetchEventCaptains(event.id);
          setCaptains(captainsData);
        } catch (error) {
          console.error("Error fetching captains:", error);
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
    navigate(`/dashboard/${event.id}/select-captains`);
  };

  const handleBeginDraft = () => {
    console.log(`Navigating to team draft page for event ${event.id}`);
    // Pass the event data as state to avoid refetching
    navigate(`/dashboard/team-draft/${event.id}`, {
      state: { eventData: event },
    });
  };

  // Case 1: RSVP is still open - show countdown
  if (isRsvpOpen) {
    return (
      <div className="mt-2 flex items-center justify-end">
        <div className="flex items-center space-x-2">
          <span className="text-xs text-gray-500">RSVP in:</span>
          <CountdownClock deadline={event.rsvpDeadline} />
        </div>
      </div>
    );
  }

  // Case 2: RSVP closed, no captains selected yet
  if (!captains || Object.keys(captains).length === 0) {
    if (isLoading) {
      return (
        <div className="mt-2 flex items-center justify-end">
          <Button variant="outline" size="sm" disabled>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Loading...
          </Button>
        </div>
      );
    }

    // Only show the Select Captains button for organizers
    if (isEventOrganizer) {
      return (
        <div className="mt-2 flex items-center justify-end">
          <Button
            onClick={handleSelectCaptains}
            variant="outline"
            size="sm"
            className="border-accent-orange text-accent-orange hover:bg-accent-orange hover:text-white"
          >
            <UserPlus className="mr-2 h-4 w-4" />
            Select Captains
          </Button>
        </div>
      );
    }

    return null;
  }

  // Case 3: Captains selected - show avatars and Begin Draft button or Draft Complete
  if (captains) {
    // Check if there are any captains assigned
    const hasCaptains = Object.values(captains).filter(Boolean).length > 0;
    return (
      <div className="mt-2 flex items-center justify-end">
        {hasCaptains &&
          (event.draftStatus === "completed" ? (
            <Button
              variant="outline"
              size="sm"
              className="cursor-not-allowed border-gray-500 text-gray-500"
              disabled={true}
            >
              {/* Display all captain avatars inside the button */}
              {Object.entries(captains).map(([teamKey, captain]) => {
                if (!captain) return null;
                return (
                  <Avatar
                    key={teamKey}
                    className="mr-1 h-6 w-6 border-2 border-gray-500"
                  >
                    <AvatarImage src={captain.avatar} alt={captain.name} />
                    <AvatarFallback>{captain.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                );
              })}
              Draft Complete
            </Button>
          ) : (
            <Button
              onClick={handleBeginDraft}
              variant="outline"
              size="sm"
              className="border-accent-orange text-accent-orange hover:bg-accent-orange hover:text-white"
            >
              {/* Display all captain avatars inside the button */}
              {Object.entries(captains).map(([teamKey, captain]) => {
                if (!captain) return null;
                return (
                  <Avatar
                    key={teamKey}
                    className="mr-1 h-6 w-6 border-2 border-accent-orange"
                  >
                    <AvatarImage src={captain.avatar} alt={captain.name} />
                    <AvatarFallback>{captain.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                );
              })}
              Begin Draft
            </Button>
          ))}
      </div>
    );
  }

  // Case 4: Default/fallback when no other case applies
  return null;
}
