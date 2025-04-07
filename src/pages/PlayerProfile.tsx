import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, MessageCircle } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function PlayerProfile() {
  const navigate = useNavigate();

  const [profileData, setProfileData] = useState({
    fullName: "John Doe",
    city: "New Jersey",
    rating: 2.75, // Example rating between 0.50 and 3.00
    timesRated: 42,
  });

  const [leagues, setLeagues] = useState([
    {
      id: "premier",
      name: "Premier League",
      rank: 8,
      totalPlayers: 15,
      stats: { won: 4, loss: 2, tied: 2, points: 15 },
      rating: 2.75,
    },
    {
      id: "division1",
      name: "Division 1",
      rank: 3,
      totalPlayers: 12,
      stats: { won: 6, loss: 1, tied: 1, points: 20 },
      rating: 2.9,
    },
    {
      id: "casual",
      name: "Casual League",
      rank: 1,
      totalPlayers: 8,
      stats: { won: 5, loss: 0, tied: 0, points: 15 },
      rating: 3.0,
    },
  ]);

  const [selectedLeague, setSelectedLeague] = useState(leagues[0]);

  function PlayerRankCard({ league }) {
    return (
      <Card className="bg-accent-orange flex h-full w-full flex-col justify-between text-white">
        <CardContent className="flex h-full flex-col items-center justify-between p-3">
          <div className="flex w-full flex-col items-center">
            <h2 className="mb-3 text-lg font-bold">{league.name}</h2>
            <Avatar className="mb-3 h-24 w-24">
              <AvatarImage
                src="/placeholder.svg?height=96&width=96"
                alt="Player avatar"
              />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <h3 className="mb-2 text-sm font-semibold">
              {profileData.fullName}
            </h3>
          </div>
          <div className="flex flex-col items-center">
            <div className="flex items-start">
              <div className="flex items-start">
                <span className="text-xl font-bold">{league.rank}</span>
                <span className="mt-0.5 text-xs font-bold">th</span>
              </div>
              <span className="ml-0.5 text-xl font-bold">
                /{league.totalPlayers}
              </span>
            </div>
            <span className="mt-1 text-xs">{league.name}</span>
            <div className="mt-2 flex items-center">
              <span className="text-lg font-bold">
                {league.rating.toFixed(2)}
              </span>
              <Star className="ml-1 h-4 w-4 fill-white" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  function RecordBox({ stats }) {
    const recordData = [
      { name: "Won", value: stats.won, color: "#009262" },
      { name: "Loss", value: stats.loss, color: "#E43226" },
      { name: "Tied", value: stats.tied, color: "#FF7A00" },
    ];

    const [activeIndex, setActiveIndex] = useState(null);

    const onPieEnter = (_, index) => {
      setActiveIndex(index);
    };

    return (
      <Card className="h-full w-full border border-gray-200">
        <CardContent className="flex h-full flex-col justify-between p-3">
          <h3 className="mb-2 text-sm font-semibold">Record</h3>
          <div className="flex flex-grow flex-col items-center justify-center">
            <div className="relative mb-2 h-[140px] w-[140px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={recordData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={55}
                    paddingAngle={2}
                    dataKey="value"
                    onMouseEnter={onPieEnter}
                  >
                    {recordData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.color}
                        stroke={activeIndex === index ? "white" : "none"}
                        strokeWidth={2}
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex flex-col items-center justify-center">
                  <span className="text-xl font-bold leading-none">
                    {stats.points}
                  </span>
                  <span className="mt-1 text-xs leading-none">PTS</span>
                </div>
              </div>
            </div>
            <div className="mt-2 flex justify-center space-x-2">
              {recordData.map((item, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div
                    className="mb-1 flex h-5 w-8 items-center justify-center rounded text-xs font-semibold text-white"
                    style={{ backgroundColor: item.color }}
                  >
                    {item.value}
                  </div>
                  <span className="text-[10px]">{item.name}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  function PlayerStats() {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Your Stats</h2>
          <Select
            value={selectedLeague.id}
            onValueChange={(value) =>
              setSelectedLeague(leagues.find((league) => league.id === value))
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select League" />
            </SelectTrigger>
            <SelectContent>
              {leagues.map((league) => (
                <SelectItem key={league.id} value={league.id}>
                  {league.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid h-[calc(100%-2rem)] max-h-[320px] grid-cols-2 gap-4">
          <PlayerRankCard league={selectedLeague} />
          <RecordBox stats={selectedLeague.stats} />
        </div>
      </div>
    );
  }

  return (
    <main className="relative flex-1 bg-background">
      <h1 className="ml-14 text-2xl font-bold">Player Profile</h1>

      <div className="">
        <div className="mx-auto max-w-2xl p-4 md:p-6">
          <div className="mb-6 flex items-center justify-between">
            <Button
              variant="ghost"
              className="text-accent-orange hover:text-accent-orange p-0 hover:bg-transparent hover:underline"
              onClick={() => navigate(-1)}
            >
              ← Previous
            </Button>
          </div>

          <div className="from-accent-orange/10 mb-8 rounded-lg bg-gradient-to-b to-white px-3 pb-3 pt-8 shadow-sm">
            <div className="mb-6 flex flex-col items-center">
              <div className="border-accent-orange relative mb-3 h-32 w-32 rounded-full border-2 bg-white p-1 shadow-lg">
                <Avatar className="h-full w-full">
                  <AvatarImage src="/placeholder.svg" alt="Profile picture" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
              </div>
            </div>
            <div className="text-center">
              <h2 className="mb-1 text-xl font-semibold text-gray-800">
                {profileData.fullName}
              </h2>
              <p className="mb-3 text-base text-gray-600">{profileData.city}</p>
              <Button
                variant="outline"
                className="text-accent-orange border-accent-orange hover:bg-accent-orange transition-colors duration-200 hover:text-white"
                onClick={() =>
                  console.log("Open chat with", profileData.fullName)
                }
              >
                <MessageCircle className="mr-2 h-4 w-4" />
                Message
              </Button>
            </div>
          </div>

          <PlayerStats />
        </div>
      </div>
    </main>
  );
}
