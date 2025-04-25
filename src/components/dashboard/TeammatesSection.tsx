import { UserType } from "@/contexts/AuthContext";
import { UserIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { StarRating } from "./StarRating";

export default function TeammatesSection({
  teammates,
}: {
  teammates: UserType[];
}) {
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
      {teammates.length > 0 ? (
        <ul className="grid gap-4 sm:grid-cols-2">
          {teammates &&
            teammates.slice(0, 8).map((teammate) => (
              <li
                key={teammate.id}
                className="flex items-center justify-between rounded-lg border border-gray-100 bg-white p-3 shadow-sm duration-200 hover:bg-gray-50"
              >
                <div className="flex items-center gap-2">
                  {teammate.avatar_url ? (
                    <img
                      src={teammate.avatar_url}
                      alt={teammate.full_name}
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100">
                      <UserIcon className="h-4 w-4 text-gray-400" />
                    </div>
                  )}
                  <div>
                    <Link
                      to={`/profile/${teammate.id}`}
                      className="text-sm font-semibold hover:underline"
                    >
                      {teammate.full_name}
                    </Link>
                    <p className="text-xs text-gray-500">
                      {teammate.positions[0]}
                    </p>
                  </div>
                </div>
                <StarRating rating={3} />
              </li>
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
