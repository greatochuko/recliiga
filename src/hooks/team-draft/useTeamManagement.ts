import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Team } from '@/components/draft/types';
import { validateTeamColorChange } from './utils';
import { toast } from "sonner";

export const useTeamManagement = (
  teams: Team[],
  setTeams: React.Dispatch<React.SetStateAction<Team[]>>,
  eventId?: string
) => {
  const handleTeamNameChange = async (teamId: number, name: string) => {
    if (!eventId) return;
    setTeams(teams.map(team => team.id === teamId ? { ...team, name } : team));
    
    // Update event in database
    try {
      const field = teamId === 1 ? 'team1_name' : 'team2_name';
      await supabase
        .from('events')
        .update({ [field]: name })
        .eq('id', eventId);
    } catch (error) {
      console.error('Error updating team name:', error);
    }
  };

  const handleTeamColorChange = async (teamId: number, color: string) => {
    if (!eventId) return;
    
    if (!validateTeamColorChange(teams, teamId, color)) {
      return;
    }
    
    setTeams(teams.map(team => team.id === teamId ? { ...team, color } : team));
    
    // Update event in database
    try {
      const field = teamId === 1 ? 'team1_color' : 'team2_color';
      await supabase
        .from('events')
        .update({ [field]: color })
        .eq('id', eventId);
    } catch (error) {
      console.error('Error updating team color:', error);
    }
  };

  const toggleEditMode = (teamId: number) => {
    setTeams(teams.map(team => 
      team.id === teamId ? { ...team, isEditing: !team.isEditing } : team
    ));
  };

  const handleConfirmTeam = (teamId: number) => {
    setTeams(teams.map(team => 
      team.id === teamId ? { ...team, confirmed: true } : team
    ));
    
    const teamName = teams.find(t => t.id === teamId)?.name || `Team ${teamId}`;
    toast.success(`Team ${teamName} roster has been confirmed!`);
  };

  return {
    handleTeamNameChange,
    handleTeamColorChange,
    toggleEditMode,
    handleConfirmTeam
  };
};
