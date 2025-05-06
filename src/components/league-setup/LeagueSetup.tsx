import { useState } from "react";
import { Check, LoaderIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LeagueInfoStep } from "./LeagueInfoStep";
import { LeaderboardStep } from "./LeaderboardStep";
// import { TeamSetupStep } from "./TeamSetupStep";
import { ConfirmationStep } from "./ConfirmationStep";
import { toast } from "sonner";
import { createLeague, LeagueDataType } from "@/api/league";
import { useNavigate } from "react-router-dom";
import { uploadImage } from "@/lib/uploadImage";

const steps = [
  { id: 1, name: "League Info" },
  { id: 2, name: "Leaderboard" },
  // { id: 3, name: "Team Setup" },
  { id: 3, name: "Confirmation" },
];

const initialLeagueData: LeagueDataType = {
  name: "",
  sport: "",
  is_private: false,
  city: "",
  date: new Date().toISOString().split("T")[0],
  image: "",
  stats: [
    { name: "Win", abbr: "W", points: 3 },
    { name: "Loss", abbr: "L", points: 0 },
    { name: "Tie", abbr: "T", points: 1.5 },
    { name: "Captain Win", abbr: "CW", points: 5 },
    { name: "Attendance", abbr: "ATT", points: 1 },
    { name: "Non-Attendance", abbr: "N-ATT", points: -1 },
  ],
  events: [],
  results: [],
};

export function LeagueSetup() {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [leagueData, setLeagueData] = useState(initialLeagueData);
  const [leagueImageFile, setLeagueImageFile] = useState<File>();

  const navigate = useNavigate();

  const updateLeagueData = (newData: Partial<LeagueDataType>) => {
    setLeagueData((prevData) => ({ ...prevData, ...newData }));
  };

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    const { url } = await uploadImage(leagueImageFile);
    const { error } = await createLeague({ ...leagueData, image: url });
    if (error) {
      toast.error("Failed to create league: " + error);
    } else {
      toast.success("League created successfully!");
      navigate("/leagues");
    }

    setLoading(false);
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  function handleChangeLeagueImage(e: React.ChangeEvent<HTMLInputElement>) {
    const image = e.target.files && e.target.files[0];
    if (image) {
      const reader = new FileReader();
      reader.onload = () => {
        updateLeagueData({ image: reader.result as string });
      };
      reader.readAsDataURL(image);
      setLeagueImageFile(image);
    }
  }

  const cannotProceed =
    currentStep === 1
      ? !leagueData.name.trim() ||
        !leagueData.sport ||
        !leagueData.city.trim() ||
        !leagueData.date.trim()
      : false;

  return (
    <div className="flex flex-col gap-8 lg:flex-row">
      <div className="w-full lg:w-40">
        <div className="sticky top-8">
          <h2 className="mb-4 text-lg font-semibold">Setup Progress</h2>
          <ol className="relative border-l border-gray-200">
            {steps.map((step) => (
              <li key={step.id} className="mb-10 ml-6">
                <span
                  className={`absolute -left-4 flex h-8 w-8 items-center justify-center rounded-full ring-4 ring-white ${
                    step.id === currentStep
                      ? "bg-accent-orange text-white"
                      : step.id < currentStep
                        ? "bg-green-500 text-white"
                        : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {step.id < currentStep ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    step.id
                  )}
                </span>
                <h3
                  className={`font-medium leading-tight ${
                    step.id === currentStep
                      ? "text-accent-orange"
                      : "text-gray-500"
                  }`}
                >
                  {step.name}
                </h3>
              </li>
            ))}
          </ol>
        </div>
      </div>
      <div className="w-full lg:w-3/4">
        {/* <h1 className="mb-6 text-3xl font-bold text-gray-800">League Setup</h1> */}

        {currentStep === 1 && (
          <LeagueInfoStep
            leagueData={leagueData}
            updateLeagueData={updateLeagueData}
            handleChangeLeagueImage={handleChangeLeagueImage}
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

        <div className="mt-6 flex justify-between">
          {currentStep > 1 && (
            <Button variant="outline" onClick={handlePrevious}>
              Previous
            </Button>
          )}
          {currentStep < steps.length ? (
            <Button
              className="ml-auto bg-accent-orange text-white hover:bg-accent-orange/90"
              onClick={handleNext}
              disabled={cannotProceed}
            >
              Next
            </Button>
          ) : (
            <Button
              className="ml-auto bg-accent-orange text-white hover:bg-accent-orange/90"
              onClick={handleSubmit}
              disabled={loading || cannotProceed}
            >
              {loading && <LoaderIcon className="h-4 w-4 animate-spin" />}
              Complete Setup
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
