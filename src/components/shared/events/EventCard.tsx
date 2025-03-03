
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Edit, Trash2, UserPlus, Trophy } from 'lucide-react';
import { Event } from '@/types/events';

interface EventCardProps {
  event: Event;
  onSelectCaptains?: (eventId: number) => void;
  onEdit?: (eventId: number) => void;
  onDelete?: (eventId: number) => void;
  onEnterResults?: (eventId: number) => void;
  showActions?: boolean;
  variant?: 'default' | 'compact';
}

export const EventCard: React.FC<EventCardProps> = ({ 
  event, 
  onSelectCaptains, 
  onEdit, 
  onDelete, 
  onEnterResults,
  showActions = true,
  variant = 'default'
}) => {
  const navigate = useNavigate();
  
  const handleSelectCaptains = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onSelectCaptains) {
      onSelectCaptains(event.id);
    } else {
      navigate(`/select-captains/${event.id}`);
    }
  };

  const handleEnterResults = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onEnterResults) {
      onEnterResults(event.id);
    } else {
      navigate(`/events/${event.id}/edit-results`);
    }
  };

  const handleViewDetails = () => {
    navigate(`/events/${event.id}`);
  };

  if (variant === 'compact') {
    return (
      <Card className="mb-4">
        <CardContent className="p-4">
          <div className="flex justify-between items-center mb-2">
            <div>
              <p className="font-semibold">{event.date} - {event.time}</p>
              <p className="text-sm text-gray-500">{event.location}</p>
            </div>
            {event.status === 'attending' && (
              <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">Attending</span>
            )}
          </div>
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center">
              <div className="mr-4 text-center">
                <div className="font-semibold">{event.team1.name}</div>
              </div>
              <div className="text-xl font-bold">vs</div>
              <div className="ml-4 text-center">
                <div className="font-semibold">{event.team2.name}</div>
              </div>
            </div>
            <Button variant="outline" className="text-[#FF7A00] border-[#FF7A00]" onClick={handleViewDetails}>
              View Details
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-4">
      <CardContent className="p-4 relative">
        <div className="flex justify-between items-start mb-2">
          <div className="flex flex-col">
            <div className="flex items-center mb-1">
              <Calendar className="w-4 h-4 text-gray-500 mr-2" aria-hidden="true" />
              <span className="text-xs text-gray-500 mr-4">{event.date}</span>
              <span className="text-xs text-gray-500 mr-4">{event.time}</span>
              <MapPin className="w-4 h-4 text-gray-500 mr-2" aria-hidden="true" />
              <span className="text-xs text-gray-500">{event.location}</span>
            </div>
          </div>
          {event.status === 'upcoming' && event.spotsLeft && (
            <span className="text-[#E43226] text-xs font-semibold">
              {event.spotsLeft === 1 ? '1 Spot Left' : `${event.spotsLeft} Spots Left`}
            </span>
          )}
        </div>
        <div className="grid grid-cols-3 items-center justify-items-center">
          <div className="flex flex-col items-center">
            <Avatar className="w-16 h-16" style={{ backgroundColor: event.team1.color }}>
              <AvatarImage src={event.team1.avatar} alt={`${event.team1.name} logo`} />
              <AvatarFallback>{event.team1.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <span className="text-sm font-semibold mt-2">{event.team1.name}</span>
          </div>
          <span className="text-lg font-semibold">vs</span>
          <div className="flex flex-col items-center">
            <Avatar className="w-16 h-16" style={{ backgroundColor: event.team2.color }}>
              <AvatarImage src={event.team2.avatar} alt={`${event.team2.name} logo`} />
              <AvatarFallback>{event.team2.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <span className="text-sm font-semibold mt-2">{event.team2.name}</span>
          </div>
        </div>
        {showActions && (
          <div className="flex justify-center mt-4 space-x-2">
            {event.status === 'upcoming' && (
              <>
                <Button onClick={handleSelectCaptains} variant="outline" size="sm" className="flex items-center">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Select Captains
                </Button>
                {onEdit && (
                  <Button onClick={() => onEdit(event.id)} variant="outline" size="sm" className="flex items-center">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                )}
                {onDelete && (
                  <Button onClick={() => onDelete(event.id)} variant="outline" size="sm" className="flex items-center text-red-500 hover:text-red-700">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                )}
              </>
            )}
            {event.status === 'past' && (
              <Button onClick={handleEnterResults} variant="outline" size="sm" className="flex items-center">
                <Trophy className="w-4 h-4 mr-2" />
                {event.resultsEntered ? 'Edit Results' : 'Enter Results'}
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
