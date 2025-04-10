import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Crown, Star, Loader2 } from "lucide-react";

import { useQuery } from "@tanstack/react-query";
import { fetchEventById } from "@/api/events";
import { TeamType } from "@/types/events";
import { UserType } from "@/contexts/AuthContext";

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      <span className="font-medium text-accent-orange">
        {rating.toFixed(2)}
      </span>
      <Star className="h-4 w-4 fill-accent-orange text-accent-orange" />
    </div>
  );
}

function AttendingList({
  players,
  captainIds,
  selectableCaptains,
  onCaptainSelect,
}: {
  players: UserType[];
  captainIds: string[];
  selectableCaptains: boolean;
  onCaptainSelect: (playerId: string, checked: boolean) => void;
}) {
  return (
    <div className="w-full">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        {players.map((player) => {
          const playerIsCaptain = captainIds.includes(player.id);

          return (
            <label
              htmlFor={player.id}
              key={player.id}
              className={`flex cursor-pointer items-center gap-3 rounded-md border p-2 ${playerIsCaptain ? "border-accent-orange" : ""}`}
            >
              {selectableCaptains && (
                <Checkbox
                  checked={playerIsCaptain}
                  onCheckedChange={(checked) =>
                    onCaptainSelect(player.id, !!checked)
                  }
                  aria-label={`Select ${player.full_name} as captain`}
                  id={player.id}
                />
              )}
              <Avatar className="h-10 w-10">
                <AvatarImage src={player.avatar_url} alt={player.full_name} />
                <AvatarFallback>
                  {player.full_name
                    .split(" ")
                    .map((n: string) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="truncate font-semibold">
                    {player.full_name}
                  </span>
                  {/* <StarRating rating={player.rating} /> */}
                  {playerIsCaptain && (
                    <Crown className="h-4 w-4 text-yellow-500" />
                  )}
                </div>
                <span className="truncate text-sm text-muted-foreground">
                  {player.positions[0] || "Unassigned"}
                </span>
              </div>
            </label>
          );
        })}
      </div>
    </div>
  );
}

export default function SelectCaptains() {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectingCaptains, setSelectingCaptains] = useState(false);
  const [players, setPlayers] = useState<UserType[]>([]);
  const [captainIds, setCaptainIds] = useState<string[]>([]);

  const {
    data: { data: event },
    isLoading,
  } = useQuery({
    queryKey: [`event-${eventId}`],
    queryFn: () => fetchEventById(eventId),
    initialData: { data: null, error: null },
  });

  useEffect(() => {
    if (event) {
      setPlayers(event.players);
      if (event.teams[0].captain && event.teams[1].captain) {
        setCaptainIds(event.teams.map((team) => team.captain.id));
      }
    }
  }, [event]);

  const handleCaptainSelect = (playerId: string, isSelected: boolean) => {
    if (isSelected && captainIds.length >= 2) {
      toast.error("You can only select two captains");
      return;
    }
    if (isSelected) {
      setCaptainIds((curr) => [...curr, playerId]);
    } else {
      setCaptainIds((curr) => curr.filter((id) => id !== playerId));
    }
  };

  const handleCancelEditing = () => {
    setCaptainIds([]);
    setSelectingCaptains(false);
  };

  const handleConfirmCaptains = async () => {
    if (captainIds.length !== 2) {
      toast.error("Please select exactly two captains");
      return;
    }

    setIsSubmitting(true);
    toast.success("Captains selected successfully", {
      style: { color: "#16a34a" },
    });
    setIsSubmitting(false);
    setSelectingCaptains(false);
  };

  const renderTeamInfo = (team: TeamType, teamNumber: number) => (
    <div className="flex flex-col items-center space-y-2">
      <Avatar
        className="h-16 w-16 border-2"
        style={{ borderColor: team.color }}
      >
        <AvatarImage src={team.logo} alt={`Team ${teamNumber}`} />
        <AvatarFallback>{`T${teamNumber}`}</AvatarFallback>
      </Avatar>
      <span className="text-sm font-semibold">
        {team.name || `Team ${teamNumber}`}
      </span>
    </div>
  );

  if (isLoading) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-accent-orange" />
      </div>
    );
  }

  return (
    <main className="relative flex-1 bg-background">
      <div className="absolute left-4 top-4 z-50"></div>
      <Button
        variant="ghost"
        size="sm"
        className="fixed right-4 top-4 z-10 p-0 text-accent-orange hover:bg-transparent hover:text-accent-orange hover:underline"
        onClick={() => navigate("/events")}
      >
        Back to Events
      </Button>
      <div className="container mx-auto px-4 py-8">
        <Card className="mx-auto max-w-3xl">
          <CardHeader>
            <CardTitle className="text-center text-2xl font-bold">
              Upcoming Match
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {event && (
                <div className="mb-8 flex items-center justify-center gap-8">
                  {renderTeamInfo(event.teams[0], 1)}
                  <div className="flex flex-col items-center justify-center">
                    <div className="mb-4 flex flex-col items-center text-center">
                      <span className="text-xs text-gray-500">
                        {new Date(event.startDate.date).toLocaleDateString()}
                      </span>
                      <span className="text-xs text-gray-500">
                        {event.location}
                      </span>
                      <span className="text-xs text-gray-500">
                        {event.startDate.startHour}:
                        {event.startDate.startMinute}
                      </span>
                      <span className="text-xs font-bold text-accent-orange">
                        {event.league.name}
                      </span>
                    </div>
                    <span className="text-2xl font-bold">vs</span>
                  </div>
                  {renderTeamInfo(event.teams[1], 2)}
                </div>
              )}

              <div className="flex items-center justify-center gap-4">
                {!selectingCaptains ? (
                  <Button onClick={() => setSelectingCaptains(true)}>
                    Select Captains
                  </Button>
                ) : (
                  <>
                    <Button
                      onClick={handleConfirmCaptains}
                      disabled={isSubmitting}
                      className="bg-accent-orange text-white hover:bg-accent-orange/90"
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
                    <Button
                      onClick={handleCancelEditing}
                      disabled={isSubmitting}
                      variant="outline"
                    >
                      Cancel
                    </Button>
                  </>
                )}
              </div>

              <div className="border-t pt-8">
                <h3 className="mb-4 text-lg font-semibold">
                  Attending Players ({players.length})
                </h3>
                <AttendingList
                  players={players}
                  captainIds={captainIds}
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
