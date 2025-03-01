
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { ArrowLeft } from 'lucide-react';

function CountdownClock({ deadline }: { deadline: Date }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0 });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const difference = deadline.getTime() - now.getTime();

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60)
        });
      } else {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [deadline]);

  return (
    <div className="text-lg font-semibold flex space-x-4">
      <div className="flex flex-col items-center">
        <span>{timeLeft.days}</span>
        <span className="text-xs text-gray-500">days</span>
      </div>
      <div className="flex flex-col items-center">
        <span>{timeLeft.hours}</span>
        <span className="text-xs text-gray-500">hours</span>
      </div>
      <div className="flex flex-col items-center">
        <span>{timeLeft.minutes}</span>
        <span className="text-xs text-gray-500">minutes</span>
      </div>
    </div>
  );
}

interface Player {
  id: number;
  name: string;
  avatar: string;
  position?: string;
}

function AttendingList({ players }: { players: Player[] }) {
  return (
    <div className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {players.map((player) => (
          <div key={player.id} className="flex items-center gap-2">
            <Avatar className="w-10 h-10">
              <AvatarImage src={player.avatar} alt={player.name} />
              <AvatarFallback>{player.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1">
                <span className="font-semibold truncate">{player.name}</span>
              </div>
              <span className="text-sm text-muted-foreground truncate">{player.position || 'Unassigned'}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function EventDetailsContent() {
  const navigate = useNavigate();
  const { id } = useParams();
  
  // Mock data for upcoming event
  const eventData = {
    date: '15-Aug-2025',
    time: '8:00 PM',
    location: 'Old Trafford',
    league: 'Premier League',
    team1: {
      avatar: '/placeholder.svg?height=64&width=64',
      color: '#DA291C',
    },
    team2: {
      avatar: '/placeholder.svg?height=64&width=64',
      color: '#6CABDD',
    },
    players: [
      { id: 1, name: 'John Smith', avatar: '/placeholder.svg?height=48&width=48', position: 'Forward' },
      { id: 2, name: 'Alex Johnson', avatar: '/placeholder.svg?height=48&width=48', position: 'Midfielder' },
      { id: 5, name: 'Pat Taylor', avatar: '/placeholder.svg?height=48&width=48', position: 'Goalkeeper' },
      { id: 6, name: 'Mike Davis', avatar: '/placeholder.svg?height=48&width=48', position: 'Midfielder' },
      { id: 7, name: 'Tom Wilson', avatar: '/placeholder.svg?height=48&width=48', position: 'Defender' },
      { id: 9, name: 'Casey Morgan', avatar: '/placeholder.svg?height=48&width=48', position: 'Forward' },
      { id: 10, name: 'Jordan Riley', avatar: '/placeholder.svg?height=48&width=48', position: 'Goalkeeper' }
    ],
    rsvpDeadline: new Date('2025-08-14T20:00:00')
  };

  const renderTeamInfo = (team: any, teamNumber: number) => (
    <div className="flex flex-col items-center space-y-2">
      <Avatar className="w-16 h-16" style={{ backgroundColor: team.color }}>
        <AvatarImage src={team.avatar} alt={`Team ${teamNumber}`} />
        <AvatarFallback>{`T${teamNumber}`}</AvatarFallback>
      </Avatar>
      <span className="text-sm font-semibold">{`Team ${teamNumber}`}</span>
    </div>
  );

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        className="fixed top-4 right-4 z-10 text-[#FF7A00] hover:text-[#FF7A00] hover:bg-transparent p-0 hover:underline"
        onClick={() => navigate(-1)}
      >
        Previous
      </Button>
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Upcoming Match</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              <div className="flex items-center justify-center gap-8 mb-8">
                {renderTeamInfo(eventData.team1, 1)}
                <div className="flex flex-col items-center justify-center">
                  <div className="flex flex-col items-center mb-4 text-center">
                    <span className="text-xs text-gray-500">{eventData.date}</span>
                    <span className="text-xs text-gray-500">{eventData.location}</span>
                    <span className="text-xs text-gray-500">{eventData.time}</span>
                    <span className="text-xs font-bold text-[#FF7A00]">{eventData.league}</span>
                  </div>
                  <span className="text-2xl font-bold">vs</span>
                </div>
                {renderTeamInfo(eventData.team2, 2)}
              </div>

              <div className="flex flex-col items-center space-y-4">
                <h2 className="text-xl font-bold">RSVP Countdown</h2>
                <CountdownClock deadline={eventData.rsvpDeadline} />
              </div>

              <div className="pt-8 border-t">
                <h3 className="text-lg font-semibold mb-4">Attending Players ({eventData.players.length})</h3>
                <AttendingList players={eventData.players} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

export default function EventDetails() {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1 bg-background relative">
          <div className="absolute top-4 left-4 z-50">
            <SidebarTrigger className="bg-white shadow-md" />
          </div>
          <EventDetailsContent />
        </main>
      </div>
    </SidebarProvider>
  );
}
