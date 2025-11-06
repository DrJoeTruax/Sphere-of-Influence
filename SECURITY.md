# Breakthrough Platform - Security Documentation

## Overview

The Breakthrough Platform handles sensitive user data and must maintain the highest security standards. This document outlines security measures, best practices, and audit procedures.

## Security Principles

The platform embodies the 7 Immutable Laws, with **Integrity** and **Accountability** requiring robust security:

1. **Truth** - No data manipulation or falsification
2. **Empathy** - Protect user privacy and data
3. **Peace** - Prevent malicious actors
4. **Autonomy** - User controls their data
5. **Accountability** - Audit trails for all actions
6. **Stewardship** - Responsible data handling
7. **Integrity** - Secure by design

## Authentication & Authorization

### Supabase Authentication

The platform uses Supabase Auth for user authentication:

```typescript
// Sign up
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'secure-password',
})

// Sign in
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'secure-password',
})

// Sign out
await supabase.auth.signOut()
```

### Password Requirements

- Minimum 12 characters
- Must include: uppercase, lowercase, number, special character
- No common passwords (use dictionary check)
- Rate limiting on password attempts

### Row Level Security (RLS)

All database tables enforce RLS policies:

```sql
-- Example: Users can only update their own profile
CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Example: Proposals are viewable by everyone
CREATE POLICY "Proposals are viewable by everyone"
ON proposals FOR SELECT
USING (true);

-- Example: Only Wave-granted users can submit proposals
CREATE POLICY "Wave users can create proposals"
ON proposals FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM wave_grants
    WHERE user_id = auth.uid()
  )
);
```

### Session Management

- Sessions stored securely in HTTP-only cookies
- Automatic expiration after 7 days
- Refresh tokens for seamless re-authentication
- Logout invalidates all tokens

## Data Protection

### Sensitive Data

**Never store in plain text:**
- Passwords (use Supabase Auth)
- API keys
- Authentication tokens
- Payment information (if added)

**Environment Variables:**

```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
SUPABASE_SERVICE_ROLE_KEY=xxx  # Never expose to client!
```

### Data Encryption

- **In Transit**: HTTPS/TLS 1.3 enforced
- **At Rest**: Supabase encrypts all data at rest
- **Client-Side**: Sensitive operations use Web Crypto API

### Personal Identifiable Information (PII)

**Minimize PII collection:**
- Email (required for auth)
- Display name (optional, user-controlled)
- No phone numbers, addresses, or government IDs

**Data Retention:**
- User can delete account anytime
- Data deleted within 30 days
- Audit logs retained for 1 year

## Input Validation & Sanitization

### Frontend Validation

```typescript
// Always validate user input
function validateProposalTitle(title: string): boolean {
  // Check length
  if (title.length < 10 || title.length > 200) return false

  // Check for malicious patterns
  const dangerousPatterns = /<script|javascript:|onerror=/i
  if (dangerousPatterns.test(title)) return false

  return true
}
```

### XSS Prevention

**React automatically escapes:**
```tsx
// Safe - React escapes automatically
<div>{userInput}</div>

// UNSAFE - dangerouslySetInnerHTML
<div dangerouslySetInnerHTML={{ __html: userInput }} /> // DON'T DO THIS
```

**Sanitize when necessary:**
```typescript
import DOMPurify from 'dompurify'

const clean = DOMPurify.sanitize(userInput)
```

### SQL Injection Prevention

**Supabase automatically prevents SQL injection:**

```typescript
// Safe - parameterized query
const { data } = await supabase
  .from('proposals')
  .select('*')
  .eq('id', proposalId)  // Automatically escaped

// UNSAFE - never use string concatenation
// const { data } = await supabase.rpc('raw_query', { query: `SELECT * FROM proposals WHERE id = ${proposalId}` })
```

## CSRF Protection

Next.js provides built-in CSRF protection for API routes:

```typescript
// pages/api/submit-proposal.ts
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Verify origin header
  const origin = req.headers.origin
  const allowedOrigins = [process.env.NEXT_PUBLIC_APP_URL]

  if (!origin || !allowedOrigins.includes(origin)) {
    return res.status(403).json({ error: 'Invalid origin' })
  }

  // Process request
}
```

## Rate Limiting

### Client-Side Rate Limiting

```typescript
import { throttle } from '@/lib/utils/performance'

// Limit vote submissions
const handleVote = throttle((proposalId: string, voteType: string) => {
  submitVote(proposalId, voteType)
}, 1000) // Max once per second
```

### Server-Side Rate Limiting

Use Vercel's rate limiting or implement custom:

```typescript
// middleware.ts
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '10 s'),
})

export async function middleware(request: Request) {
  const ip = request.headers.get('x-forwarded-for')
  const { success } = await ratelimit.limit(ip)

  if (!success) {
    return new Response('Rate limit exceeded', { status: 429 })
  }

  return NextResponse.next()
}
```

## Content Security Policy (CSP)

Configure in `next.config.js`:

```javascript
const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: `
      default-src 'self';
      script-src 'self' 'unsafe-eval' 'unsafe-inline';
      style-src 'self' 'unsafe-inline';
      img-src 'self' data: https:;
      font-src 'self';
      connect-src 'self' https://*.supabase.co;
      frame-ancestors 'none';
    `.replace(/\s{2,}/g, ' ').trim()
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block'
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin'
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()'
  }
]

module.exports = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ]
  },
}
```

## Secure Coding Practices

### Never Trust Client Input

```typescript
// BAD
async function updateProfile(userId: string, data: any) {
  await supabase.from('profiles').update(data).eq('id', userId)
}

// GOOD
async function updateProfile(userId: string, displayName: string) {
  // Validate input
  if (!displayName || displayName.length > 50) {
    throw new Error('Invalid display name')
  }

  // Only update allowed fields
  await supabase
    .from('profiles')
    .update({ display_name: displayName })
    .eq('id', userId)
}
```

### Avoid Exposing Sensitive Info

```typescript
// BAD - exposes internal IDs
console.log('User ID:', userId)

// GOOD - use generic messages
console.log('User authenticated')

// BAD - detailed error messages
catch (error) {
  res.json({ error: error.message })
}

// GOOD - generic error messages
catch (error) {
  console.error(error) // Log internally
  res.json({ error: 'An error occurred' })
}
```

### Secure File Uploads (if implemented)

```typescript
// Validate file type
const allowedTypes = ['image/png', 'image/jpeg', 'image/gif']
if (!allowedTypes.includes(file.type)) {
  throw new Error('Invalid file type')
}

// Validate file size (max 5MB)
const maxSize = 5 * 1024 * 1024
if (file.size > maxSize) {
  throw new Error('File too large')
}

// Rename file to prevent path traversal
const safeFileName = `${uuid()}.${file.name.split('.').pop()}`

// Scan for malware (use external service)
await scanFile(file)

// Upload to secure storage
await supabase.storage
  .from('avatars')
  .upload(safeFileName, file)
```

## Dependency Security

### Regular Audits

```bash
# Check for vulnerabilities
npm audit

# Fix automatically
npm audit fix

# Check for outdated packages
npm outdated

# Update packages
npm update
```

### Dependabot Configuration

```yaml
# .github/dependabot.yml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
    open-pull-requests-limit: 10
```

## Incident Response

### If a Security Vulnerability is Discovered:

1. **Assess Severity**: Critical, High, Medium, Low
2. **Contain**: Take affected system offline if critical
3. **Notify**: Inform users if data breach occurred
4. **Fix**: Patch vulnerability immediately
5. **Document**: Record incident in security log
6. **Review**: Conduct post-mortem

### Security Contact

Report security issues to: [security@breakthrough-platform.org](mailto:security@breakthrough-platform.org)

**Do not disclose publicly until patch is available.**

## Compliance

### GDPR (if serving EU users)

- [ ] Data processing agreement with Supabase
- [ ] Privacy policy published
- [ ] Cookie consent banner
- [ ] Right to access data
- [ ] Right to delete data
- [ ] Data portability
- [ ] Breach notification within 72 hours

### CCPA (if serving California users)

- [ ] Privacy policy discloses data collection
- [ ] Opt-out mechanism for data sale
- [ ] Right to delete data
- [ ] Non-discrimination policy

## Security Checklist

### Pre-Launch
- [ ] All environment variables secured
- [ ] HTTPS enforced everywhere
- [ ] CSP headers configured
- [ ] RLS policies tested
- [ ] Input validation on all forms
- [ ] Rate limiting implemented
- [ ] Dependency audit passed
- [ ] Security headers configured
- [ ] Error messages sanitized
- [ ] Authentication flow tested
- [ ] Session management secure
- [ ] CSRF protection verified

### Ongoing
- [ ] Weekly dependency audits
- [ ] Monthly security reviews
- [ ] Quarterly penetration testing
- [ ] Annual third-party security audit
- [ ] Monitor security advisories
- [ ] Update libraries promptly
- [ ] Review access logs
- [ ] Test backup restoration

## Security Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Supabase Security](https://supabase.com/docs/guides/platform/security)
- [Next.js Security](https://nextjs.org/docs/advanced-features/security-headers)
- [CWE Top 25](https://cwe.mitre.org/top25/)

---

**Last Updated**: Phase 10 - Testing
**Version**: v1.0
**Security Officer**: [To be assigned]
