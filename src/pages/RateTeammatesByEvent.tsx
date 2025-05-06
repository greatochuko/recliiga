import { fetchEventById } from "@/api/events";
import FullScreenLoader from "@/components/FullScreenLoader";
import PageHeader from "@/components/PageHeader";
import { RatingDialog } from "@/components/rating/RatingDialog";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { getUnratedTeammates } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeftIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function RateTeammatesByEvent() {
  const { user } = useAuth();
  const [teammates, setTeammates] = useState([]);

  const { eventId } = useParams();
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: [`event-${eventId}`],
    queryFn: () => fetchEventById(eventId),
  });

  const event = data?.data;

  useEffect(() => {
    if (event) {
      setTeammates(getUnratedTeammates(event, user.id));
    }
  }, [event, user.id]);

  if (isLoading) {
    return <FullScreenLoader />;
  }

  function navigateBack() {
    navigate(-1);
  }

  if (!event) {
    return (
      <div className="flex w-full flex-col items-center justify-center px-4 text-center">
        <h1 className="text-4xl font-bold text-gray-800">Event Not Found</h1>
        <p className="mt-4 text-gray-600">
          The event you are looking for does not exist or has been removed.
        </p>
        <button
          onClick={navigateBack}
          className="mt-6 flex items-center gap-1 rounded-md bg-accent-orange px-4 py-2 text-sm font-medium text-white hover:bg-accent-orange/90"
        >
          <ArrowLeftIcon className="h-5 w-5" />
          Go Back
        </button>
      </div>
    );
  }

  return (
    <main className="flex flex-1 flex-col gap-4">
      <PageHeader title="Rate Teammates" />

      {teammates.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {teammates.map((player) => (
            <RatingDialog
              key={player.id}
              player={player}
              eventId={event.id}
              setTeammates={setTeammates}
            />
          ))}
        </div>
      ) : (
        <div className="py-12 text-center">
          <h2 className="mb-4 text-2xl font-bold text-accent-orange">
            All Teammates Rated!
          </h2>
          <p className="mb-6 text-gray-600">
            Thank you for providing feedback on all your teammates. Your input
            is valuable for improving team performance.
          </p>
          <Button
            className="rounded-lg bg-accent-orange px-6 py-3 text-lg font-bold text-white hover:bg-[#E66C00]"
            onClick={() => navigate("/")}
          >
            Return to Dashboard
          </Button>
        </div>
      )}
    </main>
  );
}
