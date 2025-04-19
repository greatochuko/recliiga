"use client";

import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CalendarIcon,
  ArrowLeft,
  Loader2Icon,
  ArrowLeftIcon,
} from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format, isBefore, startOfDay } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { EventDataType, editEvent, fetchEventById } from "@/api/events";
import { EventTimeDataType } from "@/types/events";

const initialEventData: EventDataType = {
  leagueId: "",
  title: "",
  location: "",
  numTeams: 2,
  rosterSpots: 1,
  rsvpDeadline: 2,
  startTime: new Date(),
  endTime: new Date(),
  eventDates: [],
};

export default function EditEvent() {
  const [eventData, setEventData] = useState<EventDataType>(initialEventData);
  const [submitting, setSubmitting] = useState(false);
  const [rsvpDeadlineHours, setRsvpDeadlineHours] = useState("1h");

  const { id } = useParams();

  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: [`event-${id}`],
    queryFn: () => fetchEventById(id),
  });

  const event = data?.data;

  useEffect(() => {
    if (event) {
      setEventData((prev) => ({
        ...prev,
        ...event,
      }));
      setRsvpDeadlineHours(
        event.rsvpDeadline > 0 ? `${event.rsvpDeadline}h` : "custom",
      );
    }
  }, [event]);

  const handlePositiveNumberInput = (
    value: string,
    field: "numTeams" | "rosterSpots" | "customRsvpHours",
  ) => {
    const numValue = parseInt(value, 10);
    if (!isNaN(numValue) && numValue > 0) {
      setEventData((prev) => ({ ...prev, [field]: numValue }));
    } else if (value === "") {
      setEventData((prev) => ({ ...prev, [field]: "" }));
    }
  };

  function updateEventStartTime<T extends keyof EventTimeDataType>(
    field: T,
    value: EventTimeDataType[T],
  ) {
    setEventData((prev) => {
      const updatedStartTime = new Date(prev.startTime);

      switch (field) {
        case "date":
          // Preserve the original time
          updatedStartTime.setFullYear((value as Date).getFullYear());
          updatedStartTime.setMonth((value as Date).getMonth());
          updatedStartTime.setDate((value as Date).getDate());
          break;

        case "hour": {
          const hour = value as number;
          const isPM = updatedStartTime.getHours() >= 12;
          updatedStartTime.setHours(
            isPM ? (hour % 12) + 12 : hour % 12, // convert to 24-hour format
          );
          break;
        }

        case "minute":
          updatedStartTime.setMinutes(value as number);
          break;

        case "meridiem": {
          const meridiem = value as "AM" | "PM";
          const currentHour = updatedStartTime.getHours();
          const isCurrentlyPM = currentHour >= 12;
          if (meridiem === "AM" && isCurrentlyPM) {
            updatedStartTime.setHours(currentHour - 12);
          } else if (meridiem === "PM" && !isCurrentlyPM) {
            updatedStartTime.setHours(currentHour + 12);
          }
          break;
        }

        default:
          break;
      }

      return { ...prev, startTime: updatedStartTime };
    });
  }

  function updateEventEndTime<T extends keyof EventTimeDataType>(
    field: T,
    value: EventTimeDataType[T],
  ) {
    setEventData((prev) => {
      const updatedEndTime = new Date(prev.endTime);

      switch (field) {
        case "date":
          // Preserve the original time
          updatedEndTime.setFullYear((value as Date).getFullYear());
          updatedEndTime.setMonth((value as Date).getMonth());
          updatedEndTime.setDate((value as Date).getDate());
          break;

        case "hour": {
          const hour = value as number;
          const isPM = updatedEndTime.getHours() >= 12;
          updatedEndTime.setHours(
            isPM ? (hour % 12) + 12 : hour % 12, // convert to 24-hour format
          );
          break;
        }

        case "minute":
          updatedEndTime.setMinutes(value as number);
          break;

        case "meridiem": {
          const meridiem = value as "AM" | "PM";
          const currentHour = updatedEndTime.getHours();
          const isCurrentlyPM = currentHour >= 12;
          if (meridiem === "AM" && isCurrentlyPM) {
            updatedEndTime.setHours(currentHour - 12);
          } else if (meridiem === "PM" && !isCurrentlyPM) {
            updatedEndTime.setHours(currentHour + 12);
          }
          break;
        }

        default:
          break;
      }

      return { ...prev, endTime: updatedEndTime };
    });
  }

  function handleChangeRsvpDeadline(e: React.ChangeEvent<HTMLSelectElement>) {
    setRsvpDeadlineHours(e.target.value);
    if (e.target.value === "custom") {
      setEventData((prev) => ({
        ...prev,
        rsvpDeadline: 0,
      }));
    } else {
      setEventData((prev) => ({
        ...prev,
        rsvpDeadline: parseInt(e.target.value.split("h")[0], 10),
      }));
    }
  }

  const cannotSubmit =
    !eventData.title.trim() ||
    !eventData.location.trim() ||
    !eventData.leagueId ||
    eventData.numTeams < 1 ||
    eventData.rosterSpots < 1 ||
    !eventData.startTime ||
    !eventData.endTime ||
    !eventData.rsvpDeadline;

  const handleEditEvent = async (e: React.FormEvent) => {
    e.preventDefault();

    setSubmitting(true);
    const { error } = await editEvent(id, { ...eventData });

    if (error === null) {
      navigate("/manage-events");
    } else {
      setSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex w-full items-center justify-center">
        <Loader2Icon className="h-8 w-8 animate-spin text-accent-orange" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="flex w-full flex-col items-center justify-center px-4 text-center">
        <h1 className="text-4xl font-bold text-gray-800">Event Not Found</h1>
        <p className="mt-4 text-gray-600">
          The event you are looking for does not exist or has been removed.
        </p>
        <Link
          to="/manage-events"
          className="mt-6 flex items-center gap-1 rounded-md bg-accent-orange px-4 py-2 text-sm font-medium text-white hover:bg-accent-orange/90"
        >
          <ArrowLeftIcon className="h-5 w-5" />
          Go Back to Events
        </Link>
      </div>
    );
  }

  const eventStartHour = new Date(eventData.startTime).getHours();
  const eventStartMinute = new Date(eventData.startTime).getMinutes();

  const eventEndHour = new Date(eventData.endTime).getHours();
  const eventEndMinute = new Date(eventData.endTime).getMinutes();

  return (
    <main className="mx-auto w-full max-w-3xl">
      <Card className="my-2">
        <CardHeader className="relative">
          <Link
            to="/manage-events"
            className="absolute left-6 top-6 flex items-center gap-1 px-3 py-1.5 text-accent-orange"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </Link>
          <CardTitle
            className="text-center text-2xl font-semibold text-gray-800"
            style={{ marginTop: 0 }}
          >
            Edit Event
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleEditEvent} className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <Label htmlFor="league-id">League</Label>
              <select
                defaultValue={eventData.leagueId}
                className="cursor-pointer rounded-md border px-3 py-2 text-sm disabled:cursor-default disabled:bg-gray-100"
                id="league-id"
                name="league-id"
                disabled
              >
                <option value={eventData.leagueId}>{event.league.name}</option>
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="eventTitle">Event Title</Label>
              <Input
                id="eventTitle"
                value={eventData.title}
                onChange={(e) =>
                  setEventData((prev) => ({
                    ...prev,
                    title: e.target.value,
                  }))
                }
                placeholder="Enter event title"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={eventData.location}
                onChange={(e) =>
                  setEventData((prev) => ({
                    ...prev,
                    location: e.target.value,
                  }))
                }
                placeholder="Enter event location"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="teams">Number of Teams</Label>
              <Input
                id="teams"
                type="number"
                value={eventData.numTeams}
                onChange={(e) =>
                  handlePositiveNumberInput(e.target.value, "numTeams")
                }
                placeholder="Enter number of teams"
                min="1"
                disabled
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="rosterSpots">
                Number of Roster Spots Per Team
              </Label>
              <Input
                id="rosterSpots"
                type="number"
                value={eventData.rosterSpots}
                onChange={(e) =>
                  handlePositiveNumberInput(e.target.value, "rosterSpots")
                }
                placeholder="Enter number of roster spots"
                min="1"
              />
            </div>

            {eventData.rosterSpots > 0 && (
              <div className="text-sm text-muted-foreground">
                Total number of spots available:{" "}
                {eventData.rosterSpots * eventData.numTeams}
              </div>
            )}

            <div className="space-y-4 rounded-md bg-gray-50 p-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="date">Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="date"
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !eventData.startTime && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {eventData.startTime ? (
                        format(eventData.startTime, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={eventData.startTime}
                      onSelect={(date) => updateEventStartTime("date", date)}
                      disabled={(date) =>
                        isBefore(date, startOfDay(new Date()))
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <Label>Start Time</Label>
                  <div className="flex gap-2">
                    <select
                      value={
                        eventStartHour === 0
                          ? (12).toString().padStart(2, "0")
                          : eventStartHour > 12
                            ? (eventStartHour - 12).toString().padStart(2, "0")
                            : eventStartHour.toString().padStart(2, "0")
                      }
                      onChange={(e) =>
                        updateEventStartTime("hour", Number(e.target.value))
                      }
                      className="w-[70px] rounded-md border px-3 py-2 text-sm"
                    >
                      <option hidden>HH</option>
                      {Array.from({ length: 12 }, (_, i) => i + 1).map(
                        (hour) => (
                          <option
                            key={hour}
                            value={hour.toString().padStart(2, "0")}
                          >
                            {hour.toString().padStart(2, "0")}
                          </option>
                        ),
                      )}
                    </select>
                    <select
                      value={eventStartMinute.toString().padStart(2, "0")}
                      onChange={(e) =>
                        updateEventStartTime("minute", Number(e.target.value))
                      }
                      className="w-[70px] rounded-md border px-3 py-2 text-sm"
                    >
                      <option hidden>MM</option>
                      {Array.from({ length: 60 }, (_, i) => i).map((minute) => (
                        <option
                          key={minute}
                          value={minute.toString().padStart(2, "0")}
                        >
                          {minute.toString().padStart(2, "0")}
                        </option>
                      ))}
                    </select>
                    <select
                      value={eventStartHour >= 12 ? "PM" : "AM"}
                      onChange={(e) =>
                        updateEventStartTime(
                          "meridiem",
                          e.target.value as "AM" | "PM",
                        )
                      }
                      className="w-[70px] rounded-md border px-3 py-2 text-sm"
                    >
                      <option hidden>AM/PM</option>
                      <option value={"AM"}>AM</option>
                      <option value={"PM"}>PM</option>
                    </select>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Label>End Time</Label>
                  <div className="flex gap-2">
                    <select
                      value={
                        eventEndHour > 12
                          ? (eventEndHour - 12).toString().padStart(2, "0")
                          : eventEndHour.toString().padStart(2, "0")
                      }
                      onChange={(e) =>
                        updateEventEndTime("hour", Number(e.target.value))
                      }
                      className="w-[70px] rounded-md border px-3 py-2 text-sm"
                    >
                      <option hidden>HH</option>
                      {Array.from({ length: 12 }, (_, i) => i + 1).map(
                        (hour) => (
                          <option
                            key={hour}
                            value={hour.toString().padStart(2, "0")}
                          >
                            {hour.toString().padStart(2, "0")}
                          </option>
                        ),
                      )}
                    </select>
                    <select
                      value={eventEndMinute.toString().padStart(2, "0")}
                      onChange={(e) =>
                        updateEventEndTime("minute", Number(e.target.value))
                      }
                      className="w-[70px] rounded-md border px-3 py-2 text-sm"
                    >
                      <option hidden>MM</option>
                      {Array.from({ length: 60 }, (_, i) => i).map((minute) => (
                        <option
                          key={minute}
                          value={minute.toString().padStart(2, "0")}
                        >
                          {minute.toString().padStart(2, "0")}
                        </option>
                      ))}
                    </select>
                    <select
                      value={eventEndHour >= 12 ? "PM" : "AM"}
                      onChange={(e) =>
                        updateEventEndTime(
                          "meridiem",
                          e.target.value as "AM" | "PM",
                        )
                      }
                      className="w-[70px] rounded-md border px-3 py-2 text-sm"
                    >
                      <option hidden>AM/PM</option>
                      <option value={"AM"}>AM</option>
                      <option value={"PM"}>PM</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="rsvp-deadline">RSVP Deadline</Label>
              <select
                value={rsvpDeadlineHours}
                onChange={handleChangeRsvpDeadline}
                className="rounded-md border px-3 py-2 text-sm"
                id="rsvp-deadline"
                name="rsvp-deadline"
              >
                <option hidden>Select RSVP deadline</option>
                <option value="1h">1 hour before event</option>
                <option value="2h">2 hours before event</option>
                <option value="24h">24 hours before event</option>
                <option value="48h">48 hours before event</option>
                <option value="custom">Custom</option>
              </select>
            </div>

            {rsvpDeadlineHours === "custom" && (
              <div className="flex flex-col gap-2">
                <Label htmlFor="custom-rsvp-hours">
                  Custom RSVP Deadline (hours before event)
                </Label>
                <Input
                  id="custom-rsvp-hours"
                  type="number"
                  value={eventData.rsvpDeadline}
                  onChange={(e) =>
                    setEventData((prev) => ({
                      ...prev,
                      rsvpDeadline: parseInt(e.target.value, 10),
                    }))
                  }
                  placeholder="Enter hours"
                  min="0"
                />
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-accent-orange text-white hover:bg-accent-orange/90"
              disabled={submitting || cannotSubmit}
            >
              {submitting ? "Editing Event..." : "Edit Event"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
