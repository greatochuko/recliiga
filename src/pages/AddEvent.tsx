import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { useToast } from "@/components/ui/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Info } from "lucide-react"

interface Event {
  id: number;
  name: string;
  date: Date;
  location: string;
}

export default function AddEvent() {
  const [eventName, setEventName] = useState('');
  const [eventDate, setEventDate] = useState<Date | undefined>(undefined);
  const [eventLocation, setEventLocation] = useState('');
  const [alerts, setAlerts] = useState<string[]>([]);
  const topRef = useRef(null);
  const { toast } = useToast()

  const handleAddEvent = () => {
    if (!eventName || !eventDate || !eventLocation) {
      setAlerts(['Please fill in all fields.']);
      if (topRef.current) {
        topRef.current.scrollIntoView({ behavior: 'smooth' });
      }
      return;
    }

    const newEvent: Event = {
      id: Date.now(),
      name: eventName,
      date: eventDate,
      location: eventLocation,
    };

    console.log('Adding event:', newEvent);
    toast({
      title: "Event Added",
      description: "Your event has been added successfully.",
    })

    setEventName('');
    setEventDate(undefined);
    setEventLocation('');
    setAlerts([]);
  };

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-center text-gray-800">Add Event</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex justify-end mb-4">
          <Button 
            variant="link" 
            className="text-[#FF7A00] underline" 
            asChild
          >
            <Link to="/manage-events">Previous</Link>
          </Button>
        </div>
        
        <div ref={topRef} />
        {alerts.length > 0 && (
          <Alert variant="destructive">
            <Info className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              {alerts.map((alert, index) => (
                <div key={index}>{alert}</div>
              ))}
            </AlertDescription>
          </Alert>
        )}

        <div className="grid gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Event Name</Label>
            <Input
              id="name"
              placeholder="Event name"
              type="text"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Event Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-[240px] justify-start text-left font-normal",
                    !eventDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {eventDate ? format(eventDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={eventDate}
                  onSelect={setEventDate}
                  disabled={(date) =>
                    date < new Date()
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Event Location</Label>
            <Input
              id="location"
              placeholder="Event location"
              type="text"
              value={eventLocation}
              onChange={(e) => setEventLocation(e.target.value)}
            />
          </div>
        </div>

        <Button className="w-full bg-[#FF7A00] hover:bg-[#E66900] text-white" onClick={handleAddEvent}>
          Add Event
        </Button>
      </CardContent>
    </Card>
  );
}
