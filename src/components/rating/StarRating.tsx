
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  onRatingChange: (rating: number) => void;
}

export function StarRating({ rating, onRatingChange }: StarRatingProps) {
  return (
    <div className="flex justify-center space-x-4">
      {[1, 2, 3].map((star) => (
        <div
          key={star}
          className="relative w-12 h-12 cursor-pointer"
          onClick={() => onRatingChange(star)}
        >
          <Star className="w-12 h-12 text-gray-300 absolute" />
          <div
            className="absolute inset-0 overflow-hidden"
            style={{
              width:
                rating >= star
                  ? '100%'
                  : rating > star - 1
                  ? `${((rating % 1) * 100)}%`
                  : '0%',
            }}
          >
            <Star className="w-12 h-12 text-[#FF7A00]" fill="#FF7A00" />
          </div>
        </div>
      ))}
    </div>
  );
}
