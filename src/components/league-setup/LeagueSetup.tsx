
import { useState } from 'react';
import { Check } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { LeagueInfoStep } from './LeagueInfoStep';
import { LeaderboardStep } from './LeaderboardStep';
import { TeamSetupStep } from './TeamSetupStep';
import { ConfirmationStep } from './ConfirmationStep';

const steps = [
  { id: 1, name: 'League Info' },
  { id: 2, name: 'Leaderboard' },
  { id: 3, name: 'Team Setup' },
  { id: 4, name: 'Confirmation' },
];

interface LeagueSetupProps {
  onComplete: () => void;
}

export function LeagueSetup({ onComplete }: LeagueSetupProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [leagueData, setLeagueData] = useState({
    leagueName: '',
    sport: '',
    privacySetting: 'public',
    seasonStartDate: null,
    seasonEndDate: null,
    registrationDeadline: null,
    events: [],
    statPoints: {
      'Win': 3,
      'Loss': 0,
      'Tie': 1.5,
      'Captain Win': 5,
      'Attendance': 1,
      'Non-Attendance': -1,
    },
    stats: [
      { name: 'Win', abbr: 'W', isEditing: false },
      { name: 'Loss', abbr: 'L', isEditing: false },
      { name: 'Tie', abbr: 'T', isEditing: false },
      { name: 'Captain Win', abbr: 'CW', isEditing: false },
      { name: 'Attendance', abbr: 'ATT', isEditing: false },
      { name: 'Non-Attendance', abbr: 'N-ATT', isEditing: false },
    ],
  });

  const updateLeagueData = (newData) => {
    setLeagueData(prevData => ({ ...prevData, ...newData }));
  };

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-8">
      <div className="w-full md:w-1/4">
        <div className="sticky top-8">
          <h2 className="text-lg font-semibold mb-4">Setup Progress</h2>
          <ol className="relative border-l border-gray-200">
            {steps.map((step) => (
              <li key={step.id} className="mb-10 ml-6">
                <span className={`absolute flex items-center justify-center w-8 h-8 rounded-full -left-4 ring-4 ring-white ${
                  step.id === currentStep ? 'bg-[#FF7A00] text-white' : 
                  step.id < currentStep ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-500'
                }`}>
                  {step.id < currentStep ? <Check className="w-5 h-5" /> : step.id}
                </span>
                <h3 className={`font-medium leading-tight ${
                  step.id === currentStep ? 'text-[#FF7A00]' : 'text-gray-500'
                }`}>{step.name}</h3>
              </li>
            ))}
          </ol>
        </div>
      </div>
      <div className="w-full md:w-3/4">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">League Setup</h1>
        
        {currentStep === 1 && (
          <LeagueInfoStep 
            leagueData={leagueData} 
            updateLeagueData={updateLeagueData}
          />
        )}
        {currentStep === 2 && (
          <LeaderboardStep 
            leagueData={leagueData} 
            updateLeagueData={updateLeagueData}
          />
        )}
        {currentStep === 3 && (
          <TeamSetupStep 
            leagueData={leagueData} 
            updateLeagueData={updateLeagueData} 
          />
        )}
        {currentStep === 4 && (
          <ConfirmationStep leagueData={leagueData} />
        )}

        <div className="flex justify-between mt-6">
          <Button 
            variant="outline" 
            onClick={handlePrevious}
            disabled={currentStep === 1}
          >
            Previous
          </Button>
          {currentStep < steps.length ? (
            <Button 
              className="bg-[#FF7A00] hover:bg-[#FF7A00]/90 text-white"
              onClick={handleNext}
            >
              Next
            </Button>
          ) : (
            <Button 
              className="bg-[#FF7A00] hover:bg-[#FF7A00]/90 text-white"
              onClick={handleNext}
            >
              Complete Setup
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
