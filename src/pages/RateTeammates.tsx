import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

import { RatingDialog } from "@/components/rating/RatingDialog";
import { Player } from "@/components/rating/types";

const dummyPlayers = [
  {
    id: 1,
    name: "John Smith",
    position: "Midfielder",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: 2,
    name: "Emma Johnson",
    position: "Forward",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: 3,
    name: "Michael Brown",
    position: "Defender",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: 4,
    name: "Sarah Davis",
    position: "Goalkeeper",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: 5,
    name: "David Wilson",
    position: "Midfielder",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: 6,
    name: "Lisa Anderson",
    position: "Forward",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: 7,
    name: "Robert Taylor",
    position: "Defender",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: 8,
    name: "Jennifer Martinez",
    position: "Midfielder",
    avatar: "/placeholder.svg?height=32&width=32",
  },
];

export default function RateTeammates() {
  const navigate = useNavigate();

  const [players, setPlayers] = useState<Player[]>(dummyPlayers);

  const handleRatingSubmit = (playerId: number) => {
    setPlayers(players.filter((player) => player.id !== playerId));
  };

  return (
    <main className="relative flex-1 bg-background">
      <h1 className="ml-14 text-2xl font-bold">Rate Teammates</h1>

      <div className="">
        <div className="mx-auto max-w-4xl p-4">
          <div className="mb-4 ml-auto flex w-fit items-center justify-between px-2">
            <Button
              variant="ghost"
              className="text-accent-orange hover:text-accent-orange p-0 hover:bg-transparent hover:underline"
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
              <h2 className="text-accent-orange mb-4 text-2xl font-bold">
                All Teammates Rated!
              </h2>
              <p className="mb-6 text-gray-600">
                Thank you for providing feedback on all your teammates. Your
                input is valuable for improving team performance.
              </p>
              <Button
                className="bg-accent-orange rounded-lg px-6 py-3 text-lg font-bold text-white hover:bg-[#E66C00]"
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
