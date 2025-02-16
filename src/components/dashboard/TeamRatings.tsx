
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import { StarRating } from "./StarRating";

export const TeamRatings = () => {
  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Rate Your Teammates</h2>
        <Button variant="link" className="text-[#FF7A00] hover:text-[#FF7A00]/90">
          View all
        </Button>
      </div>
      <div className="grid grid-cols-2 gap-4 flex-grow">
        {[1, 2, 3, 4].map((teammate) => (
          <div
            key={teammate}
            className="bg-white rounded-lg p-3 shadow-sm border border-gray-100 flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-gray-400" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">Player {teammate}</h3>
                <p className="text-gray-500 text-xs">Midfielder</p>
              </div>
            </div>
            <StarRating rating={3} />
          </div>
        ))}
      </div>
    </div>
  );
};
