
import { Button } from "@/components/ui/button"
import { User, Users } from 'lucide-react'

interface RoleSelectProps {
  role: 'player' | 'organizer' | null;
  onRoleSelect: (role: 'player' | 'organizer') => void;
}

export default function RoleSelect({ role, onRoleSelect }: RoleSelectProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-800">Select Your Role</label>
      <div className="flex space-x-4">
        <Button
          type="button"
          variant={role === 'organizer' ? 'default' : 'outline'}
          className={`flex-1 flex flex-col items-center justify-center h-20 ${
            role === 'organizer' ? 'bg-[#FF7A00] hover:bg-[#FF7A00]/90 text-white' : ''
          }`}
          onClick={() => onRoleSelect('organizer')}
        >
          <Users className="h-6 w-6 mb-2" />
          League Organizer
        </Button>
        <Button
          type="button"
          variant={role === 'player' ? 'default' : 'outline'}
          className={`flex-1 flex flex-col items-center justify-center h-20 ${
            role === 'player' ? 'bg-[#FF7A00] hover:bg-[#FF7A00]/90 text-white' : ''
          }`}
          onClick={() => onRoleSelect('player')}
        >
          <User className="h-6 w-6 mb-2" />
          Player
        </Button>
      </div>
    </div>
  );
}
