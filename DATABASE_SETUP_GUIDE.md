# Database Setup Guide (Without Supabase CLI)

Since the Supabase CLI is not installed, you can set up the database directly through the Supabase Dashboard.

## Option 1: Supabase Dashboard (Recommended)

### Step 1: Access SQL Editor
1. Go to your Supabase project dashboard: https://app.supabase.com
2. Select your project
3. Click on **SQL Editor** in the left sidebar

### Step 2: Run Phase 11 Migration (Agame Tables)
Copy and paste the contents of `supabase/migrations/20250107000001_phase11_agame.sql` into the SQL Editor and click **Run**.

This will create:
- `agame_questions` table
- `agame_responses` table
- `values_map` table
- PostgreSQL functions for queries
- Add `agame_score` column to profiles

### Step 3: Run Phase 13-20 Migration (Additional Tables)
Copy and paste the contents of `supabase/migrations/20250107000002_phases_13_20.sql` into the SQL Editor and click **Run**.

This will create tables for all future phases.

### Step 4: Seed Agame Questions
Copy and paste the contents of `supabase/seed/agame_questions.sql` into the SQL Editor and click **Run**.

This will insert 100+ ethical dilemma questions.

## Option 2: Install Supabase CLI

If you want to use the CLI in the future:

### For Windows (PowerShell as Administrator):
```powershell
# Using Scoop
scoop install supabase

# OR using npm
npm install -g supabase
```

### After Installation:
```bash
cd supabase
supabase login
supabase link --project-ref YOUR_PROJECT_REF
supabase db push
```

## Option 3: Direct psql Connection

If you have PostgreSQL client installed:

1. Get your database connection string from Supabase Dashboard:
   - Go to Settings → Database
   - Copy the connection string

2. Run migrations:
```bash
psql "YOUR_CONNECTION_STRING" -f supabase/migrations/20250107000001_phase11_agame.sql
psql "YOUR_CONNECTION_STRING" -f supabase/migrations/20250107000002_phases_13_20.sql
psql "YOUR_CONNECTION_STRING" -f supabase/seed/agame_questions.sql
```

## Verification

After running the migrations, verify in Supabase Dashboard:

1. Go to **Table Editor**
2. You should see these new tables:
   - agame_questions
   - agame_responses
   - values_map
   - gpu_donations
   - compute_tasks
   - proposal_sessions
   - proposal_changes
   - proposal_comments
   - proposal_dependencies
   - proposal_templates
   - proposal_resources
   - ai_agents
   - agent_actions
   - agent_ratings
   - proposal_funding
   - funding_pledges
   - implementation_teams
   - moderation_actions
   - wave_applications_queue

3. Check that `profiles` table has new column:
   - agame_score (integer)

4. In **Database** → **Functions**, you should see:
   - get_next_agame_question
   - get_question_stats
   - update_values_map
   - get_platform_stats

## Testing

After setup, test the features:

1. **Landing Page**: http://localhost:3000
   - Black hole should render
   - Language selector should work

2. **Enter Page**: http://localhost:3000/enter
   - Black hole background
   - Language selection
   - Enter button should redirect to /hub

3. **Agame**: http://localhost:3000/hub/[hubId]/spectator/agame
   - Questions should load
   - Answering should save to database
   - Stats should show after each answer

4. **Values Map**: http://localhost:3000/values-map
   - Should show 7 value dimensions
   - 3D view should render
   - 2D cards should display

## Troubleshooting

### "Cannot find table agame_questions"
- Run the Phase 11 migration first
- Check SQL Editor for errors

### "Function does not exist"
- Make sure you ran the full migration file
- Check that functions were created in Database → Functions

### "Column agame_score does not exist"
- The profiles table might not exist yet
- Create it first or remove the ALTER TABLE line temporarily

### Hydration Errors
- Clear browser cache and localStorage
- Refresh the page
- Check browser console for specific errors

## Quick Start (Recommended)

The fastest way to get started:

1. Copy all three SQL files into one
2. Go to Supabase Dashboard → SQL Editor
3. Paste and Run
4. Start development server: `npm run dev`
5. Test at http://localhost:3000

That's it! You're ready to use all the new features.
