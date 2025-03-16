import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
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
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1 bg-background relative">
          <div className="absolute top-4 left-4 z-50 flex items-center">
            <SidebarTrigger className="bg-white shadow-md" />
            <h1 className="ml-4 text-2xl font-bold">Rate Teammates</h1>
          </div>

          <div className="pt-16">
            <div className="max-w-4xl mx-auto p-4">
              <div className="flex justify-between items-center mb-4 ml-auto w-fit px-2">
                <Button
                  variant="ghost"
                  className="text-[#FF7A00] hover:text-[#FF7A00] hover:bg-transparent p-0 hover:underline"
                  onClick={() => navigate(-1)}
                >
                  Previous
                </Button>
              </div>
              {players.length > 0 ? (
                <>
                  <p className="text-gray-600 mb-6">
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
                <div className="text-center py-12">
                  <h2 className="text-2xl font-bold text-[#FF7A00] mb-4">
                    All Teammates Rated!
                  </h2>
                  <p className="text-gray-600 mb-6">
                    Thank you for providing feedback on all your teammates. Your
                    input is valuable for improving team performance.
                  </p>
                  <Button
                    className="bg-[#FF7A00] hover:bg-[#E66C00] text-white font-bold py-3 px-6 rounded-lg text-lg"
                    onClick={() => navigate("/")}
                  >
                    Return to Dashboard
                  </Button>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
