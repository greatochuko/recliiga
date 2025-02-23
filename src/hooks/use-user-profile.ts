
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { User } from '@supabase/supabase-js';

export function useUserProfile(user: User | null) {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [memberships, setMemberships] = useState<Array<{ league_id: string }>>([]);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role, nickname, date_of_birth, sports')
          .eq('id', user?.id)
          .single();

        if (profile) {
          setUserRole(profile.role);
        }

        // Fetch user's league memberships
        const { data: memberships } = await supabase
          .from('league_members')
          .select('league_id')
          .eq('player_id', user?.id);

        if (memberships) {
          setMemberships(memberships);
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    if (user) {
      fetchUserProfile();
    }
  }, [user]);

  return { userRole, memberships };
}
