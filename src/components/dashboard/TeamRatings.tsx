import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import { StarRating } from "./StarRating";

export const TeamRatings = () => {
  return (
    <div className="flex h-full flex-col">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-bold">Rate Your Teammates</h2>
        <Button
          variant="link"
          className="text-accent-orange hover:text-accent-orange/90"
        >
          View all
        </Button>
      </div>
      <div className="grid flex-grow grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((teammate) => (
          <div
            key={teammate}
            className="flex items-center justify-between rounded-lg border border-gray-100 bg-white p-3 shadow-sm"
          >
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100">
                <User className="h-4 w-4 text-gray-400" />
              </div>
              <div>
                <h3 className="text-sm font-semibold">Player {teammate}</h3>
                <p className="text-xs text-gray-500">Midfielder</p>
              </div>
            </div>
            <StarRating rating={3} />
          </div>
        ))}
      </div>
    </div>
  );
};
