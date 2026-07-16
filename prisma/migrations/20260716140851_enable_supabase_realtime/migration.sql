-- Enable Realtime replication for the database if not already enabled.
-- Supabase creates a publication called 'supabase_realtime'.
-- We use a DO block to ensure this migration is idempotent.

DO $$
BEGIN
  -- Create the publication if it does not exist
  IF NOT EXISTS (
    SELECT 1 
    FROM pg_publication 
    WHERE pubname = 'supabase_realtime'
  ) THEN
    CREATE PUBLICATION supabase_realtime;
  END IF;
END $$;

DO $$
DECLARE
  table_name text;
  realtime_tables text[] := ARRAY[
    'investigation_events',
    'investigations',
    'raids',
    'raid_jobs',
    'applications'
  ];
BEGIN
  FOREACH table_name IN ARRAY realtime_tables
  LOOP
    -- Only add the table to the publication if it's not already in it
    IF NOT EXISTS (
      SELECT 1
      FROM pg_publication_tables
      WHERE pubname = 'supabase_realtime'
        AND tablename = table_name
    ) THEN
      EXECUTE format('ALTER PUBLICATION supabase_realtime ADD TABLE %I', table_name);
    END IF;
  END LOOP;
END $$;