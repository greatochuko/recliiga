import { useState, useEffect } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import PersonalInformation from "@/components/player-registration/PersonalInformation";
import SportsAndPositions from "@/components/player-registration/SportsAndPositions";
import { positions, sports } from "@/lib/constants";
import { ConfirmationAndLeagueCode } from "@/components/player-registration/ConfirmationAndLeagueCode";

export interface PlayerProfile {
  nickname: string;
  dateOfBirth?: Date;
  date_of_birth?: string;
  city: string;
  sports: string[];
  positions: Record<string, string[]>;
  leagueCode?: string;
  avatar_url?: string;
  user_id?: string;
}

const steps = [
  { id: 1, name: "Personal Information" },
  { id: 2, name: "Sports & Positions" },
  { id: 3, name: "Confirmation & League Code" },
];

const initialPlayerData = {
  nickname: "",
  dateOfBirth: undefined,
  city: "",
  sports: [] as string[],
  positions: {} as Record<string, string[]>,
  leagueCode: "",
  avatar_url: "",
};

export default function PlayerRegistration() {
  const [currentStep, setCurrentStep] = useState(1);
  const [playerData, setPlayerData] =
    useState<PlayerProfile>(initialPlayerData);

  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/sign-in");
    }
  }, [user, navigate]);

  const handleNext = async () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    try {
      const profilePositions = playerData.sports.map((sport) =>
        playerData.positions[sport] ? playerData.positions[sport].join(",") : ""
      );

      const profileData = {
        ...playerData,
        user_id: user!.id,
        date_of_birth: playerData.dateOfBirth
          ? playerData.dateOfBirth.toISOString()
          : null,
      };

      const { error } = await supabase
        .from("profiles")
        .update({
          nickname: profileData.nickname,
          date_of_birth: profileData.date_of_birth,
          city: profileData.city,
          sports: profileData.sports,
          positions: profilePositions,
          avatar_url: profileData.avatar_url,
        })
        .eq("id", user!.id);

      if (error) {
        throw error;
      }

      toast.success("Profile updated successfully!");

      navigate("/");
    } catch (err) {
      const error = err as Error;
      toast.error(
        error.message || "An error occurred while saving your profile"
      );
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updatePlayerData = (newData: Partial<PlayerProfile>) => {
    setPlayerData((prevData) => ({ ...prevData, ...newData }));
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <RouterLink to="/" className="inline-block">
            <span className="text-4xl font-bold text-[#FF7A00]">REC LiiGA</span>
          </RouterLink>
          <nav>{/* Add navigation items here if needed */}</nav>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-1/4">
            <div className="sticky top-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Registration Progress
              </h2>
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
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        step.id
                      )}
                    </span>
                    <h3
                      className={`font-medium leading-tight ${
                        step.id === currentStep
                          ? "text-[#FF7A00]"
                          : "text-[#707B81]"
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
            <h1 className="text-4xl font-bold text-gray-800 mb-6">
              Player Registration
            </h1>

            {currentStep === 1 && (
              <PersonalInformation
                playerData={playerData}
                updatePlayerData={updatePlayerData}
              />
            )}
            {currentStep === 2 && (
              <SportsAndPositions
                playerData={playerData}
                updatePlayerData={updatePlayerData}
                sports={sports}
                positions={positions}
              />
            )}
            {currentStep === 3 && (
              <ConfirmationAndLeagueCode
                playerData={playerData}
                updatePlayerData={updatePlayerData}
              />
            )}

            <div className="flex justify-between mt-6">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 1}
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Previous
              </Button>
              <Button
                className="bg-[#FF7A00] hover:bg-[#FF7A00]/90 text-white"
                onClick={handleNext}
              >
                {currentStep === steps.length
                  ? "Complete Registration"
                  : "Next"}
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
