import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Edit, Trash2, UserPlus, Trophy } from "lucide-react";
import { EventType } from "@/types/events";
import { isPast } from "date-fns";

interface ManageEventCardProps {
  event: EventType;
  onDelete: (eventId: string) => void;
}

export const ManageEventCard: React.FC<ManageEventCardProps> = ({
  event,
  onDelete,
}) => {
  const eventTime = `${event.startDate.startHour}:${event.startDate.startMinute} ${event.startDate.startAmPm}`;

  const eventSpotsLeft = event.numTeams * event.rosterSpots;

  const eventDate = new Date(event.startDate.date).setHours(
    event.startDate.startAmPm === "PM"
      ? event.startDate.startHour + 12
      : event.startDate.startHour,
    event.startDate.startMinute,
  );

  const eventStatus = isPast(eventDate) ? "past" : "upcoming";

  return (
    <Card className="mb-4">
      <CardContent className="relative p-4">
        <div className="mb-2 flex items-start justify-between">
          <div className="flex flex-col">
            <div className="mb-1 flex items-center">
              <Calendar
                className="mr-2 h-4 w-4 text-gray-500"
                aria-hidden="true"
              />
              <span className="mr-4 text-xs text-gray-500">
                {new Date(eventDate).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
              <span className="mr-4 text-xs text-gray-500">{eventTime}</span>
              <MapPin
                className="mr-2 h-4 w-4 text-gray-500"
                aria-hidden="true"
              />
              <span className="text-xs text-gray-500">{event.location}</span>
            </div>
          </div>
          {eventStatus === "upcoming" && eventSpotsLeft && (
            <span className="text-xs font-semibold text-[#E43226]">
              {eventSpotsLeft === 1
                ? "1 Spot Left"
                : `${eventSpotsLeft} Spots Left`}
            </span>
          )}
        </div>
        <div className="flex items-center justify-items-center">
          {event.teams.map((team) => (
            <React.Fragment key={team.id}>
              <div className="flex flex-1 flex-col items-center">
                <Avatar
                  className="h-16 w-16 border-2"
                  style={{ borderColor: team.color }}
                >
                  <AvatarImage src={team.logo} alt={`${team.name} logo`} />
                  <AvatarFallback>
                    {team.name.split(" ").map((n) => n[0])}
                  </AvatarFallback>
                </Avatar>
                <span className="mt-2 text-sm font-semibold">{team.name}</span>
              </div>
              <span className="flex-1 text-center text-lg font-semibold last:hidden">
                vs
              </span>
            </React.Fragment>
          ))}
        </div>
        <div className="mt-4 flex justify-center space-x-2">
          {eventStatus === "upcoming" && (
            <>
              <Link to={`/select-captains/${event.id}`}>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center"
                >
                  <UserPlus className="mr-2 h-4 w-4" />
                  Select Captains
                </Button>
              </Link>
              <Link to={`/edit-event/${event.id}`}>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center"
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Button>
              </Link>
              <Button
                onClick={() => onDelete(event.id)}
                variant="outline"
                size="sm"
                className="flex items-center text-red-500 hover:text-red-700"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </>
          )}
          {eventStatus === "past" && (
            <Link to={`/edit-results/${event.id}`}>
              <Button variant="outline" size="sm" className="flex items-center">
                <Trophy className="mr-2 h-4 w-4" />
                {event.resultsEntered ? "Edit Results" : "Enter Results"}
              </Button>
            </Link>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
