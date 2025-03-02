
import { useState } from 'react';
import { Star } from 'lucide-react';
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

interface Player {
  id: number;
  name: string;
  position: string;
  avatar: string;
}

interface RatingDialogProps {
  player: Player;
  onRatingSubmit: (playerId: number) => void;
}

export function RatingDialog({ player, onRatingSubmit }: RatingDialogProps) {
  const [rating, setRating] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const handleRatingChange = (newRating: number) => {
    setRating(newRating);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Rating for', player.name, ':', rating);
    onRatingSubmit(player.id);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Card 
          className="overflow-hidden cursor-pointer hover:bg-gray-50 transition-colors"
          onClick={() => setIsOpen(true)}
        >
          <CardContent className="p-2 flex items-center justify-between">
            <div className="flex items-center">
              <Avatar className="w-8 h-8">
                <AvatarImage src={player.avatar} alt={player.name} />
                <AvatarFallback>{player.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <div className="ml-2">
                <p className="text-xs font-medium truncate w-20">{player.name}</p>
                <p className="text-[10px] text-gray-500">{player.position}</p>
              </div>
            </div>
            <div className="bg-[#FF7A00] px-1 py-0.5 rounded flex items-center rating-btn-area">
              {[1, 2, 3].map((star) => <Star key={star} className="w-3 h-3 text-white" fill="white" />)}
            </div>
          </CardContent>
        </Card>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Rate Your Teammate</DialogTitle>
          <DialogDescription>How would you rate {player.name}'s performance?</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center justify-center">
            <Avatar className="w-24 h-24">
              <AvatarImage src={player.avatar} alt={`${player.name} avatar`} />
              <AvatarFallback>{player.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
          </div>
          <h2 className="text-xl font-semibold text-center">{player.name}</h2>
          <p className="text-center text-gray-600">{player.position}</p>
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
                className="bg-[#FF7A00] hover:bg-[#E66C00] text-white font-bold py-3 px-6 rounded-lg text-lg"
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
