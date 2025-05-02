import React, { useState, useCallback } from "react";
import { Link as RouterLink } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import PersonalInformation from "@/components/player-registration/PersonalInformation";
import SportsAndPositions from "@/components/player-registration/SportsAndPositions";
import { positions, sports } from "@/lib/constants";
import { ConfirmationAndLeagueCode } from "@/components/player-registration/ConfirmationAndLeagueCode";
import { completeProfileRegistration } from "@/api/user";
import { uploadImage } from "@/lib/uploadImage";

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
  { id: 3, name: "Confirmation" },
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
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [profileImage, setProfileImage] = useState<File>();
  const [playerData, setPlayerData] =
    useState<PlayerProfile>(initialPlayerData);

  const { user, setUser } = useAuth();

  const handleNext = async () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    const profilePositions = playerData.sports.map((sport) =>
      playerData.positions[sport] ? playerData.positions[sport].join(",") : "",
    );

    const profileData = {
      ...playerData,
      user_id: user!.id,
      date_of_birth: playerData.dateOfBirth
        ? playerData.dateOfBirth.toISOString()
        : null,
    };

    const { url } = await uploadImage(profileImage);

    const { data, error } = await completeProfileRegistration({
      nickname: profileData.nickname,
      date_of_birth: profileData.date_of_birth,
      city: profileData.city,
      sports: profileData.sports,
      positions: profilePositions,
      avatar_url: url,
    });

    if (error) {
      toast.error(error || "An error occurred while saving your profile");
      setLoading(false);
    } else {
      toast.success("Profile updated successfully!");
      setUser(data);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updatePlayerData = useCallback((newData: Partial<PlayerProfile>) => {
    setPlayerData((prevData) => ({ ...prevData, ...newData }));
  }, []);

  function handleChangeLeagueImage(e: React.ChangeEvent<HTMLInputElement>) {
    const image = e.target.files && e.target.files[0];
    if (image) {
      const reader = new FileReader();
      reader.onload = () => {
        setPlayerData((prevData) => ({
          ...prevData,
          avatar_url: reader.result as string,
        }));
      };
      reader.readAsDataURL(image);
      setProfileImage(image);
    }
  }

  const cannotProceed =
    currentStep === 1
      ? !playerData.nickname.trim() ||
        !playerData.dateOfBirth ||
        !playerData.city.trim()
      : currentStep === 2
        ? playerData.sports.length < 1 ||
          playerData.sports.some(
            (sport) =>
              !playerData.positions[sport] ||
              playerData.positions[sport].length < 1,
          )
        : false;

  return (
    <div className="flex min-h-dvh flex-col bg-white">
      <header className="bg-white shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <RouterLink to="/" className="inline-block">
            <span className="text-4xl font-bold text-accent-orange">
              REC LiiGA
            </span>
          </RouterLink>
          <button className="rounded-md bg-red-100 px-4 py-2 text-sm font-medium text-red-500">
            Logout
          </button>
        </div>
      </header>

      <main className="container mx-auto flex-grow px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 md:flex-row">
          <div className="w-full md:w-64">
            <div className="sticky top-8">
              <h2 className="mb-4 text-2xl font-semibold text-gray-800">
                Registration Progress
              </h2>
              <ol className="relative ml-4 border-l border-gray-200">
                {steps.map((step) => (
                  <li key={step.id} className="mb-10 ml-6">
                    <span
                      className={`absolute -left-4 flex h-8 w-8 -translate-y-1.5 items-center justify-center rounded-full ring-4 ring-white ${
                        step.id === currentStep
                          ? "bg-accent-orange text-white"
                          : step.id < currentStep
                            ? "bg-green-500 text-white"
                            : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {step.id < currentStep ? (
                        <CheckCircle className="h-5 w-5" />
                      ) : (
                        step.id
                      )}
                    </span>
                    <h3
                      className={`font-medium leading-tight ${
                        step.id === currentStep
                          ? "text-accent-orange"
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
          <div className="w-full flex-1">
            <h1 className="mb-6 text-4xl font-bold text-gray-800">
              Player Registration
            </h1>

            {currentStep === 1 && (
              <PersonalInformation
                playerData={playerData}
                updatePlayerData={updatePlayerData}
                handleChangeProfileImage={handleChangeLeagueImage}
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
              <ConfirmationAndLeagueCode playerData={playerData} />
            )}

            <div className="mt-6 flex justify-between">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 1}
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Previous
              </Button>
              <Button
                className="bg-accent-orange text-white hover:bg-accent-orange/90"
                onClick={handleNext}
                disabled={loading || cannotProceed}
              >
                {currentStep === steps.length
                  ? loading
                    ? "Loading..."
                    : "Complete Registration"
                  : "Next"}
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
