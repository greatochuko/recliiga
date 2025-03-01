
import { Calendar, MapPin, Clock, UserCheck, Users } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';

interface Team {
  name: string;
  avatar: string;
  color: string;
}

interface Event {
  id: number;
  date: string;
  time: string;
  location: string;
  team1: Team;
  team2: Team;
  status?: string | null;
  spotsLeft?: number;
  rsvpDeadline: Date;
  league?: string;
  hasResults?: boolean;
}

interface EventCardProps {
  event: Event;
  showLeagueName?: boolean;
}

export function EventCard({ event, showLeagueName = false }: EventCardProps) {
  const navigate = useNavigate();
  
  const isUpcoming = new Date() < event.rsvpDeadline;
  
  const handleViewDetails = () => {
    navigate(`/events/${event.id}`);
  };
  
  const handleViewResults = () => {
    navigate(`/events/${event.id}/results`);
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row">
          <div className="bg-gray-50 p-4 md:w-1/3 flex flex-col justify-center items-center">
            <p className="text-sm text-gray-500 mb-2">{event.date}</p>
            <div className="flex items-center justify-center gap-4 mb-2">
              <Avatar className="w-16 h-16" style={{ backgroundColor: event.team1.color }}>
                <AvatarImage src={event.team1.avatar} alt={event.team1.name} />
                <AvatarFallback>{event.team1.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <span className="text-xl font-bold">vs</span>
              <Avatar className="w-16 h-16" style={{ backgroundColor: event.team2.color }}>
                <AvatarImage src={event.team2.avatar} alt={event.team2.name} />
                <AvatarFallback>{event.team2.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
            </div>
            <div className="text-center">
              <p className="font-medium">{event.team1.name} vs {event.team2.name}</p>
              {showLeagueName && event.league && (
                <Badge variant="outline" className="mt-1">{event.league}</Badge>
              )}
            </div>
          </div>
          
          <div className="p-4 flex-1 flex flex-col justify-between">
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-400" />
                <span className="text-sm">{event.time}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span className="text-sm">{event.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span className="text-sm">
                  RSVP by {event.rsvpDeadline.toLocaleDateString('en-US', { 
                    day: '2-digit', 
                    month: 'short'
                  })}
                </span>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2 mt-auto">
              {event.hasResults ? (
                <Button 
                  className="flex-1 bg-[#FF7A00] hover:bg-[#FF7A00]/90 text-white" 
                  onClick={handleViewResults}
                >
                  View Results
                </Button>
              ) : isUpcoming ? (
                <>
                  {event.status === 'attending' ? (
                    <Badge className="flex items-center gap-1 bg-green-100 text-green-800 hover:bg-green-200">
                      <UserCheck className="w-3 h-3" /> Attending
                    </Badge>
                  ) : event.spotsLeft !== undefined ? (
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Users className="w-3 h-3" /> {event.spotsLeft} spots left
                    </Badge>
                  ) : null}
                  <Button 
                    className="flex-1" 
                    variant={event.status === 'attending' ? "outline" : "default"}
                    onClick={handleViewDetails}
                  >
                    View Details
                  </Button>
                </>
              ) : (
                <Button className="flex-1" variant="outline" onClick={handleViewDetails}>
                  Event Passed
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
