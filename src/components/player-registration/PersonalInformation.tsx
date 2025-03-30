import { PlayerProfile } from "@/pages/PlayerRegistration";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Upload } from "lucide-react";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";

interface PersonalInfoProps {
  playerData: PlayerProfile;
  updatePlayerData: (data: Partial<PlayerProfile>) => void;
}

export default function PersonalInformation({
  playerData,
  updatePlayerData,
}: PersonalInfoProps) {
  const [dobMonth, setDobMonth] = useState("");
  const [dobDay, setDobDay] = useState("");
  const [dobYear, setDobYear] = useState("");

  useEffect(() => {
    const updateDateOfBirth = () => {
      if (dobMonth && dobDay && dobYear) {
        const date = new Date(
          parseInt(dobYear),
          parseInt(dobMonth) - 1,
          parseInt(dobDay)
        );
        updatePlayerData({ dateOfBirth: date });
      }
    };
    updateDateOfBirth();
  }, [dobMonth, dobDay, dobYear, updatePlayerData]);

  const generateYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let year = currentYear; year >= currentYear - 100; year--) {
      years.push(year.toString());
    }
    return years;
  };

  const generateDayOptions = () => {
    const days = [];
    const maxDay =
      dobMonth === "2"
        ? parseInt(dobYear) % 4 === 0
          ? 29
          : 28
        : ["4", "6", "9", "11"].includes(dobMonth)
        ? 30
        : 31;

    if (!dobMonth) return [];

    for (let day = 1; day <= maxDay; day++) {
      days.push(day.toString().padStart(2, "0"));
    }
    return days;
  };

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-center text-gray-800">
          Personal Information
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center mb-8">
          <div className="w-32 h-32 mb-4 relative rounded-full border-2 border-black p-1">
            <Avatar className="w-full h-full">
              <AvatarImage src="/placeholder.svg" alt="Player avatar" />
              <AvatarFallback>PA</AvatarFallback>
            </Avatar>
            <div className="absolute bottom-0 right-0 bg-black text-white rounded-full p-2 shadow-lg">
              <Upload size={16} />
            </div>
          </div>
          <Button
            variant="link"
            className="text-sm text-[#FF7A00] hover:underline"
          >
            Upload photo
          </Button>
        </div>

        <div className="space-y-6">
          <div>
            <Label htmlFor="nickname" className="text-sm text-gray-700">
              Nickname
            </Label>
            <Input
              id="nickname"
              value={playerData.nickname}
              onChange={(e) => updatePlayerData({ nickname: e.target.value })}
              placeholder="Enter your nickname"
              className="mt-1"
            />
          </div>

          <div>
            <Label className="text-sm text-gray-700 mb-2 block">
              Date of Birth
            </Label>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="dobMonth" className="sr-only">
                  Month
                </Label>
                <select
                  name="dobMonth"
                  id="dobMonth"
                  value={dobMonth}
                  onChange={(e) => setDobMonth(e.target.value)}
                  className="py-2 px-3 text-sm border rounded-md outline-offset-[4px] w-full cursor-pointer"
                >
                  <option hidden>Month</option>
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                    <option
                      key={month}
                      value={month.toString().padStart(2, "0")}
                    >
                      {new Date(2000, month - 1, 1).toLocaleString("default", {
                        month: "long",
                      })}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="dobDay" className="sr-only">
                  Day
                </Label>
                <select
                  name="dobDay"
                  id="dobDay"
                  value={dobDay}
                  onChange={(e) => setDobDay(e.target.value)}
                  className="py-2 px-3 text-sm border rounded-md outline-offset-[4px] w-full cursor-pointer"
                >
                  <option hidden>Day</option>
                  {generateDayOptions().map((day) => (
                    <option key={day} value={day}>
                      {day}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="dobYear" className="sr-only">
                  Year
                </Label>
                <select
                  name="dobYear"
                  id="dobYear"
                  value={dobYear}
                  onChange={(e) => setDobYear(e.target.value)}
                  className="py-2 px-3 text-sm border rounded-md outline-offset-[4px] w-full cursor-pointer"
                >
                  <option hidden>Year</option>
                  {generateYearOptions().map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="city" className="text-sm text-gray-700">
              City
            </Label>
            <Input
              id="city"
              value={playerData.city}
              onChange={(e) => updatePlayerData({ city: e.target.value })}
              placeholder="Enter your city"
              className="mt-1"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
