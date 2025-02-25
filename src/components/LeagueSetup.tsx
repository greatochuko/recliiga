
import React from 'react';
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft } from "lucide-react";
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { BasicInfoStep } from './league-setup/BasicInfoStep';
import { LogoStep } from './league-setup/LogoStep';
import { EventsStep } from './league-setup/EventsStep';
import { ReviewStep } from './league-setup/ReviewStep';
import { useLeagueSetup } from '@/hooks/use-league-setup';
import { createLeague } from './league-setup/LeagueCreation';

export default function LeagueSetup({ onCancel }: { onCancel: () => void }) {
  const { user } = useAuth();
  const {
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
  } = useLeagueSetup(onCancel);

  const handleCreateLeague = async () => {
    try {
      if (!user) {
        toast.error('You must be logged in to create a league');
        return;
      }

      await createLeague(leagueData, user.id);
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
