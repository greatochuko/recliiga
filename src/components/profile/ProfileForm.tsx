
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ProfileFormData {
  full_name: string;
  email: string;
  city: string;
  phone: string;
  avatar_url?: string;
}

interface ProfileFormProps {
  formData: ProfileFormData;
  isEditing: boolean;
  loading: boolean;
  onChange: (key: keyof ProfileFormData, value: string) => void;
}

export function ProfileForm({ formData, isEditing, loading, onChange }: ProfileFormProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <Label>Full name</Label>
        <Input
          value={formData.full_name}
          onChange={(e) => onChange('full_name', e.target.value)}
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
          onChange={(e) => onChange('city', e.target.value)}
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
            onChange={(e) => onChange('phone', e.target.value)}
            disabled={!isEditing || loading}
            type="tel"
            placeholder="Enter your phone number"
          />
        </div>
      </div>
    </div>
  );
}
