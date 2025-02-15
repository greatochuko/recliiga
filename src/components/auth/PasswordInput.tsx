
import { Input } from "@/components/ui/input"
import { Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'

interface PasswordInputProps {
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label: string;
  placeholder?: string;
}

export default function PasswordInput({
  id,
  value,
  onChange,
  label,
  placeholder = "********"
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="space-y-2">
      <label htmlFor={id} className="text-sm text-gray-800">{label}</label>
      <div className="relative">
        <Input 
          id={id} 
          type={showPassword ? "text" : "password"} 
          placeholder={placeholder}
          className="w-full pr-10" 
          value={value}
          onChange={onChange}
        />
        <button 
          type="button"
          onClick={() => setShowPassword(!showPassword)} 
          className="absolute inset-y-0 right-0 pr-3 flex items-center"
        >
          {showPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
        </button>
      </div>
    </div>
  );
}
