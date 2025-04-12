import { useState, useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

import { JerseyIcon } from "@/components/draft/DraftUIComponents";
import { ChevronLeft } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchEventById } from "@/api/events";
import FullScreenLoader from "@/components/FullScreenLoader";
import { TeamType } from "@/types/events";

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
    <div className="flex space-x-4 text-lg font-semibold">
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

// function AttendingList({
//   players,
//   teamColor,
//   teamName,
//   uniformColor,
// }: {
//   players: Player[];
//   teamColor: string;
//   teamName: string;
//   uniformColor: string;
// }) {
//   return (
//     <div className="w-full">
//       <div className="mb-4 flex items-center justify-between">
//         <div className="flex items-center gap-2">
//           <h3 className="text-sm font-medium">{teamName}</h3>
//           <JerseyIcon color={uniformColor} size={23} />
//         </div>
//       </div>
//       <div className="space-y-4">
//         {players.map((player) => (
//           <div key={player.id} className="flex items-center gap-4">
//             <Avatar
//               className="h-10 w-10"
//               style={player.isCaptain ? { backgroundColor: teamColor } : {}}
//             >
//               <AvatarImage src={player.avatar} alt={player.name} />
//               <AvatarFallback>
//                 {player.name
//                   .split(" ")
//                   .map((n) => n[0])
//                   .join("")}
//               </AvatarFallback>
//             </Avatar>
//             <div className="flex-1">
//               <div className="flex items-center gap-2">
//                 <span className="font-semibold">{player.name}</span>
//                 {player.isCaptain && (
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     viewBox="0 0 24 24"
//                     fill="none"
//                     stroke="currentColor"
//                     strokeWidth="2"
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     className="h-4 w-4 text-accent-orange"
//                   >
//                     <path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14" />
//                   </svg>
//                 )}
//               </div>
//               <span className="text-sm text-muted-foreground">
//                 {player.position}
//               </span>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

export default function EventDetails() {
  const navigate = useNavigate();
  const { id: eventId } = useParams();

  const {
    data: { data: event, error },
    isLoading,
  } = useQuery({
    queryKey: [`event-${eventId}`],
    queryFn: () => fetchEventById(eventId),
  });

  const handleBackClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate(-1); // This ensures we go back to the previous page in history
  };

  const rsvpDeadline = useMemo(() => {
    const { date, startHour, startMinute, startAmPm } = event.startDate;

    const eventDate = new Date(date);
    const hour =
      startAmPm.toLowerCase() === "pm" && startHour !== 12
        ? startHour + 12
        : startHour === 12 && startAmPm.toLowerCase() === "am"
          ? 0
          : startHour;

    eventDate.setHours(hour, startMinute, 0, 0);

    const rsvpDeadlineTime = new Date(
      eventDate.getTime() - event.rsvpDeadline * 60 * 1000,
    );

    return { isPassed: new Date() > rsvpDeadlineTime, time: rsvpDeadlineTime };
  }, [event]);

  if (isLoading) {
    return <FullScreenLoader />;
  }

  if (error !== null) {
    return <div></div>;
  }

  return (
    <main className="relative flex-1 bg-background">
      <h1 className="ml-14 text-2xl font-bold">Event Details</h1>
      <Button
        variant="ghost"
        size="sm"
        className="fixed right-4 top-4 z-10 flex items-center p-0 text-accent-orange hover:bg-transparent hover:text-accent-orange hover:underline"
        onClick={handleBackClick}
      >
        <ChevronLeft className="mr-1 h-4 w-4" />
        Previous
      </Button>
      <div className="container mx-auto px-4 py-8">
        <Card className="mx-auto max-w-3xl">
          <CardHeader>
            <CardTitle className="text-center text-2xl font-bold">
              Upcoming Match
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              <div className="mb-8 flex items-center justify-center gap-8">
                <TeamInfo team={event.teams[0]} />
                <div className="flex flex-col items-center justify-center">
                  <div className="mb-4 flex flex-col items-center text-center">
                    <span className="text-xs text-gray-500">
                      {new Date(event.startDate.date).toLocaleDateString(
                        "en-US",
                        {
                          month: "short",
                          day: "2-digit",
                          year: "numeric",
                        },
                      )}
                    </span>
                    <span className="text-xs text-gray-500">
                      {event.location}
                    </span>
                    <span className="text-xs text-gray-500">
                      {event.startDate.startHour}:{event.startDate.startMinute}
                      {event.startDate.startAmPm}
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
                                (team) => team.captain.id === player.id,
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

function TeamInfo({ team }: { team: TeamType }) {
  return (
    <div className="flex flex-col items-center space-y-2">
      <Avatar
        className="h-16 w-16 border-2"
        style={{ borderColor: team.color }}
      >
        <AvatarImage src={team.logo} alt={team.name} />
        <AvatarFallback>
          {team.name
            .split(" ")
            .map((n: string) => n[0])
            .join("")}
        </AvatarFallback>
      </Avatar>
      <span className="text-sm font-semibold">{team.name}</span>
      <div className="mt-2 flex flex-col items-center">
        <JerseyIcon color={team.color} size={48} />
      </div>
    </div>
  );
}
