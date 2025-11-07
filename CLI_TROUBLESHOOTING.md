# Supabase CLI Not Found - Solutions

## ⚠️ Important: Global npm Install No Longer Supported

Supabase CLI **no longer supports** `npm install -g supabase`. This is why you're seeing inconsistent behavior.

## ✅ Recommended Solution: Use npx (No Install Needed)

The modern approach - just use `npx` before every command:

```powershell
# Login
npx supabase login

# Link project
npx supabase link --project-ref YOUR_PROJECT_REF

# Push migrations
npx supabase db push
```

This runs the CLI directly without any installation issues!

## Alternative Installation Methods

If you prefer a permanent installation instead of npx:

### Option 1: Scoop (Windows)
```powershell
scoop install supabase
```

### Option 2: Homebrew (Windows, Mac, Linux)
```powershell
brew install supabase/tap/supabase
```

### Option 3: Direct Binary Download
Download from: https://github.com/supabase/cli/releases

### Option 4: Docker
```powershell
docker pull supabase/cli
```

## Easiest Solution: Use Dashboard Instead

Since the CLI is being troublesome, just use the Supabase Dashboard:

1. Go to https://app.supabase.com
2. Open your project
3. Click **SQL Editor**
4. Run these files in order:

**File 1:** Copy `supabase/migrations/20250107000001_phase11_agame.sql`
- Paste into SQL Editor
- Click Run

**File 2:** Copy `supabase/migrations/20250107000002_phases_13_20.sql`
- Paste into SQL Editor
- Click Run

**File 3:** Copy `supabase/seed/agame_questions.sql`
- Paste into SQL Editor
- Click Run

Done! No CLI needed. Takes 2 minutes.

## Verify It Worked

After running the SQL:

1. In Supabase Dashboard, go to **Table Editor**
2. You should see these new tables:
   - agame_questions (with 100+ rows)
   - agame_responses
   - values_map
   - And many others

## Then Start Development

```powershell
npm run dev
```

Test at:
- http://localhost:3000 (landing page with black hole)
- http://localhost:3000/hub (solar system)
- http://localhost:3000/hub/north-america/spectator/agame (the game!)

---

**Recommended:** Use the Dashboard method. It's faster and works every time! 🚀
