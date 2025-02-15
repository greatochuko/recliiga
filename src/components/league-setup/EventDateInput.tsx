
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { EventDate } from './types';

interface EventDateInputProps {
  date: EventDate;
  onDateChange: (date: Date | undefined) => void;
  onTimeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAmPmChange: (value: string, field: 'startAmPm' | 'endAmPm') => void;
  onRemove: () => void;
}

export function EventDateInput({ 
  date, 
  onDateChange, 
  onTimeChange, 
  onAmPmChange,
  onRemove 
}: EventDateInputProps) {
  return (
    <div className="mb-2 p-2 border rounded">
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label>Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-[240px] justify-start text-left font-normal",
                  !date.date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date.date ? format(date.date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date.date}
                onSelect={onDateChange}
                disabled={(date) => date < new Date()}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label>Start Time</Label>
          <div className="flex items-center space-x-2">
            <Input
              type="number"
              name="startHour"
              value={date.startHour}
              onChange={onTimeChange}
              className="w-16"
              placeholder="Hour"
              min="1"
              max="12"
            />
            :
            <Input
              type="number"
              name="startMinute"
              value={date.startMinute}
              onChange={onTimeChange}
              className="w-16"
              placeholder="Minute"
              min="00"
              max="59"
            />
            <Select onValueChange={(value) => onAmPmChange(value, 'startAmPm')}>
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="Select" defaultValue="AM" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="AM">AM</SelectItem>
                <SelectItem value="PM">PM</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label>End Time</Label>
          <div className="flex items-center space-x-2">
            <Input
              type="number"
              name="endHour"
              value={date.endHour}
              onChange={onTimeChange}
              className="w-16"
              placeholder="Hour"
              min="1"
              max="12"
            />
            :
            <Input
              type="number"
              name="endMinute"
              value={date.endMinute}
              onChange={onTimeChange}
              className="w-16"
              placeholder="Minute"
              min="00"
              max="59"
            />
            <Select onValueChange={(value) => onAmPmChange(value, 'endAmPm')}>
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="Select" defaultValue="PM" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="AM">AM</SelectItem>
                <SelectItem value="PM">PM</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      <Button onClick={onRemove} variant="destructive" size="sm" className="mt-2">
        Remove Date
      </Button>
    </div>
  );
}
