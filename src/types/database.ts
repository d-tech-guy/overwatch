/**
 * Supabase database type definitions.
 *
 * This is a hand-authored scaffold that mirrors the schema in context/database.md.
 * Run `pnpm supabase gen types typescript --project-id <id>` to auto-generate
 * a complete version once the Supabase project is provisioned.
 */
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          full_name: string;
          email: string;
          role: "super_admin" | "school_admin";
          school_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          full_name: string;
          email: string;
          role: "super_admin" | "school_admin";
          school_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string;
          email?: string;
          role?: "super_admin" | "school_admin";
          school_id?: string | null;
          created_at?: string;
        };
      };
      schools: {
        Row: {
          id: string;
          name: string;
          short_name: string;
          aliases: string[];
          logo_url: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          short_name: string;
          aliases?: string[];
          logo_url?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          short_name?: string;
          aliases?: string[];
          logo_url?: string | null;
          created_at?: string;
        };
      };
      incidents: {
        Row: {
          id: string;
          submitted_by: string | null;
          school_id: string | null;
          tiktok_url: string;
          processing_status:
            | "queued"
            | "fetching_metadata"
            | "metadata_complete"
            | "analyzing"
            | "report_generating"
            | "completed"
            | "failed_metadata"
            | "failed_ai";
          investigation_status:
            | "pending_review"
            | "under_review"
            | "resolved"
            | "archived";
          progress: number;
          public_token: string;
          priority: "Low" | "Medium" | "High" | "Critical";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          submitted_by?: string | null;
          school_id?: string | null;
          tiktok_url: string;
          processing_status?:
            | "queued"
            | "fetching_metadata"
            | "metadata_complete"
            | "analyzing"
            | "report_generating"
            | "completed"
            | "failed_metadata"
            | "failed_ai";
          investigation_status?:
            | "pending_review"
            | "under_review"
            | "resolved"
            | "archived";
          progress?: number;
          public_token?: string;
          priority?: "Low" | "Medium" | "High" | "Critical";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          submitted_by?: string | null;
          school_id?: string | null;
          tiktok_url?: string;
          processing_status?:
            | "queued"
            | "fetching_metadata"
            | "metadata_complete"
            | "analyzing"
            | "report_generating"
            | "completed"
            | "failed_metadata"
            | "failed_ai";
          investigation_status?:
            | "pending_review"
            | "under_review"
            | "resolved"
            | "archived";
          progress?: number;
          public_token?: string;
          priority?: "Low" | "Medium" | "High" | "Critical";
          created_at?: string;
          updated_at?: string;
        };
      };
      ai_reports: {
        Row: {
          id: string;
          incident_id: string;
          summary: string;
          risk_score: number;
          confidence: number;
          detected_school: string | null;
          bullying_category: string | null;
          sentiment: "Positive" | "Neutral" | "Negative" | "Highly Negative";
          recommendation: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          incident_id: string;
          summary: string;
          risk_score: number;
          confidence: number;
          detected_school?: string | null;
          bullying_category?: string | null;
          sentiment: "Positive" | "Neutral" | "Negative" | "Highly Negative";
          recommendation: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          incident_id?: string;
          summary?: string;
          risk_score?: number;
          confidence?: number;
          detected_school?: string | null;
          bullying_category?: string | null;
          sentiment?: "Positive" | "Neutral" | "Negative" | "Highly Negative";
          recommendation?: string;
          created_at?: string;
        };
      };
      evidence: {
        Row: {
          id: string;
          incident_id: string;
          type:
            | "Caption"
            | "Transcript"
            | "OCR"
            | "Comment"
            | "Hashtag"
            | "Metadata";
          content: string;
        };
        Insert: {
          id?: string;
          incident_id: string;
          type:
            | "Caption"
            | "Transcript"
            | "OCR"
            | "Comment"
            | "Hashtag"
            | "Metadata";
          content: string;
        };
        Update: {
          id?: string;
          incident_id?: string;
          type?:
            | "Caption"
            | "Transcript"
            | "OCR"
            | "Comment"
            | "Hashtag"
            | "Metadata";
          content?: string;
        };
      };
      investigation_notes: {
        Row: {
          id: string;
          incident_id: string;
          author_id: string;
          note: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          incident_id: string;
          author_id: string;
          note: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          incident_id?: string;
          author_id?: string;
          note?: string;
          created_at?: string;
        };
      };
      resolutions: {
        Row: {
          id: string;
          incident_id: string;
          resolved_by: string;
          outcome:
            | "Confirmed Bullying"
            | "False Positive"
            | "Insufficient Evidence"
            | "Escalated"
            | "Closed";
          remarks: string | null;
          resolved_at: string;
        };
        Insert: {
          id?: string;
          incident_id: string;
          resolved_by: string;
          outcome:
            | "Confirmed Bullying"
            | "False Positive"
            | "Insufficient Evidence"
            | "Escalated"
            | "Closed";
          remarks?: string | null;
          resolved_at?: string;
        };
        Update: {
          id?: string;
          incident_id?: string;
          resolved_by?: string;
          outcome?:
            | "Confirmed Bullying"
            | "False Positive"
            | "Insufficient Evidence"
            | "Escalated"
            | "Closed";
          remarks?: string | null;
          resolved_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
