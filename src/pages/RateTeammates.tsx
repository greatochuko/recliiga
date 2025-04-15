import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

import { RatingDialog } from "@/components/rating/RatingDialog";
import { useQuery } from "@tanstack/react-query";
import { fetchLeaguesByUser } from "@/api/league";
import { UserType } from "@/contexts/AuthContext";
import FullScreenLoader from "@/components/FullScreenLoader";

export default function RateTeammates() {
  const [players, setPlayers] = useState<UserType[]>([]);

  const navigate = useNavigate();

  const {
    data: { leagues },
    isLoading,
  } = useQuery({
    queryKey: ["players"],
    queryFn: fetchLeaguesByUser,
    initialData: { leagues: [], error: null },
  });

  useEffect(() => {
    if (!isLoading) {
      setPlayers(leagues.flatMap((league) => league.players));
    }
  }, [isLoading, leagues]);

  const handleRatingSubmit = (playerId: string) => {
    setPlayers(players.filter((player) => player.id !== playerId));
  };

  if (isLoading) {
    return <FullScreenLoader />;
  }

  return (
    <main className="relative flex-1 bg-background">
      <h1 className="ml-14 text-2xl font-bold">Rate Teammates</h1>

      <div className="">
        <div className="mx-auto max-w-4xl p-4">
          <div className="mb-4 ml-auto flex w-fit items-center justify-between px-2">
            <Button
              variant="ghost"
              className="p-0 text-accent-orange hover:bg-transparent hover:text-accent-orange hover:underline"
              onClick={() => navigate(-1)}
            >
              Previous
            </Button>
          </div>
          {players.length > 0 ? (
            <>
              <p className="mb-6 text-gray-600">
                Click on the player or star icons to rate your teammates'
                performance.
              </p>
              <div className="grid grid-cols-2 gap-2">
                {players.map((player) => (
                  <RatingDialog
                    key={player.id}
                    player={player}
                    onRatingSubmit={handleRatingSubmit}
                  />
                ))}
              </div>
            </>
          ) : (
            <div className="py-12 text-center">
              <h2 className="mb-4 text-2xl font-bold text-accent-orange">
                All Teammates Rated!
              </h2>
              <p className="mb-6 text-gray-600">
                Thank you for providing feedback on all your teammates. Your
                input is valuable for improving team performance.
              </p>
              <Button
                className="rounded-lg bg-accent-orange px-6 py-3 text-lg font-bold text-white hover:bg-[#E66C00]"
                onClick={() => navigate("/")}
              >
                Return to Dashboard
              </Button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
