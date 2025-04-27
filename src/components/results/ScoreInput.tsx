import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TeamType } from "@/types/events";

interface ScoreInputProps {
  team: TeamType;
  score: number;
  setScore: (score: number) => void;
}

export function ScoreInput({ team, score, setScore }: ScoreInputProps) {
  const handleScoreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newScore = e.target.value;
    setScore(Number(newScore));
  };

  const handleAddScore = (amount: number) => {
    const newScore = (score || 0) + amount;
    setScore(Number(newScore));
  };

  const handleNumberInput = (number: string) => {
    const newScore = score + number;
    setScore(Number(newScore));
  };

  const handleClear = () => {
    setScore(0);
  };

  return (
    <div className="flex flex-1 flex-col items-center space-y-2">
      <Avatar
        className="h-16 w-16 border-2"
        style={{ borderColor: team.color }}
      >
        <AvatarImage src={team.logo} alt={team.name} />
        <AvatarFallback>
          {team.name
            .split(" ")
            .map((n) => n[0])
            .join("")}
        </AvatarFallback>
      </Avatar>
      <span className="text-sm font-semibold">{team.name}</span>
      <Input
        type="number"
        value={score}
        onChange={handleScoreChange}
        className="w-24 text-center"
        min="0"
        required
      />
      <div className="hidden space-x-2 sm:flex">
        <Button
          type="button"
          onClick={() => handleAddScore(2)}
          size="sm"
          variant="outline"
        >
          +2
        </Button>
        <Button
          type="button"
          onClick={() => handleAddScore(3)}
          size="sm"
          variant="outline"
        >
          +3
        </Button>
        <Button
          type="button"
          onClick={() => handleAddScore(10)}
          size="sm"
          variant="outline"
        >
          +10
        </Button>
      </div>
      <div className="hidden grid-cols-5 gap-1 sm:grid">
        {["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"].map((num) => (
          <Button
            key={num}
            type="button"
            onClick={() => handleNumberInput(num)}
            size="sm"
            variant="outline"
          >
            {num}
          </Button>
        ))}
      </div>

      <Button
        type="button"
        onClick={handleClear}
        size="sm"
        variant="outline"
        className="hidden w-full sm:block"
      >
        Clear
      </Button>
    </div>
  );
}
