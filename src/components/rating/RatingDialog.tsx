import { useState } from "react";
import { Star, XIcon } from "lucide-react";
import { StarRating } from "./StarRating";
import { UserType } from "@/contexts/AuthContext";
import ModalContainer from "../ModalContainer";
import { Link } from "react-router-dom";
import { rateTeammate } from "@/api/events";

interface RatingDialogProps {
  eventId: string;
  player: UserType;
  setTeammates: React.Dispatch<React.SetStateAction<any[]>>;
}

export function RatingDialog({
  eventId,
  player,
  setTeammates,
}: RatingDialogProps) {
  const [rating, setRating] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRatingChange = (newRating: number) => {
    setRating(newRating);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await rateTeammate(eventId, player.id, rating);
    if (!error) {
      setTeammates((prev) => prev.filter((tm) => tm.id !== player.id));
      setIsOpen(false);
    }
    setLoading(false);
  };

  return (
    <>
      {/* Trigger Card */}
      <div
        className="cursor-pointer overflow-hidden rounded-lg border border-neutral-100 bg-white shadow-sm transition-colors hover:bg-neutral-50"
        onClick={() => setIsOpen(true)}
      >
        <div className="flex items-center justify-between p-2">
          <div className="flex items-center">
            {player.avatar_url ? (
              <img
                src={player.avatar_url}
                alt={player.full_name}
                className="h-10 w-10 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-200 text-neutral-600">
                {player.full_name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
            )}
            <div className="ml-2">
              <p className="font-medium">{player.full_name}</p>
              <p className="text-xs text-neutral-500">{player.positions[0]}</p>
            </div>
          </div>
          <div className="flex items-center rounded bg-orange-500 px-1 py-0.5">
            {[1, 2, 3].map((star) => (
              <Star key={star} className="h-3 w-3 text-white" fill="white" />
            ))}
          </div>
        </div>
      </div>

      {/* Dialog Modal */}
      <ModalContainer open={isOpen} closeModal={() => setIsOpen(false)}>
        <div className="relative w-[90%] max-w-md rounded-lg bg-white p-6 shadow-lg">
          <div className="mb-4 text-center">
            <h2 className="text-2xl font-bold">Rate Your Teammate</h2>
            <p className="mt-2 text-neutral-500">
              How would you rate {player.full_name}'s performance?
            </p>
          </div>

          <div className="flex flex-col items-center gap-4 py-4">
            {player.avatar_url ? (
              <img
                src={player.avatar_url}
                alt={player.full_name}
                className="h-24 w-24 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-neutral-200 text-3xl text-neutral-600">
                {player.full_name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
            )}
            <Link
              to={`/profile/${player.id}`}
              className="text-xl font-semibold hover:text-accent-orange hover:underline"
            >
              {player.full_name}
            </Link>
            <p className="text-neutral-600">{player.positions[0]}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col items-center space-y-4">
              <StarRating rating={rating} onRatingChange={handleRatingChange} />
              <input
                type="range"
                min={0}
                max={3}
                step={0.5}
                value={rating}
                onChange={(e) => handleRatingChange(parseFloat(e.target.value))}
                className="w-48 accent-neutral-800"
              />
            </div>
            <div className="flex justify-center">
              <button
                type="submit"
                disabled={loading}
                className="rounded-lg bg-accent-orange px-6 py-3 text-lg font-bold text-white transition-colors hover:bg-accent-orange/90 disabled:bg-accent-orange/50"
              >
                Submit Rating
              </button>
            </div>
          </form>

          {/* Close Button */}
          <button
            className="absolute right-4 top-4 p-1 text-neutral-400 duration-200 hover:text-neutral-600"
            onClick={() => setIsOpen(false)}
          >
            <XIcon className="h-4 w-4" />
          </button>
        </div>
      </ModalContainer>
    </>
  );
}
