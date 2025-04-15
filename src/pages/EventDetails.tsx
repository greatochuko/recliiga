import { useMemo } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

import { ArrowLeftIcon, ChevronLeft } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchEventById } from "@/api/events";
import FullScreenLoader from "@/components/FullScreenLoader";
import { format } from "date-fns";
import CountdownClock from "@/components/events/CountdownClock";
import TeamInfo from "@/components/events/TeamInfo";

export default function EventDetails() {
  const navigate = useNavigate();
  const { id: eventId } = useParams();

  const { data, isLoading } = useQuery({
    queryKey: [`event-${eventId}`],
    queryFn: () => fetchEventById(eventId),
  });

  const event = data?.data;

  const handleBackClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate(-1);
  };

  const rsvpDeadline = useMemo(() => {
    if (!event?.startTime) {
      return { isPassed: false, time: new Date() };
    }

    const eventStartTime = new Date(event.startTime);

    const rsvpDeadlineTime = new Date(
      eventStartTime.getTime() - event.rsvpDeadline * 60 * 1000,
    );

    return { isPassed: new Date() > rsvpDeadlineTime, time: rsvpDeadlineTime };
  }, [event]);

  if (isLoading) {
    return <FullScreenLoader />;
  }

  if (!event) {
    return (
      <div className="flex w-full flex-col items-center justify-center px-4 text-center">
        <h1 className="text-4xl font-bold text-gray-800">Event Not Found</h1>
        <p className="mt-4 text-gray-600">
          The event you are looking for does not exist or has been removed.
        </p>
        <Link
          to="/events"
          className="mt-6 flex items-center gap-1 rounded-md bg-accent-orange px-4 py-2 text-sm font-medium text-white hover:bg-accent-orange/90"
        >
          <ArrowLeftIcon className="h-5 w-5" />
          Go Back to Events
        </Link>
      </div>
    );
  }

  return (
    <main className="relative flex-1 bg-background">
      <div className="flex items-center justify-between px-4 pl-14">
        <h1 className="text-2xl font-bold">Event Details</h1>
        <Button
          variant="link"
          size="sm"
          className="text-accent-orange"
          onClick={handleBackClick}
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
          Previous
        </Button>
      </div>
      <div className="mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-2xl font-bold">
              Upcoming Match
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              <div className="mb-8 flex items-center justify-center gap-8">
                <TeamInfo team={event.teams[0]} />
                <div className="flex flex-1 flex-col items-center justify-center">
                  <div className="mb-4 flex flex-col items-center text-center">
                    <span className="text-xs text-gray-500">
                      {new Date(event.startTime).toLocaleDateString("en-US", {
                        month: "short",
                        day: "2-digit",
                        year: "numeric",
                      })}
                    </span>
                    <span className="text-xs text-gray-500">
                      {event.location}
                    </span>
                    <span className="text-xs text-gray-500">
                      {format(event.startTime, "h:mm a")}
                    </span>
                    <span className="text-xs font-bold text-accent-orange">
                      {event.league.name}
                    </span>
                  </div>
                  <span className="text-2xl font-bold">vs</span>
                </div>
                <TeamInfo team={event.teams[1]} />
              </div>

              {rsvpDeadline.isPassed ? (
                <>
                  <div className="text-center">
                    <h2 className="mb-2 text-xl font-bold">Match Details</h2>
                    <p className="text-lg">
                      {event.teams[0].name} vs {event.teams[1].name}
                    </p>
                    <p className="text-md mt-2">
                      Join us for an exciting match!
                    </p>
                  </div>

                  <h2 className="mb-4 text-2xl font-bold">Drafted Teams</h2>
                  <div className="grid gap-8 border-t pt-8 md:grid-cols-2">
                    {/* <AttendingList
                      players={mockEventData.team1.players}
                      teamColor={mockEventData.team1.color}
                      teamName={mockEventData.team1.name}
                      uniformColor={mockEventData.team1.uniformColor}
                    />
                    <AttendingList
                      players={mockEventData.team2.players}
                      teamColor={mockEventData.team2.color}
                      teamName={mockEventData.team2.name}
                      uniformColor={mockEventData.team2.uniformColor}
                    /> */}
                  </div>
                </>
              ) : (
                <>
                  <div className="flex flex-col items-center space-y-4">
                    <h2 className="text-xl font-bold">RSVP Countdown</h2>
                    <CountdownClock deadline={rsvpDeadline.time} />
                  </div>

                  <div className="border-t pt-8">
                    <h3 className="mb-4 text-lg font-semibold">
                      Attending Players ({event.players.length})
                    </h3>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                      {event.players.map((player) => (
                        <div
                          key={player.id}
                          className="flex cursor-pointer items-center gap-2 rounded-md p-2 transition-colors hover:bg-gray-50"
                        >
                          <Avatar className="h-10 w-10">
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
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1">
                              <span className="truncate font-semibold">
                                {player.full_name}
                              </span>
                              {event.teams.some(
                                (team) => team.captain?.id === player.id,
                              ) && (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="h-4 w-4 text-accent-orange"
                                >
                                  <path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14" />
                                </svg>
                              )}
                            </div>
                            <span className="truncate text-sm text-muted-foreground">
                              {player.positions[0] || "Unassigned"}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
