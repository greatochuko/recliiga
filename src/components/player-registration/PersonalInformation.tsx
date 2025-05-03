import { PlayerProfile } from "@/pages/PlayerRegistration";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Upload } from "lucide-react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";

interface PersonalInfoProps {
  playerData: PlayerProfile;
  updatePlayerData: (data: Partial<PlayerProfile>) => void;
  handleChangeProfileImage: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function PersonalInformation({
  playerData,
  updatePlayerData,
  handleChangeProfileImage,
}: PersonalInfoProps) {
  const [dobMonth, setDobMonth] = useState(
    playerData.dateOfBirth
      ? (new Date(playerData.dateOfBirth).getMonth() + 1).toString()
      : "",
  );
  const [dobDay, setDobDay] = useState(
    playerData.dateOfBirth
      ? new Date(playerData.dateOfBirth).getDate().toString()
      : "",
  );
  const [dobYear, setDobYear] = useState(
    playerData.dateOfBirth
      ? new Date(playerData.dateOfBirth).getFullYear().toString()
      : "",
  );

  useEffect(() => {
    const updateDateOfBirth = () => {
      if (dobMonth && dobDay && dobYear) {
        const date = new Date(
          parseInt(dobYear),
          parseInt(dobMonth) - 1,
          parseInt(dobDay),
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
        <CardTitle className="text-center text-2xl font-semibold text-gray-800">
          Personal Information
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-8 flex flex-col items-center">
          <div className="relative mb-4 h-32 w-32 rounded-full border-2 border-black p-1">
            <Avatar className="h-full w-full">
              <AvatarImage
                src={playerData.avatar_url || "/placeholder.svg"}
                alt="Player avatar"
                className="object-cover"
              />
              <AvatarFallback>PA</AvatarFallback>
            </Avatar>
            <div className="absolute bottom-0 right-0 rounded-full bg-black p-2 text-white shadow-lg">
              <Upload size={16} />
            </div>
          </div>
          <label
            htmlFor="playerImage"
            className="cursor-pointer rounded-md px-4 py-2 text-sm font-medium text-accent-orange duration-200 hover:bg-accent-orange/10"
          >
            Upload photo
          </label>
          <input
            type="file"
            name="playerImage"
            id="playerImage"
            hidden
            onChange={handleChangeProfileImage}
          />
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
            <Label className="mb-2 block text-sm text-gray-700">
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
                  className="w-full cursor-pointer rounded-md border px-3 py-2 text-sm outline-[3px] outline-offset-2 outline-gray-800 focus-visible:outline"
                >
                  <option hidden>Month</option>
                  {Array.from({ length: 12 }, (_, i) => i).map((month) => (
                    <option key={month} value={month.toString()}>
                      {new Date(2000, month, 1).toLocaleString("default", {
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
                  className="w-full cursor-pointer rounded-md border px-3 py-2 text-sm outline-[3px] outline-offset-2 outline-gray-800 focus-visible:outline"
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
                  className="w-full cursor-pointer rounded-md border px-3 py-2 text-sm outline-[3px] outline-offset-2 outline-gray-800 focus-visible:outline"
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
