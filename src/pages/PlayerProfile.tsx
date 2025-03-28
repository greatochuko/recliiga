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
      <Card className="bg-[#FF7A00] text-white w-full h-full flex flex-col justify-between">
        <CardContent className="p-3 flex flex-col items-center h-full justify-between">
          <div className="flex flex-col items-center w-full">
            <h2 className="text-lg font-bold mb-3">{league.name}</h2>
            <Avatar className="w-24 h-24 mb-3">
              <AvatarImage
                src="/placeholder.svg?height=96&width=96"
                alt="Player avatar"
              />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <h3 className="text-sm font-semibold mb-2">
              {profileData.fullName}
            </h3>
          </div>
          <div className="flex flex-col items-center">
            <div className="flex items-start">
              <div className="flex items-start">
                <span className="text-xl font-bold">{league.rank}</span>
                <span className="text-xs font-bold mt-0.5">th</span>
              </div>
              <span className="text-xl font-bold ml-0.5">
                /{league.totalPlayers}
              </span>
            </div>
            <span className="text-xs mt-1">{league.name}</span>
            <div className="flex items-center mt-2">
              <span className="text-lg font-bold">
                {league.rating.toFixed(2)}
              </span>
              <Star className="w-4 h-4 ml-1 fill-white" />
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
      <Card className="border border-gray-200 w-full h-full">
        <CardContent className="p-3 flex flex-col justify-between h-full">
          <h3 className="text-sm font-semibold mb-2">Record</h3>
          <div className="flex flex-col items-center justify-center flex-grow">
            <div className="h-[140px] w-[140px] relative mb-2">
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
                  <span className="text-xs leading-none mt-1">PTS</span>
                </div>
              </div>
            </div>
            <div className="flex justify-center space-x-2 mt-2">
              {recordData.map((item, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div
                    className="w-8 h-5 flex items-center justify-center text-white text-xs font-semibold mb-1 rounded"
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
        <div className="flex justify-between items-center">
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
        <div className="grid grid-cols-2 gap-4 h-[calc(100%-2rem)] max-h-[320px]">
          <PlayerRankCard league={selectedLeague} />
          <RecordBox stats={selectedLeague.stats} />
        </div>
      </div>
    );
  }

  return (
    <main className="flex-1 bg-background relative">
      <h1 className="ml-14 text-2xl font-bold">Player Profile</h1>

      <div className="">
        <div className="max-w-2xl mx-auto p-4 md:p-6">
          <div className="flex justify-between items-center mb-6">
            <Button
              variant="ghost"
              className="text-[#FF7A00] hover:text-[#FF7A00] hover:bg-transparent p-0 hover:underline"
              onClick={() => navigate(-1)}
            >
              ← Previous
            </Button>
          </div>

          <div className="mb-8 bg-gradient-to-b from-[#FF7A00]/10 to-white pt-8 pb-3 px-3 rounded-lg shadow-sm">
            <div className="flex flex-col items-center mb-6">
              <div className="w-32 h-32 mb-3 relative rounded-full border-2 border-[#FF7A00] p-1 bg-white shadow-lg">
                <Avatar className="w-full h-full">
                  <AvatarImage src="/placeholder.svg" alt="Profile picture" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
              </div>
            </div>
            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-800 mb-1">
                {profileData.fullName}
              </h2>
              <p className="text-base text-gray-600 mb-3">{profileData.city}</p>
              <Button
                variant="outline"
                className="text-[#FF7A00] border-[#FF7A00] hover:bg-[#FF7A00] hover:text-white transition-colors duration-200"
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
