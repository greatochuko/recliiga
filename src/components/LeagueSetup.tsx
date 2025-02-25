
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { BasicInfoStep } from './league-setup/BasicInfoStep';
import { LogoStep } from './league-setup/LogoStep';
import { EventsStep } from './league-setup/EventsStep';
import { ReviewStep } from './league-setup/ReviewStep';
import { LeagueFormData } from './league-setup/types';
import { format } from 'date-fns';

export default function LeagueSetup({ onCancel }: { onCancel: () => void }) {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [leagueData, setLeagueData] = useState<LeagueFormData>({
    leagueName: '',
    sport: '',
    city: '',
    location: '',
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setLeagueData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setLeagueData(prevData => ({ ...prevData, logo: e.target.files![0] }));
    }
  };

  const handleEventChange = (e: React.ChangeEvent<HTMLInputElement>, eventIndex: number) => {
    const { name, value } = e.target;
    setLeagueData(prevData => {
      const updatedEvents = [...prevData.events];
      updatedEvents[eventIndex] = { ...updatedEvents[eventIndex], [name]: value };
      return { ...prevData, events: updatedEvents };
    });
  };

  const handleRsvpDeadlineChange = (value: string, eventIndex: number) => {
    setLeagueData(prevData => {
      const updatedEvents = [...prevData.events];
      updatedEvents[eventIndex] = { ...updatedEvents[eventIndex], rsvpDeadlineOption: value };
      return { ...prevData, events: updatedEvents };
    });
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

  const handleDateChange = (date: Date | undefined, eventIndex: number, dateIndex: number) => {
    if (date) {
      setLeagueData(prevData => {
        const updatedEvents = [...prevData.events];
        const updatedEventDates = [...updatedEvents[eventIndex].eventDates];
        updatedEventDates[dateIndex] = { ...updatedEventDates[dateIndex], date };
        updatedEvents[eventIndex] = { ...updatedEvents[eventIndex], eventDates: updatedEventDates };
        return { ...prevData, events: updatedEvents };
      });
    }
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>, eventIndex: number, dateIndex: number) => {
    const { name, value } = e.target;
    setLeagueData(prevData => {
      const updatedEvents = [...prevData.events];
      const updatedEventDates = [...updatedEvents[eventIndex].eventDates];
      updatedEventDates[dateIndex] = { ...updatedEventDates[dateIndex], [name]: value };
      updatedEvents[eventIndex] = { ...updatedEvents[eventIndex], eventDates: updatedEventDates };
      return { ...prevData, events: updatedEvents };
    });
  };

  const handleAmPmChange = (value: string, field: 'startAmPm' | 'endAmPm', eventIndex: number, dateIndex: number) => {
    setLeagueData(prevData => {
      const updatedEvents = [...prevData.events];
      const updatedEventDates = [...updatedEvents[eventIndex].eventDates];
      updatedEventDates[dateIndex] = { ...updatedEventDates[dateIndex], [field]: value };
      updatedEvents[eventIndex] = { ...updatedEvents[eventIndex], eventDates: updatedEventDates };
      return { ...prevData, events: updatedEvents };
    });
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
      if (!user) {
        toast.error('You must be logged in to create a league');
        return;
      }

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

      const { data: league, error: leagueError } = await supabase
        .from('leagues')
        .insert({
          name: leagueData.leagueName,
          sport: leagueData.sport,
          city: leagueData.city,
          location: leagueData.location,
          description: leagueData.description,
          logo_url: logoUrl,
          owner_id: user.id,
          start_date: new Date().toISOString()
        })
        .select()
        .single();

      if (leagueError) throw leagueError;

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

        const eventDatesInsert = event.eventDates.map(date => ({
          event_id: eventData.id,
          date: date.date ? format(date.date, 'yyyy-MM-dd') : null, // Convert Date to string format
          start_time: `${date.startHour}:${date.startMinute} ${date.startAmPm}`,
          end_time: `${date.endHour}:${date.endMinute} ${date.endAmPm}`,
        }));

        // Filter out any dates that are null
        const validEventDates = eventDatesInsert.filter(date => date.date !== null);

        if (validEventDates.length > 0) {
          const { error: datesError } = await supabase
            .from('event_dates')
            .insert(validEventDates);

          if (datesError) throw datesError;
        }
      }

      toast.success('League created successfully!');
      onCancel();
    } catch (error: any) {
      console.error('Error creating league:', error);
      toast.error(error.message);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Progress value={(step / 4) * 100} className="mb-4" />

      {step === 1 && (
        <BasicInfoStep 
          leagueData={leagueData}
          onDataChange={handleInputChange}
        />
      )}
      {step === 2 && (
        <LogoStep 
          onLogoChange={handleLogoChange}
        />
      )}
      {step === 3 && (
        <EventsStep 
          leagueData={leagueData}
          onEventChange={handleEventChange}
          onRsvpDeadlineChange={handleRsvpDeadlineChange}
          onDateChange={handleDateChange}
          onTimeChange={handleTimeChange}
          onAmPmChange={handleAmPmChange}
          onAddEventDate={handleAddEventDate}
          onRemoveEventDate={handleRemoveEventDate}
          onAddEvent={handleAddEvent}
        />
      )}
      {step === 4 && (
        <ReviewStep 
          leagueData={leagueData}
        />
      )}

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
