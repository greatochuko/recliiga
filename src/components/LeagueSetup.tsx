import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft } from "lucide-react";
import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export default function LeagueSetup({ onCancel }: { onCancel: () => void }) {
  const [step, setStep] = useState(1);
  const [leagueData, setLeagueData] = useState({
    leagueName: '',
    sport: '',
    city: '',
    description: '',
    logo: null,
    events: [{
      title: '',
      location: '',
      numTeams: '',
      rosterSpots: '',
      rsvpDeadlineOption: '24',
      customRsvpHours: '',
      eventDates: [{
        date: null,
        startHour: '12',
        startMinute: '00',
        startAmPm: 'AM',
        endHour: '01',
        endMinute: '00',
        endAmPm: 'PM',
      }],
    }],
  });

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>, section?: string, index?: number, dateIndex?: number) => {
    const { name, value, type } = e.target;

    if (section === 'events' && typeof index === 'number') {
      setLeagueData(prevData => {
        const updatedEvents = [...prevData.events];
        updatedEvents[index] = { ...updatedEvents[index], [name]: value };
        return { ...prevData, events: updatedEvents };
      });
    } else if (section === 'eventDates' && typeof index === 'number' && typeof dateIndex === 'number') {
      setLeagueData(prevData => {
        const updatedEvents = [...prevData.events];
        const updatedEventDates = [...updatedEvents[index].eventDates];
        updatedEventDates[dateIndex] = { ...updatedEventDates[dateIndex], [name]: value };
        updatedEvents[index] = { ...updatedEvents[index], eventDates: updatedEventDates };
        return { ...prevData, events: updatedEvents };
      });
    } else {
      setLeagueData(prevData => ({ ...prevData, [name]: value }));
    }
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setLeagueData(prevData => ({ ...prevData, logo: e.target.files![0] }));
    }
  };

  const handleAddEvent = () => {
    setLeagueData(prevData => ({
      ...prevData,
      events: [...prevData.events, {
        title: '',
        location: '',
        numTeams: '',
        rosterSpots: '',
        rsvpDeadlineOption: '24',
        customRsvpHours: '',
        eventDates: [{
          date: null,
          startHour: '12',
          startMinute: '00',
          startAmPm: 'AM',
          endHour: '01',
          endMinute: '00',
          endAmPm: 'PM',
        }],
      }],
    }));
  };

  const handleAddEventDate = (eventIndex: number) => {
    setLeagueData(prevData => {
      const updatedEvents = [...prevData.events];
      updatedEvents[eventIndex] = {
        ...updatedEvents[eventIndex],
        eventDates: [...updatedEvents[eventIndex].eventDates, {
          date: null,
          startHour: '12',
          startMinute: '00',
          startAmPm: 'AM',
          endHour: '01',
          endMinute: '00',
          endAmPm: 'PM',
        }],
      };
      return { ...prevData, events: updatedEvents };
    });
  };

  const handleDateChange = (date: Date | undefined, eventIndex: number, dateIndex: number) => {
    setLeagueData(prevData => {
      const updatedEvents = [...prevData.events];
      const updatedEventDates = [...updatedEvents[eventIndex].eventDates];
      updatedEventDates[dateIndex] = { ...updatedEventDates[dateIndex], date: date };
      updatedEvents[eventIndex] = { ...updatedEvents[eventIndex], eventDates: updatedEventDates };
      return { ...prevData, events: updatedEvents };
    });
  };

  const handleRemoveEventDate = (eventIndex: number, dateIndex: number) => {
    setLeagueData(prevData => {
      const updatedEvents = [...prevData.events];
      const updatedEventDates = updatedEvents[eventIndex].eventDates.filter((_, i) => i !== dateIndex);
      updatedEvents[eventIndex] = { ...updatedEvents[eventIndex], eventDates: updatedEventDates };
      return { ...prevData, events: updatedEvents };
    });
  };

  const handleCreateLeague = async () => {
    try {
      // Upload logo to Supabase Storage if provided
      let logoUrl = null;
      if (leagueData.logo) {
        const fileExt = leagueData.logo.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('league-logos')
          .upload(fileName, leagueData.logo);

        if (uploadError) throw uploadError;
        
        const { data: { publicUrl } } = supabase.storage
          .from('league-logos')
          .getPublicUrl(fileName);
          
        logoUrl = publicUrl;
      }

      // Create league
      const { data: league, error: leagueError } = await supabase
        .from('leagues')
        .insert({
          name: leagueData.leagueName,
          sport: leagueData.sport,
          city: leagueData.city,
          description: leagueData.description,
          logo_url: logoUrl,
        })
        .select()
        .single();

      if (leagueError) throw leagueError;

      // Create events
      for (const event of leagueData.events) {
        const { data: eventData, error: eventError } = await supabase
          .from('events')
          .insert({
            league_id: league.id,
            title: event.title,
            location: event.location,
            num_teams: parseInt(event.numTeams),
            roster_spots: parseInt(event.rosterSpots),
            rsvp_deadline_hours: event.rsvpDeadlineOption === 'custom' 
              ? parseInt(event.customRsvpHours)
              : parseInt(event.rsvpDeadlineOption),
          })
          .select()
          .single();

        if (eventError) throw eventError;

        // Create event dates
        const eventDatesInsert = event.eventDates.map(date => ({
          event_id: eventData.id,
          date: date.date,
          start_time: `${date.startHour}:${date.startMinute} ${date.startAmPm}`,
          end_time: `${date.endHour}:${date.endMinute} ${date.endAmPm}`,
        }));

        const { error: datesError } = await supabase
          .from('event_dates')
          .insert(eventDatesInsert);

        if (datesError) throw datesError;
      }

      toast.success('League created successfully!');
      onCancel();
    } catch (error: any) {
      console.error('Error creating league:', error);
      toast.error(error.message);
    }
  };

  const Step1 = () => (
    <div>
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="leagueName">League Name</Label>
          <Input
            type="text"
            id="leagueName"
            name="leagueName"
            value={leagueData.leagueName}
            onChange={handleInputChange}
            placeholder="Enter league name"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="sport">Sport</Label>
          <Input
            type="text"
            id="sport"
            name="sport"
            value={leagueData.sport}
            onChange={handleInputChange}
            placeholder="Enter sport"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="city">City</Label>
          <Input
            type="text"
            id="city"
            name="city"
            value={leagueData.city}
            onChange={handleInputChange}
            placeholder="Enter city"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            value={leagueData.description}
            onChange={handleInputChange}
            placeholder="Enter description"
          />
        </div>
      </div>
    </div>
  );

  const Step2 = () => (
    <div>
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="logo">Logo</Label>
          <Input
            type="file"
            id="logo"
            name="logo"
            onChange={handleLogoChange}
          />
        </div>
      </div>
    </div>
  );

  const Step3 = () => (
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
                onChange={(e) => handleInputChange(e, 'events', index)}
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
                onChange={(e) => handleInputChange(e, 'events', index)}
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
                onChange={(e) => handleInputChange(e, 'events', index)}
                placeholder="Enter number of teams"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor={`rosterSpots-${index}`}>Roster Spots per Team</Label>
              <Input
                type="number"
                id={`rosterSpots-${index}`}
                name="rosterSpots"
                value={event.rosterSpots}
                onChange={(e) => handleInputChange(e, 'events', index)}
                placeholder="Enter roster spots per team"
              />
            </div>
            <div className="grid gap-2">
              <Label>RSVP Deadline</Label>
              <Select onValueChange={(value) => handleInputChange({ target: { name: 'rsvpDeadlineOption', value } } as any, 'events', index)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select RSVP Deadline" defaultValue="24" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="24">24 Hours Before</SelectItem>
                  <SelectItem value="48">48 Hours Before</SelectItem>
                  <SelectItem value="72">72 Hours Before</SelectItem>
                  <SelectItem value="custom">Custom Hours</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {leagueData.events[index].rsvpDeadlineOption === 'custom' && (
              <div className="grid gap-2">
                <Label htmlFor={`customRsvpHours-${index}`}>Custom RSVP Hours</Label>
                <Input
                  type="number"
                  id={`customRsvpHours-${index}`}
                  name="customRsvpHours"
                  value={event.customRsvpHours}
                  onChange={(e) => handleInputChange(e, 'events', index)}
                  placeholder="Enter custom hours"
                />
              </div>
            )}

            <h4 className="text-md font-semibold mt-4">Event Dates</h4>
            {event.eventDates.map((date, dateIndex) => (
              <div key={dateIndex} className="mb-2 p-2 border rounded">
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
                          onSelect={(date) => handleDateChange(date, index, dateIndex)}
                          disabled={(date) =>
                            date < new Date()
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`startTime-${index}-${dateIndex}`}>Start Time</Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        type="number"
                        name="startHour"
                        value={date.startHour}
                        onChange={(e) => handleInputChange(e, 'eventDates', index, dateIndex)}
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
                        onChange={(e) => handleInputChange(e, 'eventDates', index, dateIndex)}
                        className="w-16"
                        placeholder="Minute"
                        min="00"
                        max="59"
                      />
                      <Select onValueChange={(value) => handleInputChange({ target: { name: 'startAmPm', value } } as any, 'eventDates', index, dateIndex)}>
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
                    <Label htmlFor={`endTime-${index}-${dateIndex}`}>End Time</Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        type="number"
                        name="endHour"
                        value={date.endHour}
                        onChange={(e) => handleInputChange(e, 'eventDates', index, dateIndex)}
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
                        onChange={(e) => handleInputChange(e, 'eventDates', index, dateIndex)}
                        className="w-16"
                        placeholder="Minute"
                        min="00"
                        max="59"
                      />
                      <Select onValueChange={(value) => handleInputChange({ target: { name: 'endAmPm', value } } as any, 'eventDates', index, dateIndex)}>
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
                <Button onClick={() => handleRemoveEventDate(index, dateIndex)} variant="destructive" size="sm">
                  Remove Date
                </Button>
              </div>
            ))}
            <Button onClick={() => handleAddEventDate(index)} variant="secondary" size="sm">
              Add Date
            </Button>
          </div>
        </div>
      ))}
      <Button onClick={handleAddEvent} variant="secondary">Add Event</Button>
    </div>
  );

  const Step4 = () => (
    <div>
      <h2 className="text-2xl font-bold mb-4">Review League Details</h2>
      <div className="mb-4">
        <strong>League Name:</strong> {leagueData.leagueName}
      </div>
      <div className="mb-4">
        <strong>Sport:</strong> {leagueData.sport}
      </div>
      <div className="mb-4">
        <strong>City:</strong> {leagueData.city}
      </div>
      <div className="mb-4">
        <strong>Description:</strong> {leagueData.description}
      </div>
      {leagueData.logo && (
        <div className="mb-4">
          <strong>Logo:</strong> {leagueData.logo.name}
        </div>
      )}
      <h3 className="text-xl font-bold mt-4 mb-2">Events:</h3>
      {leagueData.events.map((event, index) => (
        <div key={index} className="mb-4 p-4 border rounded">
          <h4 className="text-lg font-semibold">Event {index + 1}</h4>
          <div><strong>Title:</strong> {event.title}</div>
          <div><strong>Location:</strong> {event.location}</div>
          <div><strong>Number of Teams:</strong> {event.numTeams}</div>
          <div><strong>Roster Spots per Team:</strong> {event.rosterSpots}</div>
          <div><strong>RSVP Deadline:</strong> {event.rsvpDeadlineOption} hours before</div>
          <h5 className="text-md font-semibold mt-2">Event Dates:</h5>
          {event.eventDates.map((date, dateIndex) => (
            <div key={dateIndex} className="mb-2 p-2 border rounded">
              <div><strong>Date:</strong> {date.date ? format(date.date, "PPP") : 'Not set'}</div>
              <div><strong>Start Time:</strong> {date.startHour}:{date.startMinute} {date.startAmPm}</div>
              <div><strong>End Time:</strong> {date.endHour}:{date.endMinute} {date.endAmPm}</div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );

  return (
    <div className="container mx-auto p-4">
      <Progress value={(step / 4) * 100} className="mb-4" />

      {step === 1 && <Step1 />}
      {step === 2 && <Step2 />}
      {step === 3 && <Step3 />}
      {step === 4 && <Step4 />}

      <div className="mt-8 flex justify-between">
        {step > 1 && (
          <Button onClick={prevStep} variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" /> Previous
          </Button>
        )}
        {step < 4 && (
          <Button onClick={nextStep} className="ml-auto">
            Next <ArrowLeft className="ml-2 h-4 w-4 rotate-180" />
          </Button>
        )}
        {step === 4 && (
          <Button onClick={handleCreateLeague} className="ml-auto bg-[#FF7A00] hover:bg-[#FF7A00]/90 text-white">
            Create League
          </Button>
        )}
      </div>
    </div>
  );
}
