import { CalendarIcon, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LeagueDataType } from "@/api/league";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format, isBefore, startOfDay } from "date-fns";
import React from "react";

const sportsList = [
  "American Football",
  "Soccer",
  "Aussie Rules Football",
  "Baseball",
  "Basketball",
  "Cricket",
  "Field Hockey",
  "Futsal",
  "Gaelic Football",
  "Handball",
  "Hurling",
  "Ice Hockey",
  "Inline Hockey",
  "Korfball",
  "Lacrosse",
  "Netball",
  "Polo",
  "Rugby",
  "Sepak Takraw",
  "Ultimate Frisbee",
  "Volleyball",
  "Water Polo",
];

export function LeagueInfoStep({
  leagueData,
  updateLeagueData,
  handleChangeLeagueImage,
}: {
  leagueData: LeagueDataType;
  updateLeagueData: (newData: Partial<LeagueDataType>) => void;
  handleChangeLeagueImage: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  const sports = [...sportsList].sort((a, b) => a.localeCompare(b));

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="text-center text-2xl font-semibold text-gray-800">
          League Information
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-8 flex flex-col items-center">
          <div className="relative mb-4 h-32 w-32 rounded-full border-2 border-black p-1">
            <Avatar className="h-full w-full">
              <AvatarImage
                src={leagueData.image || "/placeholder.svg"}
                alt="League avatar"
              />
              <AvatarFallback>LA</AvatarFallback>
            </Avatar>
            <div className="absolute bottom-0 right-0 rounded-full bg-black p-2 text-white shadow-lg">
              <Upload size={16} />
            </div>
          </div>
          <label
            htmlFor="leagueImage"
            className="cursor-pointer rounded-md px-4 py-2 text-sm font-medium text-accent-orange duration-200 hover:bg-accent-orange/10"
          >
            Upload photo
          </label>
          <input
            type="file"
            name="leagueImage"
            id="leagueImage"
            hidden
            onChange={handleChangeLeagueImage}
          />
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="leagueName" className="text-gray-800">
              League Name
            </Label>
            <Input
              id="leagueName"
              value={leagueData.name}
              onChange={(e) => updateLeagueData({ name: e.target.value })}
              placeholder="Enter league name"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="sport" className="text-gray-800">
              Select Sport
            </Label>
            <select
              name="sport"
              id="sport"
              className="mt-1 block h-10 w-full rounded-md border p-2 text-sm outline-offset-4"
              value={leagueData.sport}
              onChange={(e) => updateLeagueData({ sport: e.target.value })}
            >
              <option hidden>Select a sport</option>
              {sports.map((sport) => (
                <option key={sport} value={sport}>
                  {sport}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="flex-1">
              <Label htmlFor="city" className="text-gray-800">
                City
              </Label>
              <Input
                id="city"
                type="text"
                value={leagueData.city}
                onChange={(e) => updateLeagueData({ city: e.target.value })}
                className="mt-1"
              />
            </div>

            <div className="flex-1">
              <Label htmlFor="leagueDate" className="text-gray-800">
                Start Date
              </Label>
              {/* <Input
                id="leagueDate"
                type="date"
                value={leagueData.date}
                onChange={(e) => updateLeagueData({ date: e.target.value })}
                className="mt-1"
              /> */}

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="date"
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !leagueData.date && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {leagueData.date ? (
                      format(leagueData.date, "MMM dd yyyy")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={new Date(leagueData.date)}
                    onSelect={(date) =>
                      updateLeagueData({ date: date.toDateString() })
                    }
                    disabled={(date) => isBefore(date, startOfDay(new Date()))}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div>
            <Label className="text-gray-800">Privacy Setting</Label>
            <RadioGroup
              value={leagueData.is_private ? "private" : "public"}
              onValueChange={(value) =>
                updateLeagueData({ is_private: value === "private" })
              }
              className="mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="public" id="public" />
                <Label htmlFor="public" className="text-gray-600">
                  Public (Anyone can join)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="private" id="private" />
                <Label htmlFor="private" className="text-gray-600">
                  Private (Requires approval to join)
                </Label>
              </div>
            </RadioGroup>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
