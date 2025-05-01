import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchEventsByUser } from "@/api/events";
import FullScreenLoader from "../FullScreenLoader";
import { getPastEvents, getUnratedTeammates } from "@/lib/utils";
import EventRatingCard from "../events/EventRatingCard";

export default function RatingSection() {
  const { user } = useAuth();

  const {
    data: { data: events },
    isLoading,
  } = useQuery({
    queryKey: ["upcomingEvents"],
    queryFn: fetchEventsByUser,
    initialData: { data: [], error: null },
  });

  const pastEvents = getPastEvents(events);

  const eventsToRate = pastEvents.filter(
    (event) =>
      event.resultsEntered &&
      event.players.some((player) => player.id === user.id) &&
      getUnratedTeammates(event, user.id).length > 0,
  );

  return (
    <div className="flex h-full flex-col">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold">Rate Your Teammates</h2>
        <Link
          to="/rate-teammates"
          className="text-sm text-accent-orange hover:underline"
        >
          View all
        </Link>
      </div>
      {isLoading ? (
        <div className="py-8">
          <FullScreenLoader />
        </div>
      ) : eventsToRate.length > 0 ? (
        <ul className="grid gap-4 sm:grid-cols-2">
          {eventsToRate.map((event) => (
            <EventRatingCard key={event.id} event={event} />
          ))}
        </ul>
      ) : (
        <div className="flex items-center justify-center p-6">
          <p className="text-gray-500">No teammates found.</p>
        </div>
      )}
    </div>
  );
}
