
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { User } from '@supabase/supabase-js';

export function useUserProfile(user: User | null) {
  const [userRole, setUserRole] = useState<string | null>(null);

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
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    if (user) {
      fetchUserProfile();
    }
  }, [user]);

  return { userRole };
}
