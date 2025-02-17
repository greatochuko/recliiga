
import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { AppSidebar } from "@/components/AppSidebar";

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
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<ProfileFormData>({
    full_name: "",
    email: user?.email || "",
    city: "",
    phone: "",
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user?.id)
          .single();

        if (error) throw error;

        if (data) {
          setFormData({
            full_name: data.full_name || "",
            email: user?.email || "",
            city: data.city || "",
            phone: data.phone || "",
            avatar_url: data.avatar_url,
          });
        }
      } catch (error) {
        toast.error('Error loading profile');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchProfile();
    }
  }, [user]);

  const handleClose = () => {
    navigate(-1);
  };

  const handleEditToggle = async () => {
    if (isEditing) {
      try {
        setLoading(true);
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
      } catch (error) {
        toast.error('Error updating profile');
        return;
      } finally {
        setLoading(false);
      }
    }
    setIsEditing(!isEditing);
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    try {
      setLoading(true);
      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}/avatar.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      setFormData(prev => ({ ...prev, avatar_url: publicUrl }));
      toast.success('Profile picture updated');
    } catch (error) {
      toast.error('Error uploading image');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen">
        <AppSidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-pulse">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      <AppSidebar />
      <div className="flex-1 overflow-auto bg-white p-8">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-sm border">
          <div className="p-6">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-2xl font-semibold text-gray-900">Profile</h1>
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  onClick={handleEditToggle}
                  disabled={loading}
                  className="text-[#FF7A00] border-[#FF7A00] hover:bg-orange-50"
                >
                  {isEditing ? 'Save' : 'Edit'}
                </Button>
                <button
                  onClick={handleClose}
                  className="text-gray-500 hover:text-gray-700"
                  aria-label="Close"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>

            <div className="flex flex-col items-center mb-8">
              <div className="relative">
                <Avatar className="w-32 h-32 border-2 border-gray-200">
                  <AvatarImage src={formData.avatar_url} />
                  <AvatarFallback className="bg-orange-100 text-[#FF7A00] text-xl">
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

            <div className="space-y-6">
              <div>
                <Label>Full name</Label>
                <Input
                  value={formData.full_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                  disabled={!isEditing || loading}
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <Label>Email</Label>
                <Input
                  value={formData.email}
                  disabled
                  type="email"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <Label>City</Label>
                <Input
                  value={formData.city}
                  onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                  disabled={!isEditing || loading}
                  placeholder="Enter your city"
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
                    disabled={!isEditing || loading}
                    type="tel"
                    placeholder="Enter your phone number"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
