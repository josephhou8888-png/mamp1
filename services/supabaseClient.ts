import { createClient } from '@supabase/supabase-js';

// Since the execution environment does not seem to support `import.meta.env` or `process.env`
// for client-side environment variables, the Supabase credentials are provided directly here
// as a workaround to fix the critical connection error. The anonymous key is safe to be public.
const supabaseUrl = "https://kyzmcjecfucuvopzyayx.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt5em1jamVjZnVjdXZvcHp5YXl4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg5NzcwOTYsImV4cCI6MjA3NDU1MzA5Nn0.VG3hpUkjZb2ZMP4ySgWqNG2DUkQYWHGTFpKks_nzWy4";

// This check remains as a safeguard, though it's unlikely to fail with hardcoded values.
if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('CRITICAL ERROR: Supabase credentials are not defined. The application cannot connect to the database.');
}

// Create and export the Supabase client instance.
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
