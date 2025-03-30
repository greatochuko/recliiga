import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useQuery } from "@tanstack/react-query";
import { fetchLeagueById } from "@/api/league";
import { useAuth } from "@/contexts/AuthContext";
import { ArrowLeft } from "lucide-react";
import { EventCard } from "@/components/events/EventCard";

export default function LeagueDetails() {
  const navigate = useNavigate();
  const [showAllPlayers, setShowAllPlayers] = useState(false);

  const { user } = useAuth();
  const { id } = useParams();

  const { isFetching, data } = useQuery({
    queryKey: ["league", id],
    queryFn: ({ queryKey }) => fetchLeagueById(queryKey[1]),
  });

  if (isFetching) {
    return (
      <div className="flex items-center justify-center flex-1">
        <p>Loading...</p>
      </div>
    );
  }

  if (data.error) {
    return (
      <div className="flex items-center justify-center flex-col gap-2 flex-1">
        <p>{data.error}</p>
        <button
          onClick={() => navigate("/leagues")}
          className="bg-[#FF7A00] flex items-center gap-2 text-white font-medium text-sm px-3 py-1.5 rounded-md"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Leagues
        </button>
      </div>
    );
  }

  const league = data?.league;

  const handlePlayerClick = () => {
    navigate("/player-profile");
  };

  return (
    <main className="flex-1 bg-background relative flex flex-col px-4 md:px-6 gap-6">
      <div className="flex justify-between ml-6">
        <button
          onClick={() => navigate("/leagues")}
          className="text-[#FF7A00] flex items-center gap-1 hover:bg-[#FF7A00]/10 duration-200 font-medium text-sm px-2 py-1.5 rounded-md"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        {league.owner_id === user.id && (
          <button className="ml-auto text-red-500 font-medium px-3 py-1.5 duration-200 rounded-md hover:bg-red-50 text-sm active:bg-red-100">
            Delete
          </button>
        )}
      </div>
      <div className="">
        {/* League Info */}
        <Card className="w-full mb-6 bg-[#F9F9F9] rounded-lg overflow-hidden">
          <CardContent className="p-4">
            <div className="flex items-start">
              <Avatar className="w-14 h-14 mr-4">
                <AvatarImage src={league.image} alt={`${league.name} logo`} />
                <AvatarFallback>
                  {league.name
                    .split(" ")
                    .map((n) => n[0].toUpperCase())
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-grow">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-semibold text-[rgba(0,0,0,0.8)]">
                    {league.name}
                  </h3>
                  <span className="text-sm text-[rgba(0,0,0,0.51)]">
                    {new Date(league.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <div className="text-sm text-[#F79602] mt-1">
                  {league.players.length} Players
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Players Section */}
        <section className="mb-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Players</h3>
              <button
                className="text-sm text-[#FF7A00] hover:underline px-4 py-2 font-medium"
                onClick={() => setShowAllPlayers(!showAllPlayers)}
              >
                {showAllPlayers ? "Show Less" : "View All"}
              </button>
            </div>
            {league.players.length ? (
              <div className="grid grid-cols-3 gap-2">
                {league.players
                  .slice(0, showAllPlayers ? undefined : 8)
                  .map((player, index) => (
                    <Card
                      key={index}
                      className="overflow-hidden cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={handlePlayerClick}
                    >
                      <CardContent className="p-2 flex items-center">
                        <Avatar className="w-8 h-8">
                          <AvatarImage
                            src={`/placeholder.svg?height=32&width=32`}
                            alt={player.full_name}
                          />
                          <AvatarFallback>
                            {player.full_name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="ml-2 flex-grow">
                          <p className="text-sm font-medium">
                            {player.full_name}
                          </p>
                          <p className="text-xs text-gray-500">Midfielder</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            ) : (
              <div className="text-sm text-gray-500 text-center">
                No players have joined this league yet. Be the first to invite
                players!
              </div>
            )}
          </div>
        </section>

        {/* Upcoming Events Section */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Upcoming Events</h2>
            {/* <Link
              to="/events"
              className="text-[#FF7A00] hover:underline px-4 py-2 font-medium text-sm"
            >
              View all
            </Link> */}
          </div>
          {league.events.length ? (
            <div className="space-y-4">
              {league.events.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  onEdit={() => {}}
                  onDelete={() => {}}
                />
              ))}
            </div>
          ) : (
            <div className="text-sm text-gray-500 text-center">
              No events have been scheduled for this league yet.
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
