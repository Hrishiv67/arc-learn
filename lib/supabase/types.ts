/**
 * Hand-authored to match supabase/migrations/0001_init.sql. In a real
 * deployment, regenerate this from the live schema instead of maintaining
 * it by hand:
 *
 *   npx supabase gen types typescript --project-id <ref> > lib/supabase/types.ts
 */
export type Database = {
  public: {
    Tables: {
      seasons: {
        Row: {
          id: string;
          year: number;
          is_current: boolean;
          parameters: {
            targetAltitude: { value: number; unit: string; label: string };
            durationWindow: { value: string; unit: string; label: string };
            payload: { count: number; eachMass: string; label: string };
          };
          rules_url: string;
          created_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["seasons"]["Row"],
          "id" | "created_at"
        >;
        Update: Partial<Database["public"]["Tables"]["seasons"]["Insert"]>;
        Relationships: [];
      };
      modules: {
        Row: {
          id: string;
          slug: string;
          order: number;
          unit: number;
          unit_title: string;
          title: string;
          summary: string;
          estimated_minutes: number;
          video_id: string | null;
          is_timeless: boolean;
          prerequisite_ids: string[];
          ngss_codes: string[];
          status: "live" | "soon";
          needs_review: boolean;
        };
        Insert: Database["public"]["Tables"]["modules"]["Row"];
        Update: Partial<Database["public"]["Tables"]["modules"]["Row"]>;
        Relationships: [];
      };
      users: {
        Row: {
          id: string;
          email: string;
          role: "student" | "teacher";
          created_at: string;
        };
        Insert: Pick<
          Database["public"]["Tables"]["users"]["Row"],
          "id" | "email"
        > &
          Partial<Database["public"]["Tables"]["users"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["users"]["Row"]>;
        Relationships: [];
      };
      progress: {
        Row: {
          user_id: string;
          module_id: string;
          status: "in_progress" | "complete";
          video_position_seconds: number | null;
          quiz_score: number | null;
          quiz_total: number | null;
          completed_at: string | null;
          updated_at: string;
        };
        Insert: Pick<
          Database["public"]["Tables"]["progress"]["Row"],
          "user_id" | "module_id"
        > &
          Partial<Database["public"]["Tables"]["progress"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["progress"]["Row"]>;
        Relationships: [];
      };
      teams: {
        Row: {
          id: string;
          name: string;
          teacher_id: string;
          join_code: string;
          season_id: string;
          created_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["teams"]["Row"],
          "id" | "created_at"
        >;
        Update: Partial<Database["public"]["Tables"]["teams"]["Insert"]>;
        Relationships: [];
      };
      team_members: {
        Row: {
          team_id: string;
          user_id: string;
          display_name: string;
          joined_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["team_members"]["Row"],
          "joined_at"
        >;
        Update: Partial<Database["public"]["Tables"]["team_members"]["Insert"]>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
