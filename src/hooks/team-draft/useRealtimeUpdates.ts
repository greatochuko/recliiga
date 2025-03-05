
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "sonner";
import { getDraftPicks } from '@/api/draft';

export const useRealtimeUpdates = (draftSessionId: string | undefined) => {
  useEffect(() => {
    if (!draftSessionId) return;

    const channel = supabase
      .channel('draft-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'draft_picks',
          filter: `draft_session_id=eq.${draftSessionId}`
        },
        (payload) => {
          console.log('New draft pick:', payload);
          // Reload draft picks when a new one is added
          getDraftPicks(draftSessionId).then(picks => {
            // Update state based on new picks
            toast.info("Draft updated");
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [draftSessionId]);
};
