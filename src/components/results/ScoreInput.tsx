import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getInitials } from "@/lib/utils";
import { TeamType } from "@/types/events";

interface ScoreInputProps {
  team: TeamType;
  score: string;
  setScore: React.Dispatch<React.SetStateAction<string>>;
}

export function ScoreInput({ team, score, setScore }: ScoreInputProps) {
  const handleScoreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newScore = e.target.value;
    setScore(newScore);
  };

  const handleAddScore = (amount: number) => {
    const newScore = Number(score) + amount;
    setScore(newScore.toString());
  };

  const handleNumberInput = (number: string) => {
    const newScore = score + number;
    setScore(newScore);
  };

  const handleClear = () => {
    setScore("");
  };

  return (
    <div className="flex flex-1 flex-col items-center space-y-2">
      <Avatar
        className="h-16 w-16 border-2"
        style={{ borderColor: team.color }}
      >
        <AvatarImage src={team.logo} alt={team.name} />
        <AvatarFallback>{getInitials(team.name)}</AvatarFallback>
      </Avatar>
      <span className="text-sm font-semibold">{team.name}</span>
      <Input
        type="number"
        value={score}
        onChange={handleScoreChange}
        className="w-24 text-center text-sm sm:text-base"
        min="0"
        required
        placeholder="Score"
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
