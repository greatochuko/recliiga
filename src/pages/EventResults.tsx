import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

function TeamRoster({
  team,
  attendance,
}: {
  team: any;
  attendance: Record<string, boolean>;
}) {
  const navigate = useNavigate();

  const handleViewProfile = () => {
    navigate("/player-profile");
  };

  return (
    <div className="w-full">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-medium text-muted-foreground">
          Team members
        </h3>
      </div>
      <div className="space-y-4">
        <div
          className="flex cursor-pointer items-center gap-4 rounded-lg bg-gray-100 p-2 transition-colors hover:bg-gray-200"
          onClick={handleViewProfile}
        >
          <Avatar className="h-12 w-12" style={{ backgroundColor: team.color }}>
            <AvatarImage src={team.captain.avatar} alt={team.captain.name} />
            <AvatarFallback>
              {team.captain.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-semibold">{team.captain.name}</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-accent-orange h-4 w-4"
              >
                <path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14" />
              </svg>
            </div>
            <span className="text-sm text-muted-foreground">
              {team.captain.position}
            </span>
          </div>
          <Badge
            variant={attendance[team.captain.name] ? "default" : "secondary"}
          >
            {attendance[team.captain.name] ? "Present" : "Absent"}
          </Badge>
        </div>
        {team.players.map((player: any) => (
          <div
            key={player.id}
            className="flex cursor-pointer items-center gap-4 rounded-lg p-2 transition-colors hover:bg-gray-100"
            onClick={handleViewProfile}
          >
            <Avatar className="h-12 w-12">
              <AvatarImage src={player.avatar} alt={player.name} />
              <AvatarFallback>
                {player.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <span className="font-semibold">{player.name}</span>
              <p className="text-sm text-muted-foreground">{player.position}</p>
            </div>
            <Badge variant={attendance[player.name] ? "default" : "secondary"}>
              {attendance[player.name] ? "Present" : "Absent"}
            </Badge>
          </div>
        ))}
      </div>
    </div>
  );
}

function EventResultsContent() {
  const navigate = useNavigate();

  // Mock data for event results
  const eventData = {
    date: "15-Jul-2024",
    time: "8:00 PM",
    location: "Old Trafford",
    league: "Premier League",
    team1: {
      name: "Red Devils",
      avatar: "/placeholder.svg?height=64&width=64",
      color: "#DA291C",
      score: 3,
      captain: {
        name: "John Smith",
        avatar: "/placeholder.svg?height=48&width=48",
        position: "Captain",
      },
      players: [
        {
          id: 1,
          name: "Alex Johnson",
          avatar: "/placeholder.svg?height=48&width=48",
          position: "Midfielder",
        },
        {
          id: 2,
          name: "Sam Williams",
          avatar: "/placeholder.svg?height=48&width=48",
          position: "Defender",
        },
        {
          id: 3,
          name: "Chris Brown",
          avatar: "/placeholder.svg?height=48&width=48",
          position: "Forward",
        },
        {
          id: 4,
          name: "Pat Taylor",
          avatar: "/placeholder.svg?height=48&width=48",
          position: "Goalkeeper",
        },
      ],
    },
    team2: {
      name: "Sky Blues",
      avatar: "/placeholder.svg?height=64&width=64",
      color: "#6CABDD",
      score: 2,
      captain: {
        name: "Mike Davis",
        avatar: "/placeholder.svg?height=48&width=48",
        position: "Captain",
      },
      players: [
        {
          id: 5,
          name: "Tom Wilson",
          avatar: "/placeholder.svg?height=48&width=48",
          position: "Defender",
        },
        {
          id: 6,
          name: "Jamie Lee",
          avatar: "/placeholder.svg?height=48&width=48",
          position: "Midfielder",
        },
        {
          id: 7,
          name: "Casey Morgan",
          avatar: "/placeholder.svg?height=48&width=48",
          position: "Forward",
        },
        {
          id: 8,
          name: "Jordan Riley",
          avatar: "/placeholder.svg?height=48&width=48",
          position: "Goalkeeper",
        },
      ],
    },
  };

  // Mock attendance data
  const attendanceData = {
    "John Smith": true,
    "Alex Johnson": true,
    "Sam Williams": true,
    "Chris Brown": false,
    "Pat Taylor": true,
    "Mike Davis": true,
    "Tom Wilson": true,
    "Jamie Lee": false,
    "Casey Morgan": true,
    "Jordan Riley": true,
  };

  const renderTeamScore = (team: any) => (
    <div className="flex flex-col items-center space-y-2">
      <Avatar className="h-16 w-16" style={{ backgroundColor: team.color }}>
        <AvatarImage src={team.avatar} alt={team.name} />
        <AvatarFallback>
          {team.name
            .split(" ")
            .map((n) => n[0])
            .join("")}
        </AvatarFallback>
      </Avatar>
      <span className="text-sm font-semibold">{team.name}</span>
      <span className="text-4xl font-bold">{team.score}</span>
    </div>
  );

  return (
    <div className="container relative mx-auto px-4 py-8">
      <Button
        variant="ghost"
        size="sm"
        className="text-accent-orange hover:text-accent-orange fixed right-4 top-4 z-10 p-0 hover:bg-transparent hover:underline"
        onClick={() => navigate(-1)}
      >
        Previous
      </Button>
      <Card className="mx-auto max-w-3xl">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">
            Match Result
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            <div className="mb-8 flex items-center justify-center gap-8">
              {renderTeamScore(eventData.team1)}
              <div className="flex flex-col items-center justify-center">
                <div className="mb-4 flex flex-col items-center text-center">
                  <span className="text-xs text-gray-500">
                    {eventData.date}
                  </span>
                  <span className="text-xs text-gray-500">
                    {eventData.location}
                  </span>
                  <span className="text-xs text-gray-500">
                    {eventData.time}
                  </span>
                  <span className="text-accent-orange text-xs font-bold">
                    {eventData.league}
                  </span>
                </div>
                <span className="text-2xl font-bold">vs</span>
              </div>
              {renderTeamScore(eventData.team2)}
            </div>

            <div className="text-center">
              <h2 className="mb-2 text-xl font-bold">Final Result</h2>
              <p className="text-lg">
                {eventData.team1.name} {eventData.team1.score} -{" "}
                {eventData.team2.score} {eventData.team2.name}
              </p>
              <p className="text-md mt-2">
                {eventData.team1.score > eventData.team2.score
                  ? `${eventData.team1.name} win!`
                  : eventData.team2.score > eventData.team1.score
                    ? `${eventData.team2.name} win!`
                    : "It's a draw!"}
              </p>
            </div>

            <h2 className="mb-4 text-2xl font-bold">Attendance</h2>
            <div className="grid gap-8 border-t pt-8 md:grid-cols-2">
              <TeamRoster team={eventData.team1} attendance={attendanceData} />
              <TeamRoster team={eventData.team2} attendance={attendanceData} />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function EventResults() {
  return (
    <main className="relative flex-1 bg-background">
      <h1 className="ml-14 text-2xl font-bold">Match Results</h1>
      <EventResultsContent />
    </main>
  );
}
