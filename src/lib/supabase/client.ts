import { createClient } from '@supabase/supabase-js'

// Validate environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// During build time (no env vars), create placeholder client
// In production, these should be set
const url = supabaseUrl || 'https://placeholder.supabase.co'
const key = supabaseAnonKey || 'placeholder-key'

// Create Supabase client
export const supabase = createClient(url, key)

// Helper to check if Supabase is configured
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey)

// Types for Database (will be auto-generated from Supabase later)
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type Database = {
  // Will be populated after running migrations
}
