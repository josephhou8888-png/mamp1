import { createClient } from '@supabase/supabase-js';

// --- WORKAROUND for environment variable issues ---
// The standard methods (import.meta.env, process.env) are not working reliably
// in this specific environment. Hardcoding these values ensures the application
// can connect to the database. This should be replaced with a proper secrets
// management solution in a production environment.
const supabaseUrl = "https://kyzmcjecfucuvopzyayx.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt5em1jamVjZnVjdXZvcHp5YXl4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg5NzcwOTYsImV4cCI6MjA3NDU1MzA5Nn0.VG3hpUkjZb2ZMP4ySgWqNG2DUkQYWHGTFpKks_nzWy4";

if (!supabaseUrl || !supabaseAnonKey) {
    // This check is kept for robustness, though it should not fail with the hardcoded values.
    throw new Error('CRITICAL ERROR: Supabase URL and/or anonymous key are not defined.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
