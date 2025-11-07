# Quick Database Setup with Supabase CLI

You have Supabase CLI installed! Here's how to set up your database:

## Step 1: Link to Your Project

```bash
# Login to Supabase (opens browser)
supabase login

# Link to your project
supabase link --project-ref YOUR_PROJECT_REF
```

**To find your PROJECT_REF:**
1. Go to https://app.supabase.com
2. Select your project
3. Go to Settings → General
4. Copy the "Reference ID"

## Step 2: Push Migrations

```bash
# Navigate to your project root
cd C:\Users\fcp\Documents\Projects\.SphereOfInfluence\Sphere-of-Influence

# Push all migrations to your database
supabase db push
```

This will run both migration files:
- `20250107000001_phase11_agame.sql` (Agame tables)
- `20250107000002_phases_13_20.sql` (All other phases)

## Step 3: Seed the Data

Unfortunately, Supabase CLI doesn't have a direct seed command for custom SQL files, so you have two options:

### Option A: Using psql (if you have it)

Get your database connection string:
1. Go to Supabase Dashboard → Settings → Database
2. Copy the connection string
3. Run:

```bash
psql "YOUR_CONNECTION_STRING" -f supabase/seed/agame_questions.sql
```

### Option B: Using Supabase Dashboard (Easier)

1. Go to https://app.supabase.com
2. Open your project
3. Click **SQL Editor**
4. Copy the contents of `supabase/seed/agame_questions.sql`
5. Paste and click **Run**

This will insert 100+ ethical questions for Project Agame.

## Step 4: Verify Setup

Check that everything worked:

```bash
# See all tables
supabase db list-tables
```

You should see:
- agame_questions
- agame_responses
- values_map
- gpu_donations
- compute_tasks
- proposal_sessions
- And many more...

## Step 5: Start Development

```bash
npm run dev
```

Then test:
- Landing page: http://localhost:3000
- Enter page: http://localhost:3000/enter
- Hub selection: http://localhost:3000/hub
- Agame: http://localhost:3000/hub/north-america/spectator/agame
- Values Map: http://localhost:3000/values-map

## Troubleshooting

### "Failed to link project"
- Make sure you're logged in: `supabase login`
- Check your project reference ID is correct
- Ensure you have access to the project

### "Migration failed"
- Check if tables already exist
- Look at error message for specific table/function
- You can run migrations manually via dashboard SQL Editor

### "Cannot find seed file"
- Make sure you're in the project root directory
- Check the file exists at `supabase/seed/agame_questions.sql`

## Quick Alternative: Dashboard Only

If you prefer not to use CLI:

1. Go to Supabase Dashboard → SQL Editor
2. Copy/paste these files in order:
   - `supabase/migrations/20250107000001_phase11_agame.sql`
   - `supabase/migrations/20250107000002_phases_13_20.sql`
   - `supabase/seed/agame_questions.sql`
3. Click Run after each one

That's it! You're ready to go! 🚀
