import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import FullScreenLoader from "@/components/FullScreenLoader";
import { fetchEventsByUser } from "@/api/events";
import { getPastEvents } from "@/lib/utils";
import EventRatingCard from "@/components/events/EventRatingCard";
import { ChevronLeftIcon } from "lucide-react";

export default function RateTeammates() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const {
    data: { data: events },
    isLoading,
  } = useQuery({
    queryKey: ["upcomingEvents"],
    queryFn: fetchEventsByUser,
    initialData: { data: [], error: null },
  });

  const pastEvents = getPastEvents(events);

  const eventsToRate = pastEvents.filter((event) =>
    event.players.some((player) => player.id === user.id),
  );

  if (isLoading) {
    return <FullScreenLoader />;
  }

  const handleBackClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate(-1);
  };

  return (
    <main className="flex flex-1 flex-col gap-4">
      <div className="flex items-center justify-between pl-8">
        <h1 className="text-2xl font-bold">Rate Teammates</h1>
        <Button
          variant="link"
          size="sm"
          className="text-accent-orange"
          onClick={handleBackClick}
        >
          <ChevronLeftIcon className="mr-1 h-4 w-4" />
          Previous
        </Button>
      </div>

      {eventsToRate.length > 0 ? (
        <>
          <p className="text-gray-600">
            Click on the player or star icons to rate your teammates'
            performance.
          </p>
          <div className="grid grid-cols-2 gap-4">
            {eventsToRate.map((event) => (
              <EventRatingCard key={event.id} event={event} />
            ))}
          </div>
        </>
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
