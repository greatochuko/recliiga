import { Button } from "@/components/ui/button";

interface ProfileHeaderProps {
  isEditing: boolean;
  onEdit: () => void;
  loading: boolean;
}

export function ProfileHeader({
  isEditing,
  onEdit,
  loading,
}: ProfileHeaderProps) {
  return (
    <div className="mb-8 flex items-center justify-between">
      <h1 className="text-2xl font-semibold text-gray-900">Profile</h1>
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          onClick={onEdit}
          disabled={loading}
          className="border-accent-orange text-accent-orange hover:bg-orange-50 hover:text-accent-orange"
        >
          {isEditing ? (loading ? "Saving..." : "Save") : "Edit"}
        </Button>
      </div>
    </div>
  );
}
