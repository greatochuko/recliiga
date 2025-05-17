import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Edit } from "lucide-react";
import { CountdownClock } from "./CountdownClock";
import { Event } from "@/types/dashboard";
import { useNavigate } from "react-router-dom";
import { getLeagueName } from "@/types/dashboard";
import { getInitials } from "@/lib/utils";

interface EventCardProps {
  event: Event;
  showLeagueName?: boolean;
  isPastEvent?: boolean;
}

export function EventCard({
  event,
  showLeagueName = false,
  isPastEvent = false,
}: EventCardProps) {
  const navigate = useNavigate();
  const [attendanceStatus, setAttendanceStatus] = useState(
    event.status || null,
  );
  const isRsvpOpen = event.rsvpDeadline && new Date() < event.rsvpDeadline;
  const [isEditing, setIsEditing] = useState(false);

  const getTeamName = (team: { name: string }, index: number) => {
    if (isRsvpOpen) {
      return `Team ${index + 1}`;
    }
    return team.name;
  };

  const getTeamAvatarFallback = (team: { name: string }, index: number) => {
    if (isRsvpOpen) {
      return `T${index + 1}`;
    }
    return getInitials(team.name);
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
      navigate(`/dashboard/events/${event.id}/results`);
    } else {
      navigate(`/dashboard/events/${event.id}`);
    }
  };

  return (
    <Card className="mb-4">
      <CardContent className="relative p-4">
        <div className="mb-4 flex items-start justify-between">
          <div className="flex items-center">
            <Calendar className="mr-2 h-4 w-4 text-gray-500" />
            <span className="mr-4 text-xs text-gray-500">{event.date}</span>
            <span className="mr-4 text-xs text-gray-500">{event.time}</span>
            <MapPin className="mr-2 h-4 w-4 text-gray-500" />
            <span className="text-xs text-gray-500">{event.location}</span>
          </div>
          {attendanceStatus === "attending" && !isEditing && (
            <Badge
              variant="secondary"
              className="bg-accent-orange bg-opacity-20 text-xs text-accent-orange"
            >
              Attending
            </Badge>
          )}
          {attendanceStatus === "declined" && !isEditing && (
            <Badge
              variant="secondary"
              className="bg-red-100 text-xs text-red-600"
            >
              Declined
            </Badge>
          )}
          {!isPastEvent && event.spotsLeft && !attendanceStatus && (
            <span className="text-xs font-semibold text-[#E43226]">
              {event.spotsLeft === 1
                ? "1 Spot Left"
                : `${event.spotsLeft} Spots Left`}
            </span>
          )}
        </div>
        <div className="mb-4 grid grid-cols-3 items-center justify-items-center">
          <div className="flex flex-col items-center">
            <Avatar
              className="h-16 w-16"
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
            <span className="mt-2 text-sm font-semibold">
              {getTeamName(event.team1, 0)}
            </span>
          </div>
          <span className="text-lg font-semibold">vs</span>
          <div className="flex flex-col items-center">
            <Avatar
              className="h-16 w-16"
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
            <span className="mt-2 text-sm font-semibold">
              {getTeamName(event.team2, 1)}
            </span>
          </div>
        </div>
        {showLeagueName && (
          <div className="absolute bottom-4 left-4 text-xs">
            <span className="font-bold text-accent-orange">
              {getLeagueName(event.league)}
            </span>
          </div>
        )}
        <div className="mt-2 flex justify-center space-x-2">
          <Button
            variant="outline"
            className="rounded-md border-accent-orange px-4 py-2 text-sm text-accent-orange transition-colors hover:bg-accent-orange hover:text-white"
            style={{ transform: "scale(1.1)" }}
            onClick={handleViewDetails}
          >
            {event.hasResults ? "View Results" : "View Details"}
          </Button>
        </div>
        {!isPastEvent && isRsvpOpen && (
          <div className="mt-2 flex justify-center space-x-2">
            {(isEditing || !attendanceStatus) && (
              <>
                <Button
                  className="rounded-md bg-accent-orange px-4 py-2 text-sm text-white transition-colors hover:bg-accent-orange/90"
                  onClick={handleAttend}
                >
                  Attend
                </Button>
                <Button
                  className="rounded-md bg-accent-orange px-4 py-2 text-sm text-white transition-colors hover:bg-accent-orange/90"
                  onClick={handleDecline}
                >
                  Decline
                </Button>
              </>
            )}
            {attendanceStatus && !isEditing && (
              <Button
                variant="outline"
                className="rounded-md border-accent-orange px-4 py-2 text-sm text-accent-orange transition-colors hover:bg-accent-orange hover:text-white"
                onClick={toggleEdit}
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit RSVP
              </Button>
            )}
          </div>
        )}
        {isRsvpOpen && (
          <div className="mt-2 flex items-center justify-end">
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
