
import { useState } from 'react';
import { LeagueFormData, Event, EventDate } from '@/components/league-setup/types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { format } from 'date-fns';

export const useLeagueSetup = (onCancel: () => void) => {
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

  return {
    step,
    leagueData,
    nextStep,
    prevStep,
    handleInputChange,
    handleLogoChange,
    handleEventChange,
    handleRsvpDeadlineChange,
    handleDateChange,
    handleTimeChange,
    handleAmPmChange,
    handleAddEventDate,
    handleRemoveEventDate,
    handleAddEvent,
  };
};
