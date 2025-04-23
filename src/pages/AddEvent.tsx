"use client";

import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarIcon, ArrowLeft } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn, getDateIncrement } from "@/lib/utils";
import { format, isBefore, startOfDay } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { fetchLeaguesByCreator } from "@/api/league";
import { EventDataType, createEvent } from "@/api/events";
import { EventTimeDataType } from "@/types/events";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const initialStartTime = new Date();
initialStartTime.setDate(initialStartTime.getDate() + 1);
initialStartTime.setHours(12, 0, 0, 0);

const initialEventData: EventDataType = {
  leagueId: "",
  title: "",
  location: "",
  draftType: "",
  numTeams: 2,
  rosterSpots: 1,
  rsvpDeadline: 2,
  startTime: initialStartTime,
  endTime: new Date(initialStartTime.getTime() + 2 * 60 * 60 * 1000),
  eventDates: [],
};

const isDateInPast = (date: Date) => {
  return isBefore(date, startOfDay(new Date()));
};

export default function AddEvent() {
  const [eventData, setEventData] = useState<EventDataType>(initialEventData);
  const [submitting, setSubmitting] = useState(false);
  const [rsvpDeadlineHours, setRsvpDeadlineHours] = useState("1h");
  const [repeatFrequency, setRepeatFrequency] = useState<
    "daily" | "weekly" | "bi-weekly" | "monthly" | undefined
  >();
  const [repeatEndDate, setRepeatEndDate] = useState<Date | undefined>();
  const [isRepeatingEvent, setIsRepeatingEvent] = useState(false);

  const navigate = useNavigate();

  const {
    data: { leagues },
    isLoading: isLoadingLeagues,
  } = useQuery({
    queryKey: ["leagues"],
    queryFn: fetchLeaguesByCreator,
    initialData: { leagues: [], error: null },
  });

  const eventDates = useMemo(() => {
    if (!eventData.startTime || !repeatEndDate || !repeatFrequency) return [];

    const dates: { startTime: Date; endTime: Date }[] = [];

    // Convert start and end times to proper Date objects
    const baseStartTime = new Date(eventData.startTime);
    const baseEndTime = new Date(eventData.endTime);

    // Set the repeat end time to the Date object
    const end = new Date(repeatEndDate);
    end.setHours(23, 59, 59, 999);

    const currentStartTime = new Date(baseStartTime);
    const currentEndTime = new Date(baseEndTime);

    while (currentStartTime <= end) {
      dates.push({
        startTime: new Date(currentStartTime),
        endTime: new Date(currentEndTime),
      });

      // Increment the date based on repeat frequency
      const increment = getDateIncrement(repeatFrequency);
      currentStartTime.setDate(currentStartTime.getDate() + increment);
      currentEndTime.setDate(currentEndTime.getDate() + increment);
    }

    return dates;
  }, [eventData.startTime, eventData.endTime, repeatEndDate, repeatFrequency]);

  // Utility functions

  const handlePositiveNumberInput = (
    value: string,
    field: "numTeams" | "rosterSpots" | "customRsvpHours",
  ) => {
    const numValue = parseInt(value, 10);
    if (value === "") {
      setEventData((prev) => ({ ...prev, [field]: 0 }));
      return;
    }

    if (!isNaN(numValue) && numValue >= 1) {
      setEventData((prev) => ({ ...prev, [field]: numValue }));
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

  const cannotSubmit = Object.entries(eventData)
    .map(([key, value]) => {
      if (key === "eventDates") return false;
      if (isRepeatingEvent) {
        if (!repeatFrequency || !repeatEndDate) return true;
      }
      return value === "" || value === undefined || value === null;
    })
    .some((isInvalid) => isInvalid);

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();

    setSubmitting(true);
    const { error } = await createEvent({ ...eventData, eventDates });

    if (error === null) {
      navigate("/manage-events");
    } else {
      setSubmitting(false);
    }
  };

  const eventStartHour = new Date(eventData.startTime).getHours();
  const eventEndHour = new Date(eventData.endTime).getHours();

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
            Add Event
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreateEvent} className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <Label htmlFor="league-id">League</Label>
              <select
                value={eventData.leagueId}
                onChange={(e) =>
                  setEventData((prev) => ({
                    ...prev,
                    leagueId: e.target.value,
                  }))
                }
                className="cursor-pointer rounded-md border px-3 py-2 text-sm disabled:cursor-default disabled:bg-gray-100"
                id="league-id"
                name="league-id"
                disabled={isLoadingLeagues}
              >
                <option hidden>Select League</option>
                {leagues.map((league) => (
                  <option key={league.id} value={league.id}>
                    {league.name}
                  </option>
                ))}
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
                value={eventData.rosterSpots || ""}
                onChange={(e) =>
                  handlePositiveNumberInput(e.target.value, "rosterSpots")
                }
                placeholder="Enter number of roster spots"
                min="1"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="rosterSpots">Draft Type</Label>
              <RadioGroup
                value={eventData.draftType}
                onValueChange={(value) =>
                  setEventData((prev) => ({
                    ...prev,
                    draftType: value,
                  }))
                }
                className="flex space-x-4"
                disabled
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="alternating" id="alternating" />
                  <Label htmlFor="alternating" className="text-sm">
                    Alternating
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="snake" id="snake" />
                  <Label htmlFor="snake" className="text-sm">
                    Snake
                  </Label>
                </div>
              </RadioGroup>
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
                        eventStartHour > 12
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
                      value={eventData.startTime
                        .getMinutes()
                        .toString()
                        .padStart(2, "0")}
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
                      value={eventData.endTime
                        .getMinutes()
                        .toString()
                        .padStart(2, "0")}
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
                      value={eventData.endTime.getHours() >= 12 ? "PM" : "AM"}
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

            <div className="flex items-center space-x-2">
              {/* <Switch
              id="repeat-event"
              checked={currentEvent.isRepeatingEvent}
              onCheckedChange={handleRepeatToggle}
            /> */}
              <input
                type="checkbox"
                checked={isRepeatingEvent}
                onChange={() => {
                  if (isRepeatingEvent) {
                    setRepeatEndDate(undefined);
                    setRepeatFrequency(undefined);
                  }
                  setIsRepeatingEvent((prev) => !prev);
                }}
                name="repeat-event"
                id="repeat-event"
                className="accent-gray-700"
              />
              <Label htmlFor="repeat-event">Repeat Event</Label>
            </div>

            {isRepeatingEvent && (
              <div className="space-y-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="repeat-frequency">Repeat Frequency</Label>
                  <select
                    value={repeatFrequency}
                    onChange={(e) =>
                      setRepeatFrequency(
                        e.target.value as typeof repeatFrequency,
                      )
                    }
                    className="rounded-md border px-3 py-2 text-sm"
                    id="repeat-frequency"
                    name="repeat-frequency"
                  >
                    <option hidden>Select frequency</option>
                    <option value="daily">Every day</option>
                    <option value="weekly">Every week</option>
                    <option value="bi-weekly">Every 2 weeks</option>
                    <option value="monthly">Every month</option>
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="repeat-end-date">Repeat Until</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        id="repeat-end-date"
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !repeatEndDate && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {repeatEndDate ? (
                          format(repeatEndDate, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={repeatEndDate}
                        onSelect={(date) => setRepeatEndDate(date)}
                        disabled={(date) =>
                          isBefore(date, startOfDay(new Date()))
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            )}

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

            {eventDates.length > 0 && (
              <div className="flex flex-col gap-2">
                <Label>Event Dates</Label>
                <div className="flex flex-col gap-2">
                  {eventDates.map((date, index) => (
                    <div
                      key={index}
                      className="rounded-md bg-gray-50 p-2 text-sm"
                    >
                      {format(date.startTime, "MMMM d yyyy, hh:mm a")}
                      {" - "}
                      {format(date.endTime, "hh:mm a")}
                      {", "}
                      {format(date.startTime, "EEEE")}
                      {isDateInPast(date.startTime) && (
                        <span className="ml-2 text-red-500">(Past date)</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-accent-orange text-white hover:bg-accent-orange/90"
              disabled={submitting || cannotSubmit}
            >
              {submitting ? "Adding Event..." : "Add Event"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
