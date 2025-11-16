# Breakthrough Platform - Deployment Guide

## Prerequisites

- Supabase account (https://supabase.com)
- Vercel account (recommended) or any Next.js hosting
- Domain name (optional, Vercel provides free subdomain)
- Node.js 18+ installed locally

## 1. Supabase Setup

### Create Supabase Project

1. Go to https://app.supabase.com
2. Click "New Project"
3. Choose organization and project name
4. Select region closest to your primary user base
5. Generate strong database password
6. Wait for project to provision (~2 minutes)

### Get API Credentials

1. In Supabase dashboard, go to **Settings > API**
2. Copy the following:
   - `URL` (Project URL)
   - `anon` `public` (Anon key)
3. Save these for later

### Run Database Migrations

1. In Supabase dashboard, go to **SQL Editor**
2. Create a new query
3. Run each migration file in order:

**Migration 1: Base Schema**
```sql
-- Copy/paste contents of supabase/migrations/20250107000000_base_schema.sql
-- Click "Run"
```

**Migration 2: Agame Tables**
```sql
-- Copy/paste contents of supabase/migrations/20250107000001_phase11_agame.sql
-- Click "Run"
```

**Migration 3: Additional Features**
```sql
-- Copy/paste contents of supabase/migrations/20250107000002_phases_13_20.sql
-- Click "Run"
```

**Migration 4: Launch Blockers**
```sql
-- Copy/paste contents of supabase/migrations/20250107000003_launch_blockers.sql
-- Click "Run"
```

### Verify Database Setup

1. Go to **Table Editor**
2. Confirm these tables exist:
   - hubs (12 rows)
   - problem_categories (58 rows)
   - trust_scores
   - value_anomaly_alerts
   - voucher_chains
   - All other tables from schema

### Configure Authentication

1. Go to **Authentication > Providers**
2. Enable **Email** provider
3. Customize email templates:
   - Go to **Authentication > Email Templates**
   - Edit "Confirm signup" template
   - Edit "Reset password" template
4. Optional: Enable OAuth providers (Google, GitHub, etc.)

### Set Up Row Level Security (RLS)

The migrations already include RLS policies, but verify:

1. Go to **Authentication > Policies**
2. Confirm policies exist for:
   - profiles (users can read all, update own)
   - proposals (users can read all, builders can create)
   - votes (users can read all, insert own)
   - comments (users can read all, create own)

## 2. Local Development Setup

### Clone Repository

```bash
git clone https://github.com/DrJoeTruax/Sphere-of-Influence.git
cd Sphere-of-Influence
```

### Install Dependencies

```bash
npm install
```

### Configure Environment Variables

Create `.env.local`:

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### Run Development Server

```bash
npm run dev
```

Open http://localhost:3000

### Test Locally

Follow the **TESTING_CHECKLIST.md** to verify everything works.

## 3. Production Deployment (Vercel)

### Connect to Vercel

1. Go to https://vercel.com
2. Click "Add New Project"
3. Import your GitHub repository
4. Select the `Sphere-of-Influence` repo

### Configure Environment Variables

In Vercel project settings:

1. Go to **Settings > Environment Variables**
2. Add the following variables:

```
NEXT_PUBLIC_SUPABASE_URL = https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = your-anon-key-here
```

3. Make sure they're available for:
   - Production
   - Preview
   - Development

### Deploy

1. Vercel will auto-deploy from `main` branch
2. Wait for build to complete (~2-5 minutes)
3. Visit the provided URL (e.g., `your-project.vercel.app`)

### Configure Custom Domain (Optional)

1. In Vercel, go to **Settings > Domains**
2. Add your custom domain
3. Follow DNS configuration instructions
4. Wait for SSL certificate provisioning

### Enable Production Branch Protection

1. Go to GitHub repository settings
2. **Branches > Add rule**
3. Protect `main` branch:
   - Require pull request reviews
   - Require status checks (Vercel deployment)

## 4. Post-Deployment Configuration

### Update Supabase Redirect URLs

1. In Supabase dashboard, go to **Authentication > URL Configuration**
2. Add your production URL to:
   - **Site URL:** `https://your-domain.com`
   - **Redirect URLs:**
     - `https://your-domain.com/**`
     - `http://localhost:3000/**` (for local dev)

### Set Up Monitoring

**Vercel Analytics:**
1. Enable in Vercel project settings
2. Track page views, performance

**Supabase Logs:**
1. Go to **Logs** in Supabase dashboard
2. Monitor database queries, errors

**Error Tracking (Optional):**
```bash
npm install @sentry/nextjs
npx @sentry/wizard -i nextjs
```

### Configure Email Service

**Supabase SMTP (Recommended for production):**
1. Go to **Settings > Auth > SMTP Settings**
2. Configure your SMTP provider (SendGrid, Mailgun, etc.)
3. Test email delivery

### Set Up Backups

**Automatic (Supabase Pro):**
- Daily automatic backups included

**Manual:**
1. Go to **Database > Backups**
2. Download backup file
3. Store securely

## 5. Launch Checklist

### Pre-Launch

- [ ] All migrations run successfully
- [ ] Environment variables set in Vercel
- [ ] Custom domain configured (if applicable)
- [ ] SSL certificate active
- [ ] Email authentication working
- [ ] Legal pages live (/terms, /privacy, /code-of-conduct)
- [ ] Testing checklist 95%+ complete
- [ ] Monitoring tools configured
- [ ] Backup plan in place

### Launch Day

- [ ] Announce on social media
- [ ] Monitor error logs closely
- [ ] Watch database performance
- [ ] Be ready to rollback if critical issues
- [ ] Respond to user feedback quickly

### Post-Launch (First Week)

- [ ] Daily database backups
- [ ] Monitor trust scores system
- [ ] Check anomaly detection
- [ ] Gather user feedback
- [ ] Fix critical bugs immediately
- [ ] Plan first feature updates

## 6. Scaling Considerations

### Database Optimization

When you reach 10,000+ users:

- Upgrade Supabase plan (more connections)
- Add database indexes for slow queries
- Consider read replicas

### CDN & Caching

- Vercel automatically provides CDN
- Enable ISR (Incremental Static Regeneration) for static pages
- Cache proposal data with `revalidate`

### Real-time Connections

Supabase limits real-time connections by plan:
- Free: 200 concurrent
- Pro: 500 concurrent
- Enterprise: Custom

### Cost Estimates

**Free Tier (< 500 users):**
- Supabase: Free
- Vercel: Free
- Total: $0/month

**Small Scale (500-5,000 users):**
- Supabase Pro: $25/month
- Vercel Pro: $20/month
- Total: $45/month

**Medium Scale (5,000-50,000 users):**
- Supabase Pro: $25/month
- Vercel Pro: $20/month
- Additional database compute: ~$50/month
- Total: $95/month

## 7. Troubleshooting

### "Supabase not configured" error

- Check `.env.local` exists and has correct values
- Restart dev server after changing env vars
- In production, verify Vercel environment variables

### Database connection errors

- Check Supabase project is not paused (free tier pauses after 1 week inactivity)
- Verify database password is correct
- Check IP allowlist (if configured)

### Real-time subscriptions not working

- Verify Realtime is enabled in Supabase project settings
- Check browser console for WebSocket errors
- Confirm RLS policies allow reading

### Email not sending

- Check SMTP settings in Supabase
- Verify email templates are configured
- Check spam folder
- Test with different email provider

### Build errors on Vercel

- Check build logs in Vercel dashboard
- Verify all dependencies in `package.json`
- Ensure TypeScript errors are fixed
- Check if any files are missing

## 8. Rollback Plan

If critical issues occur post-launch:

### Option 1: Revert Deployment

```bash
# In Vercel dashboard
1. Go to "Deployments"
2. Find last working deployment
3. Click "..." menu > "Promote to Production"
```

### Option 2: Emergency Maintenance

1. Create a simple `pages/maintenance.tsx`:
```tsx
export default function Maintenance() {
  return <div>Platform under maintenance. Back soon!</div>
}
```

2. Redirect all traffic to maintenance page in `next.config.js`

### Option 3: Database Rollback

1. In Supabase, go to **Database > Backups**
2. Restore from last known good backup
3. Warning: This loses recent data!

## 9. Support & Community

- **Documentation:** https://docs.breakthrough.example.com
- **GitHub Issues:** https://github.com/DrJoeTruax/Sphere-of-Influence/issues
- **Discord:** (Set up community Discord server)
- **Email:** support@breakthrough.example.com

## 10. Legal Compliance

### GDPR (Europe)

- Privacy policy updated ✓
- Data export functionality (implement)
- Data deletion requests (implement)
- Cookie consent (implement if using analytics)

### CCPA (California)

- Privacy policy covers California residents ✓
- Opt-out mechanism (implement)

### Age Restrictions

- Terms specify 13+ age requirement ✓
- Consider age verification for <18

---

## Quick Reference Commands

```bash
# Install dependencies
npm install

# Run locally
npm run dev

# Build for production
npm run build

# Start production server (test locally)
npm start

# Type check
npm run type-check

# Lint
npm run lint

# Format code
npm run format
```

## Emergency Contacts

- **Platform Lead:** [Your Name]
- **Database Admin:** [Name]
- **DevOps:** [Name]
- **Supabase Support:** https://supabase.com/support

---

**Last Updated:** January 2025
