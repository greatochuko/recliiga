import { useState, useRef, useEffect } from "react";
import {
  format,
  isBefore,
  startOfDay,
  addDays,
  addWeeks,
  addMonths,
} from "date-fns";
import { CalendarIcon, CheckCircle, AlertCircle, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface EventDate {
  date: Date | undefined;
  startHour: string;
  startMinute: string;
  startAmPm: string;
  endHour: string;
  endMinute: string;
  endAmPm: string;
}

interface Event {
  title: string;
  location: string;
  numTeams: string;
  rosterSpots: string;
  isRepeatingEvent: boolean;
  repeatFrequency: string;
  repeatStartDate: Date | undefined;
  repeatEndDate: Date | undefined;
  rsvpDeadlineOption: string;
  customRsvpHours: string;
  eventDates: EventDate[];
}

export function TeamSetupStep({ leagueData, updateLeagueData }) {
  const [showAddedAlert, setShowAddedAlert] = useState(false);
  const topRef = useRef<HTMLDivElement>(null);
  const [currentEvent, setCurrentEvent] = useState<Event>({
    title: "",
    location: "",
    numTeams: "",
    rosterSpots: "",
    isRepeatingEvent: false,
    repeatFrequency: "",
    repeatStartDate: undefined,
    repeatEndDate: undefined,
    rsvpDeadlineOption: "24h",
    customRsvpHours: "24",
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
  });

  const [totalSpots, setTotalSpots] = useState(0);

  useEffect(() => {
    if (
      currentEvent.isRepeatingEvent &&
      currentEvent.repeatStartDate &&
      currentEvent.repeatEndDate &&
      currentEvent.repeatFrequency
    ) {
      const dates: Date[] = [];
      let currentDate = new Date(currentEvent.repeatStartDate);

      while (currentDate <= currentEvent.repeatEndDate) {
        dates.push(new Date(currentDate));

        switch (currentEvent.repeatFrequency) {
          case "every-day":
            currentDate = addDays(currentDate, 1);
            break;
          case "every-week":
            currentDate = addWeeks(currentDate, 1);
            break;
          case "every-2-weeks":
            currentDate = addWeeks(currentDate, 2);
            break;
          case "every-month":
            currentDate = addMonths(currentDate, 1);
            break;
        }
      }

      setCurrentEvent((prev) => ({
        ...prev,
        eventDates: dates.map((date) => ({
          date,
          startHour: prev.eventDates[0].startHour,
          startMinute: prev.eventDates[0].startMinute,
          startAmPm: prev.eventDates[0].startAmPm,
          endHour: prev.eventDates[0].endHour,
          endMinute: prev.eventDates[0].endMinute,
          endAmPm: prev.eventDates[0].endAmPm,
        })),
      }));
    }
  }, [
    currentEvent.isRepeatingEvent,
    currentEvent.repeatStartDate,
    currentEvent.repeatEndDate,
    currentEvent.repeatFrequency,
  ]);

  useEffect(() => {
    const teams = parseInt(currentEvent.numTeams);
    const spots = parseInt(currentEvent.rosterSpots);
    if (!isNaN(teams) && !isNaN(spots)) {
      setTotalSpots(teams * spots);
    } else {
      setTotalSpots(0);
    }
  }, [currentEvent.numTeams, currentEvent.rosterSpots]);

  const isDateInPast = (date: Date) => {
    return isBefore(date, startOfDay(new Date()));
  };

  const handlePositiveNumberInput = (
    value: string,
    field: "numTeams" | "rosterSpots" | "customRsvpHours",
  ) => {
    const numValue = parseInt(value, 10);
    if (!isNaN(numValue) && numValue > 0) {
      setCurrentEvent((prev) => ({ ...prev, [field]: numValue.toString() }));
    } else if (value === "") {
      setCurrentEvent((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleRepeatToggle = (checked: boolean) => {
    setCurrentEvent((prev) => ({
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
    field: keyof EventDate,
    value: any,
  ) => {
    setCurrentEvent((prev) => {
      const updatedDates = [...prev.eventDates];
      updatedDates[index] = { ...updatedDates[index], [field]: value };
      return { ...prev, eventDates: updatedDates };
    });
  };

  const scrollToTop = () => {
    topRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const cannotAddEvent =
    !currentEvent.title.trim() ||
    !currentEvent.location.trim() ||
    !currentEvent.numTeams ||
    !currentEvent.rosterSpots ||
    !currentEvent.eventDates.length;

  const addAnotherEvent = () => {
    if (cannotAddEvent) return;
    updateLeagueData({ events: [...leagueData.events, currentEvent] });
    setCurrentEvent({
      ...currentEvent,
      title: "",
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
      isRepeatingEvent: false,
      repeatFrequency: "",
      repeatStartDate: undefined,
      repeatEndDate: undefined,
    });
    setShowAddedAlert(true);
    setTimeout(() => setShowAddedAlert(false), 3000);
    scrollToTop();
  };

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="text-center text-2xl font-semibold text-gray-800">
          Add Event
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div ref={topRef} />
        {showAddedAlert && (
          <Alert className="mb-4">
            <CheckCircle className="h-4 w-4" />
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>
              Event{leagueData.events.length > 1 ? "s" : ""} Added
            </AlertDescription>
          </Alert>
        )}

        {leagueData.events.length > 0 && (
          <div className="mb-8 space-y-4">
            <h3 className="text-lg font-semibold">Created Events</h3>
            {leagueData.events.map((event, index) => (
              <div key={index} className="rounded-md bg-gray-50 p-4">
                <h4 className="font-medium">{event.title}</h4>
                <p>Location: {event.location}</p>
                <p>
                  Teams: {event.numTeams}, Roster Spots: {event.rosterSpots}{" "}
                  (Total number of spots available:{" "}
                  {parseInt(event.numTeams) * parseInt(event.rosterSpots)})
                </p>
                <p>
                  RSVP Deadline: {event.rsvpDeadlineOption} (hours before event)
                </p>
                <div className="mt-2">
                  <h5 className="font-medium">Event Dates:</h5>
                  <ul className="list-inside list-disc">
                    {event.eventDates.map((date, dateIndex) => (
                      <li key={dateIndex}>
                        {date.date && (
                          <>
                            {format(date.date, "MMMM d yyyy")},{" "}
                            {formatTime(
                              date.startHour,
                              date.startMinute,
                              date.startAmPm,
                            )}{" "}
                            -{" "}
                            {formatTime(
                              date.endHour,
                              date.endMinute,
                              date.endAmPm,
                            )}
                            , {format(date.date, "EEEE")}
                          </>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  Total events: {event.eventDates.length}
                </p>
              </div>
            ))}
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Next Step</AlertTitle>
              <AlertDescription>
                When you're finished adding events, press the "Next" button
                below to move to the next step.
              </AlertDescription>
            </Alert>
          </div>
        )}

        <div className="mb-4 text-lg font-semibold">
          {leagueData.events.length > 0
            ? "Create Another Event"
            : "Create Your First Event"}
        </div>

        <div className="space-y-2">
          <Label htmlFor="eventTitle">Event Title</Label>
          <Input
            id="eventTitle"
            value={currentEvent.title}
            onChange={(e) =>
              setCurrentEvent((prev) => ({ ...prev, title: e.target.value }))
            }
            placeholder="Enter event title"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            value={currentEvent.location}
            onChange={(e) =>
              setCurrentEvent((prev) => ({ ...prev, location: e.target.value }))
            }
            placeholder="Enter event location"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="teams">Number of Teams</Label>
          <Input
            id="teams"
            type="number"
            value={currentEvent.numTeams}
            onChange={(e) =>
              handlePositiveNumberInput(e.target.value, "numTeams")
            }
            placeholder="Enter number of teams"
            min="1"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="rosterSpots">Number of Roster Spots Per Team</Label>
          <Input
            id="rosterSpots"
            type="number"
            value={currentEvent.rosterSpots}
            onChange={(e) =>
              handlePositiveNumberInput(e.target.value, "rosterSpots")
            }
            placeholder="Enter number of roster spots"
            min="1"
          />
        </div>

        {totalSpots > 0 && (
          <div className="text-sm text-muted-foreground">
            Total number of spots available: {totalSpots}
          </div>
        )}

        <div className="space-y-4 rounded-md bg-gray-50 p-4">
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date"
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !currentEvent.eventDates[0].date && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {currentEvent.eventDates[0].date ? (
                    format(currentEvent.eventDates[0].date, "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={currentEvent.eventDates[0].date}
                  onSelect={(date) => updateEventDate(0, "date", date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Start Time</Label>
              <div className="flex space-x-2">
                {/* <Select
                  value={currentEvent.eventDates[0].startHour}
                  onValueChange={(value) =>
                    updateEventDate(0, "startHour", value)
                  }
                >
                  <SelectTrigger className="w-[70px]">
                    <SelectValue placeholder="HH" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 12 }, (_, i) => i + 1).map((hour) => (
                      <SelectItem
                        key={hour}
                        value={hour.toString().padStart(2, "0")}
                      >
                        {hour.toString().padStart(2, "0")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select> */}
                <select
                  name="startHour"
                  id="startHour"
                  className="block rounded-md border p-2"
                  value={currentEvent.eventDates[0].startHour}
                  onChange={(e) =>
                    updateEventDate(0, "startHour", e.target.value)
                  }
                >
                  <option hidden>HH</option>
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((hour) => (
                    <option key={hour} value={hour.toString().padStart(2, "0")}>
                      {hour.toString().padStart(2, "0")}
                    </option>
                  ))}
                </select>
                {/* <Select
                  value={currentEvent.eventDates[0].startMinute}
                  onValueChange={(value) =>
                    updateEventDate(0, "startMinute", value)
                  }
                >
                  <SelectTrigger className="w-[70px]">
                    <SelectValue placeholder="MM" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 60 }, (_, i) => i).map((minute) => (
                      <SelectItem
                        key={minute}
                        value={minute.toString().padStart(2, "0")}
                      >
                        {minute.toString().padStart(2, "0")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                 */}
                <select
                  name="startMinute"
                  id="startMinute"
                  className="block rounded-md border p-2"
                  value={currentEvent.eventDates[0].startMinute}
                  onChange={(e) =>
                    updateEventDate(0, "startMinute", e.target.value)
                  }
                >
                  <option hidden>HH</option>
                  {Array.from({ length: 60 }, (_, i) => i).map((minute) => (
                    <option
                      key={minute}
                      value={minute.toString().padStart(2, "0")}
                    >
                      {minute.toString().padStart(2, "0")}
                    </option>
                  ))}
                </select>
                {/* <Select
                  value={currentEvent.eventDates[0].startAmPm}
                  onValueChange={(value) =>
                    updateEventDate(0, "startAmPm", value)
                  }
                >
                  <SelectTrigger className="w-[70px]">
                    <SelectValue placeholder="AM/PM" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AM">AM</SelectItem>
                    <SelectItem value="PM">PM</SelectItem>
                  </SelectContent>
                </Select> */}
                <select
                  name="startAmPm"
                  id="startAmPm"
                  className="block rounded-md border p-2"
                  value={currentEvent.eventDates[0].startAmPm}
                  onChange={(e) =>
                    updateEventDate(0, "startAmPm", e.target.value)
                  }
                >
                  <option hidden>AM/PM</option>
                  <option value={"AM"}>AM</option>
                  <option value={"PM"}>PM</option>
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>End Time</Label>
              <div className="flex space-x-2">
                {/* <Select
                  value={currentEvent.eventDates[0].endHour}
                  onValueChange={(value) =>
                    updateEventDate(0, "endHour", value)
                  }
                >
                  <SelectTrigger className="w-[70px]">
                    <SelectValue placeholder="HH" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 12 }, (_, i) => i + 1).map((hour) => (
                      <SelectItem
                        key={hour}
                        value={hour.toString().padStart(2, "0")}
                      >
                        {hour.toString().padStart(2, "0")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select> */}
                <select
                  name="endHour"
                  id="endHour"
                  className="block rounded-md border p-2"
                  value={currentEvent.eventDates[0].endHour}
                  onChange={(e) =>
                    updateEventDate(0, "endHour", e.target.value)
                  }
                >
                  <option hidden>HH</option>
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((hour) => (
                    <option key={hour} value={hour.toString().padStart(2, "0")}>
                      {hour.toString().padStart(2, "0")}
                    </option>
                  ))}
                </select>
                {/* <Select
                  value={currentEvent.eventDates[0].endMinute}
                  onValueChange={(value) =>
                    updateEventDate(0, "endMinute", value)
                  }
                >
                  <SelectTrigger className="w-[70px]">
                    <SelectValue placeholder="MM" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 60 }, (_, i) => i).map((minute) => (
                      <SelectItem
                        key={minute}
                        value={minute.toString().padStart(2, "0")}
                      >
                        {minute.toString().padStart(2, "0")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select> */}
                <select
                  name="endMinute"
                  id="endMinute"
                  className="block rounded-md border p-2"
                  value={currentEvent.eventDates[0].endMinute}
                  onChange={(e) =>
                    updateEventDate(0, "endMinute", e.target.value)
                  }
                >
                  <option hidden>HH</option>
                  {Array.from({ length: 60 }, (_, i) => i).map((minute) => (
                    <option
                      key={minute}
                      value={minute.toString().padStart(2, "0")}
                    >
                      {minute.toString().padStart(2, "0")}
                    </option>
                  ))}
                </select>
                {/* <Select
                  value={currentEvent.eventDates[0].endAmPm}
                  onValueChange={(value) =>
                    updateEventDate(0, "endAmPm", value)
                  }
                >
                  <SelectTrigger className="w-[70px]">
                    <SelectValue placeholder="AM/PM" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AM">AM</SelectItem>
                    <SelectItem value="PM">PM</SelectItem>
                  </SelectContent>
                </Select> */}
                <select
                  name="endAmPm"
                  id="endAmPm"
                  className="block rounded-md border p-2"
                  value={currentEvent.eventDates[0].endAmPm}
                  onChange={(e) =>
                    updateEventDate(0, "endAmPm", e.target.value)
                  }
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
          <Switch
            id="repeat-event"
            checked={currentEvent.isRepeatingEvent}
            onCheckedChange={handleRepeatToggle}
          />
          <Label htmlFor="repeat-event">Repeat Event</Label>
        </div>

        {currentEvent.isRepeatingEvent && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="repeat-frequency">Repeat Frequency</Label>
              <Select
                value={currentEvent.repeatFrequency}
                onValueChange={(value) =>
                  setCurrentEvent((prev) => ({
                    ...prev,
                    repeatFrequency: value,
                  }))
                }
              >
                <SelectTrigger id="repeat-frequency">
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="every-day">Every day</SelectItem>
                  <SelectItem value="every-week">Every week</SelectItem>
                  <SelectItem value="every-2-weeks">Every 2 weeks</SelectItem>
                  <SelectItem value="every-month">Every month</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="repeat-end-date">Repeat End Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="repeat-end-date"
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !currentEvent.repeatEndDate && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {currentEvent.repeatEndDate ? (
                      format(currentEvent.repeatEndDate, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={currentEvent.repeatEndDate}
                    onSelect={(date) =>
                      setCurrentEvent((prev) => ({
                        ...prev,
                        repeatEndDate: date,
                      }))
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="rsvp-deadline">RSVP Deadline</Label>
          <Select
            value={currentEvent.rsvpDeadlineOption}
            onValueChange={(value) =>
              setCurrentEvent((prev) => ({
                ...prev,
                rsvpDeadlineOption: value,
              }))
            }
          >
            <SelectTrigger id="rsvp-deadline">
              <SelectValue placeholder="Select RSVP deadline" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">24 hours before event</SelectItem>
              <SelectItem value="48h">48 hours before event</SelectItem>
              <SelectItem value="custom">Custom</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {currentEvent.rsvpDeadlineOption === "custom" && (
          <div className="space-y-2">
            <Label htmlFor="custom-rsvp-hours">
              Custom RSVP Deadline (hours before event)
            </Label>
            <Input
              id="custom-rsvp-hours"
              type="number"
              value={currentEvent.customRsvpHours}
              onChange={(e) =>
                handlePositiveNumberInput(e.target.value, "customRsvpHours")
              }
              placeholder="Enter hours"
              min="1"
            />
          </div>
        )}

        {currentEvent.eventDates.length > 0 && (
          <div className="space-y-2">
            <Label>Event Dates</Label>
            <div className="space-y-2">
              {currentEvent.eventDates.map((date, index) => (
                <div key={index} className="rounded-md bg-gray-50 p-2">
                  {date.date && (
                    <>
                      {format(date.date, "MMMM d yyyy")},{" "}
                      {formatTime(
                        date.startHour,
                        date.startMinute,
                        date.startAmPm,
                      )}{" "}
                      - {formatTime(date.endHour, date.endMinute, date.endAmPm)}
                      , {format(date.date, "EEEE")}
                      {isDateInPast(date.date) && (
                        <span className="ml-2 text-red-500">(Past date)</span>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <Button
          onClick={addAnotherEvent}
          className="bg-accent-orange hover:bg-accent-orange/90 w-full text-white"
          disabled={cannotAddEvent}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Event
        </Button>
      </CardContent>
    </Card>
  );
}
