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
    endAmPm: "PM",
  },
  eventDates: [],
};

export default function EditEvent() {
  const [eventData, setEventData] = useState<EventDataType>(initialEventData);
  const [submitting, setSubmitting] = useState(false);
  const [rsvpDeadlineHours, setRsvpDeadlineHours] = useState("1h");

  const { id } = useParams();

  const navigate = useNavigate();

  const {
    data: { data: event },
    isFetching,
  } = useQuery({
    queryKey: [`event-${id}`],
    queryFn: () => fetchEventById(id),
    initialData: { data: null, error: null },
  });

  useEffect(() => {
    if (event) {
      setEventData((prev) => ({
        ...prev,
        ...event,
        startDate: {
          ...prev.startDate,
          ...event.startDate,
          date: new Date(event.startDate.date),
        },
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

      return value === "" || value === undefined || value === null;
    })
    .some((isInvalid) => isInvalid);

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

  if (isFetching) {
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
          className="mt-6 flex items-center gap-1 rounded-md bg-accent-orange px-4 py-2 font-medium text-white hover:bg-accent-orange/90"
        >
          <ArrowLeftIcon className="h-5 w-5" />
          Go Back to Events
        </Link>
      </div>
    );
  }

  return (
    <main className="mx-auto w-[90%] max-w-3xl">
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
                      value={eventData.startDate.startHour
                        .toString()
                        .padStart(2, "0")}
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
                      value={eventData.startDate.startMinute
                        .toString()
                        .padStart(2, "0")}
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
                      value={eventData.startDate.endHour
                        .toString()
                        .padStart(2, "0")}
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
                      value={eventData.startDate.endMinute
                        .toString()
                        .padStart(2, "0")}
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
