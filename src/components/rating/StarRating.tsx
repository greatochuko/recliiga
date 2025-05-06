import { useState } from "react";
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
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  const sizeClass = {
    sm: "w-4 h-4",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  };

  const activeRating = hoverRating ?? rating;

  if (onRatingChange) {
    return (
      <div className="flex justify-center">
        {[1, 2, 3].map((star) => {
          const fillPercentage =
            activeRating >= star ? 100 : activeRating >= star - 0.5 ? 50 : 0;

          const isHoveredStar =
            hoverRating !== null &&
            (hoverRating === star || hoverRating === star - 0.5);

          return (
            <div
              key={star}
              className={`relative ${sizeClass[size]} cursor-pointer`}
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const newHoverRating = x < rect.width / 2 ? star - 0.5 : star;
                setHoverRating(newHoverRating);
              }}
              onMouseLeave={() => setHoverRating(null)}
              onClick={() => onRatingChange(hoverRating ?? star)}
            >
              <Star className={`${sizeClass[size]} absolute text-gray-300`} />
              <div
                className="absolute inset-0 overflow-hidden"
                style={{
                  width: `${fillPercentage}%`,
                }}
              >
                <Star
                  className={`${sizeClass[size]} ${
                    isHoveredStar ? "text-[#FFA94D]" : "text-accent-orange"
                  }`}
                  fill={isHoveredStar ? "#FFA94D" : "#FF7A00"}
                />
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1">
      {displayValue && (
        <span className="font-medium text-accent-orange">
          {rating.toFixed(2)}
        </span>
      )}
      <Star className="h-4 w-4 fill-accent-orange text-accent-orange" />
    </div>
  );
}
