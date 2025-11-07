# 🚀 Quick Start - Database Setup

## Step 1: Login to Supabase

```powershell
npx supabase login
```

This will open your browser for authentication.

## Step 2: Get Your Project Reference ID

1. Go to https://app.supabase.com
2. Select your project
3. Go to **Settings** → **General**
4. Copy the **Reference ID** (looks like: `abcdefghijklmnop`)

## Step 3: Link Your Project

```powershell
npx supabase link --project-ref YOUR_PROJECT_REF
```

Replace `YOUR_PROJECT_REF` with the ID you copied.

## Step 4: Push Database Migrations

```powershell
npx supabase db push
```

This will create all the tables for:
- Phase 11: Project Agame (agame_questions, agame_responses, values_map)
- Phases 13-20: All future features

## Step 5: Seed Agame Questions

You have two options:

### Option A: Dashboard (Easiest)
1. Go to https://app.supabase.com
2. Open your project
3. Click **SQL Editor**
4. Copy contents of `supabase/seed/agame_questions.sql`
5. Paste and click **Run**

### Option B: psql (If you have PostgreSQL client)
1. Get connection string from Dashboard → Settings → Database
2. Run:
```powershell
psql "YOUR_CONNECTION_STRING" -f supabase/seed/agame_questions.sql
```

## Step 6: Start Development

```powershell
npm run dev
```

## Step 7: Test Everything

Open these URLs:

1. **Landing Page**: http://localhost:3000
   - Should show black hole with gravitational text
   - Language selector should work

2. **Enter Page**: http://localhost:3000/enter
   - Black hole background
   - Beautiful language selection
   - Enter button → hub selection

3. **Hub Selection**: http://localhost:3000/hub
   - Choose a regional hub
   - Select role (Spectator or Builder)

4. **Project Agame**: http://localhost:3000/hub/north-america/spectator/agame
   - Should load ethical dilemma questions
   - Answer and see global stats
   - Track your streak

5. **Values Map**: http://localhost:3000/values-map
   - 3D/2D visualization
   - Shows what humanity values in real-time

## Troubleshooting

### "Failed to link project"
- Make sure you're logged in: `npx supabase login`
- Double-check your project reference ID
- Ensure you have access to the project

### "Migration failed"
- Check if tables already exist in your database
- Look at the error message for specific issues
- You can always run the SQL manually via Dashboard

### "Questions not loading in Agame"
- Make sure you ran the seed file
- Check that `agame_questions` table has rows
- Look at browser console for errors

---

**Need help?** Check these files:
- `CLI_TROUBLESHOOTING.md` - CLI issues
- `DATABASE_SETUP_GUIDE.md` - Alternative setup methods
- `PHASES_11_20_README.md` - Full feature documentation

**Ready to go!** 🎮✨
