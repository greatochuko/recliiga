"use client";

import { useState } from "react";
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
import { EventDataType, EventDateType, createEvent } from "@/api/events";

const initialEventData: EventDataType = {
  leagueId: "",
  title: "",
  location: "",
  numTeams: 0,
  rosterSpots: 0,
  isRepeatingEvent: false,
  repeatFrequency: undefined,
  repeatStartDate: undefined,
  repeatEndDate: undefined,
  rsvpDeadline: "2h",
  customRsvpHours: 24,
  eventDates: [
    {
      date: undefined,
      startHour: "12",
      startMinute: "00",
      startAmPm: "AM",
      endHour: "12",
      endMinute: "00",
      endAmPm: "AM",
    },
  ],
};

export default function AddEvent() {
  const [eventData, setEventData] = useState<EventDataType>(initialEventData);
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();

  const {
    data: { leagues },
    isFetching: isLoadingLeagues,
  } = useQuery({
    queryKey: ["leagues"],
    queryFn: fetchLeaguesByUser,
    initialData: { leagues: [], error: null },
  });

  const isDateInPast = (date: Date) => {
    return isBefore(date, startOfDay(new Date()));
  };

  const handlePositiveNumberInput = (
    value: string,
    field: "numTeams" | "rosterSpots" | "customRsvpHours"
  ) => {
    const numValue = parseInt(value, 10);
    if (!isNaN(numValue) && numValue > 0) {
      setEventData((prev) => ({ ...prev, [field]: numValue }));
    } else if (value === "") {
      setEventData((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleRepeatToggle = () => {
    const checked = !eventData.isRepeatingEvent;
    setEventData((prev) => ({
      ...prev,
      isRepeatingEvent: checked,
      repeatFrequency: checked ? prev.repeatFrequency : "",
      repeatStartDate: checked ? prev.eventDates[0].date : undefined,
      repeatEndDate: checked ? undefined : undefined,
    }));
  };

  const formatTime = (hour: string, minute: string, ampm: string) => {
    return `${hour}:${minute} ${ampm}`;
  };

  const updateEventDate = (
    index: number,
    field: keyof EventDateType,
    value: any
  ) => {
    setEventData((prev) => {
      const updatedDates = [...prev.eventDates];
      updatedDates[index] = { ...updatedDates[index], [field]: value };
      return { ...prev, eventDates: updatedDates };
    });
  };

  const cannotSubmit = Object.entries(eventData)
    .map(([key, value]) => {
      if (["repeatFrequency", "repeatStartDate", "repeatEndDate"].includes(key))
        return false;
      return value === "" || value === undefined || value === null;
    })
    .some((isInvalid) => isInvalid);

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();

    setSubmitting(true);
    const { error } = await createEvent(eventData);

    if (error === null) {
      navigate("/manage-events");
    } else {
      setSubmitting(false);
    }
  };

  return (
    <main className="w-[90%] max-w-3xl mx-auto">
      <Card className="my-2">
        <CardHeader className="relative">
          <Link
            to="/manage-events"
            className="text-[#FF7A00] absolute top-6 left-6 flex items-center gap-1 px-3 py-1.5"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </Link>
          <CardTitle
            className="text-2xl font-semibold text-center text-gray-800"
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
                className="px-3 py-2 border rounded-md text-sm"
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

            <div className="space-y-4 p-4 bg-gray-50 rounded-md">
              <div className="flex flex-col gap-2">
                <Label htmlFor="date">Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="date"
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !eventData.eventDates[0].date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {eventData.eventDates[0].date ? (
                        format(eventData.eventDates[0].date, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={eventData.eventDates[0].date}
                      onSelect={(date) => updateEventDate(0, "date", date)}
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
                      value={eventData.eventDates[0].startHour}
                      onChange={(e) =>
                        updateEventDate(0, "startHour", e.target.value)
                      }
                      className="px-3 py-2 border rounded-md w-[70px] text-sm"
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
                        )
                      )}
                    </select>
                    <select
                      value={eventData.eventDates[0].startMinute}
                      onChange={(e) =>
                        updateEventDate(0, "startMinute", e.target.value)
                      }
                      className="px-3 py-2 border rounded-md w-[70px] text-sm"
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
                      value={eventData.eventDates[0].startAmPm}
                      onChange={(e) =>
                        updateEventDate(0, "startAmPm", e.target.value)
                      }
                      className="px-3 py-2 border rounded-md w-[70px] text-sm"
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
                      value={eventData.eventDates[0].endHour}
                      onChange={(e) =>
                        updateEventDate(0, "endHour", e.target.value)
                      }
                      className="px-3 py-2 border rounded-md w-[70px] text-sm"
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
                        )
                      )}
                    </select>
                    <select
                      value={eventData.eventDates[0].endMinute}
                      onChange={(e) =>
                        updateEventDate(0, "endMinute", e.target.value)
                      }
                      className="px-3 py-2 border rounded-md w-[70px] text-sm"
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
                      value={eventData.eventDates[0].endAmPm}
                      onChange={(e) =>
                        updateEventDate(0, "endAmPm", e.target.value)
                      }
                      className="px-3 py-2 border rounded-md w-[70px] text-sm"
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
                checked={eventData.isRepeatingEvent}
                onChange={handleRepeatToggle}
                name="repeat-event"
                id="repeat-event"
                className="accent-gray-700"
              />
              <Label htmlFor="repeat-event">Repeat Event</Label>
            </div>

            {eventData.isRepeatingEvent && (
              <div className="space-y-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="repeat-frequency">Repeat Frequency</Label>
                  <select
                    value={eventData.repeatFrequency}
                    onChange={(e) =>
                      setEventData((prev) => ({
                        ...prev,
                        repeatFrequency: e.target.value,
                      }))
                    }
                    className="px-3 py-2 border rounded-md text-sm"
                    id="repeat-frequency"
                    name="repeat-frequency"
                  >
                    <option hidden>Select frequency</option>
                    <option value="every-day">Every day</option>
                    <option value="every-week">Every week</option>
                    <option value="every-2-weeks">Every 2 weeks</option>
                    <option value="every-month">Every month</option>
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
                          !eventData.repeatEndDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {eventData.repeatEndDate ? (
                          format(eventData.repeatEndDate, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={eventData.repeatEndDate}
                        onSelect={(date) =>
                          setEventData((prev) => ({
                            ...prev,
                            repeatEndDate: date,
                          }))
                        }
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
                value={eventData.rsvpDeadline}
                onChange={(e) =>
                  setEventData((prev) => ({
                    ...prev,
                    rsvpDeadline: e.target.value,
                  }))
                }
                className="px-3 py-2 border rounded-md text-sm"
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

            {eventData.rsvpDeadline === "custom" && (
              <div className="flex flex-col gap-2">
                <Label htmlFor="custom-rsvp-hours">
                  Custom RSVP Deadline (hours before event)
                </Label>
                <Input
                  id="custom-rsvp-hours"
                  type="number"
                  value={eventData.customRsvpHours}
                  onChange={(e) =>
                    handlePositiveNumberInput(e.target.value, "customRsvpHours")
                  }
                  placeholder="Enter hours"
                  min="1"
                />
              </div>
            )}

            {eventData.eventDates.length > 0 && (
              <div className="flex flex-col gap-2">
                <Label>Event Dates</Label>
                <div className="flex flex-col gap-2">
                  {eventData.eventDates.map((date, index) => (
                    <div
                      key={index}
                      className="p-2 bg-gray-50 rounded-md text-sm"
                    >
                      {date.date && (
                        <>
                          {format(date.date, "MMMM d yyyy")},{" "}
                          {formatTime(
                            date.startHour,
                            date.startMinute,
                            date.startAmPm
                          )}{" "}
                          -{" "}
                          {formatTime(
                            date.endHour,
                            date.endMinute,
                            date.endAmPm
                          )}
                          , {format(date.date, "EEEE")}
                          {isDateInPast(date.date) && (
                            <span className="ml-2 text-red-500">
                              (Past date)
                            </span>
                          )}
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-[#FF7A00] hover:bg-[#FF7A00]/90 text-white"
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
