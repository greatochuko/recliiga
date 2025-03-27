import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { AppSidebar } from "@/components/AppSidebar";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileAvatar } from "@/components/profile/ProfileAvatar";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { updateUser } from "@/api/user";

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
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    return;

    const file = event.target.files?.[0];
    if (!file || !user) return;

    try {
      setLoading(true);
      const fileExt = file.name.split(".").pop();
      const filePath = `${user.id}/avatar.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from("avatars").getPublicUrl(filePath);

      setFormData((prev) => ({ ...prev, avatar_url: publicUrl }));
      toast.success("Profile picture updated");
    } catch (error) {
      toast.error("Error uploading image");
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (key: keyof ProfileFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  // if (loading) {
  //   return (
  //     <SidebarProvider>
  //       <div className="min-h-screen flex w-full">
  //
  //         <main className="flex-1 bg-background relative">
  //           <div className="absolute top-4 left-4 z-50 flex items-center">
  //             <SidebarTrigger className="bg-white shadow-md" />
  //             <h1 className="ml-4 text-2xl font-bold">Profile</h1>
  //           </div>
  //           <div className="flex-1 flex items-center h-full justify-center">
  //             <div className="animate-pulse">Loading...</div>
  //           </div>
  //         </main>
  //       </div>
  //     </SidebarProvider>
  //   );
  // }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <main className="flex-1 bg-background relative">
          <div className="absolute top-4 left-4 z-50 flex items-center">
            <SidebarTrigger className="bg-white shadow-md" />
            <h1 className="ml-4 text-2xl font-bold">Profile</h1>
          </div>
          <div className="pt-16">
            <div className="flex-1 overflow-auto bg-white p-8">
              <div className="w-full max-w-4xl mx-auto bg-white rounded-lg shadow-sm border">
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
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
