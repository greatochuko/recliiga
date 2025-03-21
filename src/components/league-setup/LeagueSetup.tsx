import { useState } from "react";
import { Check, LoaderIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LeagueInfoStep } from "./LeagueInfoStep";
import { LeaderboardStep } from "./LeaderboardStep";
// import { TeamSetupStep } from "./TeamSetupStep";
import { ConfirmationStep } from "./ConfirmationStep";
import { toast } from "sonner";
import { createLeague, LeagueDataType } from "@/api/league";
import { useAuth } from "@/contexts/AuthContext";

const steps = [
  { id: 1, name: "League Info" },
  { id: 2, name: "Leaderboard" },
  // { id: 3, name: "Team Setup" },
  { id: 3, name: "Confirmation" },
];

export function LeagueSetup() {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [leagueData, setLeagueData] = useState<LeagueDataType>({
    name: "",
    sport: "",
    is_private: false,
    stats: [
      { name: "Win", abbr: "W", isEditing: false, points: 3 },
      { name: "Loss", abbr: "L", isEditing: false, points: 0 },
      { name: "Tie", abbr: "T", isEditing: false, points: 1.5 },
      { name: "Captain Win", abbr: "CW", isEditing: false, points: 5 },
      { name: "Attendance", abbr: "ATT", isEditing: false, points: 1 },
      { name: "Non-Attendance", abbr: "N-ATT", isEditing: false, points: -1 },
    ],
  });
  const { setIsProfileComplete } = useAuth();

  const updateLeagueData = (newData: Partial<LeagueDataType>) => {
    setLeagueData((prevData) => ({ ...prevData, ...newData }));
  };

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleSubmit = async (leagueData: LeagueDataType) => {
    setLoading(true);
    try {
      const { error } = await createLeague(leagueData);

      if (error) {
        throw new Error(error);
      }

      toast.success("League created successfully!");
      setIsProfileComplete(true);
    } catch (error: any) {
      toast.error("Failed to create league: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const cannotProceed =
    currentStep === 1 ? !leagueData.name.trim() || !leagueData.sport : false;

  return (
    <div className="flex flex-col md:flex-row gap-8">
      <div className="w-full md:w-1/4">
        <div className="sticky top-8">
          <h2 className="text-lg font-semibold mb-4">Setup Progress</h2>
          <ol className="relative border-l border-gray-200">
            {steps.map((step) => (
              <li key={step.id} className="mb-10 ml-6">
                <span
                  className={`absolute flex items-center justify-center w-8 h-8 rounded-full -left-4 ring-4 ring-white ${
                    step.id === currentStep
                      ? "bg-[#FF7A00] text-white"
                      : step.id < currentStep
                      ? "bg-green-500 text-white"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {step.id < currentStep ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    step.id
                  )}
                </span>
                <h3
                  className={`font-medium leading-tight ${
                    step.id === currentStep ? "text-[#FF7A00]" : "text-gray-500"
                  }`}
                >
                  {step.name}
                </h3>
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
        {/* {currentStep === 3 && (
          <TeamSetupStep
            leagueData={leagueData}
            updateLeagueData={updateLeagueData}
          />
        )} */}
        {currentStep === 3 && <ConfirmationStep leagueData={leagueData} />}

        <div className="flex justify-between mt-6">
          {currentStep > 1 && (
            <Button variant="outline" onClick={handlePrevious}>
              Previous
            </Button>
          )}
          {currentStep < steps.length ? (
            <Button
              className="bg-[#FF7A00] ml-auto hover:bg-[#FF7A00]/90 text-white"
              onClick={handleNext}
              disabled={cannotProceed}
            >
              Next
            </Button>
          ) : (
            <Button
              className="bg-[#FF7A00] ml-auto hover:bg-[#FF7A00]/90 text-white"
              onClick={() => handleSubmit(leagueData)}
              disabled={loading || cannotProceed}
            >
              {loading && <LoaderIcon className="w-4 h-4 animate-spin" />}
              Complete Setup
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
