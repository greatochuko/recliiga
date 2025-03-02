import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { PlayerProfile } from '@/pages/PlayerRegistration';
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface PersonalInfoStepProps {
  onSubmit: (data: Partial<PlayerProfile>) => void;
  initialData: PlayerProfile;
}

const AVAILABLE_SPORTS = ['Basketball', 'Soccer', 'Volleyball', 'Tennis'];
const AVAILABLE_POSITIONS = {
  'Basketball': ['Point Guard', 'Shooting Guard', 'Small Forward', 'Power Forward', 'Center'],
  'Soccer': ['Goalkeeper', 'Defender', 'Midfielder', 'Forward'],
  'Volleyball': ['Setter', 'Outside Hitter', 'Middle Blocker', 'Libero'],
  'Tennis': ['Singles', 'Doubles'],
};

export default function PersonalInfoStep({ onSubmit, initialData }: PersonalInfoStepProps) {
  const [nickname, setNickname] = useState(initialData.nickname);
  const [city, setCity] = useState(initialData.city);
  const [dateOfBirth, setDateOfBirth] = useState<Date | undefined>(
    initialData.date_of_birth ? new Date(initialData.date_of_birth) : undefined
  );
  const [sports, setSports] = useState<string[]>(initialData.sports || []);
  const [positions, setPositions] = useState<Record<string, string[]>>(initialData.positions || {});
  const [date, setDate] = useState<Date>();
  const [calendarMonth, setCalendarMonth] = useState<Date>(dateOfBirth || new Date());

  const years = Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i);
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const handleSportToggle = (sport: string) => {
    if (sports.includes(sport)) {
      setSports(sports.filter(s => s !== sport));
      const newPositions = { ...positions };
      delete newPositions[sport];
      setPositions(newPositions);
    } else {
      setSports([...sports, sport]);
      setPositions({
        ...positions,
        [sport]: []
      });
    }
  };

  const handlePositionToggle = (sport: string, position: string) => {
    const sportPositions = positions[sport] || [];
    
    if (sportPositions.includes(position)) {
      setPositions({
        ...positions,
        [sport]: sportPositions.filter(p => p !== position)
      });
    } else {
      setPositions({
        ...positions,
        [sport]: [...sportPositions, position]
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nickname || !city || !dateOfBirth || sports.length === 0) {
      return;
    }
    onSubmit({
      nickname,
      city,
      dateOfBirth,
      sports,
      positions,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium" htmlFor="nickname">
          Nickname
        </label>
        <Input
          id="nickname"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          placeholder="How should we call you?"
          required
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">
          Date of Birth
        </label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateOfBirth ? format(dateOfBirth, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <div className="flex gap-2 p-3">
              <Select
                value={calendarMonth.getMonth().toString()}
                onValueChange={(value) => {
                  const newDate = new Date(calendarMonth);
                  newDate.setMonth(parseInt(value));
                  setCalendarMonth(newDate);
                }}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {months.map((month, index) => (
                    <SelectItem key={month} value={index.toString()}>
                      {month}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={calendarMonth.getFullYear().toString()}
                onValueChange={(value) => {
                  const newDate = new Date(calendarMonth);
                  newDate.setFullYear(parseInt(value));
                  setCalendarMonth(newDate);
                }}
              >
                <SelectTrigger className="w-[95px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {years.map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Calendar
              mode="single"
              selected={dateOfBirth}
              onSelect={(date) => setDateOfBirth(date)}
              disabled={(date) =>
                date > new Date() || date < new Date("1900-01-01")
              }
              month={calendarMonth}
              onMonthChange={setCalendarMonth}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium" htmlFor="city">
          City
        </label>
        <Input
          id="city"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Where do you live?"
          required
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">
          Sports
        </label>
        <div className="flex flex-wrap gap-2">
          {AVAILABLE_SPORTS.map((sport) => (
            <Badge
              key={sport}
              variant={sports.includes(sport) ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => handleSportToggle(sport)}
            >
              {sport}
            </Badge>
          ))}
        </div>
      </div>

      {sports.length > 0 && (
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Positions
          </label>
          <div className="flex flex-wrap gap-2">
            {sports.map(sport => (
              <div key={sport} className="w-full">
                <h4 className="text-sm font-medium text-gray-500 mb-2">{sport}</h4>
                <div className="flex flex-wrap gap-2">
                  {AVAILABLE_POSITIONS[sport as keyof typeof AVAILABLE_POSITIONS].map((position) => (
                    <Badge
                      key={position}
                      variant={positions[sport]?.includes(position) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => handlePositionToggle(sport, position)}
                    >
                      {position}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <Button 
        type="submit" 
        className="w-full bg-[#FF7A00] hover:bg-[#FF7A00]/90"
        disabled={!nickname || !city || !dateOfBirth || sports.length === 0}
      >
        Continue
      </Button>
    </form>
  );
}
