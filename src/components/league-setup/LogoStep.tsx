
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LeagueFormData } from './types';

interface LogoStepProps {
  onLogoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function LogoStep({ onLogoChange }: LogoStepProps) {
  return (
    <div>
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="logo">Logo</Label>
          <Input
            type="file"
            id="logo"
            name="logo"
            onChange={onLogoChange}
          />
        </div>
      </div>
    </div>
  );
}
