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
import { cn } from "@/lib/utils";
import { format, isBefore, startOfDay } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { fetchLeaguesByUser } from "@/api/league";
import { EventDataType, createEvent } from "@/api/events";
import { EventDateType } from "@/types/events";

const initialEventData: EventDataType = {
  leagueId: "",
  title: "",
  location: "",
  numTeams: 2,
  rosterSpots: 1,
  rsvpDeadline: 2,
  startDate: {
    date: new Date(),
    startHour: 12,
    startMinute: 0,
    startAmPm: "PM",
    endHour: 1,
    endMinute: 0,
    endAmPm: "pM",
  },
  eventDates: [],
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
    isFetching: isLoadingLeagues,
  } = useQuery({
    queryKey: ["leagues"],
    queryFn: fetchLeaguesByUser,
    initialData: { leagues: [], error: null },
  });

  const eventDates = useMemo(() => {
    if (!eventData.startDate.date || !repeatEndDate || !repeatFrequency)
      return [];

    const dates: Date[] = [];
    const current = new Date(eventData.startDate.date);
    const end = new Date(repeatEndDate);

    while (current <= end) {
      dates.push(new Date(current));

      switch (repeatFrequency) {
        case "daily":
          current.setDate(current.getDate() + 1);
          break;
        case "weekly":
          current.setDate(current.getDate() + 7);
          break;
        case "bi-weekly":
          current.setDate(current.getDate() + 14);
          break;
        case "monthly":
          current.setMonth(current.getMonth() + 1);
          break;
        default:
          return dates;
      }
    }

    return dates;
  }, [eventData.startDate.date, repeatEndDate, repeatFrequency]);

  const isDateInPast = (date: Date) => {
    return isBefore(date, startOfDay(new Date()));
  };

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

  const formatTime = (hour: string, minute: string, ampm: string) => {
    return `${hour}:${minute} ${ampm}`;
  };

  function updateEventDate<T extends keyof EventDateType>(
    field: T,
    value: EventDateType[T],
  ) {
    setEventData((prev) => ({
      ...prev,
      startDate: { ...prev.startDate, [field]: value },
    }));
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

  return (
    <main className="mx-auto w-[90%] max-w-3xl">
      <Card className="my-2">
        <CardHeader className="relative">
          <Link
            to="/manage-events"
            className="text-accent-orange absolute left-6 top-6 flex items-center gap-1 px-3 py-1.5"
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
                className="cursor-pointer rounded-md border px-3 py-2 text-sm disabled:bg-gray-100"
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
                        !eventData.startDate.date && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {eventData.startDate.date ? (
                        format(eventData.startDate.date, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={eventData.startDate.date}
                      onSelect={(date) => updateEventDate("date", date)}
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
                      value={eventData.startDate.startHour}
                      onChange={(e) =>
                        updateEventDate("startHour", Number(e.target.value))
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
                      value={eventData.startDate.startMinute}
                      onChange={(e) =>
                        updateEventDate("startMinute", Number(e.target.value))
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
                      value={eventData.startDate.startAmPm}
                      onChange={(e) =>
                        updateEventDate("startAmPm", e.target.value)
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
                      value={eventData.startDate.endHour}
                      onChange={(e) =>
                        updateEventDate("endHour", Number(e.target.value))
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
                      value={eventData.startDate.endMinute}
                      onChange={(e) =>
                        updateEventDate("endMinute", Number(e.target.value))
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
                      value={eventData.startDate.endAmPm}
                      onChange={(e) =>
                        updateEventDate("endAmPm", e.target.value)
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
                onChange={() => setIsRepeatingEvent((prev) => !prev)}
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
                      {format(date, "MMMM d yyyy")},{" "}
                      <>
                        {formatTime(
                          eventData.startDate.startHour.toString(),
                          eventData.startDate.startMinute.toString(),
                          eventData.startDate.startAmPm,
                        )}{" "}
                        -{" "}
                        {formatTime(
                          eventData.startDate.endHour.toString(),
                          eventData.startDate.endMinute.toString(),
                          eventData.startDate.endAmPm,
                        )}
                        , {format(date, "EEEE")}
                        {isDateInPast(date) && (
                          <span className="ml-2 text-red-500">(Past date)</span>
                        )}
                      </>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Button
              type="submit"
              className="bg-accent-orange hover:bg-accent-orange/90 w-full text-white"
              disabled={submitting || cannotSubmit}
            >
              Add Event
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
