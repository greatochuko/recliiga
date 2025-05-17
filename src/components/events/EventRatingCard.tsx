import { useAuth } from "@/contexts/AuthContext";
import { getInitials, getUnratedTeammates } from "@/lib/utils";
import { EventType } from "@/types/events";
import { MapPinIcon } from "lucide-react";
import { Link } from "react-router-dom";

export default function EventRatingCard({ event }: { event: EventType }) {
  const { user } = useAuth();

  const teammates = getUnratedTeammates(event, user.id);

  return (
    <Link
      key={event.id}
      to={`/dashboard/rate-teammates/${event.id}`}
      className="flex flex-col gap-4 rounded-lg border border-gray-100 bg-white p-4 shadow-sm duration-200 hover:bg-gray-50"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800">{event.title}</h3>
        <span className="text-xs text-gray-500">
          {new Date(event.startTime).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </span>
      </div>

      <div className="flex items-center gap-2 text-sm text-gray-500">
        <MapPinIcon className="h-4 w-4" />
        <span>{event.location}</span>
      </div>
      {/* <p className="mb-4 text-sm text-gray-600">{event.description}</p> */}

      <div className="flex items-center gap-2">
        {teammates.slice(0, 3).map((player) => (
          <div key={player.id} className="relative">
            {player.avatar_url ? (
              <img
                src={player.avatar_url}
                alt={player.full_name}
                className="h-8 w-8 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-8 w-8 items-center justify-center rounded-full border bg-gray-100 text-xs font-medium text-gray-700">
                {getInitials(player.full_name)}
              </div>
            )}
          </div>
        ))}
        {teammates.length > 3 && (
          <span className="text-xs text-gray-500">
            +{teammates.length - 3} more
          </span>
        )}

        <span className="ml-auto self-end text-xs font-semibold text-accent-orange">
          {event.league.name}
        </span>
      </div>
    </Link>
  );
}
