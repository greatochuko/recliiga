import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  MapPin,
  Edit,
  UserPlus,
  Trophy,
  ClockIcon,
} from "lucide-react";
import { EventType } from "@/types/events";
import { format, isPast } from "date-fns";
import DeleteEventButton from "./DeleteEventButton";
import CountdownClock from "./CountdownClock";

interface ManageEventCardProps {
  event: EventType;
  refetchEvents: () => void;
}

export default function ManageEventCard({
  event,
  refetchEvents,
}: ManageEventCardProps) {
  const eventDate = new Date(event.startTime);
  const eventTime = format(event.startTime, "h:mm a");
  const spotsLeft = event.numTeams * event.rosterSpots - event.players.length;
  const eventStatus = isPast(eventDate) ? "past" : "upcoming";

  const rsvpDeadline = useMemo(() => {
    const startTime = new Date(event.startTime);
    return new Date(startTime.getTime() - event.rsvpDeadline * 60 * 60 * 1000);
  }, [event.startTime, event.rsvpDeadline]);

  const isRsvpOpen = new Date() < rsvpDeadline;

  return (
    <Card className="mb-4">
      <CardContent className="relative p-4">
        <div className="mb-2 flex items-start justify-between">
          <div className="mb-1 flex w-full flex-col gap-4 sm:flex-row sm:items-center">
            <div className="flex items-center justify-between">
              <h3 className="mr-4 font-medium">{event.title}</h3>
              {eventStatus === "upcoming" && (
                <span className="w-fit whitespace-nowrap text-xs font-semibold text-[#E43226] sm:hidden">
                  {!spotsLeft
                    ? "No Spots left"
                    : spotsLeft === 1
                      ? "1 Spot Left"
                      : `${spotsLeft} Spots Left`}
                </span>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-2 sm:gap-4">
              <span className="flex items-center gap-2 text-xs text-gray-500">
                <Calendar
                  className="h-4 w-4 text-gray-500"
                  aria-hidden="true"
                />
                {new Date(eventDate).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
              <span className="flex items-center gap-2 text-xs text-gray-500">
                <ClockIcon className="h-4 w-4 text-gray-500" />
                {eventTime}
              </span>

              <span className="flex items-center gap-2 text-xs text-gray-500">
                <MapPin className="h-4 w-4 text-gray-500" aria-hidden="true" />
                {event.location}
              </span>
            </div>
          </div>
          {eventStatus === "upcoming" && (
            <span className="hidden w-fit whitespace-nowrap text-xs font-semibold text-[#E43226] sm:block">
              {!spotsLeft
                ? "No Spots left"
                : spotsLeft === 1
                  ? "1 Spot Left"
                  : `${spotsLeft} Spots Left`}
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
                <span className="mt-2 text-center text-sm font-semibold">
                  {team.name}
                </span>
              </div>
              <span className="flex-1 text-center text-lg font-semibold last:hidden">
                vs
              </span>
            </React.Fragment>
          ))}
        </div>

        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {!isRsvpOpen && !event.resultsEntered && (
            <Link to={`/${event.id}/select-captains`}>
              <Button variant="outline" size="sm" className="flex items-center">
                <UserPlus className="mr-2 h-4 w-4" />
                {event.teams.every((team) => team.captain)
                  ? "Change"
                  : "Select"}{" "}
                Captains
              </Button>
            </Link>
          )}
          {eventStatus === "upcoming" ? (
            <>
              <div className="flex gap-4">
                <Link to={`/events/${event.id}/edit`}>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center"
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                </Link>
                <DeleteEventButton
                  eventId={event.id}
                  refetchEvents={refetchEvents}
                />
              </div>
            </>
          ) : (
            <div className="flex gap-4">
              <Link to={`/edit-results/${event.id}`} className="hidden sm:flex">
                <Button variant="outline" size="sm" className="items-center">
                  <Trophy className="mr-2 h-4 w-4" />
                  {event.resultsEntered ? "Edit Results" : "Enter Results"}
                </Button>
              </Link>
              {!event.resultsEntered && (
                <Link to={`/events/${event.id}/edit`}>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center"
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                </Link>
              )}
            </div>
          )}
        </div>

        <div
          className={`flex items-end justify-between gap-2.5 sm:gap-4 ${!event.resultsEntered ? "mt-4" : ""}`}
        >
          {isRsvpOpen ? (
            <CountdownClock deadline={rsvpDeadline} size="sm" />
          ) : (
            eventStatus === "upcoming" && (
              <p className="text-sm font-medium text-red-500">Rsvp Expired</p>
            )
          )}
          {/* {!event.resultsEntered && eventStatus !== "upcoming" && (
            <Link
              to={`/events/${event.id}/edit`}
              className={eventStatus === "past" ? "" : "sm:hidden"}
            >
              <Button variant="outline" size="sm" className="flex items-center">
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Button>
            </Link>
          )} */}
          {eventStatus === "past" && (
            <Link to={`/edit-results/${event.id}`}>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center sm:hidden"
              >
                <Trophy className="mr-2 h-4 w-4" />
                {event.resultsEntered ? "Edit Results" : "Enter Results"}
              </Button>
            </Link>
          )}
          <span className="bottom-4 left-4 ml-auto text-xs font-bold text-accent-orange">
            {event.league.name}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
