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
import { JerseyIcon } from "@/components/draft/DraftUIComponents";
import { StarRating } from "@/components/rating/StarRating";
import { getInitials, getUserRating } from "@/lib/utils";

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
      eventStartTime.getTime() - event.rsvpDeadline * 60 * 60 * 1000,
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
          to="/dashboard/events"
          className="mt-6 flex items-center gap-1 rounded-md bg-accent-orange px-4 py-2 text-sm font-medium text-white hover:bg-accent-orange/90"
        >
          <ArrowLeftIcon className="h-5 w-5" />
          Go Back to Events
        </Link>
      </div>
    );
  }

  return (
    <main className="relative flex flex-1 flex-col gap-4 bg-background sm:gap-6">
      <div className="flex items-center justify-between pl-8">
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
      <div className="mx-auto w-full">
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-2xl font-bold">
              {event.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 sm:p-6">
            <div className="space-y-8">
              <div className="mb-8 flex items-center justify-center gap-8">
                <TeamInfo team={event.teams[0]} />
                <div className="flex flex-col items-center justify-center">
                  <div className="mb-4 hidden flex-col items-center text-center sm:flex">
                    <span className="text-sm font-medium text-gray-500">
                      {new Date(event.startTime).toLocaleDateString("en-US", {
                        month: "short",
                        day: "2-digit",
                        year: "numeric",
                      })}
                    </span>
                    <span className="text-sm font-medium text-gray-500">
                      {event.location}
                    </span>
                    <span className="text-sm font-medium text-gray-500">
                      {format(event.startTime, "h:mm a")}
                    </span>
                    <span className="text-sm font-bold text-accent-orange">
                      {event.league.name}
                    </span>
                  </div>
                  <span className="text-2xl font-bold">vs</span>
                </div>
                <TeamInfo team={event.teams[1]} />
              </div>

              <div className="flex flex-col items-center text-center sm:hidden">
                <span className="text-sm font-medium text-gray-500">
                  {new Date(event.startTime).toLocaleDateString("en-US", {
                    month: "short",
                    day: "2-digit",
                    year: "numeric",
                  })}
                  {", "}
                  {format(event.startTime, "h:mm a")}
                </span>
                <span className="text-sm font-medium text-gray-500">
                  {event.location}
                </span>
                <span className="text-sm font-medium text-gray-500"></span>
                <span className="text-sm font-bold text-accent-orange">
                  {event.league.name}
                </span>
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
                </>
              ) : (
                <>
                  <div className="flex flex-col items-center space-y-4">
                    <h2 className="text-xl font-bold">Event Countdown</h2>
                    <CountdownClock deadline={new Date(event.startTime)} />
                  </div>
                </>
              )}
              {event.teams.every((team) => team.draftCompleted) ? (
                <div>
                  <h3 className="mb-4 text-xl font-semibold">Drafted Teams</h3>
                  <div className="flex justify-between gap-4 border-t pt-6">
                    {event.teams.map((team) => (
                      <div className="flex flex-1 flex-col gap-4">
                        <h4 className="flex items-center gap-2 font-medium">
                          {team.name}{" "}
                          <JerseyIcon color={team.color} size={24} />
                        </h4>
                        <div
                          key={team.captainId}
                          className="flex cursor-pointer items-center gap-2 rounded-md transition-colors hover:bg-gray-50"
                        >
                          <Avatar className="h-10 w-10">
                            <AvatarImage
                              src={team.captain?.avatar_url}
                              alt={team.captain?.full_name}
                              className="object-cover"
                            />
                            <AvatarFallback>
                              {getInitials(team.captain?.full_name)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1">
                              <p className="truncate font-semibold">
                                {team.captain?.full_name}
                              </p>
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
                            </div>
                            <span className="truncate text-sm text-muted-foreground">
                              {team.captain.positions?.[event.league.sport]
                                ? team.captain.positions[event.league.sport]
                                    .slice(0, 2)
                                    .join(", ") +
                                  (team.captain.positions[event.league.sport]
                                    .length > 2
                                    ? "..."
                                    : "")
                                : "N/A"}
                            </span>
                          </div>
                        </div>
                        {[...team.players]
                          .sort((a, b) =>
                            a.full_name.localeCompare(b.full_name),
                          )
                          .map((player) => (
                            <div
                              key={player.id}
                              className="flex cursor-pointer items-center gap-2 rounded-md transition-colors hover:bg-gray-50"
                            >
                              <Avatar className="h-10 w-10">
                                <AvatarImage
                                  src={player.avatar_url}
                                  alt={player.full_name}
                                  className="object-cover"
                                />
                                <AvatarFallback>
                                  {getInitials(player.full_name)}
                                </AvatarFallback>
                              </Avatar>
                              <div className="min-w-0 flex-1">
                                <p className="truncate font-semibold">
                                  {player.full_name}
                                </p>
                                <span className="truncate text-sm text-muted-foreground">
                                  {player.positions?.[event.league.sport]
                                    ? player.positions[event.league.sport]
                                        .slice(0, 2)
                                        .join(", ") +
                                      (player.positions[event.league.sport]
                                        .length > 2
                                        ? "..."
                                        : "")
                                    : "N/A"}
                                </span>
                              </div>
                            </div>
                          ))}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="border-t pt-8">
                  <h3 className="mb-4 text-lg font-semibold">
                    Attending Players ({event.players.length})
                  </h3>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                    {event.players.map((player) => (
                      <div
                        key={player.id}
                        className="flex items-center gap-2 rounded-md p-2 transition-colors hover:bg-gray-50"
                      >
                        <Avatar className="h-10 w-10">
                          <AvatarImage
                            src={player.avatar_url}
                            alt={player.full_name}
                            className="object-cover"
                          />
                          <AvatarFallback>
                            {getInitials(player.full_name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1">
                            <Link
                              to={`/dashboard/profile/${player.id}`}
                              className="truncate text-sm font-semibold hover:text-accent-orange hover:underline"
                            >
                              {player.full_name}
                            </Link>
                            {event.teams.some(
                              (team) => team.captainId === player.id,
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
                            <div className="ml-1">
                              <StarRating
                                rating={getUserRating(
                                  event.leagueId,
                                  player.ratings,
                                )}
                                displayValue
                              />
                            </div>
                          </div>
                          <span className="truncate text-sm text-muted-foreground">
                            <p className="text-xs text-gray-500">
                              {player.positions?.[event.league.sport]
                                ? player.positions[event.league.sport]
                                    .slice(0, 2)
                                    .join(", ") +
                                  (player.positions[event.league.sport].length >
                                  2
                                    ? "..."
                                    : "")
                                : "N/A"}
                            </p>
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
