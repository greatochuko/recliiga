
import { supabase } from '@/integrations/supabase/client';
import { LeagueFormData } from './types';
import { format } from 'date-fns';
import { toast } from 'sonner';

export const createLeague = async (leagueData: LeagueFormData, userId: string) => {
  let logoUrl = null;
  
  if (leagueData.logo) {
    const fileExt = leagueData.logo.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('league-logos')
      .upload(fileName, leagueData.logo);

    if (uploadError) throw uploadError;
    
    const { data: { publicUrl } } = supabase.storage
      .from('league-logos')
      .getPublicUrl(fileName);
      
    logoUrl = publicUrl;
  }

  const { data: league, error: leagueError } = await supabase
    .from('leagues')
    .insert({
      name: leagueData.leagueName,
      sport: leagueData.sport,
      city: leagueData.city,
      location: leagueData.location,
      description: leagueData.description,
      logo_url: logoUrl,
      owner_id: userId,
      start_date: new Date().toISOString()
    })
    .select()
    .single();

  if (leagueError) throw leagueError;

  for (const event of leagueData.events) {
    const { data: eventData, error: eventError } = await supabase
      .from('events')
      .insert({
        league_id: league.id,
        title: event.title,
        location: event.location,
        num_teams: parseInt(event.numTeams),
        roster_spots: parseInt(event.rosterSpots),
        rsvp_deadline_hours: event.rsvpDeadlineOption === 'custom' 
          ? parseInt(event.customRsvpHours)
          : parseInt(event.rsvpDeadlineOption),
      })
      .select()
      .single();

    if (eventError) throw eventError;

    const eventDatesInsert = event.eventDates.map(date => ({
      event_id: eventData.id,
      date: date.date ? format(date.date, 'yyyy-MM-dd') : null,
      start_time: `${date.startHour}:${date.startMinute} ${date.startAmPm}`,
      end_time: `${date.endHour}:${date.endMinute} ${date.endAmPm}`,
    }));

    const validEventDates = eventDatesInsert.filter(date => date.date !== null);

    if (validEventDates.length > 0) {
      const { error: datesError } = await supabase
        .from('event_dates')
        .insert(validEventDates);

      if (datesError) throw datesError;
    }
  }

  return league;
};
