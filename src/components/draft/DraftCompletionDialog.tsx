
import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Star, Check } from 'lucide-react';
import { toast } from "@/components/ui/use-toast";

// Re-use the JerseyIcon component for consistency
const JerseyIcon = ({ color, size = 24 }: { color: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color} xmlns="http://www.w3.org/2000/svg">
    <path d="M20 8.5V20.5H4V8.5L8 4.5H16L20 8.5Z" stroke={color === '#FFFFFF' ? '#000000' : 'black'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M8 4.5H16V8.5H8V4.5Z" stroke={color === '#FFFFFF' ? '#000000' : 'black'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// PlayerRating component for consistency
const PlayerRating = ({ rating }: { rating: number }) => (
  <div className="flex items-center text-[#FF7A00] font-bold">
    <span className="mr-1">{rating.toFixed(2)}</span>
    <Star className="w-4 h-4 fill-[#FF7A00]" />
  </div>
);

interface Player {
  id: number;
  name: string;
  avatar: string;
  position: string;
  rating: number;
}

interface Team {
  id: number;
  name: string;
  color: string;
  players: Player[];
  captain: string | null;
  confirmed?: boolean;
}

interface DraftCompletionDialogProps {
  open: boolean;
  teams: Team[];
  onOpenChange: (open: boolean) => void;
  onConfirmTeam: (teamId: number) => void;
  onFinalizeDraft: () => void;
}

export function DraftCompletionDialog({
  open,
  teams,
  onOpenChange,
  onConfirmTeam,
  onFinalizeDraft
}: DraftCompletionDialogProps) {
  const allTeamsConfirmed = teams.every(team => team.confirmed);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center text-[#FF7A00]">
            Draft Complete!
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <p className="text-center mb-6">
            Review the final team rosters below. All captains must confirm their team to finalize the draft.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto max-h-[50vh]">
            {teams.map((team) => (
              <Card key={team.id} className="overflow-hidden border-2" style={{ borderColor: team.color }}>
                <CardHeader className="p-4" style={{ backgroundColor: `${team.color}20` }}>
                  <CardTitle className="flex items-center space-x-2">
                    <JerseyIcon color={team.color} size={24} />
                    <span>{team.name}</span>
                    {team.confirmed && (
                      <div className="ml-auto bg-green-500 text-white p-1 rounded-full">
                        <Check className="h-4 w-4" />
                      </div>
                    )}
                  </CardTitle>
                  <div className="flex items-center space-x-2 mt-2">
                    <Avatar className="w-8 h-8">
                      <AvatarImage 
                        src={team.players[0]?.avatar} 
                        alt={team.captain || ''} 
                      />
                      <AvatarFallback>
                        {team.captain?.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">Captain: {team.captain}</span>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <h4 className="font-semibold mb-2">Players ({team.players.length})</h4>
                  <ScrollArea className="h-48 rounded-md border p-2">
                    {team.players.map((player) => (
                      <div key={player.id} className="flex items-center justify-between p-2 border-b last:border-0">
                        <div className="flex items-center space-x-2">
                          <Avatar className="w-8 h-8">
                            <AvatarImage src={player.avatar} alt={player.name} />
                            <AvatarFallback>{player.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{player.name}</p>
                            <p className="text-sm text-gray-500">{player.position}</p>
                          </div>
                        </div>
                        <PlayerRating rating={player.rating} />
                      </div>
                    ))}
                  </ScrollArea>
                  
                  <div className="mt-4">
                    <Button 
                      onClick={() => onConfirmTeam(team.id)}
                      className="w-full"
                      variant={team.confirmed ? "outline" : "default"}
                      disabled={team.confirmed}
                      style={team.confirmed ? {} : { backgroundColor: team.color }}
                    >
                      {team.confirmed ? "Confirmed!" : "Confirm Team Roster"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        
        <DialogFooter>
          <Button 
            onClick={onFinalizeDraft} 
            disabled={!allTeamsConfirmed}
            className="w-full bg-[#FF7A00] hover:bg-[#FF7A00]/90 text-white"
          >
            Finalize Draft
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
