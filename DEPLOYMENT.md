# Breakthrough Platform - Deployment Guide

## Pre-Deployment Checklist

### Code Quality
- [ ] All TypeScript errors resolved
- [ ] ESLint warnings reviewed and addressed
- [ ] Build completes successfully: `npm run build`
- [ ] No console.error or console.warn in production code
- [ ] All tests pass (if implemented)
- [ ] Code reviewed by at least one other developer

### Performance
- [ ] Lighthouse score > 90 on production build
- [ ] Bundle size analyzed and optimized
- [ ] Images optimized (WebP format, compressed)
- [ ] Fonts optimized (subset, woff2 format)
- [ ] Code splitting implemented
- [ ] Dynamic imports used for heavy components
- [ ] 3D assets optimized (< 5MB total)

### Security
- [ ] All environment variables configured
- [ ] No sensitive data in client-side code
- [ ] Security headers configured
- [ ] HTTPS enforced
- [ ] CORS properly configured
- [ ] Rate limiting implemented
- [ ] Input validation on all forms
- [ ] npm audit shows no high/critical vulnerabilities

### Database
- [ ] Supabase project created
- [ ] Database schema migrated: `supabase db push`
- [ ] RLS policies enabled on all tables
- [ ] Seed data inserted (if needed)
- [ ] Database indexes optimized
- [ ] Backup strategy configured

### Content
- [ ] All text reviewed for accuracy
- [ ] 7 Immutable Laws text verified
- [ ] Privacy policy published
- [ ] Terms of service published
- [ ] About page complete
- [ ] Contact information accurate

## Environment Setup

### Required Environment Variables

Create `.env.local` for development and configure in Vercel for production:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...  # Server-side only

# App
NEXT_PUBLIC_APP_URL=https://breakthrough-platform.org
NODE_ENV=production

# Analytics (optional)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Error Tracking (optional)
SENTRY_DSN=https://xxx@sentry.io/xxx
```

### Supabase Setup

1. **Create Project**
   ```bash
   # Sign up at https://supabase.com
   # Create new project: "breakthrough-platform"
   ```

2. **Run Migrations**
   ```bash
   # Install Supabase CLI
   npm install -g supabase

   # Link project
   supabase link --project-ref your-project-ref

   # Push schema
   supabase db push
   ```

3. **Configure Auth**
   - Navigate to Authentication > Settings
   - Set Site URL: `https://breakthrough-platform.org`
   - Add Redirect URLs: `https://breakthrough-platform.org/**`
   - Enable email auth
   - Configure email templates

4. **Enable Realtime**
   - Navigate to Database > Replication
   - Enable replication for: `emergency_alerts`

## Deployment Options

### Option 1: Vercel (Recommended)

Vercel is optimized for Next.js and provides excellent performance.

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   # Preview deployment
   vercel

   # Production deployment
   vercel --prod
   ```

4. **Configure Project**
   - Add environment variables in Vercel dashboard
   - Enable automatic deployments from GitHub
   - Configure custom domain

5. **Set Build Settings**
   ```
   Framework Preset: Next.js
   Build Command: npm run build
   Output Directory: .next
   Install Command: npm install
   ```

### Option 2: Netlify

1. **Connect Repository**
   - Sign up at https://netlify.com
   - Click "New site from Git"
   - Authorize GitHub and select repository

2. **Configure Build**
   ```
   Build command: npm run build
   Publish directory: .next
   ```

3. **Add Environment Variables**
   - Navigate to Site settings > Environment variables
   - Add all required variables from `.env.local`

4. **Deploy**
   - Click "Deploy site"
   - Enable automatic deploys from main branch

### Option 3: Docker + VPS

1. **Create Dockerfile**
   ```dockerfile
   FROM node:18-alpine AS builder
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci
   COPY . .
   RUN npm run build

   FROM node:18-alpine AS runner
   WORKDIR /app
   ENV NODE_ENV=production
   COPY --from=builder /app/next.config.js ./
   COPY --from=builder /app/public ./public
   COPY --from=builder /app/.next ./.next
   COPY --from=builder /app/node_modules ./node_modules
   COPY --from=builder /app/package.json ./package.json

   EXPOSE 3000
   CMD ["npm", "start"]
   ```

2. **Build Image**
   ```bash
   docker build -t breakthrough-platform .
   ```

3. **Run Container**
   ```bash
   docker run -p 3000:3000 \
     -e NEXT_PUBLIC_SUPABASE_URL=$SUPABASE_URL \
     -e NEXT_PUBLIC_SUPABASE_ANON_KEY=$SUPABASE_ANON_KEY \
     breakthrough-platform
   ```

4. **Deploy to VPS**
   - Use Docker Compose or Kubernetes
   - Configure reverse proxy (Nginx/Caddy)
   - Set up SSL with Let's Encrypt

## Domain Configuration

### DNS Records

Point your domain to your hosting provider:

**For Vercel:**
```
Type: CNAME
Name: @
Value: cname.vercel-dns.com
```

**For custom server:**
```
Type: A
Name: @
Value: [Your server IP]

Type: AAAA (IPv6)
Name: @
Value: [Your server IPv6]
```

### SSL Certificate

- **Vercel**: Automatic SSL via Let's Encrypt
- **Netlify**: Automatic SSL via Let's Encrypt
- **Custom VPS**: Use Certbot

```bash
# Install Certbot
sudo apt-get install certbot

# Generate certificate
sudo certbot certonly --standalone -d breakthrough-platform.org
```

## Post-Deployment

### Verification Checklist

- [ ] Site loads at production URL
- [ ] HTTPS working (no mixed content warnings)
- [ ] All pages accessible
- [ ] Forms submit successfully
- [ ] 3D scenes load and perform well
- [ ] Database connections working
- [ ] Authentication flow works
- [ ] Real-time updates work (if Supabase configured)
- [ ] Error pages display correctly (404, 500)
- [ ] Mobile responsive on real devices

### Performance Testing

```bash
# Test with Lighthouse
npx lighthouse https://breakthrough-platform.org --view

# Test with WebPageTest
# Visit https://www.webpagetest.org

# Load test with Artillery
artillery quick --count 100 --num 10 https://breakthrough-platform.org
```

### Monitoring Setup

1. **Vercel Analytics**
   - Enable in Vercel dashboard
   - Tracks Core Web Vitals automatically

2. **Google Analytics**
   ```typescript
   // Add to _app.tsx
   import { useEffect } from 'react'
   import { useRouter } from 'next/router'

   declare global {
     interface Window {
       gtag: (...args: unknown[]) => void
     }
   }

   export default function App({ Component, pageProps }: AppProps) {
     const router = useRouter()

     useEffect(() => {
       const handleRouteChange = (url: string) => {
         window.gtag('config', process.env.NEXT_PUBLIC_GA_ID!, {
           page_path: url,
         })
       }

       router.events.on('routeChangeComplete', handleRouteChange)
       return () => {
         router.events.off('routeChangeComplete', handleRouteChange)
       }
     }, [router.events])

     return <Component {...pageProps} />
   }
   ```

3. **Error Tracking (Sentry)**
   ```bash
   npm install @sentry/nextjs

   # Initialize
   npx @sentry/wizard -i nextjs
   ```

4. **Uptime Monitoring**
   - Use UptimeRobot (free)
   - Monitor every 5 minutes
   - Alert via email/SMS on downtime

## Rollback Procedure

### On Vercel

1. Navigate to Deployments
2. Find last working deployment
3. Click "..." menu > "Promote to Production"

### On Custom Server

1. **Using Git**
   ```bash
   # Find last working commit
   git log

   # Revert to that commit
   git reset --hard [commit-hash]

   # Force push (if needed)
   git push -f origin main

   # Rebuild and restart
   npm run build
   pm2 restart breakthrough-platform
   ```

2. **Using Docker**
   ```bash
   # List images
   docker images

   # Run previous version
   docker run -p 3000:3000 breakthrough-platform:[previous-tag]
   ```

## Scaling Considerations

### When to Scale

Monitor these metrics:
- Response time > 1 second (p95)
- Error rate > 1%
- CPU usage > 80% sustained
- Memory usage > 80% sustained
- Concurrent users > 10,000

### Horizontal Scaling

**Vercel**: Automatic, scales to millions of requests

**Custom Server**:
```bash
# Use PM2 cluster mode
pm2 start npm --name "breakthrough" -i max -- start

# Or use load balancer
# Nginx upstream configuration
upstream breakthrough {
    server 127.0.0.1:3001;
    server 127.0.0.1:3002;
    server 127.0.0.1:3003;
}
```

### Database Scaling

**Supabase**:
- Upgrade to higher tier
- Enable read replicas
- Implement connection pooling
- Add indexes to slow queries

### CDN Configuration

Use Vercel Edge Network or Cloudflare:

```javascript
// next.config.js
module.exports = {
  images: {
    domains: ['cdn.breakthrough-platform.org'],
    formats: ['image/avif', 'image/webp'],
  },
  async headers() {
    return [
      {
        source: '/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]
  },
}
```

## Backup & Recovery

### Database Backups

Supabase provides automatic backups:
- Daily backups (retained 7 days)
- Point-in-time recovery

**Manual backup:**
```bash
# Export database
pg_dump -h db.xxx.supabase.co -U postgres breakthrough > backup.sql

# Restore database
psql -h db.xxx.supabase.co -U postgres breakthrough < backup.sql
```

### Code Backups

- GitHub repository (primary)
- Local clones on team machines
- Archive releases on GitHub

### Asset Backups

- Supabase Storage has built-in redundancy
- Consider additional S3 bucket for critical assets

## Maintenance Windows

Schedule maintenance for low-traffic periods:
- Sundays 2 AM - 4 AM UTC
- Notify users 48 hours in advance
- Use emergency alert system

## Support & Documentation

### User Support Channels

1. **Email**: support@breakthrough-platform.org
2. **GitHub Issues**: For bug reports
3. **Discord**: For community support (if created)

### Internal Documentation

Maintain these docs:
- Architecture diagrams
- Database schema
- API documentation
- Runbook for common issues
- Incident response procedures

## Launch Announcement

### Pre-Launch (1 week before)

- [ ] Press release drafted
- [ ] Social media accounts created
- [ ] Community moderators recruited
- [ ] Support email configured
- [ ] Launch blog post written

### Launch Day

- [ ] Deploy to production
- [ ] Verify all systems operational
- [ ] Publish press release
- [ ] Post on social media
- [ ] Monitor for issues
- [ ] Respond to user feedback

### Post-Launch (First week)

- [ ] Daily health checks
- [ ] Monitor user feedback
- [ ] Hot-fix critical issues immediately
- [ ] Publish post-launch report
- [ ] Thank early adopters

---

**Last Updated**: Phase 10 - Testing
**Version**: v1.0
**Deployment Lead**: [To be assigned]
