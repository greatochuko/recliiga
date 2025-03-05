
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Edit } from 'lucide-react';
import { Event } from '@/types/events';

interface EventActionsProps {
  event: Event;
  isPastEvent?: boolean;
  attendanceStatus: 'attending' | 'declined' | null;
  isRsvpOpen: boolean;
  isEditing: boolean;
  setIsEditing: (isEditing: boolean) => void;
  setAttendanceStatus: (status: 'attending' | 'declined' | null) => void;
}

export const EventActions: React.FC<EventActionsProps> = ({
  event,
  isPastEvent = false,
  attendanceStatus,
  isRsvpOpen,
  isEditing,
  setIsEditing,
  setAttendanceStatus,
}) => {
  const navigate = useNavigate();

  const handleAttend = () => {
    setAttendanceStatus('attending');
    setIsEditing(false);
  };

  const handleDecline = () => {
    setAttendanceStatus('declined');
    setIsEditing(false);
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleViewDetails = () => {
    if (event.hasResults) {
      navigate(`/events/${event.id}/results`);
    } else {
      navigate(`/events/${event.id}`);
    }
  };

  return (
    <>
      <div className="flex justify-center mt-2 space-x-2">
        <Button 
          variant="outline" 
          className="text-[#FF7A00] border-[#FF7A00] hover:bg-[#FF7A00] hover:text-white transition-colors px-4 py-2 text-sm rounded-md" 
          style={{
            transform: 'scale(1.1)'
          }} 
          onClick={handleViewDetails}
        >
          {event.hasResults ? "View Results" : "View Details"}
        </Button>
      </div>
      {!isPastEvent && isRsvpOpen && (
        <div className="flex justify-center mt-2 space-x-2">
          {(isEditing || !attendanceStatus) && (
            <>
              <Button 
                className="bg-[#FF7A00] text-white hover:bg-[#FF7A00]/90 transition-colors px-4 py-2 text-sm rounded-md" 
                onClick={handleAttend}
              >
                Attend
              </Button>
              <Button 
                className="bg-[#FF7A00] text-white hover:bg-[#FF7A00]/90 transition-colors px-4 py-2 text-sm rounded-md" 
                onClick={handleDecline}
              >
                Decline
              </Button>
            </>
          )}
          {attendanceStatus && !isEditing && (
            <Button 
              variant="outline" 
              className="text-[#FF7A00] border-[#FF7A00] hover:bg-[#FF7A00] hover:text-white transition-colors px-4 py-2 text-sm rounded-md" 
              onClick={toggleEdit}
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit RSVP
            </Button>
          )}
        </div>
      )}
    </>
  );
};
