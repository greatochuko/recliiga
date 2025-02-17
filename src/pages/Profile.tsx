
import { useState, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ProfileFormData {
  full_name: string;
  email: string;
  city: string;
  phone: string;
  avatar_url?: string;
}

export default function Profile() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<ProfileFormData>({
    full_name: "John Doe",
    email: "Johndoe@gmail.com",
    city: "New Jersey",
    phone: "7653247990",
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClose = () => {
    navigate(-1);
  };

  const handleEditToggle = async () => {
    if (isEditing) {
      // Save changes
      try {
        const { error } = await supabase
          .from('profiles')
          .update({
            full_name: formData.full_name,
            city: formData.city,
            phone: formData.phone,
            avatar_url: formData.avatar_url,
          })
          .eq('id', user?.id);

        if (error) throw error;
        toast.success('Profile updated successfully');
      } catch (error: any) {
        toast.error('Error updating profile');
        return;
      }
    }
    setIsEditing(!isEditing);
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `${user?.id}/avatar.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      setFormData(prev => ({ ...prev, avatar_url: publicUrl }));
      toast.success('Profile picture updated');
    } catch (error: any) {
      toast.error('Error uploading image');
    }
  };

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Profile</h1>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={handleEditToggle}
              className="text-[#FF7A00] border-[#FF7A00] hover:bg-orange-50"
            >
              {isEditing ? 'Save' : 'Edit'}
            </Button>
            <button
              onClick={handleClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="flex flex-col items-center mb-8">
          <div className="relative">
            <Avatar className="w-32 h-32">
              <AvatarImage src={formData.avatar_url} />
              <AvatarFallback>
                {formData.full_name?.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            {isEditing && (
              <>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />
                <Button
                  variant="outline"
                  className="absolute bottom-0 right-0"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Change
                </Button>
              </>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <Label>Full name</Label>
            <Input
              value={formData.full_name}
              onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
              disabled={!isEditing}
            />
          </div>

          <div>
            <Label>Email</Label>
            <Input
              value={formData.email}
              disabled
              type="email"
            />
          </div>

          <div>
            <Label>City</Label>
            <Input
              value={formData.city}
              onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
              disabled={!isEditing}
            />
          </div>

          <div>
            <Label>Mobile Number</Label>
            <div className="flex gap-2">
              <Input
                value="+1"
                disabled
                className="w-16"
              />
              <Input
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                disabled={!isEditing}
                type="tel"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
