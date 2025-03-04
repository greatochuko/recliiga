
-- Function to select captains for an event
CREATE OR REPLACE FUNCTION public.select_event_captains(
  p_event_id TEXT,
  p_team1_captain_id TEXT,
  p_team2_captain_id TEXT
) RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Delete any existing captains for this event
  DELETE FROM public.team_captains WHERE event_id = p_event_id::uuid;
  
  -- Insert new captains
  INSERT INTO public.team_captains (event_id, team_id, captain_id)
  VALUES 
    (p_event_id::uuid, 'team1', p_team1_captain_id::uuid),
    (p_event_id::uuid, 'team2', p_team2_captain_id::uuid);
    
  -- Update the event's draft status
  UPDATE public.events 
  SET draft_status = 'in_progress'
  WHERE id = p_event_id::uuid;
END;
$$;

-- Function to finalize a draft
CREATE OR REPLACE FUNCTION public.finalize_draft(
  p_draft_session_id TEXT,
  p_event_id TEXT
) RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  team1_captain_id uuid;
  team2_captain_id uuid;
BEGIN
  -- Get captain IDs
  SELECT captain_id INTO team1_captain_id FROM public.team_captains
  WHERE event_id = p_event_id::uuid AND team_id = 'team1';
  
  SELECT captain_id INTO team2_captain_id FROM public.team_captains
  WHERE event_id = p_event_id::uuid AND team_id = 'team2';
  
  -- Add captains to team rosters first
  INSERT INTO public.team_rosters (event_id, team_id, player_id, is_captain)
  VALUES 
    (p_event_id::uuid, 'team1', team1_captain_id, true),
    (p_event_id::uuid, 'team2', team2_captain_id, true)
  ON CONFLICT (event_id, player_id) DO NOTHING;
  
  -- Add all drafted players to team rosters
  INSERT INTO public.team_rosters (event_id, team_id, player_id, is_captain)
  SELECT 
    p_event_id::uuid,
    dp.team_id,
    dp.player_id,
    false
  FROM public.draft_picks dp
  WHERE dp.draft_session_id = p_draft_session_id::uuid
  AND dp.player_id NOT IN (team1_captain_id, team2_captain_id)
  ON CONFLICT (event_id, player_id) DO NOTHING;
  
  -- Update the draft session status
  UPDATE public.draft_sessions
  SET status = 'completed'
  WHERE id = p_draft_session_id::uuid;
  
  -- Update the event's draft status
  UPDATE public.events 
  SET draft_status = 'completed'
  WHERE id = p_event_id::uuid;
END;
$$;
