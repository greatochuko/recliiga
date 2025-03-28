import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Edit } from "lucide-react";

import { CountdownClock } from "@/components/dashboard/CountdownClock";

function EventCard({
  event,
  isPastEvent = false,
  showLeagueName = false,
}: {
  event: any;
  isPastEvent?: boolean;
  showLeagueName?: boolean;
}) {
  const navigate = useNavigate();
  const [attendanceStatus, setAttendanceStatus] = useState(
    event.status || null
  );
  const isRsvpOpen = event.rsvpDeadline && new Date() < event.rsvpDeadline;
  const [isEditing, setIsEditing] = useState(false);

  const getTeamName = (team: any, index: number) => {
    if (isRsvpOpen) {
      return `Team ${index + 1}`;
    }
    return team.name;
  };

  const getTeamAvatarFallback = (team: any, index: number) => {
    if (isRsvpOpen) {
      return `T${index + 1}`;
    }
    return team.name
      .split(" ")
      .map((n: string) => n[0])
      .join("");
  };

  const handleAttend = () => {
    setAttendanceStatus("attending");
    setIsEditing(false);
  };

  const handleDecline = () => {
    setAttendanceStatus("declined");
    setIsEditing(false);
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleViewDetails = () => {
    if (event.hasResults) {
      navigate(`/events/${event.id}/results`);
    } else {
      navigate(`/events/${event.id}`);
    }
  };

  return (
    <Card className="mb-4">
      <CardContent className="p-4 relative">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center">
            <Calendar className="w-4 h-4 text-gray-500 mr-2" />
            <span className="text-xs text-gray-500 mr-4">{event.date}</span>
            <span className="text-xs text-gray-500 mr-4">{event.time}</span>
            <MapPin className="w-4 h-4 text-gray-500 mr-2" />
            <span className="text-xs text-gray-500">{event.location}</span>
          </div>
          {attendanceStatus === "attending" && !isEditing && (
            <Badge
              variant="secondary"
              className="bg-[#FF7A00] bg-opacity-20 text-[#FF7A00] text-xs"
            >
              Attending
            </Badge>
          )}
          {attendanceStatus === "declined" && !isEditing && (
            <Badge
              variant="secondary"
              className="bg-red-100 text-red-600 text-xs"
            >
              Declined
            </Badge>
          )}
          {!isPastEvent && event.spotsLeft && !attendanceStatus && (
            <span className="text-[#E43226] text-xs font-semibold">
              {event.spotsLeft === 1
                ? "1 Spot Left"
                : `${event.spotsLeft} Spots Left`}
            </span>
          )}
        </div>
        <div className="grid grid-cols-3 items-center justify-items-center mb-4">
          <div className="flex flex-col items-center">
            <Avatar
              className="w-16 h-16"
              style={{ backgroundColor: event.team1.color }}
            >
              <AvatarImage
                src={event.team1.avatar}
                alt={getTeamName(event.team1, 0)}
              />
              <AvatarFallback>
                {getTeamAvatarFallback(event.team1, 0)}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm font-semibold mt-2">
              {getTeamName(event.team1, 0)}
            </span>
          </div>
          <span className="text-lg font-semibold">vs</span>
          <div className="flex flex-col items-center">
            <Avatar
              className="w-16 h-16"
              style={{ backgroundColor: event.team2.color }}
            >
              <AvatarImage
                src={event.team2.avatar}
                alt={getTeamName(event.team2, 1)}
              />
              <AvatarFallback>
                {getTeamAvatarFallback(event.team2, 1)}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm font-semibold mt-2">
              {getTeamName(event.team2, 1)}
            </span>
          </div>
        </div>
        {showLeagueName && (
          <div className="absolute bottom-4 left-4 text-xs">
            <span className="font-bold text-[#FF7A00]">{event.league}</span>
          </div>
        )}
        <div className="flex justify-center mt-2 space-x-2">
          <Button
            variant="outline"
            className="text-[#FF7A00] border-[#FF7A00] hover:bg-[#FF7A00] hover:text-white transition-colors px-4 py-2 text-sm rounded-md"
            style={{ transform: "scale(1.1)" }}
            onClick={handleViewDetails}
          >
            {event.hasResults ? "View Results" : "View Details"}
          </Button>
        </div>
        {!isPastEvent && isRsvpOpen && (
          <div className="flex justify-center mt-2 space-x-2">
            {(isEditing || !attendanceStatus) && (
              <>
                <Button
                  className="bg-[#FF7A00] text-white hover:bg-[#FF7A00]/90 transition-colors px-4 py-2 text-sm rounded-md"
                  onClick={handleAttend}
                >
                  Attend
                </Button>
                <Button
                  className="bg-[#FF7A00] text-white hover:bg-[#FF7A00]/90 transition-colors px-4 py-2 text-sm rounded-md"
                  onClick={handleDecline}
                >
                  Decline
                </Button>
              </>
            )}
            {attendanceStatus && !isEditing && (
              <Button
                variant="outline"
                className="text-[#FF7A00] border-[#FF7A00] hover:bg-[#FF7A00] hover:text-white transition-colors px-4 py-2 text-sm rounded-md"
                onClick={toggleEdit}
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit RSVP
              </Button>
            )}
          </div>
        )}
        {isRsvpOpen && (
          <div className="flex justify-end items-center mt-2">
            <div className="flex items-center space-x-2">
              <span className="text-xs text-gray-500">RSVP in:</span>
              <CountdownClock deadline={event.rsvpDeadline} />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function LeagueDetailsContent() {
  const [showAllPlayers, setShowAllPlayers] = useState(false);
  const upcomingEvents = [
    {
      id: 1,
      date: "20-Aug-2025",
      time: "6:00 PM",
      location: "Allianz Arena",
      team1: {
        name: "Eagle Claws",
        avatar: "/placeholder.svg?height=64&width=64",
        color: "#272D31",
      },
      team2: {
        name: "Ravens",
        avatar: "/placeholder.svg?height=64&width=64",
        color: "#FFC700",
      },
      rsvpDeadline: new Date("2025-08-19T18:00:00"),
      status: "attending",
      league: "Premier League",
      hasResults: false,
    },
    {
      id: 2,
      date: "25-Aug-2025",
      time: "7:30 PM",
      location: "Stamford Bridge",
      team1: {
        name: "Blue Lions",
        avatar: "/placeholder.svg?height=64&width=64",
        color: "#034694",
      },
      team2: {
        name: "Red Devils",
        avatar: "/placeholder.svg?height=64&width=64",
        color: "#DA291C",
      },
      rsvpDeadline: new Date("2025-08-24T19:30:00"),
      status: null,
      spotsLeft: 2,
      league: "Championship",
      hasResults: false,
    },
    {
      id: 3,
      date: "01-Sep-2025",
      time: "5:00 PM",
      location: "Camp Nou",
      team1: {
        name: "Catalonia FC",
        avatar: "/placeholder.svg?height=64&width=64",
        color: "#A50044",
      },
      team2: {
        name: "White Angels",
        avatar: "/placeholder.svg?height=64&width=64",
        color: "#FFFFFF",
      },
      rsvpDeadline: new Date("2025-08-31T17:00:00"),
      status: null,
      spotsLeft: 1,
      league: "La Liga",
      hasResults: false,
    },
  ];

  return (
    <div className="p-4 md:p-6">
      {/* League Info */}
      <Card className="w-full mb-6 bg-[#F9F9F9] rounded-lg overflow-hidden">
        <CardContent className="p-4">
          <div className="flex items-start">
            <Avatar className="w-16 h-16 mr-4">
              <AvatarImage src="/placeholder.svg" alt="Premier League logo" />
              <AvatarFallback>PL</AvatarFallback>
            </Avatar>
            <div className="flex-grow">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-semibold text-[rgba(0,0,0,0.8)]">
                  Premier League
                </h3>
                <span className="text-sm text-[rgba(0,0,0,0.51)]">
                  12-Feb-2024
                </span>
              </div>
              <div className="text-sm text-[#F79602] mt-1">17 Players</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Players Section */}
      <section className="mb-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Players</h3>
            <Button
              variant="link"
              className="text-sm text-[#FF7A00] hover:underline"
              onClick={() => setShowAllPlayers(!showAllPlayers)}
            >
              {showAllPlayers ? "Show Less" : "View All"}
            </Button>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[
              "John Smith",
              "Emma Johnson",
              "Michael Brown",
              "Sarah Davis",
              "David Wilson",
              "Jennifer Lee",
              "Robert Taylor",
              "Lisa Anderson",
              "James Martinez",
            ].map((player, index) => (
              <Card
                key={index}
                className="overflow-hidden cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => {}}
              >
                <CardContent className="p-2 flex items-center">
                  <Avatar className="w-8 h-8">
                    <AvatarImage
                      src={`/placeholder.svg?height=32&width=32`}
                      alt={player}
                    />
                    <AvatarFallback>
                      {player
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="ml-2 flex-grow">
                    <p className="text-sm font-medium">{player}</p>
                    <p className="text-xs text-gray-500">Midfielder</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          {showAllPlayers && (
            <div className="grid grid-cols-3 gap-2 mt-4">
              {[
                "Alex Turner",
                "Olivia Parker",
                "Daniel White",
                "Sophia Chen",
                "Ethan Rodriguez",
                "Isabella Kim",
                "Ryan Patel",
                "Ava Nguyen",
                "Noah Garcia",
              ].map((player, index) => (
                <Card
                  key={index}
                  className="overflow-hidden cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => {}}
                >
                  <CardContent className="p-2 flex items-center">
                    <Avatar className="w-8 h-8">
                      <AvatarImage
                        src={`/placeholder.svg?height=32&width=32`}
                        alt={player}
                      />
                      <AvatarFallback>
                        {player
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="ml-2 flex-grow">
                      <p className="text-sm font-medium">{player}</p>
                      <p className="text-xs text-gray-500">Forward</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Upcoming Events Section */}
      <section className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Upcoming Events</h2>
          <Link to="/events" className="text-[#FF7A00] hover:underline text-sm">
            View all
          </Link>
        </div>
        <div className="space-y-4">
          {upcomingEvents.map((event) => (
            <EventCard key={event.id} event={event} showLeagueName={true} />
          ))}
        </div>
      </section>
    </div>
  );
}

export default function LeagueDetails() {
  const navigate = useNavigate();
  const [showAllPlayers, setShowAllPlayers] = useState(false);

  const handlePlayerClick = () => {
    navigate("/player-profile");
  };

  const upcomingEvents = [
    {
      id: 1,
      date: "20-Aug-2025",
      time: "6:00 PM",
      location: "Allianz Arena",
      team1: {
        name: "Eagle Claws",
        avatar: "/placeholder.svg?height=64&width=64",
        color: "#272D31",
      },
      team2: {
        name: "Ravens",
        avatar: "/placeholder.svg?height=64&width=64",
        color: "#FFC700",
      },
      rsvpDeadline: new Date("2025-08-19T18:00:00"),
      status: "attending",
      league: "Premier League",
      hasResults: false,
    },
    {
      id: 2,
      date: "25-Aug-2025",
      time: "7:30 PM",
      location: "Stamford Bridge",
      team1: {
        name: "Blue Lions",
        avatar: "/placeholder.svg?height=64&width=64",
        color: "#034694",
      },
      team2: {
        name: "Red Devils",
        avatar: "/placeholder.svg?height=64&width=64",
        color: "#DA291C",
      },
      rsvpDeadline: new Date("2025-08-24T19:30:00"),
      status: null,
      spotsLeft: 2,
      league: "Championship",
      hasResults: false,
    },
    {
      id: 3,
      date: "01-Sep-2025",
      time: "5:00 PM",
      location: "Camp Nou",
      team1: {
        name: "Catalonia FC",
        avatar: "/placeholder.svg?height=64&width=64",
        color: "#A50044",
      },
      team2: {
        name: "White Angels",
        avatar: "/placeholder.svg?height=64&width=64",
        color: "#FFFFFF",
      },
      rsvpDeadline: new Date("2025-08-31T17:00:00"),
      status: null,
      spotsLeft: 1,
      league: "La Liga",
      hasResults: false,
    },
  ];

  return (
      <main className="flex-1 bg-background relative pt-10">
        <div className="absolute top-4 left-4 z-50"></div>
        <div className="p-4 md:p-6">
          {/* League Info */}
          <Card className="w-full mb-6 bg-[#F9F9F9] rounded-lg overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-start">
                <Avatar className="w-16 h-16 mr-4">
                  <AvatarImage
                    src="/placeholder.svg"
                    alt="Premier League logo"
                  />
                  <AvatarFallback>PL</AvatarFallback>
                </Avatar>
                <div className="flex-grow">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-semibold text-[rgba(0,0,0,0.8)]">
                      Premier League
                    </h3>
                    <span className="text-sm text-[rgba(0,0,0,0.51)]">
                      12-Feb-2024
                    </span>
                  </div>
                  <div className="text-sm text-[#F79602] mt-1">17 Players</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Players Section */}
          <section className="mb-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Players</h3>
                <Button
                  variant="link"
                  className="text-sm text-[#FF7A00] hover:underline"
                  onClick={() => setShowAllPlayers(!showAllPlayers)}
                >
                  {showAllPlayers ? "Show Less" : "View All"}
                </Button>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[
                  "John Smith",
                  "Emma Johnson",
                  "Michael Brown",
                  "Sarah Davis",
                  "David Wilson",
                  "Jennifer Lee",
                  "Robert Taylor",
                  "Lisa Anderson",
                  "James Martinez",
                ].map((player, index) => (
                  <Card
                    key={index}
                    className="overflow-hidden cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={handlePlayerClick}
                  >
                    <CardContent className="p-2 flex items-center">
                      <Avatar className="w-8 h-8">
                        <AvatarImage
                          src={`/placeholder.svg?height=32&width=32`}
                          alt={player}
                        />
                        <AvatarFallback>
                          {player
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="ml-2 flex-grow">
                        <p className="text-sm font-medium">{player}</p>
                        <p className="text-xs text-gray-500">Midfielder</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              {showAllPlayers && (
                <div className="grid grid-cols-3 gap-2 mt-4">
                  {[
                    "Alex Turner",
                    "Olivia Parker",
                    "Daniel White",
                    "Sophia Chen",
                    "Ethan Rodriguez",
                    "Isabella Kim",
                    "Ryan Patel",
                    "Ava Nguyen",
                    "Noah Garcia",
                  ].map((player, index) => (
                    <Card
                      key={index}
                      className="overflow-hidden cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={handlePlayerClick}
                    >
                      <CardContent className="p-2 flex items-center">
                        <Avatar className="w-8 h-8">
                          <AvatarImage
                            src={`/placeholder.svg?height=32&width=32`}
                            alt={player}
                          />
                          <AvatarFallback>
                            {player
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="ml-2 flex-grow">
                          <p className="text-sm font-medium">{player}</p>
                          <p className="text-xs text-gray-500">Forward</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* Upcoming Events Section */}
          <section className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Upcoming Events</h2>
              <Link
                to="/events"
                className="text-[#FF7A00] hover:underline text-sm"
              >
                View all
              </Link>
            </div>
            <div className="space-y-4">
              {upcomingEvents.map((event) => (
                <EventCard key={event.id} event={event} showLeagueName={true} />
              ))}
            </div>
          </section>
        </div>
      </main>
  );
}
