import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

function StarRating({ rating, onRatingChange }) {
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

function RatingDialog({ player, onRatingSubmit }) {
  const [rating, setRating] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const handleRatingChange = (newRating) => {
    setRating(newRating);
  };

  const handleSubmit = (e) => {
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

export default function RateTeammates() {
  const navigate = useNavigate();
  
  const [players, setPlayers] = useState([
    { id: 1, name: 'John Smith', position: 'Midfielder', avatar: '/placeholder.svg?height=32&width=32' },
    { id: 2, name: 'Emma Johnson', position: 'Forward', avatar: '/placeholder.svg?height=32&width=32' },
    { id: 3, name: 'Michael Brown', position: 'Defender', avatar: '/placeholder.svg?height=32&width=32' },
    { id: 4, name: 'Sarah Davis', position: 'Goalkeeper', avatar: '/placeholder.svg?height=32&width=32' },
    { id: 5, name: 'David Wilson', position: 'Midfielder', avatar: '/placeholder.svg?height=32&width=32' },
    { id: 6, name: 'Lisa Anderson', position: 'Forward', avatar: '/placeholder.svg?height=32&width=32' },
    { id: 7, name: 'Robert Taylor', position: 'Defender', avatar: '/placeholder.svg?height=32&width=32' },
    { id: 8, name: 'Jennifer Martinez', position: 'Midfielder', avatar: '/placeholder.svg?height=32&width=32' },
  ]);

  const handleRatingSubmit = (playerId) => {
    setPlayers(players.filter(player => player.id !== playerId));
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1 bg-background relative pt-10">
          <div className="absolute top-4 left-4 z-50">
            <SidebarTrigger className="bg-white shadow-md" />
          </div>
          
          <div className="max-w-4xl mx-auto p-4">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-lg font-semibold">Rate Your Teammates</h1>
              <Button 
                variant="ghost" 
                className="text-[#FF7A00] hover:text-[#FF7A00] hover:bg-transparent p-0 hover:underline"
                onClick={() => navigate(-1)}
              >
                Previous
              </Button>
            </div>
            {players.length > 0 ? (
              <>
                <p className="text-gray-600 mb-6">Click on the player or star icons to rate your teammates' performance.</p>
                <div className="grid grid-cols-2 gap-2">
                  {players.map((player) => (
                    <RatingDialog 
                      key={player.id} 
                      player={player} 
                      onRatingSubmit={handleRatingSubmit}
                    />
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <h2 className="text-2xl font-bold text-[#FF7A00] mb-4">All Teammates Rated!</h2>
                <p className="text-gray-600 mb-6">Thank you for providing feedback on all your teammates. Your input is valuable for improving team performance.</p>
                <Button 
                  className="bg-[#FF7A00] hover:bg-[#E66C00] text-white font-bold py-3 px-6 rounded-lg text-lg"
                  onClick={() => navigate('/')}
                >
                  Return to Dashboard
                </Button>
              </div>
            )}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
