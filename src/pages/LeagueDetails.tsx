import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useQuery } from "@tanstack/react-query";
import { fetchLeagueById } from "@/api/league";
// import { useAuth } from "@/contexts/AuthContext";
import { ArrowLeft } from "lucide-react";
import EventCard from "@/components/events/EventCard";
import { getUpcomingEvents } from "@/lib/utils";

export default function LeagueDetails() {
  const navigate = useNavigate();
  const [showAllPlayers, setShowAllPlayers] = useState(false);

  // const { user } = useAuth();
  const { id } = useParams();

  const { isLoading, data } = useQuery({
    queryKey: ["league", id],
    queryFn: ({ queryKey }) => fetchLeagueById(queryKey[1]),
  });

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (data.error) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-2">
        <p>{data.error}</p>
        <button
          onClick={() => navigate("/leagues")}
          className="flex items-center gap-2 rounded-md bg-accent-orange px-3 py-1.5 text-sm font-medium text-white"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Leagues
        </button>
      </div>
    );
  }

  const league = data?.league;

  const handlePlayerClick = () => {
    navigate("/player-profile");
  };

  const upcomingEvents = getUpcomingEvents(league.events);

  return (
    <main className="relative flex flex-1 flex-col gap-6 bg-background">
      <div className="ml-6 flex justify-between">
        <button
          onClick={() => navigate("/leagues")}
          className="flex items-center gap-1 rounded-md px-2 py-1.5 text-sm font-medium text-accent-orange duration-200 hover:bg-accent-orange/10"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        {/* {league.owner_id === user.id && (
          <button className="ml-auto rounded-md px-3 py-1.5 text-sm font-medium text-red-500 duration-200 hover:bg-red-50 active:bg-red-100">
            Delete
          </button>
        )} */}
      </div>
      <div className="">
        {/* League Info */}
        <Card className="mb-6 w-full overflow-hidden rounded-lg bg-[#F9F9F9]">
          <CardContent className="p-4">
            <div className="flex items-start">
              <Avatar className="mr-4 h-14 w-14">
                <AvatarImage src={league.image} alt={`${league.name} logo`} />
                <AvatarFallback>
                  {league.name
                    .split(" ")
                    .map((n) => n[0].toUpperCase())
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-grow">
                <div className="flex items-start justify-between">
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
                <div className="mt-1 text-sm text-[#F79602]">
                  {league.players.length} Players
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Players Section */}
        <section className="mb-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Players</h3>
              {league.players.length > 8 && (
                <button
                  className="px-4 py-2 text-sm font-medium text-accent-orange hover:underline"
                  onClick={() => setShowAllPlayers(!showAllPlayers)}
                >
                  {showAllPlayers ? "Show Less" : "View All"}
                </button>
              )}
            </div>
            {league.players.length ? (
              <div className="grid grid-cols-3 gap-2">
                {league.players
                  .slice(0, showAllPlayers ? undefined : 8)
                  .map((player, index) => (
                    <Card
                      key={index}
                      className="cursor-pointer overflow-hidden transition-colors hover:bg-gray-50"
                      onClick={handlePlayerClick}
                    >
                      <CardContent className="flex items-center p-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src={player.avatar_url}
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
              <div className="text-center text-sm text-gray-500">
                No players have joined this league yet. Be the first to invite
                players!
              </div>
            )}
          </div>
        </section>

        {/* Upcoming Events Section */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Upcoming Events</h2>
            {/* <Link
              to="/events"
              className="text-accent-orange hover:underline px-4 py-2 font-medium text-sm"
            >
              View all
            </Link> */}
          </div>
          {upcomingEvents.length ? (
            <div className="space-y-4">
              {upcomingEvents.map((event) => (
                <EventCard event={event} key={event.id} />
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-sm text-gray-500">
              No events have been scheduled for this league yet.
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
