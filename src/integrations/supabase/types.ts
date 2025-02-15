export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      event_dates: {
        Row: {
          created_at: string
          date: string
          end_time: string
          event_id: string
          id: string
          start_time: string
        }
        Insert: {
          created_at?: string
          date: string
          end_time: string
          event_id: string
          id?: string
          start_time: string
        }
        Update: {
          created_at?: string
          date?: string
          end_time?: string
          event_id?: string
          id?: string
          start_time?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_dates_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      event_rsvps: {
        Row: {
          created_at: string
          event_id: string | null
          id: string
          player_id: string | null
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          event_id?: string | null
          id?: string
          player_id?: string | null
          status: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          event_id?: string | null
          id?: string
          player_id?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_rsvps_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          created_at: string
          id: string
          league_id: string
          location: string
          num_teams: number
          roster_spots: number
          rsvp_deadline_hours: number
          team1_color: string | null
          team1_name: string | null
          team2_color: string | null
          team2_name: string | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          league_id: string
          location: string
          num_teams: number
          roster_spots: number
          rsvp_deadline_hours: number
          team1_color?: string | null
          team1_name?: string | null
          team2_color?: string | null
          team2_name?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          league_id?: string
          location?: string
          num_teams?: number
          roster_spots?: number
          rsvp_deadline_hours?: number
          team1_color?: string | null
          team1_name?: string | null
          team2_color?: string | null
          team2_name?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "events_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "leagues"
            referencedColumns: ["id"]
          },
        ]
      }
      league_members: {
        Row: {
          id: string
          joined_at: string | null
          league_id: string | null
          player_id: string | null
        }
        Insert: {
          id?: string
          joined_at?: string | null
          league_id?: string | null
          player_id?: string | null
        }
        Update: {
          id?: string
          joined_at?: string | null
          league_id?: string | null
          player_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "league_members_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "leagues"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "league_members_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      leagues: {
        Row: {
          city: string
          created_at: string
          description: string | null
          id: string
          league_code: string | null
          logo_url: string | null
          name: string
          owner_id: string
          sport: string
          updated_at: string
        }
        Insert: {
          city: string
          created_at?: string
          description?: string | null
          id?: string
          league_code?: string | null
          logo_url?: string | null
          name: string
          owner_id: string
          sport: string
          updated_at?: string
        }
        Update: {
          city?: string
          created_at?: string
          description?: string | null
          id?: string
          league_code?: string | null
          logo_url?: string | null
          name?: string
          owner_id?: string
          sport?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "leagues_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      player_stats: {
        Row: {
          created_at: string
          id: string
          league_id: string | null
          losses: number | null
          player_id: string | null
          points: number | null
          ties: number | null
          updated_at: string
          wins: number | null
        }
        Insert: {
          created_at?: string
          id?: string
          league_id?: string | null
          losses?: number | null
          player_id?: string | null
          points?: number | null
          ties?: number | null
          updated_at?: string
          wins?: number | null
        }
        Update: {
          created_at?: string
          id?: string
          league_id?: string | null
          losses?: number | null
          player_id?: string | null
          points?: number | null
          ties?: number | null
          updated_at?: string
          wins?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "player_stats_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "leagues"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          date_of_birth: string | null
          full_name: string | null
          id: string
          nickname: string | null
          phone: string | null
          positions: string[] | null
          role: string | null
          sports: string[] | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          date_of_birth?: string | null
          full_name?: string | null
          id: string
          nickname?: string | null
          phone?: string | null
          positions?: string[] | null
          role?: string | null
          sports?: string[] | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          date_of_birth?: string | null
          full_name?: string | null
          id?: string
          nickname?: string | null
          phone?: string | null
          positions?: string[] | null
          role?: string | null
          sports?: string[] | null
          updated_at?: string
        }
        Relationships: []
      }
      teammate_ratings: {
        Row: {
          created_at: string
          id: string
          league_id: string | null
          rated_id: string | null
          rater_id: string | null
          rating: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          league_id?: string | null
          rated_id?: string | null
          rater_id?: string | null
          rating?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          league_id?: string | null
          rated_id?: string | null
          rater_id?: string | null
          rating?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "teammate_ratings_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "leagues"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
