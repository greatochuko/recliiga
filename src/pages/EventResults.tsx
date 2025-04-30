import { Link, useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { fetchEventById } from "@/api/events";
import { ArrowLeftIcon, ChevronLeftIcon } from "lucide-react";
import FullScreenLoader from "@/components/FullScreenLoader";
import { TeamType } from "@/types/events";
import { UserType } from "@/contexts/AuthContext";

function TeamRoster({
  team,
  attendance,
}: {
  team: TeamType;
  attendance: UserType[];
}) {
  return (
    <div className="w-full">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-medium text-muted-foreground">
          Team members
        </h3>
      </div>
      <div className="space-y-4">
        <div className="flex items-center gap-4 rounded-lg bg-gray-100 p-2 transition-colors hover:bg-gray-200">
          <Avatar className="h-12 w-12" style={{ backgroundColor: team.color }}>
            <AvatarImage
              src={team.captain.avatar_url}
              alt={team.captain.full_name}
              className="object-cover"
            />
            <AvatarFallback>
              {team.captain.full_name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <Link
                to={`/profile/${team.captain.id}`}
                className="font-semibold hover:text-accent-orange hover:underline"
              >
                {team.captain.full_name}
              </Link>
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
            <span className="text-sm text-muted-foreground">
              {team.captain.positions[0]}
            </span>
          </div>
          <Badge
            variant={
              attendance.some((pl) => pl.id === team.captain.id)
                ? "default"
                : "secondary"
            }
          >
            {attendance.some((pl) => pl.id === team.captain.id)
              ? "Present"
              : "Absent"}
          </Badge>
        </div>
        {team.players.map((player) => (
          <div
            key={player.id}
            className="flex items-center gap-4 rounded-lg p-2 transition-colors hover:bg-gray-100"
          >
            <Avatar className="h-12 w-12">
              <AvatarImage src={player.avatar_url} alt={player.full_name} />
              <AvatarFallback>
                {player.full_name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <Link
                to={`/profile/${player.id}`}
                className="font-semibold hover:text-accent-orange hover:underline"
              >
                {player.full_name}
              </Link>
              <p className="text-sm text-muted-foreground">
                {player.positions[0]}
              </p>
            </div>
            <Badge
              variant={
                attendance.some((pl) => pl.id === player.id)
                  ? "default"
                  : "secondary"
              }
            >
              {attendance.some((pl) => pl.id === player.id)
                ? "Present"
                : "Absent"}
            </Badge>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function EventResults() {
  const { id: eventId } = useParams();
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: [`event-${eventId}`],
    queryFn: () => fetchEventById(eventId),
  });

  const event = data?.data;

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

  const handleBackClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate(-1);
  };

  return (
    <main className="relative flex flex-1 flex-col gap-4 bg-background sm:gap-6">
      <div className="flex items-center justify-between pl-8">
        <h1 className="text-2xl font-bold">Match Results</h1>
        <Button
          variant="link"
          size="sm"
          className="text-accent-orange"
          onClick={handleBackClick}
        >
          <ChevronLeftIcon className="mr-1 h-4 w-4" />
          Previous
        </Button>
      </div>
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">
            Match Result
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            <div className="mb-8 grid grid-cols-3 items-center gap-4">
              <div className="flex flex-col items-center space-y-2">
                <Avatar
                  className="h-16 w-16 border-2"
                  style={{ borderColor: event.teams[0].color }}
                >
                  <AvatarImage
                    src={event.teams[0].logo}
                    alt={event.teams[0].name}
                  />
                  <AvatarFallback>
                    {event.teams[0].name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-semibold">
                  {event.teams[0].name}
                </span>
                <span className="text-4xl font-bold">
                  {event.result.team1Score}
                </span>
              </div>

              <div className="flex flex-col items-center justify-center">
                <div className="mb-4 flex flex-col items-center text-center">
                  <span className="text-xs text-gray-500">
                    {new Date(event.startTime).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                  <span className="text-xs text-gray-500">
                    {event.location}
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(event.startTime).toLocaleDateString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </span>
                  <span className="text-xs font-bold text-accent-orange">
                    {event.league.name}
                  </span>
                </div>
                <span className="text-2xl font-bold">vs</span>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <Avatar
                  className="h-16 w-16 border-2"
                  style={{ borderColor: event.teams[1].color }}
                >
                  <AvatarImage
                    src={event.teams[1].logo}
                    alt={event.teams[1].name}
                  />
                  <AvatarFallback>
                    {event.teams[1].name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-semibold">
                  {event.teams[1].name}
                </span>
                <span className="text-4xl font-bold">
                  {event.result.team2Score}
                </span>
              </div>
            </div>

            <div className="text-center">
              <h2 className="mb-2 text-xl font-bold">Final Result</h2>
              <p className="text-lg">
                {event.teams[0].name}{" "}
                <span className="font-semibold text-accent-orange">
                  {event.result.team1Score}
                </span>
                {" - "}
                <span className="font-semibold text-accent-orange">
                  {event.result.team2Score}
                </span>{" "}
                {event.teams[1].name}
              </p>
              <p className="text-md mt-2 text-accent-orange">
                {event.result.team1Score > event.result.team2Score
                  ? `${event.teams[0].name} win!`
                  : event.result.team2Score > event.result.team1Score
                    ? `${event.teams[1].name} win!`
                    : "It's a draw!"}
              </p>
            </div>

            <h2 className="mb-4 text-2xl font-bold">Attendance</h2>
            <div className="grid gap-8 border-t pt-8 md:grid-cols-2">
              <TeamRoster
                team={event.teams[0]}
                attendance={event.result.attendingPlayers}
              />
              <TeamRoster
                team={event.teams[1]}
                attendance={event.result.attendingPlayers}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
