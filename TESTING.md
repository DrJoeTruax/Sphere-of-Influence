# Breakthrough Platform - Testing Guide

## Overview

This document outlines testing procedures for the Breakthrough Platform v1.0. The platform must meet strict performance, security, and functionality requirements before launch.

## Performance Requirements

### 3D Performance Targets
- **Desktop**: 60 FPS sustained
- **Mobile**: 30 FPS minimum
- **Load Time**: < 3 seconds to First Contentful Paint
- **Concurrent Users**: 10,000+ supported

### Testing 3D Performance

1. **Frame Rate Testing**
   ```typescript
   // In browser console:
   let frames = 0;
   let lastTime = performance.now();

   function measureFPS() {
     frames++;
     const now = performance.now();
     if (now >= lastTime + 1000) {
       console.log(`FPS: ${frames}`);
       frames = 0;
       lastTime = now;
     }
     requestAnimationFrame(measureFPS);
   }
   measureFPS();
   ```

2. **Load Time Testing**
   ```typescript
   // Check First Contentful Paint
   performance.getEntriesByType('paint').forEach(entry => {
     console.log(`${entry.name}: ${entry.startTime}ms`);
   });
   ```

3. **Memory Usage**
   - Open Chrome DevTools > Performance > Memory
   - Record during 5-minute session
   - Check for memory leaks (increasing trend)
   - Target: < 200MB for 3D scenes

## Functional Testing

### Phase 1-8 Feature Checklist

#### Entry Flow
- [ ] Starfield loads and animates smoothly
- [ ] 12 languages selectable
- [ ] Opening screen displays core message
- [ ] Language preference persists

#### 3D Navigation
- [ ] Solar system animates from space to Earth
- [ ] Earth rotates with 12 hub markers visible
- [ ] Space station orbits correctly
- [ ] Hub markers clickable and labeled
- [ ] Camera controls work (drag, zoom)

#### Role Selection
- [ ] Spectator and Builder roles display
- [ ] Role preview modals open correctly
- [ ] Role selection navigates appropriately

#### 3D Forum
- [ ] Proposals display in spiral arrangement
- [ ] Proposal panels are clickable
- [ ] Hover effects work
- [ ] Selected proposal highlights
- [ ] OrbitControls functional

#### 2D Forum (Mobile)
- [ ] Card layout displays correctly
- [ ] Vote counts visible
- [ ] Consensus bars animate
- [ ] Touch scrolling works smoothly
- [ ] Cards are tappable

#### Voting System
- [ ] Vote buttons appear (For/Against/Abstain)
- [ ] Confirmation modal displays
- [ ] Vote is recorded
- [ ] Vote counts update
- [ ] Already-voted state prevents re-voting
- [ ] Consensus celebration triggers at 75%

#### Wave System
- [ ] Application form validates (word counts)
- [ ] Application submits successfully
- [ ] Review interface displays applications
- [ ] Approve/reject actions work
- [ ] Proposal submission checks Wave access
- [ ] Gate screen displays for non-Wave users

#### Emergency Alerts
- [ ] Alerts display with correct severity styling
- [ ] Auto-dismiss timer works
- [ ] Critical alerts cannot be dismissed early
- [ ] Multiple alerts stack properly
- [ ] Real-time updates work (if Supabase configured)

#### Celebrations
- [ ] Confetti triggers on consensus
- [ ] 200+ particles animate smoothly
- [ ] Celebration modal displays correctly
- [ ] Social sharing buttons present
- [ ] Dismissible via click

### Cross-Browser Testing

Test on:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Chrome Mobile
- [ ] Safari Mobile

### Responsive Testing

Test at breakpoints:
- [ ] 320px (mobile small)
- [ ] 375px (mobile medium)
- [ ] 768px (tablet)
- [ ] 1024px (desktop small)
- [ ] 1920px (desktop large)
- [ ] 2560px (desktop XL)

## Accessibility Testing

### Screen Reader Testing
- [ ] Test with NVDA (Windows)
- [ ] Test with JAWS (Windows)
- [ ] Test with VoiceOver (Mac/iOS)
- [ ] All interactive elements have labels
- [ ] Form inputs have associated labels
- [ ] Modals trap focus correctly

### Keyboard Navigation
- [ ] Tab through all interactive elements
- [ ] Enter/Space activate buttons
- [ ] Escape closes modals
- [ ] Focus indicators visible
- [ ] No keyboard traps

### Color Contrast
- [ ] All text meets WCAG AA (4.5:1)
- [ ] Interactive elements meet WCAG AA (3:1)
- [ ] Test with high contrast mode

## Security Testing

### Input Validation
- [ ] XSS prevention in text inputs
- [ ] SQL injection prevention (Supabase RLS)
- [ ] CSRF protection on forms
- [ ] File upload restrictions (if added)
- [ ] Rate limiting on submissions

### Authentication & Authorization
- [ ] Row Level Security enforced
- [ ] Wave access properly gated
- [ ] Session management secure
- [ ] Logout clears session
- [ ] No sensitive data in localStorage

### Content Security Policy
- [ ] CSP headers configured
- [ ] No inline scripts
- [ ] External resources whitelisted

## Load Testing

### Simulating 10,000+ Users

Using Artillery (https://artillery.io):

```yaml
# load-test.yml
config:
  target: "http://localhost:3000"
  phases:
    - duration: 60
      arrivalRate: 10
      rampTo: 100
      name: "Ramp up to 100 users"
    - duration: 300
      arrivalRate: 100
      name: "Sustain 100 concurrent users"
scenarios:
  - flow:
      - get:
          url: "/"
      - get:
          url: "/enter"
      - get:
          url: "/hub"
```

Run with: `artillery run load-test.yml`

### Monitoring During Load Tests
- CPU usage < 80%
- Memory usage < 2GB
- Response time < 200ms (p95)
- Error rate < 0.1%

## Database Testing

### Supabase RLS Policies

Test each table's RLS policies:

```sql
-- Test as anonymous user
SET LOCAL ROLE anon;
SELECT * FROM profiles; -- Should see all
SELECT * FROM wave_applications; -- Should see none

-- Test as authenticated user
SET LOCAL ROLE authenticated;
SELECT * FROM profiles; -- Should see all
UPDATE profiles SET display_name = 'Test' WHERE id = current_user_id(); -- Should work on own profile only
```

### Migration Testing
- [ ] Test schema migration on fresh database
- [ ] Verify all triggers execute
- [ ] Check seed data inserts correctly
- [ ] Validate indexes created

## Internationalization Testing

For each of 12 languages:
- [ ] UI text displays correctly
- [ ] No text overflow
- [ ] RTL layout works (Arabic)
- [ ] Characters render properly (Chinese, Hindi, etc.)
- [ ] Language preference persists

## Error Handling Testing

### Error Boundary
- [ ] Throw test error in component
- [ ] Error boundary catches and displays
- [ ] Reload button works
- [ ] Go Home button works

### Network Errors
- [ ] Test offline mode
- [ ] Test slow 3G connection
- [ ] Test timeout scenarios
- [ ] Verify graceful degradation

## Regression Testing

After any code changes, verify:
- [ ] All existing features still work
- [ ] No new console errors
- [ ] Performance hasn't degraded
- [ ] Build completes successfully
- [ ] No TypeScript errors

## Pre-Launch Checklist

### Performance
- [ ] Lighthouse score > 90
- [ ] Core Web Vitals pass
  - LCP < 2.5s
  - FID < 100ms
  - CLS < 0.1
- [ ] 3D scenes run at target FPS
- [ ] Bundle size optimized

### Functionality
- [ ] All user flows work end-to-end
- [ ] Forms validate properly
- [ ] Error states display correctly
- [ ] Success states display correctly

### Content
- [ ] All text reviewed for errors
- [ ] 7 Immutable Laws accurate
- [ ] Links work correctly
- [ ] Images optimized

### Security
- [ ] Environment variables secured
- [ ] API keys not exposed
- [ ] HTTPS enforced
- [ ] Security headers configured

### Monitoring
- [ ] Error tracking configured
- [ ] Analytics tracking configured
- [ ] Performance monitoring active
- [ ] Uptime monitoring configured

## Continuous Testing

### CI/CD Pipeline

```yaml
# .github/workflows/test.yml
name: Test Suite
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm ci
      - run: npm run build
      - run: npm run lint
      - run: npm run test
```

## Known Limitations

1. **3D Performance**: May struggle on devices with < 2GB RAM
2. **Browser Support**: IE11 not supported (WebGL 2 required)
3. **Offline Mode**: 3D assets require initial online load
4. **Mobile 3D**: Limited to simpler scenes on low-end devices

## Reporting Issues

When reporting bugs, include:
1. Browser and version
2. Device and OS
3. Steps to reproduce
4. Expected vs actual behavior
5. Screenshots/video
6. Console errors

## Testing Tools

- **Chrome DevTools**: Performance, Network, Console
- **React DevTools**: Component inspection
- **Lighthouse**: Performance auditing
- **axe DevTools**: Accessibility testing
- **Artillery**: Load testing
- **BrowserStack**: Cross-browser testing

---

**Last Updated**: Phase 10 - Testing
**Version**: v1.0
**Author**: Claude (Anthropic)
