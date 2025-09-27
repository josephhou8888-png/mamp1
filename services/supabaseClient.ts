import { createClient } from '@supabase/supabase-js';

// For Vite projects, environment variables exposed to the client
// must be prefixed with VITE_ and are accessed via import.meta.env
// FIX: Add type assertion to handle missing Vite client types for `import.meta.env`.
const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL;
// FIX: Add type assertion to handle missing Vite client types for `import.meta.env`.
const supabaseAnonKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Supabase URL (VITE_SUPABASE_URL) and Anon Key (VITE_SUPABASE_ANON_KEY) must be provided in your .env file.");
}

// Create a single, reusable Supabase client instance
export const supabase = createClient(supabaseUrl, supabaseAnonKey);