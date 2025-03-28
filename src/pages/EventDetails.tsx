import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

import { JerseyIcon } from "@/components/draft/DraftUIComponents";
import { ChevronLeft } from "lucide-react";

function CountdownClock({ deadline }: { deadline: Date }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0 });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const difference = deadline.getTime() - now.getTime();

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
        });
      } else {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [deadline]);

  return (
    <div className="text-lg font-semibold flex space-x-4">
      <div className="flex flex-col items-center">
        <span>{timeLeft.days}</span>
        <span className="text-xs text-gray-500">days</span>
      </div>
      <div className="flex flex-col items-center">
        <span>{timeLeft.hours}</span>
        <span className="text-xs text-gray-500">hours</span>
      </div>
      <div className="flex flex-col items-center">
        <span>{timeLeft.minutes}</span>
        <span className="text-xs text-gray-500">minutes</span>
      </div>
    </div>
  );
}

interface Player {
  id: number;
  name: string;
  avatar: string;
  position?: string;
  isCaptain?: boolean;
}

function AttendingList({
  players,
  teamColor,
  teamName,
  uniformColor,
}: {
  players: Player[];
  teamColor: string;
  teamName: string;
  uniformColor: string;
}) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-medium">{teamName}</h3>
          <JerseyIcon color={uniformColor} size={23} />
        </div>
      </div>
      <div className="space-y-4">
        {players.map((player) => (
          <div key={player.id} className="flex items-center gap-4">
            <Avatar
              className="w-10 h-10"
              style={player.isCaptain ? { backgroundColor: teamColor } : {}}
            >
              <AvatarImage src={player.avatar} alt={player.name} />
              <AvatarFallback>
                {player.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold">{player.name}</span>
                {player.isCaptain && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-4 h-4 text-[#FF7A00]"
                  >
                    <path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14" />
                  </svg>
                )}
              </div>
              <span className="text-sm text-muted-foreground">
                {player.position}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function EventDetailsContent() {
  const navigate = useNavigate();

  // Mock data for upcoming event
  const eventData = {
    date: "15-Aug-2024",
    time: "8:00 PM",
    location: "Old Trafford",
    league: "Premier League",
    team1: {
      name: "Red Devils",
      avatar: "/placeholder.svg?height=64&width=64",
      color: "#DA291C",
      uniformColor: "#FF0000",
      players: [
        {
          id: 1,
          name: "John Smith",
          avatar: "/placeholder.svg?height=48&width=48",
          position: "Forward",
          isCaptain: true,
        },
        {
          id: 2,
          name: "Alex Johnson",
          avatar: "/placeholder.svg?height=48&width=48",
          position: "Midfielder",
        },
        {
          id: 3,
          name: "Sarah Williams",
          avatar: "/placeholder.svg?height=48&width=48",
          position: "Defender",
        },
        {
          id: 4,
          name: "Chris Lee",
          avatar: "/placeholder.svg?height=48&width=48",
          position: "Goalkeeper",
        },
        {
          id: 5,
          name: "Pat Taylor",
          avatar: "/placeholder.svg?height=48&width=48",
          position: "Forward",
        },
        {
          id: 6,
          name: "Jamie Brown",
          avatar: "/placeholder.svg?height=48&width=48",
          position: "Midfielder",
        },
        {
          id: 7,
          name: "Sam Green",
          avatar: "/placeholder.svg?height=48&width=48",
          position: "Defender",
        },
      ],
    },
    team2: {
      name: "Sky Blues",
      avatar: "/placeholder.svg?height=64&width=64",
      color: "#6CABDD",
      uniformColor: "#0000FF",
      players: [
        {
          id: 8,
          name: "Mike Davis",
          avatar: "/placeholder.svg?height=48&width=48",
          position: "Midfielder",
          isCaptain: true,
        },
        {
          id: 9,
          name: "Tom Wilson",
          avatar: "/placeholder.svg?height=48&width=48",
          position: "Defender",
        },
        {
          id: 10,
          name: "Casey Morgan",
          avatar: "/placeholder.svg?height=48&width=48",
          position: "Forward",
        },
        {
          id: 11,
          name: "Jordan Riley",
          avatar: "/placeholder.svg?height=48&width=48",
          position: "Goalkeeper",
        },
        {
          id: 12,
          name: "Emma Thompson",
          avatar: "/placeholder.svg?height=48&width=48",
          position: "Midfielder",
        },
        {
          id: 13,
          name: "Olivia Chen",
          avatar: "/placeholder.svg?height=48&width=48",
          position: "Forward",
        },
        {
          id: 14,
          name: "Ryan Patel",
          avatar: "/placeholder.svg?height=48&width=48",
          position: "Defender",
        },
      ],
    },
    draftStatus: "completed",
    rsvpDeadline: new Date("2024-08-14T20:00:00"),
  };

  const handleBackClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate(-1); // This ensures we go back to the previous page in history
  };

  const renderTeamInfo = (team: any) => (
    <div className="flex flex-col items-center space-y-2">
      <Avatar className="w-16 h-16" style={{ backgroundColor: team.color }}>
        <AvatarImage src={team.avatar} alt={team.name} />
        <AvatarFallback>
          {team.name
            .split(" ")
            .map((n: string) => n[0])
            .join("")}
        </AvatarFallback>
      </Avatar>
      <span className="text-sm font-semibold">{team.name}</span>
      <div className="flex flex-col items-center mt-2">
        <JerseyIcon color={team.uniformColor} size={48} />
      </div>
    </div>
  );

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        className="fixed top-4 right-4 z-10 text-[#FF7A00] hover:text-[#FF7A00] hover:bg-transparent p-0 hover:underline flex items-center"
        onClick={handleBackClick}
      >
        <ChevronLeft className="mr-1 h-4 w-4" />
        Previous
      </Button>
      <div className="container mx-auto px-4 py-8 ">
        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              Upcoming Match
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              <div className="flex items-center justify-center gap-8 mb-8">
                {renderTeamInfo(eventData.team1)}
                <div className="flex flex-col items-center justify-center">
                  <div className="flex flex-col items-center mb-4 text-center">
                    <span className="text-xs text-gray-500">
                      {eventData.date}
                    </span>
                    <span className="text-xs text-gray-500">
                      {eventData.location}
                    </span>
                    <span className="text-xs text-gray-500">
                      {eventData.time}
                    </span>
                    <span className="text-xs font-bold text-[#FF7A00]">
                      {eventData.league}
                    </span>
                  </div>
                  <span className="text-2xl font-bold">vs</span>
                </div>
                {renderTeamInfo(eventData.team2)}
              </div>

              {eventData.draftStatus === "completed" ? (
                <>
                  <div className="text-center">
                    <h2 className="text-xl font-bold mb-2">Match Details</h2>
                    <p className="text-lg">
                      {eventData.team1.name} vs {eventData.team2.name}
                    </p>
                    <p className="text-md mt-2">
                      Join us for an exciting match!
                    </p>
                  </div>

                  <h2 className="text-2xl font-bold mb-4">Drafted Teams</h2>
                  <div className="grid md:grid-cols-2 gap-8 pt-8 border-t">
                    <AttendingList
                      players={eventData.team1.players}
                      teamColor={eventData.team1.color}
                      teamName={eventData.team1.name}
                      uniformColor={eventData.team1.uniformColor}
                    />
                    <AttendingList
                      players={eventData.team2.players}
                      teamColor={eventData.team2.color}
                      teamName={eventData.team2.name}
                      uniformColor={eventData.team2.uniformColor}
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="flex flex-col items-center space-y-4">
                    <h2 className="text-xl font-bold">RSVP Countdown</h2>
                    <CountdownClock deadline={eventData.rsvpDeadline} />
                  </div>

                  <div className="pt-8 border-t">
                    <h3 className="text-lg font-semibold mb-4">
                      Attending Players (
                      {eventData.team1.players.length +
                        eventData.team2.players.length}
                      )
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {[
                        ...eventData.team1.players,
                        ...eventData.team2.players,
                      ].map((player) => (
                        <div
                          key={player.id}
                          className="flex items-center gap-2 hover:bg-gray-50 p-2 rounded-md cursor-pointer transition-colors"
                        >
                          <Avatar className="w-10 h-10">
                            <AvatarImage
                              src={player.avatar}
                              alt={player.name}
                            />
                            <AvatarFallback>
                              {player.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1">
                              <span className="font-semibold truncate">
                                {player.name}
                              </span>
                              {player.isCaptain && (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="w-4 h-4 text-[#FF7A00]"
                                >
                                  <path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14" />
                                </svg>
                              )}
                            </div>
                            <span className="text-sm text-muted-foreground truncate">
                              {player.position || "Unassigned"}
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
    </>
  );
}

export default function EventDetails() {
  return (
    <div className="min-h-screen flex w-full">
      <main className="flex-1 bg-background relative">
        <h1 className="ml-14 text-2xl font-bold">Event Details</h1>
        <EventDetailsContent />
      </main>
    </div>
  );
}
