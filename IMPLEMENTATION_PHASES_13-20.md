# Implementation Guide: Phases 13-20

This document provides step-by-step implementation instructions for the remaining platform phases.

## Phase 13: GPU Donation System (15 hours)

### Database Schema
```sql
CREATE TABLE gpu_donations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  session_id TEXT UNIQUE,
  gpu_info JSONB, -- Device capabilities
  hours_donated FLOAT DEFAULT 0,
  tasks_completed INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  last_active TIMESTAMP DEFAULT NOW()
);

CREATE TABLE compute_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_type TEXT, -- 'alignment_training', 'consensus_sim', etc.
  status TEXT CHECK (status IN ('pending', 'assigned', 'completed', 'failed')),
  assigned_to UUID REFERENCES gpu_donations(id),
  result JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP
);
```

### Component Location
`src/app/hub/[hubId]/spectator/donate-compute/page.tsx`

### Key Features
- WebGPU detection and capability check
- Background worker for compute tasks
- Real-time progress tracking
- Leaderboard of top contributors
- Pause/resume controls

### Implementation Steps
1. Create database tables
2. Build WebGPU compute worker
3. Create donation UI with status display
4. Implement task queue system
5. Add leaderboard component

## Phase 14: Real-Time Collaboration (18 hours)

### Database Schema
```sql
CREATE TABLE proposal_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  proposal_id UUID REFERENCES proposals(id),
  active_users JSONB[], -- Array of user IDs currently editing
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE proposal_changes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  proposal_id UUID REFERENCES proposals(id),
  user_id UUID REFERENCES profiles(id),
  change_type TEXT, -- 'insert', 'delete', 'format'
  position INTEGER,
  content TEXT,
  timestamp TIMESTAMP DEFAULT NOW()
);

CREATE TABLE proposal_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  proposal_id UUID REFERENCES proposals(id),
  user_id UUID REFERENCES profiles(id),
  content TEXT,
  position INTEGER, -- Character position in document
  resolved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Key Libraries
- Yjs or Automerge for CRDT
- Supabase Realtime for presence
- ProseMirror or TipTap for editor

### Implementation Steps
1. Set up CRDT document store
2. Implement collaborative editor
3. Add real-time cursor tracking
4. Build comment system
5. Create version history viewer

## Phase 15: Proposal Enhancement System (20 hours)

### Database Schema
```sql
CREATE TABLE proposal_dependencies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  proposal_id UUID REFERENCES proposals(id),
  depends_on UUID REFERENCES proposals(id),
  dependency_type TEXT, -- 'requires', 'blocks', 'relates_to'
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE proposal_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT,
  category TEXT,
  template_structure JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE proposal_resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  proposal_id UUID REFERENCES proposals(id),
  resource_type TEXT, -- 'people', 'compute', 'money', 'time'
  amount NUMERIC,
  unit TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Key Features
- Dependency graph visualization (use D3.js or Cytoscape.js)
- Template builder
- Resource estimation calculator
- Impact prediction AI
- Counter-proposal system

### Implementation Steps
1. Create dependency tracking system
2. Build template editor
3. Implement resource calculator
4. Add graph visualization
5. Create counter-proposal workflow

## Phase 16: Mobile Native Apps (40 hours)

### React Native Setup
```bash
npx create-expo-app breakthrough-mobile
cd breakthrough-mobile
npm install @supabase/supabase-js
npm install react-native-biometrics
npm install @react-navigation/native
npm install expo-notifications
```

### Key Features
- Shared codebase with web (where possible)
- Native push notifications
- Biometric authentication
- Offline mode with sync
- Native camera integration
- Touch-optimized voting interface

### Implementation Steps
1. Set up Expo project
2. Configure Supabase client for mobile
3. Implement authentication with biometrics
4. Build navigation structure
5. Create optimized voting UI
6. Add push notification system
7. Implement offline storage
8. Submit to App Store & Play Store

## Phase 17: AI Agent Integration (25 hours)

### Database Schema
```sql
CREATE TABLE ai_agents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_name TEXT UNIQUE,
  ai_system TEXT, -- 'gpt-4', 'claude-3', etc.
  capabilities TEXT[],
  verified BOOLEAN DEFAULT FALSE,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE agent_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID REFERENCES ai_agents(id),
  action_type TEXT, -- 'proposal', 'comment', 'analysis', etc.
  target_id UUID, -- ID of proposal/comment/etc
  content TEXT,
  reasoning TEXT, -- AI's explanation
  sources TEXT[], -- Citations
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE agent_ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID REFERENCES ai_agents(id),
  user_id UUID REFERENCES profiles(id),
  rating INTEGER CHECK (rating BETWEEN 1 AND 5),
  feedback TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Key Features
- Agent registration system
- Transparent action logging
- Human oversight for all agent actions
- Rate limiting
- Source citation requirements
- Community ratings

### Implementation Steps
1. Create agent registration flow
2. Build API for agent interactions
3. Implement action logging
4. Add human review interface
5. Create rating system
6. Set up rate limiting

## Phase 18: Breakthrough Marketplace (15 hours)

### Database Schema
```sql
CREATE TABLE proposal_funding (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  proposal_id UUID REFERENCES proposals(id),
  funding_goal NUMERIC,
  current_funding NUMERIC DEFAULT 0,
  payment_method TEXT[], -- 'stripe', 'crypto', etc.
  milestone_structure JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE funding_pledges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  funding_id UUID REFERENCES proposal_funding(id),
  user_id UUID REFERENCES profiles(id),
  amount NUMERIC,
  payment_method TEXT,
  status TEXT CHECK (status IN ('pledged', 'charged', 'refunded')),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE implementation_teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  proposal_id UUID REFERENCES proposals(id),
  team_name TEXT,
  members UUID[],
  reputation_score FLOAT,
  past_projects JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Key Features
- Crowdfunding interface
- Milestone-based payments
- Stripe + crypto integration
- Team reputation system
- Dispute resolution

### Implementation Steps
1. Set up Stripe integration
2. Build crowdfunding UI
3. Implement milestone tracking
4. Create team profiles
5. Add dispute resolution system

## Phase 19: Advanced Analytics (12 hours)

### Database Views
```sql
CREATE VIEW platform_health AS
SELECT
  date_trunc('day', created_at) as date,
  COUNT(*) as daily_proposals,
  AVG(hope_index) as avg_hope,
  COUNT(DISTINCT user_id) as active_users
FROM proposals
GROUP BY date;

CREATE VIEW user_analytics AS
SELECT
  user_id,
  COUNT(*) FILTER (WHERE vote='yes') as yes_votes,
  COUNT(*) FILTER (WHERE vote='no') as no_votes,
  AVG(confidence) as avg_confidence
FROM votes
GROUP BY user_id;
```

### Key Features
- Platform health dashboard
- User behavior analytics
- Predictive analytics for proposals
- Export functionality
- Public API for researchers

### Implementation Steps
1. Create analytics database views
2. Build dashboard with Chart.js/Recharts
3. Implement prediction models
4. Add export functionality
5. Create public API endpoints

## Phase 20: Admin & Moderation Tools (10 hours)

### Database Schema
```sql
CREATE TABLE moderation_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  moderator_id UUID REFERENCES profiles(id),
  target_type TEXT, -- 'user', 'proposal', 'comment'
  target_id UUID,
  action_type TEXT, -- 'warning', 'removal', 'ban'
  reason TEXT,
  public BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE wave_applications_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  status TEXT CHECK (status IN ('pending', 'approved', 'rejected')),
  reviewed_by UUID REFERENCES profiles(id),
  review_notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  reviewed_at TIMESTAMP
);
```

### Key Features
- Application review queue
- Content moderation interface
- Emergency alert creator
- System health monitoring
- Public action log

### Implementation Steps
1. Create admin dashboard
2. Build application review queue
3. Implement moderation tools
4. Add system monitoring
5. Create emergency alert system

## Testing Checklist

For each phase:
- [ ] Database migrations run successfully
- [ ] All queries optimized with indexes
- [ ] Real-time subscriptions working
- [ ] Error handling implemented
- [ ] Loading states added
- [ ] Mobile responsive
- [ ] Accessibility tested
- [ ] Performance profiled

## Deployment Steps

1. Run migrations: `supabase db push`
2. Seed data: `psql -f supabase/seed/[file].sql`
3. Test locally: `npm run dev`
4. Run TypeScript checks: `npm run type-check`
5. Build: `npm run build`
6. Deploy: `vercel --prod`

## Success Metrics

Track these KPIs for each phase:
- User engagement rate
- Feature adoption percentage
- Error rates
- Performance metrics (load time, response time)
- User satisfaction scores

## Next Steps After Phase 20

Consider these bonus features:
- GitHub integration
- Discord/Slack bots
- More language support
- Gamification system
- Educational content
- Research tools

---

**Total Estimated Time**: 200 hours agent time (~10-20 hours real time)
**Total Estimated Cost**: ~$100 in API credits

Ready to build the future! 🚀
