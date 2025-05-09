import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRef } from "react";
import { getInitials } from "@/lib/utils";

interface ProfileAvatarProps {
  avatarUrl?: string;
  fullName: string;
  isEditing: boolean;
  loading: boolean;
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export function ProfileAvatar({
  avatarUrl,
  fullName,
  isEditing,
  loading,
  onFileChange,
}: ProfileAvatarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="mb-8 flex flex-col items-center">
      <div className="relative">
        <Avatar className="h-32 w-32 border-2 border-gray-200">
          <AvatarImage src={avatarUrl} className="object-cover" />
          <AvatarFallback className="bg-orange-100 text-xl text-accent-orange">
            {getInitials(fullName)}
          </AvatarFallback>
        </Avatar>
        {isEditing && (
          <>
            <input
              type="file"
              ref={fileInputRef}
              onChange={onFileChange}
              accept="image/*"
              className="hidden"
            />
            <Button
              variant="outline"
              size="sm"
              className="absolute bottom-0 right-0"
              onClick={() => fileInputRef.current?.click()}
              disabled={loading}
            >
              Change
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
