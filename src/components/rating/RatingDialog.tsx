import { useState } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { StarRating } from "./StarRating";
import { UserType } from "@/contexts/AuthContext";

interface RatingDialogProps {
  player: UserType;
  onRatingSubmit: (playerId: string) => void;
}

export function RatingDialog({ player, onRatingSubmit }: RatingDialogProps) {
  const [rating, setRating] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const handleRatingChange = (newRating: number) => {
    setRating(newRating);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onRatingSubmit(player.id);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Card
          className="cursor-pointer overflow-hidden transition-colors hover:bg-gray-50"
          onClick={() => setIsOpen(true)}
        >
          <CardContent className="flex items-center justify-between p-2">
            <div className="flex items-center">
              <Avatar className="h-10 w-10">
                <AvatarImage
                  src={player.avatar_url}
                  alt={player.full_name}
                  className="object-cover"
                />
                <AvatarFallback>
                  {player.full_name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="ml-2">
                <p className="font-medium">{player.full_name}</p>
                <p className="text-xs text-gray-500">{player.positions[0]}</p>
              </div>
            </div>
            <div className="rating-btn-area flex items-center rounded bg-accent-orange px-1 py-0.5">
              {[1, 2, 3].map((star) => (
                <Star key={star} className="h-3 w-3 text-white" fill="white" />
              ))}
            </div>
          </CardContent>
        </Card>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Rate Your Teammate</DialogTitle>
          <DialogDescription>
            How would you rate {player.full_name}'s performance?
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center justify-center">
            <Avatar className="h-24 w-24">
              <AvatarImage
                src={player.avatar_url}
                alt={`${player.full_name} avatar`}
                className="object-cover"
              />
              <AvatarFallback>
                {player.full_name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
          </div>
          <h2 className="text-center text-xl font-semibold">
            {player.full_name}
          </h2>
          <p className="text-center text-gray-600">{player.positions[0]}</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-4">
              <StarRating rating={rating} onRatingChange={handleRatingChange} />
              <div className="flex justify-center">
                <Slider
                  value={[rating]}
                  onValueChange={(value) => handleRatingChange(value[0])}
                  min={0}
                  max={3}
                  step={0.5}
                  className="w-[calc(3*3rem+2*1rem)]"
                />
              </div>
            </div>
            <div className="flex justify-center">
              <Button
                type="submit"
                className="rounded-lg bg-accent-orange px-6 py-3 text-lg font-bold text-white hover:bg-[#E66C00]"
              >
                Submit Rating
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
