
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { BasicInfoStep } from '@/components/league-setup/BasicInfoStep';
import { LogoStep } from '@/components/league-setup/LogoStep';
import { EventsStep } from '@/components/league-setup/EventsStep';
import { ReviewStep } from '@/components/league-setup/ReviewStep';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { LeagueFormData } from '@/components/league-setup/types';
import { toast } from 'sonner';

const initialLeagueData: LeagueFormData = {
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
      startHour: '9',
      startMinute: '00',
      startAmPm: 'AM',
      endHour: '5',
      endMinute: '00',
      endAmPm: 'PM'
    }]
  }]
};

export default function CreateLeague() {
  const [step, setStep] = useState(1);
  const [leagueData, setLeagueData] = useState<LeagueFormData>(initialLeagueData);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleDataChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setLeagueData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLeagueData(prev => ({
        ...prev,
        logo: file
      }));
    }
  };

  const handleEventChange = (e: React.ChangeEvent<HTMLInputElement>, eventIndex: number) => {
    const { name, value } = e.target;
    setLeagueData(prev => ({
      ...prev,
      events: prev.events.map((event, index) =>
        index === eventIndex ? { ...event, [name]: value } : event
      )
    }));
  };

  const handleRsvpDeadlineChange = (value: string, eventIndex: number) => {
    setLeagueData(prev => ({
      ...prev,
      events: prev.events.map((event, index) =>
        index === eventIndex ? { ...event, rsvpDeadlineOption: value } : event
      )
    }));
  };

  const handleDateChange = (date: Date | undefined, eventIndex: number, dateIndex: number) => {
    setLeagueData(prev => ({
      ...prev,
      events: prev.events.map((event, eIndex) =>
        eIndex === eventIndex ? {
          ...event,
          eventDates: event.eventDates.map((eventDate, dIndex) =>
            dIndex === dateIndex ? { ...eventDate, date: date ?? null } : eventDate
          )
        } : event
      )
    }));
  };

  const handleTimeChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    eventIndex: number,
    dateIndex: number
  ) => {
    const { name, value } = e.target;
    setLeagueData(prev => ({
      ...prev,
      events: prev.events.map((event, eIndex) =>
        eIndex === eventIndex ? {
          ...event,
          eventDates: event.eventDates.map((eventDate, dIndex) =>
            dIndex === dateIndex ? { ...eventDate, [name]: value } : eventDate
          )
        } : event
      )
    }));
  };

  const handleAmPmChange = (
    value: string,
    field: 'startAmPm' | 'endAmPm',
    eventIndex: number,
    dateIndex: number
  ) => {
    setLeagueData(prev => ({
      ...prev,
      events: prev.events.map((event, eIndex) =>
        eIndex === eventIndex ? {
          ...event,
          eventDates: event.eventDates.map((eventDate, dIndex) =>
            dIndex === dateIndex ? { ...eventDate, [field]: value } : eventDate
          )
        } : event
      )
    }));
  };

  const handleAddEventDate = (eventIndex: number) => {
    setLeagueData(prev => ({
      ...prev,
      events: prev.events.map((event, index) =>
        index === eventIndex ? {
          ...event,
          eventDates: [...event.eventDates, {
            date: null,
            startHour: '9',
            startMinute: '00',
            startAmPm: 'AM',
            endHour: '5',
            endMinute: '00',
            endAmPm: 'PM'
          }]
        } : event
      )
    }));
  };

  const handleRemoveEventDate = (eventIndex: number, dateIndex: number) => {
    setLeagueData(prev => ({
      ...prev,
      events: prev.events.map((event, index) =>
        index === eventIndex ? {
          ...event,
          eventDates: event.eventDates.filter((_, dIndex) => dIndex !== dateIndex)
        } : event
      )
    }));
  };

  const handleAddEvent = () => {
    setLeagueData(prev => ({
      ...prev,
      events: [...prev.events, {
        title: '',
        location: '',
        numTeams: '',
        rosterSpots: '',
        rsvpDeadlineOption: '24',
        customRsvpHours: '',
        eventDates: [{
          date: null,
          startHour: '9',
          startMinute: '00',
          startAmPm: 'AM',
          endHour: '5',
          endMinute: '00',
          endAmPm: 'PM'
        }]
      }]
    }));
  };

  const handleSubmit = async () => {
    try {
      const { error } = await supabase.auth.updateUser({
        data: { profile_completed: true }
      });

      if (error) throw error;

      toast.success('League created successfully!');
      navigate('/');
    } catch (error: any) {
      toast.error('Failed to create league: ' + error.message);
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return <BasicInfoStep leagueData={leagueData} onDataChange={handleDataChange} />;
      case 2:
        return <LogoStep onLogoChange={handleLogoChange} />;
      case 3:
        return (
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
        );
      case 4:
        return <ReviewStep leagueData={leagueData} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-[#FF7A00] text-center mb-8">Create Your League</h1>
        
        <div className="flex justify-center mb-8">
          <div className="flex items-center">
            {[1, 2, 3, 4].map((stepNumber) => (
              <>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step >= stepNumber ? 'bg-[#FF7A00] text-white' : 'bg-gray-200'
                }`}>
                  {stepNumber}
                </div>
                {stepNumber < 4 && (
                  <div className={`w-20 h-1 ${step > stepNumber ? 'bg-[#FF7A00]' : 'bg-gray-200'}`} />
                )}
              </>
            ))}
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-center">
              {step === 1 ? 'Basic Information' :
               step === 2 ? 'Upload Logo' :
               step === 3 ? 'Create Events' :
               'Review Details'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {renderStepContent()}
            
            <div className="flex justify-between mt-6">
              <Button
                onClick={() => setStep(prev => prev - 1)}
                disabled={step === 1}
                variant="outline"
              >
                Previous
              </Button>
              <Button
                onClick={() => {
                  if (step === 4) {
                    handleSubmit();
                  } else {
                    setStep(prev => prev + 1);
                  }
                }}
              >
                {step === 4 ? 'Create League' : 'Next'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
