import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Crown, Star, Loader2 } from "lucide-react";

import { selectEventCaptains } from "@/api/captains";
import { fetchEventById } from "@/api/events2";
import { getAttendingPlayers } from "@/api/events2";
import { useAuth } from "@/contexts/AuthContext";

interface Player {
  id: string;
  name: string;
  avatar: string;
  position: string;
  rating: number;
  isCaptain: boolean;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      <span className="text-[#FF7A00] font-medium">{rating.toFixed(2)}</span>
      <Star className="h-4 w-4 fill-[#FF7A00] text-[#FF7A00]" />
    </div>
  );
}

function AttendingList({
  players,
  selectableCaptains,
  onCaptainSelect,
}: {
  players: Player[];
  selectableCaptains: boolean;
  onCaptainSelect: (playerId: string, checked: boolean) => void;
}) {
  return (
    <div className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {players.map((player) => (
          <div key={player.id} className="flex items-center gap-2">
            <Avatar className="w-10 h-10">
              <AvatarImage src={player.avatar} alt={player.name} />
              <AvatarFallback>
                {player.name
                  .split(" ")
                  .map((n: string) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-semibold truncate">{player.name}</span>
                <StarRating rating={player.rating} />
                {player.isCaptain && (
                  <Crown className="h-4 w-4 text-yellow-500" />
                )}
              </div>
              <span className="text-sm text-muted-foreground truncate">
                {player.position || "Unassigned"}
              </span>
            </div>
            {selectableCaptains && (
              <Checkbox
                checked={player.isCaptain}
                onCheckedChange={(checked) =>
                  onCaptainSelect(player.id, !!checked)
                }
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
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectingCaptains, setSelectingCaptains] = useState(false);
  const [players, setPlayers] = useState<Player[]>([]);
  const [event, setEvent] = useState<any>(null);

  useEffect(() => {
    const loadEventData = async () => {
      if (!eventId) return;

      setIsLoading(true);
      try {
        // Fetch event details
        const eventData = await fetchEventById(eventId);
        if (eventData) {
          setEvent(eventData);
        }

        // Fetch attending players
        const attendingPlayersData = await getAttendingPlayers(eventId);
        setPlayers(attendingPlayersData);

        setSelectingCaptains(true);
      } catch (error) {
        console.error("Error loading event data:", error);
        toast.error("Failed to load event data");
      } finally {
        setIsLoading(false);
      }
    };

    loadEventData();
  }, [eventId]);

  const handleCaptainSelect = (playerId: string, isSelected: boolean) => {
    const captainCount = players.filter((p) => p.isCaptain).length;

    if (isSelected && captainCount >= 2) {
      toast.error("You can only select two captains");
      return;
    }

    setPlayers(
      players.map((player) =>
        player.id === playerId ? { ...player, isCaptain: isSelected } : player
      )
    );
  };

  const handleConfirmCaptains = async () => {
    const selectedCaptains = players.filter((p) => p.isCaptain);

    if (selectedCaptains.length !== 2) {
      toast.error("Please select exactly two captains");
      return;
    }

    setIsSubmitting(true);
    try {
      const success = await selectEventCaptains(
        eventId!,
        selectedCaptains[0].id,
        selectedCaptains[1].id
      );

      if (success) {
        toast.success("Captains selected successfully");
        navigate(`/events/${eventId}`);
      } else {
        toast.error("Failed to select captains");
      }
    } catch (error) {
      console.error("Error selecting captains:", error);
      toast.error("An error occurred while selecting captains");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderTeamInfo = (team: any, teamNumber: number) => (
    <div className="flex flex-col items-center space-y-2">
      <Avatar className="w-16 h-16" style={{ backgroundColor: team.color }}>
        <AvatarImage src={team.avatar} alt={`Team ${teamNumber}`} />
        <AvatarFallback>{`T${teamNumber}`}</AvatarFallback>
      </Avatar>
      <span className="text-sm font-semibold">
        {team.name || `Team ${teamNumber}`}
      </span>
    </div>
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 text-[#FF7A00] animate-spin" />
      </div>
    );
  }

  return (
    <main className="flex-1 bg-background relative">
      <div className="absolute top-4 left-4 z-50"></div>
      <Button
        variant="ghost"
        size="sm"
        className="fixed top-4 right-4 z-10 text-[#FF7A00] hover:text-[#FF7A00] hover:bg-transparent p-0 hover:underline"
        onClick={() => navigate("/events")}
      >
        Back to Events
      </Button>
      <div className="container mx-auto px-4 py-8 ">
        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              Upcoming Match
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {event && (
                <div className="flex items-center justify-center gap-8 mb-8">
                  {renderTeamInfo(event.team1, 1)}
                  <div className="flex flex-col items-center justify-center">
                    <div className="flex flex-col items-center mb-4 text-center">
                      <span className="text-xs text-gray-500">
                        {event.date}
                      </span>
                      <span className="text-xs text-gray-500">
                        {event.location}
                      </span>
                      <span className="text-xs text-gray-500">
                        {event.time}
                      </span>
                      <span className="text-xs font-bold text-[#FF7A00]">
                        {event.league}
                      </span>
                    </div>
                    <span className="text-2xl font-bold">vs</span>
                  </div>
                  {renderTeamInfo(event.team2, 2)}
                </div>
              )}

              <div className="flex flex-col items-center space-y-4">
                {!selectingCaptains ? (
                  <Button onClick={() => setSelectingCaptains(true)}>
                    Select Captains
                  </Button>
                ) : (
                  <Button
                    onClick={handleConfirmCaptains}
                    disabled={isSubmitting}
                    className="bg-[#FF7A00] hover:bg-[#FF7A00]/90 text-white"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Confirming...
                      </>
                    ) : (
                      "Confirm Captains"
                    )}
                  </Button>
                )}
              </div>

              <div className="pt-8 border-t">
                <h3 className="text-lg font-semibold mb-4">
                  Attending Players ({players.length})
                </h3>
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
    </main>
  );
}
