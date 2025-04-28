import { fetchEventById } from "@/api/events";
import FullScreenLoader from "@/components/FullScreenLoader";
import { RatingDialog } from "@/components/rating/RatingDialog";
import { Button } from "@/components/ui/button";
import { UserType } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeftIcon, ChevronLeftIcon } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

export default function RateTeammatesByEvent() {
  const { eventId } = useParams();

  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: [`event-${eventId}`],
    queryFn: () => fetchEventById(eventId),
  });

  const event = data?.data;

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

  function handleRatingSubmit(player: UserType) {
    console.log("Rating submitted for player:", player.full_name);
  }

  return (
    <main className="flex flex-1 flex-col gap-4">
      <div className="flex items-center justify-between pl-8">
        <h1 className="text-2xl font-bold">Rate Teammates for {event.title}</h1>
        <Button
          variant="link"
          size="sm"
          className="text-accent-orange"
          onClick={navigateBack}
        >
          <ChevronLeftIcon className="mr-1 h-4 w-4" />
          Previous
        </Button>
      </div>
      {event.players.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {event.players.map((player) => (
            <RatingDialog
              key={player.id}
              player={player}
              onRatingSubmit={() => handleRatingSubmit(player)}
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
