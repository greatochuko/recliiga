
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Calendar, Clock, AlertCircle } from 'lucide-react';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isAttending, setIsAttending] = useState(false);

  // Mock event data
  const event = {
    id: id,
    date: '20-Aug-2025',
    time: '6:00 PM',
    location: 'Allianz Arena',
    league: 'Premier League',
    description: 'Regular season match between Eagle Claws and Ravens. Both teams are fighting for the top position in the league table.',
    team1: { 
      name: 'Eagle Claws', 
      avatar: '/placeholder.svg?height=64&width=64', 
      color: '#272D31',
      players: [
        { id: 1, name: 'John Smith', avatar: '/placeholder.svg?height=48&width=48', position: 'Captain' },
        { id: 2, name: 'Alex Johnson', avatar: '/placeholder.svg?height=48&width=48', position: 'Midfielder' },
        { id: 3, name: 'Sam Williams', avatar: '/placeholder.svg?height=48&width=48', position: 'Defender' },
      ]
    },
    team2: { 
      name: 'Ravens', 
      avatar: '/placeholder.svg?height=64&width=64', 
      color: '#FFC700',
      players: [
        { id: 4, name: 'Mike Davis', avatar: '/placeholder.svg?height=48&width=48', position: 'Captain' },
        { id: 5, name: 'Tom Wilson', avatar: '/placeholder.svg?height=48&width=48', position: 'Defender' },
        { id: 6, name: 'Jamie Lee', avatar: '/placeholder.svg?height=48&width=48', position: 'Midfielder' },
      ]
    },
    rsvpDeadline: new Date('2025-08-19T18:00:00')
  };

  const handleAttendanceChange = () => {
    if (isAttending) {
      setShowConfirmDialog(true);
    } else {
      setIsAttending(true);
    }
  };

  const handleCancelAttendance = () => {
    setIsAttending(false);
    setShowConfirmDialog(false);
  };

  function EventDetailsContent() {
    return (
      <div className="container mx-auto px-4 py-8 pt-10 max-w-3xl">
        <Button 
          variant="ghost" 
          className="mb-4 text-[#FF7A00] p-0 hover:bg-transparent hover:text-[#FF7A00]/90 hover:underline"
          onClick={() => navigate('/events')}
        >
          ← Back to Events
        </Button>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Match Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-center gap-8 mb-4">
              <div className="flex flex-col items-center">
                <Avatar className="w-20 h-20" style={{ backgroundColor: event.team1.color }}>
                  <AvatarImage src={event.team1.avatar} alt={event.team1.name} />
                  <AvatarFallback>{event.team1.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <span className="mt-2 font-semibold">{event.team1.name}</span>
              </div>
              <div className="flex flex-col items-center justify-center">
                <span className="text-2xl font-bold mb-2">vs</span>
                <span className="text-sm font-bold text-[#FF7A00]">{event.league}</span>
              </div>
              <div className="flex flex-col items-center">
                <Avatar className="w-20 h-20" style={{ backgroundColor: event.team2.color }}>
                  <AvatarImage src={event.team2.avatar} alt={event.team2.name} />
                  <AvatarFallback>{event.team2.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <span className="mt-2 font-semibold">{event.team2.name}</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center p-4 bg-gray-50 rounded-lg">
              <div className="flex flex-col items-center">
                <Calendar className="w-5 h-5 text-gray-500 mb-1" />
                <span className="text-sm font-medium">{event.date}</span>
              </div>
              <div className="flex flex-col items-center">
                <Clock className="w-5 h-5 text-gray-500 mb-1" />
                <span className="text-sm font-medium">{event.time}</span>
              </div>
              <div className="flex flex-col items-center">
                <MapPin className="w-5 h-5 text-gray-500 mb-1" />
                <span className="text-sm font-medium">{event.location}</span>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2">Event Description</h3>
              <p className="text-gray-700">{event.description}</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">{event.team1.name} Roster</h3>
                {event.team1.players.map(player => (
                  <div key={player.id} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={player.avatar} alt={player.name} />
                      <AvatarFallback>{player.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                      <span className="font-medium">{player.name}</span>
                      <p className="text-xs text-gray-500">{player.position}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">{event.team2.name} Roster</h3>
                {event.team2.players.map(player => (
                  <div key={player.id} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={player.avatar} alt={player.name} />
                      <AvatarFallback>{player.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                      <span className="font-medium">{player.name}</span>
                      <p className="text-xs text-gray-500">{player.position}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex justify-center pt-4 border-t">
              <Button 
                className={`w-full max-w-md py-2 ${isAttending ? 'bg-white text-[#FF7A00] border border-[#FF7A00] hover:bg-[#FF7A00]/10' : 'bg-[#FF7A00] hover:bg-[#FF7A00]/90 text-white'}`}
                onClick={handleAttendanceChange}
              >
                {isAttending ? "Cancel Attendance" : "Confirm Attendance"}
              </Button>
            </div>
            
            <div className="flex items-center gap-2 text-amber-600 justify-center">
              <AlertCircle className="w-4 h-4" />
              <p className="text-sm">
                RSVP Deadline: {event.rsvpDeadline.toLocaleDateString('en-US', { 
                  day: '2-digit', 
                  month: 'short',
                  year: 'numeric'
                })}
              </p>
            </div>
          </CardContent>
        </Card>
        
        <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Cancel your attendance?</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to cancel your attendance for this event? Your spot may be given to another player.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>No, keep me in</AlertDialogCancel>
              <AlertDialogAction onClick={handleCancelAttendance}>
                Yes, cancel my attendance
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    );
  }

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
