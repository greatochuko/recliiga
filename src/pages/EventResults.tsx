
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";

function TeamRoster({ team, attendance }: { team: any, attendance: Record<string, boolean> }) {
  const navigate = useNavigate();
  
  const handleViewProfile = () => {
    navigate('/player-profile');
  };
  
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-muted-foreground">Team members</h3>
      </div>
      <div className="space-y-4">
        <div 
          className="flex items-center gap-4 bg-gray-100 p-2 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors"
          onClick={handleViewProfile}
        >
          <Avatar className="w-12 h-12" style={{ backgroundColor: team.color }}>
            <AvatarImage src={team.captain.avatar} alt={team.captain.name} />
            <AvatarFallback>{team.captain.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-semibold">{team.captain.name}</span>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-[#FF7A00]"><path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14"/></svg>
            </div>
            <span className="text-sm text-muted-foreground">{team.captain.position}</span>
          </div>
          <Badge variant={attendance[team.captain.name] ? "default" : "secondary"}>
            {attendance[team.captain.name] ? "Present" : "Absent"}
          </Badge>
        </div>
        {team.players.map((player: any) => (
          <div 
            key={player.id} 
            className="flex items-center gap-4 cursor-pointer hover:bg-gray-100 p-2 rounded-lg transition-colors"
            onClick={handleViewProfile}
          >
            <Avatar className="w-12 h-12">
              <AvatarImage src={player.avatar} alt={player.name} />
              <AvatarFallback>{player.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <span className="font-semibold">{player.name}</span>
              <p className="text-sm text-muted-foreground">{player.position}</p>
            </div>
            <Badge variant={attendance[player.name] ? "default" : "secondary"}>
              {attendance[player.name] ? "Present" : "Absent"}
            </Badge>
          </div>
        ))}
      </div>
    </div>
  );
}

function EventResultsContent() {
  const navigate = useNavigate();
  const { id } = useParams();
  
  // Mock data for event results
  const eventData = {
    date: '15-Jul-2024',
    time: '8:00 PM',
    location: 'Old Trafford',
    league: 'Premier League',
    team1: {
      name: 'Red Devils',
      avatar: '/placeholder.svg?height=64&width=64',
      color: '#DA291C',
      score: 3,
      captain: {
        name: 'John Smith',
        avatar: '/placeholder.svg?height=48&width=48',
        position: 'Captain'
      },
      players: [
        { id: 1, name: 'Alex Johnson', avatar: '/placeholder.svg?height=48&width=48', position: 'Midfielder' },
        { id: 2, name: 'Sam Williams', avatar: '/placeholder.svg?height=48&width=48', position: 'Defender' },
        { id: 3, name: 'Chris Brown', avatar: '/placeholder.svg?height=48&width=48', position: 'Forward' },
        { id: 4, name: 'Pat Taylor', avatar: '/placeholder.svg?height=48&width=48', position: 'Goalkeeper' }
      ]
    },
    team2: {
      name: 'Sky Blues',
      avatar: '/placeholder.svg?height=64&width=64',
      color: '#6CABDD',
      score: 2,
      captain: {
        name: 'Mike Davis',
        avatar: '/placeholder.svg?height=48&width=48',
        position: 'Captain'
      },
      players: [
        { id: 5, name: 'Tom Wilson', avatar: '/placeholder.svg?height=48&width=48', position: 'Defender' },
        { id: 6, name: 'Jamie Lee', avatar: '/placeholder.svg?height=48&width=48', position: 'Midfielder' },
        { id: 7, name: 'Casey Morgan', avatar: '/placeholder.svg?height=48&width=48', position: 'Forward' },
        { id: 8, name: 'Jordan Riley', avatar: '/placeholder.svg?height=48&width=48', position: 'Goalkeeper' }
      ]
    }
  };

  // Mock attendance data
  const attendanceData = {
    'John Smith': true,
    'Alex Johnson': true,
    'Sam Williams': true,
    'Chris Brown': false,
    'Pat Taylor': true,
    'Mike Davis': true,
    'Tom Wilson': true,
    'Jamie Lee': false,
    'Casey Morgan': true,
    'Jordan Riley': true
  };

  const renderTeamScore = (team: any) => (
    <div className="flex flex-col items-center space-y-2">
      <Avatar className="w-16 h-16" style={{ backgroundColor: team.color }}>
        <AvatarImage src={team.avatar} alt={team.name} />
        <AvatarFallback>{team.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
      </Avatar>
      <span className="text-sm font-semibold">{team.name}</span>
      <span className="text-4xl font-bold">{team.score}</span>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8 relative">
      <Button 
        variant="ghost" 
        size="sm" 
        className="fixed top-4 right-4 z-10 text-[#FF7A00] hover:text-[#FF7A00] hover:bg-transparent p-0 hover:underline"
        onClick={() => navigate(-1)}
      >
        Previous
      </Button>
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Match Result</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            <div className="flex items-center justify-center gap-8 mb-8">
              {renderTeamScore(eventData.team1)}
              <div className="flex flex-col items-center justify-center">
                <div className="flex flex-col items-center mb-4 text-center">
                  <span className="text-xs text-gray-500">{eventData.date}</span>
                  <span className="text-xs text-gray-500">{eventData.location}</span>
                  <span className="text-xs text-gray-500">{eventData.time}</span>
                  <span className="text-xs font-bold text-[#FF7A00]">{eventData.league}</span>
                </div>
                <span className="text-2xl font-bold">vs</span>
              </div>
              {renderTeamScore(eventData.team2)}
            </div>

            <div className="text-center">
              <h2 className="text-xl font-bold mb-2">Final Result</h2>
              <p className="text-lg">
                {eventData.team1.name} {eventData.team1.score} - {eventData.team2.score} {eventData.team2.name}
              </p>
              <p className="text-md mt-2">
                {eventData.team1.score > eventData.team2.score
                  ? `${eventData.team1.name} win!`
                  : eventData.team2.score > eventData.team1.score
                  ? `${eventData.team2.name} win!`
                  : 'It\'s a draw!'}
              </p>
            </div>

            <h2 className="text-2xl font-bold mb-4">Attendance</h2>
            <div className="grid md:grid-cols-2 gap-8 pt-8 border-t">
              <TeamRoster 
                team={eventData.team1}
                attendance={attendanceData}
              />
              <TeamRoster 
                team={eventData.team2}
                attendance={attendanceData}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function EventResults() {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1 bg-background relative">
          <div className="absolute top-4 left-4 z-50">
            <SidebarTrigger className="bg-white shadow-md" />
          </div>
          <EventResultsContent />
        </main>
      </div>
    </SidebarProvider>
  );
}
