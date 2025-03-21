export type LeagueType = {
  id: string;
  name: string;
  sport: string;
  is_private: boolean;
  city: string;
  location: string;
  description: string | null;
  logo_url: string | null;
  owner_id: string;
};
