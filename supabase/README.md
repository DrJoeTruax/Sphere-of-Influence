# Supabase Setup Guide

## Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Create a new organization (if needed)
4. Click "New Project"
5. Choose a project name: `breakthrough-platform`
6. Set a strong database password (save it!)
7. Choose a region closest to your users
8. Click "Create new project"

## Step 2: Run Database Migration

1. Wait for your project to finish setting up (~2 minutes)
2. In your Supabase dashboard, go to **SQL Editor** (left sidebar)
3. Click "New Query"
4. Copy the entire contents of `supabase/schema.sql`
5. Paste into the SQL editor
6. Click "Run" (or press Cmd/Ctrl + Enter)
7. Verify success: You should see "Success. No rows returned"

## Step 3: Get Your API Keys

1. In Supabase dashboard, go to **Project Settings** > **API**
2. You'll see two important values:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **Project API keys**:
     - `anon` `public` key (safe to use in browser)
     - `service_role` key (⚠️ NEVER expose in browser!)

## Step 4: Configure Environment Variables

1. In your project root, create `.env.local`:

```bash
cp .env.local.example .env.local
```

2. Edit `.env.local` and add your values:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

3. **Important**: Never commit `.env.local` to git (already in `.gitignore`)

## Step 5: Enable Row Level Security

The schema automatically enables RLS on all tables. Verify in Supabase dashboard:

1. Go to **Database** > **Tables**
2. Click any table (e.g., `profiles`)
3. Click **Policies** tab
4. You should see policies listed (e.g., "Profiles are viewable by everyone")

## Step 6: Test Connection

Run the development server:

```bash
npm run dev
```

The app should connect to Supabase without errors. Check browser console for any connection issues.

## Database Schema Overview

### Core Tables
- **profiles**: User accounts and preferences
- **hubs**: 12 regional hubs + space station
- **hub_memberships**: User roles (Spectator/Builder) per hub
- **problem_categories**: 58 AGI problem categories

### Governance Tables
- **proposals**: Ideas submitted by Builders
- **votes**: Voting records (immutable audit trail)
- **comments**: Discussions on proposals

### Access Control
- **wave_applications**: Applications for Builder access
- **wave_grants**: Approved Builder permissions

### Communication
- **emergency_alerts**: Critical system-wide announcements
- **celebrations**: Consensus achievement events

### Auditing
- **activity_logs**: Complete audit trail of all actions

## Common Commands

### View all tables
```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public';
```

### Check RLS policies
```sql
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE schemaname = 'public';
```

### Count records in a table
```sql
SELECT COUNT(*) FROM profiles;
```

## Troubleshooting

### "relation does not exist" error
- Make sure you ran the full schema.sql migration
- Check you're connected to the right project

### RLS policy error
- RLS is enabled by default in our schema
- Check that you're authenticated when testing Builder features
- Use the Supabase Auth helper functions

### Connection timeout
- Verify your API keys are correct
- Check your internet connection
- Verify project is not paused (free tier pauses after inactivity)

## Next Steps

After setup is complete:
1. ✅ Database connected
2. ⬜ Set up authentication (Supabase Auth)
3. ⬜ Create test user accounts
4. ⬜ Seed initial hub data
5. ⬜ Build landing page
6. ⬜ Build 3D experience

## Resources

- [Supabase Docs](https://supabase.com/docs)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase Auth](https://supabase.com/docs/guides/auth)
