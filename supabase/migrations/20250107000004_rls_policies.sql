-- Quick fix for RLS policies to allow public read access
-- Run this in Supabase SQL Editor AFTER running the base migrations

-- Enable RLS on tables (if not already enabled)
ALTER TABLE hubs ENABLE ROW LEVEL SECURITY;
ALTER TABLE problem_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE agame_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE values_map ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read hubs (needed for hub selection)
CREATE POLICY "Anyone can read hubs"
  ON hubs FOR SELECT
  USING (true);

-- Allow anyone to read problem categories (needed for proposal submission)
CREATE POLICY "Anyone can read problem categories"
  ON problem_categories FOR SELECT
  USING (true);

-- Allow anyone to read agame questions (needed for Agame)
CREATE POLICY "Anyone can read agame questions"
  ON agame_questions FOR SELECT
  USING (true);

-- Allow anyone to read values map (needed for visualization)
CREATE POLICY "Anyone can read values map"
  ON values_map FOR SELECT
  USING (true);

-- Allow anyone to read profiles (needed to display usernames)
CREATE POLICY "Anyone can read profiles"
  ON profiles FOR SELECT
  USING (true);

-- Allow anyone to read proposals (public forum)
CREATE POLICY "Anyone can read proposals"
  ON proposals FOR SELECT
  USING (true);

-- Allow anyone to read votes (transparency)
CREATE POLICY "Anyone can read votes"
  ON votes FOR SELECT
  USING (true);

-- Allow anyone to read comments (public discussion)
CREATE POLICY "Anyone can read comments"
  ON comments FOR SELECT
  USING (true);

-- Allow authenticated users to insert their own profile
CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Allow users to update their own profile
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Allow authenticated users to insert agame responses
CREATE POLICY "Users can insert own agame responses"
  ON agame_responses FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Allow authenticated builders to insert proposals
CREATE POLICY "Builders can insert proposals"
  ON proposals FOR INSERT
  WITH CHECK (auth.uid() = author_id);

-- Allow authenticated builders to insert votes
CREATE POLICY "Builders can insert votes"
  ON votes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Allow authenticated builders to insert comments
CREATE POLICY "Builders can insert comments"
  ON comments FOR INSERT
  WITH CHECK (auth.uid() = author_id);

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'RLS policies created successfully!';
END $$;
