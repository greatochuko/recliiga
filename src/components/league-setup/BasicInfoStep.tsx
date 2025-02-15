
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { LeagueFormData } from './types';

interface BasicInfoStepProps {
  leagueData: LeagueFormData;
  onDataChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export function BasicInfoStep({ leagueData, onDataChange }: BasicInfoStepProps) {
  return (
    <div>
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="leagueName">League Name</Label>
          <Input
            type="text"
            id="leagueName"
            name="leagueName"
            value={leagueData.leagueName}
            onChange={onDataChange}
            placeholder="Enter league name"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="sport">Sport</Label>
          <Input
            type="text"
            id="sport"
            name="sport"
            value={leagueData.sport}
            onChange={onDataChange}
            placeholder="Enter sport"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="city">City</Label>
          <Input
            type="text"
            id="city"
            name="city"
            value={leagueData.city}
            onChange={onDataChange}
            placeholder="Enter city"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            value={leagueData.description}
            onChange={onDataChange}
            placeholder="Enter description"
          />
        </div>
      </div>
    </div>
  );
}
