import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Edit } from 'lucide-react';
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
function CountdownClock({
  deadline
}: {
  deadline: Date;
}) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0
  });
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const difference = deadline.getTime() - now.getTime();
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor(difference / (1000 * 60 * 60) % 24),
          minutes: Math.floor(difference / 1000 / 60 % 60)
        });
      } else {
        clearInterval(timer);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [deadline]);
  return <div className="text-xs text-gray-500 flex space-x-2">
      <span>{timeLeft.days}d</span>
      <span>{timeLeft.hours}h</span>
      <span>{timeLeft.minutes}m</span>
    </div>;
}
interface Event {
  id: number;
  date: string;
  time: string;
  location: string;
  team1: {
    name: string;
    avatar: string;
    color: string;
  };
  team2: {
    name: string;
    avatar: string;
    color: string;
  };
  rsvpDeadline?: Date;
  status: string | null;
  league: string;
  hasResults: boolean;
  spotsLeft?: number;
}
function EventCard({
  event,
  isPastEvent = false,
  showLeagueName = false
}: {
  event: Event;
  isPastEvent?: boolean;
  showLeagueName?: boolean;
}) {
  const [attendanceStatus, setAttendanceStatus] = useState(event.status || null);
  const isRsvpOpen = event.rsvpDeadline && new Date() < event.rsvpDeadline;
  const [isEditing, setIsEditing] = useState(false);
  const getTeamName = (team: {
    name: string;
  }, index: number) => {
    if (isRsvpOpen) {
      return `Team ${index + 1}`;
    }
    return team.name;
  };
  const getTeamAvatarFallback = (team: {
    name: string;
  }, index: number) => {
    if (isRsvpOpen) {
      return `T${index + 1}`;
    }
    return team.name.split(' ').map(n => n[0]).join('');
  };
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
  return <Card className="mb-4">
      <CardContent className="p-4 relative">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center">
            <Calendar className="w-4 h-4 text-gray-500 mr-2" />
            <span className="text-xs text-gray-500 mr-4">{event.date}</span>
            <span className="text-xs text-gray-500 mr-4">{event.time}</span>
            <MapPin className="w-4 h-4 text-gray-500 mr-2" />
            <span className="text-xs text-gray-500">{event.location}</span>
          </div>
          {attendanceStatus === 'attending' && !isEditing && <Badge variant="secondary" className="bg-[#FF7A00] bg-opacity-20 text-[#FF7A00] text-xs">
              Attending
            </Badge>}
          {attendanceStatus === 'declined' && !isEditing && <Badge variant="secondary" className="bg-red-100 text-red-600 text-xs">
              Declined
            </Badge>}
          {!isPastEvent && event.spotsLeft && !attendanceStatus && <span className="text-[#E43226] text-xs font-semibold">
              {event.spotsLeft === 1 ? '1 Spot Left' : `${event.spotsLeft} Spots Left`}
            </span>}
        </div>
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
        {showLeagueName && <div className="absolute bottom-4 left-4 text-xs">
            <span className="font-bold text-[#FF7A00]">{event.league}</span>
          </div>}
        <div className="flex justify-center mt-2 space-x-2">
          <Button variant="outline" className="text-[#FF7A00] border-[#FF7A00] hover:bg-[#FF7A00] hover:text-white transition-colors px-4 py-2 text-sm rounded-md" style={{
          transform: 'scale(1.1)'
        }}>
            {event.hasResults ? "View Results" : "View Details"}
          </Button>
        </div>
        {!isPastEvent && isRsvpOpen && <div className="flex justify-center mt-2 space-x-2">
            {(isEditing || !attendanceStatus) && <>
                <Button className="bg-[#FF7A00] text-white hover:bg-[#FF7A00]/90 transition-colors px-4 py-2 text-sm rounded-md" onClick={handleAttend}>
                  Attend
                </Button>
                <Button className="bg-[#FF7A00] text-white hover:bg-[#FF7A00]/90 transition-colors px-4 py-2 text-sm rounded-md" onClick={handleDecline}>
                  Decline
                </Button>
              </>}
            {attendanceStatus && !isEditing && <Button variant="outline" className="text-[#FF7A00] border-[#FF7A00] hover:bg-[#FF7A00] hover:text-white transition-colors px-4 py-2 text-sm rounded-md" onClick={toggleEdit}>
                <Edit className="w-4 h-4 mr-2" />
                Edit RSVP
              </Button>}
          </div>}
        {isRsvpOpen && <div className="flex justify-end items-center mt-2">
            <div className="flex items-center space-x-2">
              <span className="text-xs text-gray-500">RSVP in:</span>
              <CountdownClock deadline={event.rsvpDeadline!} />
            </div>
          </div>}
      </CardContent>
    </Card>;
}
function EventsContent() {
  const upcomingEvents = [{
    id: 1,
    date: '20-Aug-2025',
    time: '6:00 PM',
    location: 'Allianz Arena',
    team1: {
      name: 'Eagle Claws',
      avatar: '/placeholder.svg?height=64&width=64',
      color: '#272D31'
    },
    team2: {
      name: 'Ravens',
      avatar: '/placeholder.svg?height=64&width=64',
      color: '#FFC700'
    },
    rsvpDeadline: new Date('2025-08-19T18:00:00'),
    status: 'attending',
    league: 'Premier League',
    hasResults: false
  }, {
    id: 2,
    date: '25-Aug-2025',
    time: '7:30 PM',
    location: 'Stamford Bridge',
    team1: {
      name: 'Blue Lions',
      avatar: '/placeholder.svg?height=64&width=64',
      color: '#034694'
    },
    team2: {
      name: 'Red Devils',
      avatar: '/placeholder.svg?height=64&width=64',
      color: '#DA291C'
    },
    rsvpDeadline: new Date('2025-08-24T19:30:00'),
    status: null,
    spotsLeft: 2,
    league: 'Championship',
    hasResults: false
  }, {
    id: 3,
    date: '01-Sep-2025',
    time: '5:00 PM',
    location: 'Camp Nou',
    team1: {
      name: 'Catalonia FC',
      avatar: '/placeholder.svg?height=64&width=64',
      color: '#A50044'
    },
    team2: {
      name: 'White Angels',
      avatar: '/placeholder.svg?height=64&width=64',
      color: '#FFFFFF'
    },
    rsvpDeadline: new Date('2025-08-31T17:00:00'),
    status: null,
    spotsLeft: 1,
    league: 'La Liga',
    hasResults: false
  }];
  const pastEvents = [{
    id: 4,
    date: '15-Jul-2025',
    time: '8:00 PM',
    location: 'Old Trafford',
    team1: {
      name: 'Red Devils',
      avatar: '/placeholder.svg?height=64&width=64',
      color: '#DA291C'
    },
    team2: {
      name: 'Sky Blues',
      avatar: '/placeholder.svg?height=64&width=64',
      color: '#6CABDD'
    },
    status: 'past',
    league: 'Premier League',
    hasResults: true
  }, {
    id: 5,
    date: '10-Jul-2025',
    time: '7:00 PM',
    location: 'Anfield',
    team1: {
      name: 'The Reds',
      avatar: '/placeholder.svg?height=64&width=64',
      color: '#C8102E'
    },
    team2: {
      name: 'Spurs',
      avatar: '/placeholder.svg?height=64&width=64',
      color: '#132257'
    },
    status: 'past',
    league: 'Premier League',
    hasResults: true
  }, {
    id: 6,
    date: '05-Jul-2025',
    time: '6:30 PM',
    location: 'Emirates Stadium',
    team1: {
      name: 'Gunners',
      avatar: '/placeholder.svg?height=64&width=64',
      color: '#EF0107'
    },
    team2: {
      name: 'Hammers',
      avatar: '/placeholder.svg?height=64&width=64',
      color: '#7A263A'
    },
    status: 'past',
    league: 'Premier League',
    hasResults: true
  }];
  return <div className="p-4 md:p-6">
      {/* Upcoming Events Section */}
      <section className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold text-xl">Upcoming Events</h2>
          <Button variant="link" className="text-[#FF7A00] hover:text-[#FF7A00]/90">
            View all
          </Button>
        </div>
        <div className="space-y-4">
          {upcomingEvents.map(event => <EventCard key={event.id} event={event} showLeagueName={true} />)}
        </div>
      </section>

      {/* Past Events Section */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Past Events</h2>
          <Button variant="link" className="text-[#FF7A00] hover:text-[#FF7A00]/90">
            View all
          </Button>
        </div>
        <div className="space-y-4">
          {pastEvents.map(event => <EventCard key={event.id} event={event} isPastEvent={true} showLeagueName={true} />)}
        </div>
      </section>
    </div>;
}
export default function Events() {
  return <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1 bg-background">
          <EventsContent />
        </main>
      </div>
    </SidebarProvider>;
}