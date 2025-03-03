
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Crown, AlertCircle, Calendar, MapPin } from 'lucide-react';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";

function TeamRoster({ team, attendance, onAttendanceChange }) {
  const allChecked = team.players.every(player => attendance[player.name]) && attendance[team.captain.name];

  const handleSelectAll = (checked) => {
    const newAttendance = {};
    newAttendance[team.captain.name] = checked;
    team.players.forEach(player => {
      newAttendance[player.name] = checked;
    });
    onAttendanceChange(newAttendance);
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-muted-foreground">Team members</h3>
        <div className="flex items-center gap-2">
          <label
            htmlFor={`select-all-${team.name}`}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Select All
          </label>
          <Checkbox
            id={`select-all-${team.name}`}
            checked={allChecked}
            onCheckedChange={handleSelectAll}
            aria-label={`Select all players for ${team.name}`}
          />
        </div>
      </div>
      <div className="space-y-4">
        <div className="flex items-center gap-4 bg-gray-100 p-2 rounded-lg">
          <Avatar className="w-12 h-12" style={{ backgroundColor: team.color }}>
            <AvatarImage src={team.captain.avatar} alt={team.captain.name} />
            <AvatarFallback>{team.captain.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-semibold">{team.captain.name}</span>
              <Crown className="w-4 h-4 text-[#FF7A00]" />
            </div>
            <span className="text-sm text-muted-foreground">{team.captain.position}</span>
          </div>
          <Checkbox
            checked={attendance[team.captain.name] || false}
            onCheckedChange={(checked) => onAttendanceChange({ ...attendance, [team.captain.name]: checked })}
            aria-label={`Mark ${team.captain.name} as present`}
          />
        </div>
        {team.players.map((player) => (
          <div key={player.id} className="flex items-center gap-4">
            <Avatar className="w-12 h-12">
              <AvatarImage src={player.avatar} alt={player.name} />
              <AvatarFallback>{player.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <span className="font-semibold">{player.name}</span>
              <p className="text-sm text-muted-foreground">{player.position}</p>
            </div>
            <Checkbox
              checked={attendance[player.name] || false}
              onCheckedChange={(checked) => onAttendanceChange({ ...attendance, [player.name]: checked })}
              aria-label={`Mark ${player.name} as present`}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function EventResultsContent() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [team1Score, setTeam1Score] = useState('');
  const [team2Score, setTeam2Score] = useState('');
  const [attendance, setAttendance] = useState({});
  const [alertMessage, setAlertMessage] = useState('');

  // Mock data for team rosters
  const mockTeamData = {
    team1: {
      name: 'Red Devils',
      avatar: '/placeholder.svg?height=64&width=64',
      color: '#DA291C',
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

  const mockEvent = {
    date: '15-Jul-2024',
    time: '8:00 PM',
    location: 'Old Trafford',
    league: 'Premier League'
  };

  const handleAttendanceChange = (newAttendance) => {
    setAttendance(prev => ({
      ...prev,
      ...newAttendance
    }));
  };

  const updateScores = (team1Score: string, team2Score: string) => {
    const team1ScoreNum = parseInt(team1Score);
    const team2ScoreNum = parseInt(team2Score);

    if (team1ScoreNum && team2ScoreNum) {
      if (team1ScoreNum > team2ScoreNum) {
        setAlertMessage(`${mockTeamData.team1.name} beat ${mockTeamData.team2.name} ${team1Score}-${team2Score}`);
      } else if (team2ScoreNum > team1ScoreNum) {
        setAlertMessage(`${mockTeamData.team2.name} beat ${mockTeamData.team1.name} ${team2Score}-${team1Score}`);
      } else {
        setAlertMessage(`${mockTeamData.team1.name} and ${mockTeamData.team2.name} tied ${team1Score}-${team2Score}`);
      }
    } else {
      setAlertMessage('');
    }
  };

  const handleTeam1ScoreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newScore = e.target.value;
    setTeam1Score(newScore);
    updateScores(newScore, team2Score);
  };

  const handleTeam2ScoreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newScore = e.target.value;
    setTeam2Score(newScore);
    updateScores(team1Score, newScore);
  };

  const handleAddScore = (team: 'team1' | 'team2', amount: number) => {
    if (team === 'team1') {
      const newScore = (parseInt(team1Score) || 0) + amount;
      setTeam1Score(newScore.toString());
      updateScores(newScore.toString(), team2Score);
    } else {
      const newScore = (parseInt(team2Score) || 0) + amount;
      setTeam2Score(newScore.toString());
      updateScores(team1Score, newScore.toString());
    }
  };

  const handleNumberInput = (team: 'team1' | 'team2', number: string) => {
    if (team === 'team1') {
      const newScore = team1Score + number;
      setTeam1Score(newScore);
      updateScores(newScore, team2Score);
    } else {
      const newScore = team2Score + number;
      setTeam2Score(newScore);
      updateScores(team1Score, newScore);
    }
  };

  const handleClear = (team: 'team1' | 'team2') => {
    if (team === 'team1') {
      setTeam1Score('');
      updateScores('', team2Score);
    } else {
      setTeam2Score('');
      updateScores(team1Score, '');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitting scores:', { team1Score, team2Score });
    console.log('Attendance:', attendance);
  };

  const renderScoreInput = (team: 'team1' | 'team2') => {
    const score = team === 'team1' ? team1Score : team2Score;
    const teamData = team === 'team1' ? mockTeamData.team1 : mockTeamData.team2;

    return (
      <div className="flex flex-col items-center space-y-2">
        <Avatar className="w-16 h-16" style={{ backgroundColor: teamData.color }}>
          <AvatarImage src={teamData.avatar} alt={teamData.name} />
          <AvatarFallback>{teamData.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
        </Avatar>
        <span className="text-sm font-semibold">{teamData.name}</span>
        <Input
          type="number"
          value={score}
          onChange={team === 'team1' ? handleTeam1ScoreChange : handleTeam2ScoreChange}
          className="w-24 text-center"
          min="0"
          required
        />
        <div className="flex space-x-2">
          <Button type="button" onClick={() => handleAddScore(team, 2)} size="sm" variant="outline">+2</Button>
          <Button type="button" onClick={() => handleAddScore(team, 3)} size="sm" variant="outline">+3</Button>
          <Button type="button" onClick={() => handleAddScore(team, 10)} size="sm" variant="outline">+10</Button>
        </div>
        <div className="grid grid-cols-5 gap-1">
          {['1', '2', '3', '4', '5'].map((num) => (
            <Button key={num} type="button" onClick={() => handleNumberInput(team, num)} size="sm" variant="outline">{num}</Button>
          ))}
        </div>
        <div className="grid grid-cols-5 gap-1">
          {['6', '7', '8', '9', '0'].map((num) => (
            <Button key={num} type="button" onClick={() => handleNumberInput(team, num)} size="sm" variant="outline">{num}</Button>
          ))}
        </div>
        <Button type="button" onClick={() => handleClear(team)} size="sm" variant="outline" className="w-full">Clear</Button>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
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
          <CardTitle className="text-2xl font-bold text-center">Input Match Result</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="flex items-center justify-center gap-8 mb-8">
              {renderScoreInput('team1')}
              <div className="flex flex-col items-center justify-center">
                <div className="flex items-center mb-1">
                  <Calendar className="w-4 h-4 text-gray-500 mr-2" />
                  <span className="text-xs text-gray-500 mr-2">{mockEvent.date}</span>
                  <span className="text-xs text-gray-500">{mockEvent.time}</span>
                </div>
                <div className="flex items-center mb-1">
                  <MapPin className="w-4 h-4 text-gray-500 mr-2" />
                  <span className="text-xs text-gray-500">{mockEvent.location}</span>
                </div>
                <span className="text-xs font-bold text-[#FF7A00] mb-2">{mockEvent.league}</span>
                <span className="text-2xl font-bold">vs</span>
              </div>
              {renderScoreInput('team2')}
            </div>

            {alertMessage && (
              <div className="flex justify-center">
                <Alert variant="destructive" className="max-w-sm w-full text-center">
                  <div className="flex items-center justify-center w-full">
                    <AlertCircle className="h-4 w-4 mr-2" />
                    <AlertDescription>{alertMessage}</AlertDescription>
                  </div>
                </Alert>
              </div>
            )}

            <h2 className="text-2xl font-bold mb-4">Attendance</h2>
            <div className="grid md:grid-cols-2 gap-8 pt-8 border-t">
              <TeamRoster 
                team={mockTeamData.team1}
                attendance={attendance}
                onAttendanceChange={handleAttendanceChange}
              />
              <TeamRoster 
                team={mockTeamData.team2}
                attendance={attendance}
                onAttendanceChange={handleAttendanceChange}
              />
            </div>

            <div className="flex justify-center pt-4">
              <Button type="submit" className="bg-[#FF7A00] hover:bg-[#E66900] text-white">
                Submit Result
              </Button>
            </div>
          </form>
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
          <div className="absolute top-4 left-4 z-50 flex items-center">
            <SidebarTrigger className="bg-white shadow-md" />
            <h1 className="ml-4 text-2xl font-bold">Match Results</h1>
          </div>
          <EventResultsContent />
        </main>
      </div>
    </SidebarProvider>
  );
}
