import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "../ui/card";
import { Calendar, Edit, MapPin } from "lucide-react";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { CountdownClock } from "../dashboard/CountdownClock";

export default function LeagueEventCard({
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
