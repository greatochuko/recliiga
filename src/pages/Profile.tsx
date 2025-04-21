import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileAvatar } from "@/components/profile/ProfileAvatar";
import { ProfileForm } from "@/components/profile/ProfileForm";

import { updateUser } from "@/api/user";
import FullScreenLoader from "@/components/FullScreenLoader";
import { ArrowLeft } from "lucide-react";

interface ProfileFormData {
  full_name: string;
  email: string;
  city: string;
  phone: string;
  avatar_url?: string;
}

export default function Profile() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<ProfileFormData>({
    full_name: user.full_name || "",
    email: user?.email || "",
    city: user.city || "",
    phone: user.phone || "",
    avatar_url: user.avatar_url || "",
  });

  const handleClose = () => {
    navigate(-1);
  };

  const handleUpdateUser = async () => {
    try {
      setLoading(true);
      const { data: updatedUser, error } = await updateUser(formData);
      if (error) throw new Error(error);

      setUser(updatedUser);
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error("Error updating profile");
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
    console.log(event.target.files);
    return;
  };

  const handleFormChange = (key: keyof ProfileFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  if (loading) {
    return <FullScreenLoader />;
  }

  return (
    <main className="relative flex flex-1 flex-col gap-6 bg-background">
      <div className="relative ml-8 flex items-center justify-between">
        <h1 className="ml-0 text-2xl font-bold">Profile</h1>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 rounded-md p-1.5 px-3 text-sm font-medium text-accent-orange duration-200 hover:bg-accent-orange/10"
        >
          <ArrowLeft className="h-4 w-4" />
          Previous
        </button>
      </div>
      <div className="rounded-lg border bg-white shadow-sm">
        <div className="p-6">
          <ProfileHeader
            isEditing={isEditing}
            onEdit={handleEditToggle}
            onClose={handleClose}
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
        </div>
      </div>
    </main>
  );
}
