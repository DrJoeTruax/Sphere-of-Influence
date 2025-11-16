# How to Run Database Migrations

## Step 1: Open Supabase SQL Editor

1. Go to https://app.supabase.com
2. Select your project (giddqwmuqtefygjxmbzv)
3. Click **SQL Editor** in the left sidebar
4. Click **New query**

## Step 2: Run Each Migration in Order

### Migration 1: Base Schema (MOST IMPORTANT)

1. Open file: `supabase/migrations/20250107000000_base_schema.sql`
2. Copy ALL contents
3. Paste into Supabase SQL Editor
4. Click **Run** (bottom right)
5. Wait for "Success" message

### Migration 2: Agame Tables

1. Open file: `supabase/migrations/20250107000001_phase11_agame.sql`
2. Copy ALL contents
3. Paste into Supabase SQL Editor
4. Click **Run**
5. Wait for "Success"

### Migration 3: Additional Features

1. Open file: `supabase/migrations/20250107000002_phases_13_20.sql`
2. Copy ALL contents
3. Paste into Supabase SQL Editor
4. Click **Run**
5. Wait for "Success"

### Migration 4: Launch Blockers (NEW)

1. Open file: `supabase/migrations/20250107000003_launch_blockers.sql`
2. Copy ALL contents
3. Paste into Supabase SQL Editor
4. Click **Run**
5. Wait for "Success"

## Step 3: Verify Data Was Seeded

After running all migrations:

1. In Supabase, click **Table Editor** (left sidebar)
2. You should see these tables:
   - `hubs` - should have 12 rows
   - `problem_categories` - should have 58 rows
   - `trust_scores` - will be empty (that's fine)
   - Many other tables

## If You Get Errors

### "relation already exists"
- This means you already ran that migration before
- Skip to the next migration

### "permission denied"
- You might not have admin access
- Contact project owner

### "syntax error"
- Make sure you copied the ENTIRE file
- Check that you didn't accidentally modify the SQL

## After All Migrations Are Run

Come back here and run:
```bash
npm run dev
```

Then visit http://localhost:3000/hub

You should now be able to see and select hubs!
