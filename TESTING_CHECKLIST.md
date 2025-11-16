# Breakthrough Platform - Pre-Launch Testing Checklist

## Critical Path Testing (Must Pass Before Launch)

### 1. Database Setup ✓
- [x] Supabase project created
- [ ] Environment variables configured in `.env.local`
- [ ] All migrations run successfully
- [ ] 12 hubs seeded correctly
- [ ] 58 problem categories seeded
- [ ] Trust scores tables created
- [ ] Anomaly detection tables created

### 2. Authentication Flow
- [ ] User can sign up with email
- [ ] User receives confirmation email
- [ ] User can sign in
- [ ] User can sign out
- [ ] Session persists across page refreshes
- [ ] Password reset works

### 3. Hub Selection & Entry
- [ ] Landing page loads without errors
- [ ] /enter page displays correctly
- [ ] Language selector works
- [ ] "ENTER" button navigates to /hub
- [ ] 3D Earth scene renders
- [ ] All 12 regional hubs visible
- [ ] Space Station visible and selectable
- [ ] Clicking hub shows details
- [ ] Arrow keys cycle through hubs
- [ ] "Confirm Selection" navigates to role page

### 4. Role Selection
- [ ] Role selection page displays correctly
- [ ] Both roles (Spectator/Builder) are clickable
- [ ] Preview modals open correctly
- [ ] "Confirm" button works
- [ ] Navigates to correct hub-specific page
- [ ] Selection saved to localStorage

### 5. Spectator Experience
- [ ] Spectator landing page loads
- [ ] "Play Agame" button visible
- [ ] Agame question loads
- [ ] User can select answer
- [ ] Answer is saved to database
- [ ] Next question loads
- [ ] Values map updates (if implemented)
- [ ] GPU donation option visible (Phase 13)

### 6. Builder Experience
- [ ] Builder landing page loads
- [ ] Forum/proposals view visible
- [ ] User can view proposals
- [ ] User can vote on proposals
- [ ] User can comment on proposals
- [ ] "Submit Proposal" requires Wave access
- [ ] Wave application form works
- [ ] Vote counts update in real-time

### 7. Proposal Submission (Builders with Wave Access)
- [ ] Submit proposal form loads
- [ ] All 58 categories available in dropdown
- [ ] Title and content fields work
- [ ] Markdown preview works
- [ ] Submit button creates proposal
- [ ] Proposal appears in hub forum
- [ ] Author can see their proposal

### 8. Voting System
- [ ] Builders can vote For/Against/Abstain
- [ ] Vote is saved to database
- [ ] Vote counts update immediately
- [ ] Cannot vote twice on same proposal
- [ ] Trust score affects vote weight (if user has low score)
- [ ] Consensus celebration triggers at threshold

### 9. Emergency Alerts
- [ ] Emergency alert displays if active
- [ ] User can dismiss alert
- [ ] Alert appears on all pages
- [ ] Dismissed alerts don't reappear

### 10. Mobile Optimization
- [ ] Site loads on mobile (< 768px width)
- [ ] 2D layout renders correctly
- [ ] Touch interactions work
- [ ] Navigation is usable
- [ ] PWA manifest loads
- [ ] "Add to Home Screen" prompt appears
- [ ] Service worker registers
- [ ] Basic offline functionality works

### 11. Legal Pages
- [ ] /terms page loads
- [ ] /privacy page loads
- [ ] /code-of-conduct page loads
- [ ] All links between pages work
- [ ] Content is readable and formatted

### 12. Anomaly Dashboard
- [ ] /admin/anomalies page loads
- [ ] Tabs switch correctly
- [ ] Real-time updates work
- [ ] Anomaly data displays correctly
- [ ] Trust scores table renders
- [ ] Patterns table renders
- [ ] No console errors

## Performance Testing

- [ ] Homepage loads in < 3 seconds
- [ ] 3D scenes render smoothly (>30fps)
- [ ] Database queries return in < 500ms
- [ ] Real-time subscriptions connect quickly
- [ ] No memory leaks after extended use

## Security Testing

- [ ] SQL injection attempts fail
- [ ] XSS attempts are sanitized
- [ ] CSRF tokens protect forms
- [ ] Unauthenticated users cannot access protected routes
- [ ] Users cannot vote/comment as others
- [ ] Database RLS policies enforced

## Browser Compatibility

- [ ] Chrome/Edge (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Mobile Safari (iOS)
- [ ] Mobile Chrome (Android)

## Console Checks

- [ ] No errors on fresh page load
- [ ] No warnings about missing dependencies
- [ ] No 404s for missing assets
- [ ] Supabase connection successful
- [ ] Real-time subscriptions active

## Data Integrity

- [ ] Votes are immutable (cannot change)
- [ ] Activity logs capture all actions
- [ ] Trust scores calculate correctly
- [ ] Anomaly detection triggers on test data
- [ ] Hub membership persists

## Edge Cases

- [ ] Empty state messages display correctly
- [ ] Loading states work properly
- [ ] Error boundaries catch React errors
- [ ] Network errors handled gracefully
- [ ] Supabase downtime doesn't crash app
- [ ] Large proposals render without freezing

## Accessibility

- [ ] Keyboard navigation works
- [ ] Screen reader compatible (ARIA labels)
- [ ] Color contrast meets WCAG AA
- [ ] Focus indicators visible
- [ ] All interactive elements have labels

## Final Pre-Launch Checks

- [ ] README updated with setup instructions
- [ ] Environment variables documented
- [ ] Deployment guide written
- [ ] Backup plan in place
- [ ] Monitoring/alerting configured
- [ ] Support channels ready (Discord/email)
- [ ] Legal pages reviewed
- [ ] Privacy policy GDPR compliant

## Post-Launch Monitoring (First 24 Hours)

- [ ] User signups working
- [ ] Database performance acceptable
- [ ] No spike in errors
- [ ] Trust scores updating
- [ ] Anomaly detection active
- [ ] Real-time features working
- [ ] Mobile users can access
- [ ] International users can connect

---

## Testing Instructions

### Setting Up Test Environment

1. **Clone the repository:**
   ```bash
   git clone https://github.com/DrJoeTruax/Sphere-of-Influence.git
   cd Sphere-of-Influence
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create `.env.local`:**
   ```bash
   cp .env.local.example .env.local
   # Edit .env.local and add your Supabase credentials
   ```

4. **Run migrations:**
   ```bash
   # In Supabase dashboard, go to SQL Editor and run:
   # - supabase/migrations/20250107000000_base_schema.sql
   # - supabase/migrations/20250107000001_phase11_agame.sql
   # - supabase/migrations/20250107000002_phases_13_20.sql
   # - supabase/migrations/20250107000003_launch_blockers.sql
   ```

5. **Start development server:**
   ```bash
   npm run dev
   ```

6. **Open browser:**
   ```
   http://localhost:3000
   ```

### Manual Testing Flow

1. **New User Journey:**
   - Open incognito window
   - Navigate to homepage
   - Click "Enter Platform"
   - Select language
   - Choose hub
   - Choose role
   - Complete first action (Agame or proposal vote)

2. **Builder Journey:**
   - Create account
   - Select hub
   - Choose Builder role
   - Vote on 3 proposals
   - Comment on 1 proposal
   - Apply for Wave access
   - (If granted) Submit proposal

3. **Spectator Journey:**
   - Create account
   - Select hub
   - Choose Spectator role
   - Play 5 Agame questions
   - View values map
   - Explore forum (read-only)

### Automated Testing (Future)

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Coverage
npm run test:coverage
```

---

## Known Issues / Limitations

1. **3D Performance:** May be slow on older mobile devices
2. **Offline Mode:** Limited to cached pages only
3. **Icons:** Placeholder icons need to be replaced with actual designs
4. **Email:** Supabase email templates need customization
5. **Localization:** Translation strings need professional review

## Launch Readiness Score

Calculate score by dividing completed checklist items by total items.

**Target for Launch: 95%+ (Critical items must be 100%)**
