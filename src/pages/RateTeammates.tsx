import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

import { RatingDialog } from "@/components/rating/RatingDialog";
import { useQuery } from "@tanstack/react-query";
import { fetchLeaguesByUser } from "@/api/league";
import { UserType } from "@/contexts/AuthContext";
import FullScreenLoader from "@/components/FullScreenLoader";

export default function RateTeammates() {
  const [teamMates, setTeamMates] = useState<UserType[]>();

  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ["players"],
    queryFn: fetchLeaguesByUser,
  });

  const leagues = data?.leagues;

  useEffect(() => {
    if (!isLoading) {
      setTeamMates(leagues.flatMap((league) => league.players));
    }
  }, [isLoading, leagues]);

  const handleRatingSubmit = (playerId: string) => {
    setTeamMates(teamMates.filter((player) => player.id !== playerId));
  };

  if (isLoading || !teamMates) {
    return <FullScreenLoader />;
  }

  return (
    <main className="mx-auto w-[90%] max-w-4xl">
      <div className="flex justify-between">
        <h1 className="ml-8 text-2xl font-bold">Rate Teammates</h1>
        <Button
          variant="ghost"
          className="p-0 text-accent-orange hover:bg-transparent hover:text-accent-orange hover:underline"
          onClick={() => navigate(-1)}
        >
          Previous
        </Button>
      </div>

      {teamMates.length > 0 ? (
        <>
          <p className="mb-6 text-gray-600">
            Click on the player or star icons to rate your teammates'
            performance.
          </p>
          <div className="grid grid-cols-2 gap-2">
            {teamMates.map((player) => (
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
            Thank you for providing feedback on all your teammates. Your input
            is valuable for improving team performance.
          </p>
          <Button
            className="rounded-lg bg-accent-orange px-6 py-3 text-lg font-bold text-white hover:bg-[#E66C00]"
            onClick={() => navigate("/")}
          >
            Return to Dashboard
          </Button>
        </div>
      )}
    </main>
  );
}
