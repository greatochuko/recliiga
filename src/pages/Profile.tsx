import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileAvatar } from "@/components/profile/ProfileAvatar";
import { ProfileForm } from "@/components/profile/ProfileForm";

import { updateUser } from "@/api/user";
import { uploadImage } from "@/lib/uploadImage";
import PageHeader from "@/components/PageHeader";
import SportsAndPositions from "@/components/player-registration/SportsAndPositions";
import { PlayerProfile } from "./PlayerRegistration";

interface ProfileFormData {
  full_name: string;
  email: string;
  city: string;
  phone: string;
  avatar_url?: string;
  sports: string[];
  positions: Record<string, string[]>;
}

export default function Profile() {
  const { user, setUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File>();
  const [formData, setFormData] = useState<ProfileFormData>({
    full_name: user.full_name || "",
    email: user?.email || "",
    city: user.city || "",
    phone: user.phone || "",
    avatar_url: user.avatar_url || "",
    sports: user.sports || [],
    positions: user.positions || {},
  });

  console.log();

  const handleUpdateUser = async () => {
    try {
      setLoading(true);
      const { url } = await uploadImage(avatarFile);
      const { data: updatedUser, error } = await updateUser({
        ...formData,
        avatar_url: url,
      });
      if (error) throw new Error(error);

      setUser(updatedUser);
      toast.success("Profile updated successfully", {
        style: { color: "#16a34a" },
      });
    } catch (error) {
      toast.error("Error updating profile", { style: { color: "#ef4444" } });
      return;
    } finally {
      setLoading(false);
    }
  };

  const handleEditToggle = async () => {
    if (isEditing) {
      await handleUpdateUser();
    }
    setIsEditing(!isEditing);
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const reader = new FileReader();
    reader.onload = () => {
      setFormData((prev) => ({ ...prev, avatar_url: reader.result as string }));
    };
    reader.readAsDataURL(event.target.files[0]);
    setAvatarFile(event.target.files[0]);
    return;
  };

  const handleFormChange = (key: keyof ProfileFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  function updatePlayerData(data: Partial<PlayerProfile>) {
    setFormData((prev) => ({
      ...prev,
      ...data,
    }));
  }

  return (
    <main className="relative flex flex-1 flex-col gap-6 bg-background">
      <PageHeader title="Profile" />
      <div className="rounded-lg border bg-white shadow-sm">
        <div className="p-6">
          <ProfileHeader
            isEditing={isEditing}
            onEdit={handleEditToggle}
            loading={loading}
          />
          <ProfileAvatar
            avatarUrl={formData.avatar_url}
            fullName={formData.full_name}
            isEditing={isEditing}
            loading={loading}
            onFileChange={handleFileChange}
          />
          <ProfileForm
            formData={formData}
            isEditing={isEditing}
            loading={loading}
            onChange={handleFormChange}
          />

          <div className="mt-6 flex flex-col gap-6 text-sm">
            {!isEditing ? (
              <>
                <div>
                  <span className="font-medium">Sports: </span>
                  {formData?.sports?.length > 0
                    ? formData.sports.join(", ")
                    : "None selected"}
                </div>
                <div>
                  <span className="font-medium">Positions: </span>
                  {formData?.positions &&
                  Object.keys(formData.positions).length > 0 ? (
                    <ul className="list-inside list-disc pl-4">
                      {Object.entries(formData.positions).map(
                        ([sport, sportPositions]) => (
                          <li key={sport}>
                            <span className="font-medium text-gray-500">
                              {sport}:{" "}
                            </span>
                            {sportPositions.length > 0
                              ? sportPositions.join(", ")
                              : "None selected"}
                          </li>
                        ),
                      )}
                    </ul>
                  ) : (
                    <span>None selected</span>
                  )}
                </div>
              </>
            ) : (
              <SportsAndPositions
                playerData={formData}
                updatePlayerData={updatePlayerData}
              />
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
