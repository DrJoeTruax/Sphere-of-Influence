import { createClient } from '@supabase/supabase-js'

// Validate environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Please check your .env.local file.'
  )
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for Database (will be auto-generated from Supabase later)
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type Database = {
  // Will be populated after running migrations
}
