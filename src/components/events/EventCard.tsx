
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Users, Edit, Trash2, Trophy } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Event } from '@/types/events';
import { Link } from 'react-router-dom';

interface EventCardProps {
  event: Event;
  onSelectCaptains: (eventId: number) => void;
  onEdit: (eventId: number) => void;
  onDelete: (eventId: number) => void;
  onEnterResults: (eventId: number) => void;
  isPast?: boolean;
}

export const EventCard: React.FC<EventCardProps> = ({ 
  event, 
  onSelectCaptains, 
  onEdit, 
  onDelete, 
  onEnterResults,
  isPast = false
}) => {
  const isUpcoming = event.status === 'upcoming';

  return (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="flex flex-col md:flex-row gap-4 justify-between">
          {/* Event Info */}
          <div className="md:w-1/3">
            <div className="flex items-center text-sm text-gray-500 mb-2">
              <Calendar className="w-4 h-4 mr-2" />
              <span>{event.date} • {event.time}</span>
            </div>
            <div className="flex items-center text-sm text-gray-500 mb-4">
              <MapPin className="w-4 h-4 mr-2" />
              <span>{event.location}</span>
            </div>
            <div className="flex items-center">
              <Avatar className="w-10 h-10 mr-2" style={{ backgroundColor: event.team1.color }}>
                <AvatarImage src={event.team1.avatar} alt={event.team1.name} />
                <AvatarFallback>{event.team1.name.substring(0, 2)}</AvatarFallback>
              </Avatar>
              <span className="font-medium mx-2">vs</span>
              <Avatar className="w-10 h-10" style={{ backgroundColor: event.team2.color }}>
                <AvatarImage src={event.team2.avatar} alt={event.team2.name} />
                <AvatarFallback>{event.team2.name.substring(0, 2)}</AvatarFallback>
              </Avatar>
            </div>
          </div>
          
          {/* Actions */}
          <div className="md:w-2/3 flex flex-wrap gap-2 justify-end items-start">
            {isPast ? (
              <>
                {!event.resultsEntered ? (
                  <Button 
                    className="bg-[#FF7A00] text-white hover:bg-[#FF7A00]/90 flex items-center"
                    onClick={() => onEnterResults(event.id)}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Input Results
                  </Button>
                ) : (
                  <Button 
                    variant="outline" 
                    className="text-[#FF7A00] border-[#FF7A00] hover:bg-[#FF7A00] hover:text-white"
                    asChild
                  >
                    <Link to={`/events/${event.id}/results`}>
                      <Trophy className="w-4 h-4 mr-2" />
                      View Results
                    </Link>
                  </Button>
                )}
                <Button 
                  variant="outline" 
                  className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                  onClick={() => onDelete(event.id)}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </>
            ) : (
              <>
                <Button 
                  variant="outline" 
                  className="border-[#FF7A00] text-[#FF7A00] hover:bg-[#FF7A00] hover:text-white"
                  onClick={() => onSelectCaptains(event.id)}
                >
                  <Users className="w-4 h-4 mr-2" />
                  Select Captains
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => onEdit(event.id)}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
                <Button 
                  variant="outline" 
                  className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                  onClick={() => onDelete(event.id)}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
