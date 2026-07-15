-- 1. Enumerations
CREATE TYPE processing_status AS ENUM (
  'queued',
  'fetching_metadata',
  'metadata_complete',
  'analyzing',
  'report_generating',
  'completed',
  'failed_metadata',
  'failed_ai'
);

CREATE TYPE investigation_status AS ENUM (
  'pending_review',
  'under_review',
  'resolved',
  'archived'
);

CREATE TYPE severity AS ENUM (
  'low',
  'medium',
  'high',
  'critical'
);

CREATE TYPE evidence_type AS ENUM (
  'caption',
  'hashtag',
  'comment',
  'metadata',
  'ai_evidence'
);

-- 2. Schools
CREATE TABLE schools (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  short_name text,
  aliases text[],
  state text,
  country text,
  logo_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 3. Admins
CREATE TABLE admins (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  email text NOT NULL,
  school_id uuid REFERENCES schools(id) ON DELETE SET NULL,
  role text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 4. Investigations
CREATE TABLE investigations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  public_id uuid NOT NULL DEFAULT gen_random_uuid() UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz,
  
  -- Submission
  submitted_url text NOT NULL,
  submitted_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  submission_ip_hash text,
  
  -- Processing
  processing_status processing_status NOT NULL DEFAULT 'queued',
  investigation_status investigation_status NOT NULL DEFAULT 'pending_review',
  progress integer NOT NULL DEFAULT 0,
  
  -- TikTok Metadata
  author_username text,
  caption text,
  upload_timestamp timestamptz,
  hashtags text[],
  comment_count integer,
  like_count integer,
  share_count integer,
  
  -- AI Findings
  detected_school_id uuid REFERENCES schools(id) ON DELETE SET NULL,
  detected_location text,
  sentiment text,
  severity severity,
  risk_score integer,
  confidence_score integer,
  
  -- Structured Report
  summary text,
  explanation text,
  
  -- Debug
  ai_response_json jsonb
);

-- 5. Investigation Events
CREATE TABLE investigation_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  investigation_id uuid NOT NULL REFERENCES investigations(id) ON DELETE CASCADE,
  event text NOT NULL,
  description text,
  progress integer,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 6. Evidence
CREATE TABLE evidence (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  investigation_id uuid NOT NULL REFERENCES investigations(id) ON DELETE CASCADE,
  type evidence_type NOT NULL,
  content text NOT NULL,
  source text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 7. Admin Notes
CREATE TABLE admin_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  investigation_id uuid NOT NULL REFERENCES investigations(id) ON DELETE CASCADE,
  admin_id uuid NOT NULL REFERENCES admins(id) ON DELETE CASCADE,
  note text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 8. Indexes
CREATE INDEX idx_investigations_processing_status ON investigations(processing_status);
CREATE INDEX idx_investigations_investigation_status ON investigations(investigation_status);
CREATE INDEX idx_investigations_detected_school_id ON investigations(detected_school_id);
CREATE INDEX idx_investigations_created_at ON investigations(created_at);
CREATE INDEX idx_investigations_public_id ON investigations(public_id);
CREATE INDEX idx_investigation_events_investigation_id ON investigation_events(investigation_id);
CREATE INDEX idx_evidence_investigation_id ON evidence(investigation_id);
CREATE INDEX idx_admin_notes_investigation_id ON admin_notes(investigation_id);

-- 9. Row Level Security
ALTER TABLE schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE investigations ENABLE ROW LEVEL SECURITY;
ALTER TABLE investigation_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE evidence ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_notes ENABLE ROW LEVEL SECURITY;

-- Anonymous users may create investigations
CREATE POLICY "Allow public users to insert investigations" 
ON investigations FOR INSERT TO anon 
WITH CHECK (true);

-- Authenticated administrators may read investigations
CREATE POLICY "Allow admins to read investigations"
ON investigations FOR SELECT TO authenticated
USING (true);

-- Authenticated administrators may update investigations
CREATE POLICY "Allow admins to update investigation status"
ON investigations FOR UPDATE TO authenticated
USING (true);

-- Authenticated administrators may read evidence
CREATE POLICY "Allow admins to read evidence"
ON evidence FOR SELECT TO authenticated
USING (true);

-- Authenticated administrators may read investigation_events
CREATE POLICY "Allow admins to read investigation events"
ON investigation_events FOR SELECT TO authenticated
USING (true);

-- Authenticated administrators may read schools
CREATE POLICY "Allow admins to read schools"
ON schools FOR SELECT TO authenticated
USING (true);

-- Authenticated administrators may read admin_notes
CREATE POLICY "Allow admins to read admin notes"
ON admin_notes FOR SELECT TO authenticated
USING (true);

-- Authenticated administrators may insert admin_notes
CREATE POLICY "Allow admins to insert admin notes"
ON admin_notes FOR INSERT TO authenticated
WITH CHECK (true);

-- Allow admins to read admins
CREATE POLICY "Allow admins to read admins"
ON admins FOR SELECT TO authenticated
USING (true);

-- 10. Storage Buckets
INSERT INTO storage.buckets (id, name, public) 
VALUES ('evidence', 'evidence', false)
ON CONFLICT (id) DO NOTHING;
