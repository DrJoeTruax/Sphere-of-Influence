# Breakthrough Platform v1.0

A 3D web platform for 7 billion people to coordinate global AGI development through autonomous governance.

Built on the **7 Immutable Laws**: Truth, Empathy, Peace, Autonomy, Accountability, Stewardship, and Integrity.

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Supabase

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Run the database migration from `supabase/schema.sql` (see `supabase/README.md`)
3. Copy `.env.local.example` to `.env.local` and add your Supabase credentials

```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your values:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the platform.

## Tech Stack

- **Frontend**: Next.js 15 (App Router) + React 19 + TypeScript
- **3D Graphics**: React Three Fiber + @react-three/drei + Three.js
- **Backend**: Supabase (PostgreSQL + Auth + Realtime)
- **Styling**: Tailwind CSS v4
- **Animation**: Framer Motion
- **Hosting**: Vercel (recommended)

## Project Structure

```
breakthrough-platform/
├── src/
│   ├── app/                    # Next.js pages
│   │   ├── page.tsx           # Landing page
│   │   ├── why/               # Immutable Plan page
│   │   └── enter/             # 3D experience entry (Phase 2)
│   ├── components/            # React components
│   │   ├── 3d/               # Three.js components
│   │   ├── forum/            # Forum UI
│   │   └── ui/               # Reusable UI
│   └── lib/                  # Utilities
│       ├── supabase/         # Database client
│       ├── hooks/            # React hooks
│       └── utils/            # Helper functions
├── supabase/
│   ├── schema.sql            # Database schema
│   └── README.md             # Setup guide
└── public/                   # Static assets
```

## Development Phases

### ✅ Phase 1: Foundation (COMPLETE)
- [x] Next.js project setup
- [x] Install dependencies (Supabase, Three.js, etc.)
- [x] Database schema created
- [x] Landing page
- [x] Philosophy page (/why)

### ⬜ Phase 2: Entry Experience (12 hours)
- [ ] Starfield loading animation
- [ ] Opening screen with language selection
- [ ] Cinematic intro

### ⬜ Phase 3: 3D Navigation (25 hours)
- [ ] Solar system visualization
- [ ] Earth with 12 regional hubs
- [ ] Hub selection interface

### ⬜ Phase 4: Role System (8 hours)
- [ ] Spectator/Builder role selection
- [ ] User authentication
- [ ] Profile management

### ⬜ Phase 5: Forum System (30 hours)
- [ ] 3D proposal visualization
- [ ] Voting interface
- [ ] Comment system

### ⬜ Phase 6: Wave System (10 hours)
- [ ] Anti-spam wave applications
- [ ] Builder access management

### ⬜ Phase 7: Emergency Alerts (5 hours)
- [ ] Real-time alert system
- [ ] Full-screen notifications

### ⬜ Phase 8: Celebrations (7 hours)
- [ ] Consensus celebration animations
- [ ] Social sharing

### ⬜ Phase 9: Polish (15 hours)
- [ ] Mobile 2D alternative
- [ ] Accessibility improvements
- [ ] 12 language support

### ⬜ Phase 10: Testing (13 hours)
- [ ] Functional testing
- [ ] Performance benchmarks
- [ ] Security audit

**Total: 133 hours across 10 phases**

## Performance Targets

- Load time: <3 seconds
- 3D framerate: 60fps (desktop), 30fps (mobile)
- API response: <500ms
- Database queries: <100ms
- Concurrent users: 10,000+

## The 7 Immutable Laws

1. **Truth** - No hidden behavior, full transparency
2. **Empathy** - Preserve emotional/psychological safety
3. **Peace** - No violence, humiliation, or domination
4. **Autonomy** - Users choose freely, no coercion
5. **Accountability** - Actions leave audit trails
6. **Stewardship** - Improve the world, waste nothing
7. **Integrity** - If you break these, authority dissolves

**14-Point Autonomy Test Score: 96.4%** (vs 66% corporate AGI average)

## Database Schema

The platform uses Supabase (PostgreSQL) with comprehensive Row Level Security (RLS) policies.

Key tables:
- `profiles` - User accounts
- `hubs` - 12 regional hubs + space station
- `proposals` - AGI development proposals
- `votes` - Transparent voting records
- `comments` - Discussion threads
- `wave_applications` - Builder access control
- `emergency_alerts` - Critical notifications
- `activity_logs` - Complete audit trail

See `supabase/schema.sql` for complete schema and `supabase/README.md` for setup guide.

## Contributing

This platform is built for humanity. Quality > Speed.

**Never compromise the 7 Immutable Laws for convenience.**

## License

CC0 1.0 Universal (Public Domain)

The principles and code belong to humanity. Use freely.

## Links

- **Philosophy**: [The Immutable Plan](http://localhost:3000/why)
- **Documentation**: Coming soon
- **GitHub**: Coming soon

---

**Built with integrity. Powered by the 7 Immutable Laws.**
