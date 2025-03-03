
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/components/ui/use-toast";
import { Crown, Star } from 'lucide-react';
import { AppSidebar } from "@/components/AppSidebar";

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      <span className="text-[#FF7A00] font-medium">{rating.toFixed(2)}</span>
      <Star className="h-4 w-4 fill-[#FF7A00] text-[#FF7A00]" />
    </div>
  );
}

function AttendingList({ players, selectableCaptains, onCaptainSelect }) {
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
              <div className="flex items-center gap-2">
                <span className="font-semibold truncate">{player.name}</span>
                <StarRating rating={player.rating} />
                {player.isCaptain && <Crown className="h-4 w-4 text-yellow-500" />}
              </div>
              <span className="text-sm text-muted-foreground truncate">{player.position || 'Unassigned'}</span>
            </div>
            {selectableCaptains && (
              <Checkbox
                checked={player.isCaptain}
                onCheckedChange={(checked) => onCaptainSelect(player.id, checked)}
                aria-label={`Select ${player.name} as captain`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function SelectCaptains() {
  const { eventId } = useParams();
  const [selectingCaptains, setSelectingCaptains] = useState(false);
  const [players, setPlayers] = useState([
    { id: 1, name: 'John Smith', avatar: '/placeholder.svg?height=48&width=48', position: 'Forward', isCaptain: false, rating: 2.75 },
    { id: 2, name: 'Alex Johnson', avatar: '/placeholder.svg?height=48&width=48', position: 'Midfielder', isCaptain: false, rating: 3.0 },
    { id: 5, name: 'Pat Taylor', avatar: '/placeholder.svg?height=48&width=48', position: 'Goalkeeper', isCaptain: false, rating: 2.5 },
    { id: 6, name: 'Mike Davis', avatar: '/placeholder.svg?height=48&width=48', position: 'Midfielder', isCaptain: false, rating: 1.5 },
    { id: 7, name: 'Tom Wilson', avatar: '/placeholder.svg?height=48&width=48', position: 'Defender', isCaptain: false, rating: 2.0 },
    { id: 9, name: 'Casey Morgan', avatar: '/placeholder.svg?height=48&width=48', position: 'Forward', isCaptain: false, rating: 2.25 },
    { id: 10, name: 'Jordan Riley', avatar: '/placeholder.svg?height=48&width=48', position: 'Goalkeeper', isCaptain: false, rating: 1.75 }
  ]);

  // Mock data for upcoming event
  const eventData = {
    date: '15-Aug-2023',
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
  };

  const handleCaptainSelect = (playerId, isSelected) => {
    const captainCount = players.filter(p => p.isCaptain).length;
    if (isSelected && captainCount >= 2) {
      toast({
        title: "Captain selection limit reached",
        description: "You can only select two captains.",
        variant: "destructive",
      });
      return;
    }
    setPlayers(players.map(player => 
      player.id === playerId ? { ...player, isCaptain: isSelected } : player
    ));
  };

  const handleConfirmCaptains = () => {
    const selectedCaptains = players.filter(p => p.isCaptain);
    if (selectedCaptains.length === 2) {
      setSelectingCaptains(false);
      toast({
        title: "Captains selected",
        description: "The captains have been successfully selected.",
      });
    } else {
      toast({
        title: "Invalid captain selection",
        description: "Please select exactly two captains.",
        variant: "destructive",
      });
    }
  };

  const renderTeamInfo = (team, teamNumber) => (
    <div className="flex flex-col items-center space-y-2">
      <Avatar className="w-16 h-16" style={{ backgroundColor: team.color }}>
        <AvatarImage src={team.avatar} alt={`Team ${teamNumber}`} />
        <AvatarFallback>{`T${teamNumber}`}</AvatarFallback>
      </Avatar>
      <span className="text-sm font-semibold">{`Team ${teamNumber}`}</span>
    </div>
  );

  return (
    <div className="flex h-screen">
      <AppSidebar />
      <div className="flex-1 overflow-auto">
        <Button
          variant="ghost"
          size="sm"
          className="fixed top-4 right-4 z-10 text-[#FF7A00] hover:text-[#FF7A00] hover:bg-transparent p-0 hover:underline"
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
                  {!selectingCaptains ? (
                    <Button onClick={() => setSelectingCaptains(true)}>
                      Select Captains
                    </Button>
                  ) : (
                    <Button onClick={handleConfirmCaptains}>
                      Confirm Captains
                    </Button>
                  )}
                </div>

                <div className="pt-8 border-t">
                  <h3 className="text-lg font-semibold mb-4">Attending Players ({players.length})</h3>
                  <AttendingList 
                    players={players} 
                    selectableCaptains={selectingCaptains}
                    onCaptainSelect={handleCaptainSelect}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
