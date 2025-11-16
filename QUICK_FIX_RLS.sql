-- QUICK FIX: Temporarily disable RLS for testing
-- Run this in Supabase SQL Editor if you want to test immediately
-- WARNING: This makes all data publicly accessible - fine for testing, fix before production

-- Disable RLS on critical tables for testing
ALTER TABLE hubs DISABLE ROW LEVEL SECURITY;
ALTER TABLE problem_categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE agame_questions DISABLE ROW LEVEL SECURITY;
ALTER TABLE agame_responses DISABLE ROW LEVEL SECURITY;
ALTER TABLE values_map DISABLE ROW LEVEL SECURITY;
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE proposals DISABLE ROW LEVEL SECURITY;
ALTER TABLE votes DISABLE ROW LEVEL SECURITY;
ALTER TABLE comments DISABLE ROW LEVEL SECURITY;

-- Success
SELECT 'RLS disabled for testing - you can now access hubs!' as message;
