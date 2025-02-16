
import { Star } from "lucide-react";

export const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex">
      {[1, 2, 3].map((star) => (
        <Star
          key={star}
          className={`h-6 w-6 ${star <= rating ? "text-[#FF7A00] fill-current" : "text-gray-300"}`}
        />
      ))}
    </div>
  );
};
