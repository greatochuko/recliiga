
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProfileHeaderProps {
  isEditing: boolean;
  onEdit: () => void;
  onClose: () => void;
  loading: boolean;
}

export function ProfileHeader({ isEditing, onEdit, onClose, loading }: ProfileHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-8">
      <h1 className="text-2xl font-semibold text-gray-900">Profile</h1>
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          onClick={onEdit}
          disabled={loading}
          className="text-[#FF7A00] border-[#FF7A00] hover:bg-orange-50"
        >
          {isEditing ? 'Save' : 'Edit'}
        </Button>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
          aria-label="Close"
        >
          <X className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
}
