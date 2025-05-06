import React from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LeagueFormData } from "./types";
import { EventDateInput } from "./EventDateInput";
import { Input } from "../ui/input";

interface EventsStepProps {
  leagueData: LeagueFormData;
  onEventChange: (
    e: React.ChangeEvent<HTMLInputElement>,
    eventIndex: number
  ) => void;
  onRsvpDeadlineChange: (value: string, eventIndex: number) => void;
  onDateChange: (
    date: Date | undefined,
    eventIndex: number,
    dateIndex: number
  ) => void;
  onTimeChange: (
    e: React.ChangeEvent<HTMLInputElement>,
    eventIndex: number,
    dateIndex: number
  ) => void;
  onAmPmChange: (
    value: string,
    field: "startAmPm" | "endAmPm",
    eventIndex: number,
    dateIndex: number
  ) => void;
  onAddEventDate: (eventIndex: number) => void;
  onRemoveEventDate: (eventIndex: number, dateIndex: number) => void;
  onAddEvent: () => void;
}

export function EventsStep({
  leagueData,
  onEventChange,
  onRsvpDeadlineChange,
  onDateChange,
  onTimeChange,
  onAmPmChange,
  onAddEventDate,
  onRemoveEventDate,
  onAddEvent,
}: EventsStepProps) {
  return (
    <div>
      {leagueData.events.map((event, index) => (
        <div key={index} className="mb-4 p-4 border rounded">
          <h3 className="text-lg font-semibold mb-2">Event {index + 1}</h3>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor={`title-${index}`}>Title</Label>
              <Input
                type="text"
                id={`title-${index}`}
                name="title"
                value={event.title}
                onChange={(e) => onEventChange(e, index)}
                placeholder="Enter title"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor={`location-${index}`}>Location</Label>
              <Input
                type="text"
                id={`location-${index}`}
                name="location"
                value={event.location}
                onChange={(e) => onEventChange(e, index)}
                placeholder="Enter location"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor={`numTeams-${index}`}>Number of Teams</Label>
              <Input
                type="number"
                id={`numTeams-${index}`}
                name="numTeams"
                value={event.numTeams}
                onChange={(e) => onEventChange(e, index)}
                placeholder="Enter number of teams"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor={`rosterSpots-${index}`}>
                Roster Spots per Team
              </Label>
              <Input
                type="number"
                id={`rosterSpots-${index}`}
                name="rosterSpots"
                value={event.rosterSpots}
                onChange={(e) => onEventChange(e, index)}
                placeholder="Enter roster spots per team"
              />
            </div>
            <div className="grid gap-2">
              <Label>RSVP Deadline</Label>
              <Select
                onValueChange={(value) => onRsvpDeadlineChange(value, index)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue
                    placeholder="Select RSVP Deadline"
                    defaultValue="24"
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="24">24 Hours Before</SelectItem>
                  <SelectItem value="48">48 Hours Before</SelectItem>
                  <SelectItem value="72">72 Hours Before</SelectItem>
                  <SelectItem value="custom">Custom Hours</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {event.rsvpDeadlineOption === "custom" && (
              <div className="grid gap-2">
                <Label htmlFor={`customRsvpHours-${index}`}>
                  Custom RSVP Hours
                </Label>
                <Input
                  type="number"
                  id={`customRsvpHours-${index}`}
                  name="customRsvpHours"
                  value={event.customRsvpHours}
                  onChange={(e) => onEventChange(e, index)}
                  placeholder="Enter custom hours"
                />
              </div>
            )}

            <h4 className="text-md font-semibold mt-4">Event Dates</h4>
            {event.eventDates.map((date, dateIndex) => (
              <EventDateInput
                key={dateIndex}
                date={date}
                onDateChange={(date) => onDateChange(date, index, dateIndex)}
                onTimeChange={(e) => onTimeChange(e, index, dateIndex)}
                onAmPmChange={(value, field) =>
                  onAmPmChange(value, field, index, dateIndex)
                }
                onRemove={() => onRemoveEventDate(index, dateIndex)}
              />
            ))}
            <Button
              onClick={() => onAddEventDate(index)}
              variant="secondary"
              size="sm"
            >
              Add Date
            </Button>
          </div>
        </div>
      ))}
      <Button onClick={onAddEvent} variant="secondary">
        Add Event
      </Button>
    </div>
  );
}
