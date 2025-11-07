-- Phases 13-20: Additional Database Schema
-- Run this migration after phase 11 migration

-- PHASE 13: GPU Donation System
CREATE TABLE IF NOT EXISTS gpu_donations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  session_id TEXT UNIQUE,
  gpu_info JSONB,
  hours_donated FLOAT DEFAULT 0,
  tasks_completed INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  last_active TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS compute_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_type TEXT,
  status TEXT CHECK (status IN ('pending', 'assigned', 'completed', 'failed')),
  assigned_to UUID REFERENCES gpu_donations(id),
  result JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP
);

-- PHASE 14: Real-Time Collaboration
CREATE TABLE IF NOT EXISTS proposal_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  proposal_id UUID REFERENCES proposals(id),
  active_users JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS proposal_changes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  proposal_id UUID REFERENCES proposals(id),
  user_id UUID REFERENCES profiles(id),
  change_type TEXT,
  position INTEGER,
  content TEXT,
  timestamp TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS proposal_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  proposal_id UUID REFERENCES proposals(id),
  user_id UUID REFERENCES profiles(id),
  content TEXT,
  position INTEGER,
  resolved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- PHASE 15: Proposal Enhancement
CREATE TABLE IF NOT EXISTS proposal_dependencies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  proposal_id UUID REFERENCES proposals(id),
  depends_on UUID REFERENCES proposals(id),
  dependency_type TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS proposal_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT,
  category TEXT,
  template_structure JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS proposal_resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  proposal_id UUID REFERENCES proposals(id),
  resource_type TEXT,
  amount NUMERIC,
  unit TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- PHASE 17: AI Agent Integration
CREATE TABLE IF NOT EXISTS ai_agents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_name TEXT UNIQUE,
  ai_system TEXT,
  capabilities TEXT[],
  verified BOOLEAN DEFAULT FALSE,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS agent_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID REFERENCES ai_agents(id),
  action_type TEXT,
  target_id UUID,
  content TEXT,
  reasoning TEXT,
  sources TEXT[],
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS agent_ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID REFERENCES ai_agents(id),
  user_id UUID REFERENCES profiles(id),
  rating INTEGER CHECK (rating BETWEEN 1 AND 5),
  feedback TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- PHASE 18: Breakthrough Marketplace
CREATE TABLE IF NOT EXISTS proposal_funding (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  proposal_id UUID REFERENCES proposals(id),
  funding_goal NUMERIC,
  current_funding NUMERIC DEFAULT 0,
  payment_methods TEXT[],
  milestone_structure JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS funding_pledges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  funding_id UUID REFERENCES proposal_funding(id),
  user_id UUID REFERENCES profiles(id),
  amount NUMERIC,
  payment_method TEXT,
  status TEXT CHECK (status IN ('pledged', 'charged', 'refunded')),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS implementation_teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  proposal_id UUID REFERENCES proposals(id),
  team_name TEXT,
  members UUID[],
  reputation_score FLOAT DEFAULT 0,
  past_projects JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP DEFAULT NOW()
);

-- PHASE 20: Admin & Moderation Tools
CREATE TABLE IF NOT EXISTS moderation_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  moderator_id UUID REFERENCES profiles(id),
  target_type TEXT,
  target_id UUID,
  action_type TEXT,
  reason TEXT,
  public BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS wave_applications_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  status TEXT CHECK (status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
  reviewed_by UUID REFERENCES profiles(id),
  review_notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  reviewed_at TIMESTAMP
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_gpu_donations_user ON gpu_donations(user_id);
CREATE INDEX IF NOT EXISTS idx_compute_tasks_status ON compute_tasks(status);
CREATE INDEX IF NOT EXISTS idx_proposal_sessions_proposal ON proposal_sessions(proposal_id);
CREATE INDEX IF NOT EXISTS idx_proposal_changes_proposal ON proposal_changes(proposal_id);
CREATE INDEX IF NOT EXISTS idx_proposal_comments_proposal ON proposal_comments(proposal_id);
CREATE INDEX IF NOT EXISTS idx_proposal_dependencies_proposal ON proposal_dependencies(proposal_id);
CREATE INDEX IF NOT EXISTS idx_agent_actions_agent ON agent_actions(agent_id);
CREATE INDEX IF NOT EXISTS idx_funding_pledges_funding ON funding_pledges(funding_id);
CREATE INDEX IF NOT EXISTS idx_moderation_actions_moderator ON moderation_actions(moderator_id);
CREATE INDEX IF NOT EXISTS idx_wave_applications_status ON wave_applications_queue(status);

-- PHASE 19: Analytics Views
CREATE OR REPLACE VIEW platform_health AS
SELECT
  date_trunc('day', created_at) as date,
  COUNT(*) as daily_proposals,
  COUNT(DISTINCT creator_id) as unique_creators
FROM proposals
GROUP BY date
ORDER BY date DESC;

CREATE OR REPLACE VIEW user_engagement AS
SELECT
  user_id,
  COUNT(*) as total_votes,
  AVG(CASE WHEN vote='yes' THEN 1 ELSE 0 END) as approval_rate
FROM votes
GROUP BY user_id;

-- Function: Get platform statistics
CREATE OR REPLACE FUNCTION get_platform_stats()
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'total_users', (SELECT COUNT(*) FROM profiles),
    'total_proposals', (SELECT COUNT(*) FROM proposals),
    'total_votes', (SELECT COUNT(*) FROM votes),
    'active_proposals', (SELECT COUNT(*) FROM proposals WHERE status = 'voting'),
    'total_agame_responses', (SELECT COUNT(*) FROM agame_responses)
  ) INTO result;

  RETURN result;
END;
$$ LANGUAGE plpgsql;
