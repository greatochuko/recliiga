import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Edit, Trash2, UserPlus, Trophy } from "lucide-react";
import { EventType } from "@/types/events";
import { isPast } from "date-fns";

interface EventCardProps {
  event: EventType;
  onSelectCaptains: (eventId: string) => void;
  onEdit: (eventId: string) => void;
  onDelete: (eventId: string) => void;
  onEnterResults: (eventId: string) => void;
}

export const EventCard: React.FC<EventCardProps> = ({
  event,
  onSelectCaptains,
  onEdit,
  onDelete,
  onEnterResults,
}) => {
  const navigate = useNavigate();

  const handleSelectCaptains = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate(`/select-captains/${event.id}`);
  };

  const handleEnterResults = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate(`/edit-results/${event.id}`);
  };

  const eventDate = event.eventDates[0].date;

  const eventTime = `${event.eventDates[0].startHour}:${event.eventDates[0].startMinute} ${event.eventDates[0].startAmPm}`;

  const eventSpotsLeft = event.numTeams * event.rosterSpots;

  const eventStatus = isPast(eventDate) ? "past" : "upcoming";

  return (
    <Card className="mb-4">
      <CardContent className="p-4 relative">
        <div className="flex justify-between items-start mb-2">
          <div className="flex flex-col">
            <div className="flex items-center mb-1">
              <Calendar
                className="w-4 h-4 text-gray-500 mr-2"
                aria-hidden="true"
              />
              <span className="text-xs text-gray-500 mr-4">
                {new Date(eventDate).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
              <span className="text-xs text-gray-500 mr-4">{eventTime}</span>
              <MapPin
                className="w-4 h-4 text-gray-500 mr-2"
                aria-hidden="true"
              />
              <span className="text-xs text-gray-500">{event.location}</span>
            </div>
          </div>
          {eventStatus === "upcoming" && eventSpotsLeft && (
            <span className="text-[#E43226] text-xs font-semibold">
              {eventSpotsLeft === 1
                ? "1 Spot Left"
                : `${eventSpotsLeft} Spots Left`}
            </span>
          )}
        </div>
        <div className="grid grid-cols-3 items-center justify-items-center">
          <div className="flex flex-col items-center">
            <Avatar className="w-16 h-16 border-2 border-red-500">
              <AvatarImage src={"/placeholder2.svg"} alt={`Team 1 logo`} />
              <AvatarFallback>T1</AvatarFallback>
            </Avatar>
            <span className="text-sm font-semibold mt-2">TEAM 1</span>
          </div>
          <span className="text-lg font-semibold">vs</span>
          <div className="flex flex-col items-center">
            <Avatar className="w-16 h-16 border-2 border-blue-500">
              <AvatarImage src={"/placeholder2.svg"} alt={`TEAM 2 logo`} />
              <AvatarFallback>T2</AvatarFallback>
            </Avatar>
            <span className="text-sm font-semibold mt-2">TEAM 2</span>
          </div>
        </div>
        <div className="flex justify-center mt-4 space-x-2">
          {eventStatus === "upcoming" && (
            <>
              <Button
                onClick={handleSelectCaptains}
                variant="outline"
                size="sm"
                className="flex items-center"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Select Captains
              </Button>
              <Button
                onClick={() => onEdit(event.id)}
                variant="outline"
                size="sm"
                className="flex items-center"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
              <Button
                onClick={() => onDelete(event.id)}
                variant="outline"
                size="sm"
                className="flex items-center text-red-500 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
            </>
          )}
          {/*eventStatus === "past" && (
            <Button
              onClick={handleEnterResults}
              variant="outline"
              size="sm"
              className="flex items-center"
            >
              <Trophy className="w-4 h-4 mr-2" />
              {event.resultsEntered ? "Edit Results" : "Enter Results"}
            </Button>
          )*/}
        </div>
      </CardContent>
    </Card>
  );
};
