import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number;
  onRatingChange?: (rating: number) => void;
  displayValue?: boolean;
  size?: "sm" | "md" | "lg";
}

export function StarRating({
  rating,
  onRatingChange,
  displayValue = false,
  size = "md",
}: StarRatingProps) {
  const sizeClass = {
    sm: "w-4 h-4",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  };

  // Only render the clickable version when onRatingChange is provided
  if (onRatingChange) {
    return (
      <div className="flex justify-center space-x-4">
        {[1, 2, 3].map((star) => (
          <div
            key={star}
            className={`relative ${sizeClass[size]} cursor-pointer`}
            onClick={() => onRatingChange(star)}
          >
            <Star className={`${sizeClass[size]} absolute text-gray-300`} />
            <div
              className="absolute inset-0 overflow-hidden"
              style={{
                width:
                  rating >= star
                    ? "100%"
                    : rating > star - 1
                      ? `${(rating % 1) * 100}%`
                      : "0%",
              }}
            >
              <Star
                className={`${sizeClass[size]} text-accent-orange`}
                fill="#FF7A00"
              />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Otherwise render the display-only version
  return (
    <div className="flex items-center gap-1">
      {displayValue && (
        <span className="text-accent-orange font-medium">
          {rating.toFixed(2)}
        </span>
      )}
      <Star className="fill-accent-orange text-accent-orange h-4 w-4" />
    </div>
  );
}
