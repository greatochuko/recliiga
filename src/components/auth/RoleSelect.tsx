import { Button } from "@/components/ui/button";
import { User, Users } from "lucide-react";

interface RoleSelectProps {
  role: "player" | "organizer" | null;
  onRoleSelect: (role: "player" | "organizer") => void;
}

export default function RoleSelect({ role, onRoleSelect }: RoleSelectProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-800">
        Select Your Role
      </label>
      <div className="flex space-x-4">
        <Button
          type="button"
          variant={role === "organizer" ? "default" : "outline"}
          className={`flex h-20 flex-1 flex-col items-center justify-center ${
            role === "organizer"
              ? "bg-accent-orange hover:bg-accent-orange/90 text-white"
              : ""
          }`}
          onClick={() => onRoleSelect("organizer")}
        >
          <Users className="mb-2 h-6 w-6" />
          League Organizer
        </Button>
        <Button
          type="button"
          variant={role === "player" ? "default" : "outline"}
          className={`flex h-20 flex-1 flex-col items-center justify-center ${
            role === "player"
              ? "bg-accent-orange hover:bg-accent-orange/90 text-white"
              : ""
          }`}
          onClick={() => onRoleSelect("player")}
        >
          <User className="mb-2 h-6 w-6" />
          Player
        </Button>
      </div>
    </div>
  );
}
