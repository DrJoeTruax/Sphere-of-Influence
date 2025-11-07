-- BREAKTHROUGH PLATFORM BASE SCHEMA
-- This migration creates all core tables needed by the platform
-- Run this BEFORE phase11 migrations

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================================================
-- CORE TABLES
-- =============================================================================

-- User profiles (implements Law of Autonomy, Accountability)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE,
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_seen_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- User preferences
  language_code TEXT DEFAULT 'en',
  timezone TEXT DEFAULT 'UTC',

  -- Contribution tracking (Law of Accountability)
  total_contributions INT DEFAULT 0,
  reputation_score INT DEFAULT 0
);

-- Regional hubs (12 regions + space station)
CREATE TABLE IF NOT EXISTS hubs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL, -- e.g., 'north-america', 'space-station'
  name TEXT NOT NULL,
  description TEXT,
  language_codes TEXT[] DEFAULT '{}', -- Array of supported language codes
  position_3d JSONB, -- {x, y, z} coordinates for 3D rendering
  active_contributors INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User hub memberships (implements Law of Autonomy - users choose their hub)
CREATE TABLE IF NOT EXISTS hub_memberships (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  hub_id UUID REFERENCES hubs(id) ON DELETE CASCADE,
  role TEXT CHECK (role IN ('spectator', 'builder')) DEFAULT 'spectator',
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_active_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  UNIQUE(user_id, hub_id)
);

-- 58 problem categories for AGI development
CREATE TABLE IF NOT EXISTS problem_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  parent_category_id UUID REFERENCES problem_categories(id),
  display_order INT DEFAULT 0,
  icon TEXT, -- Icon name for UI
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Proposals (implements Law of Truth, Stewardship)
CREATE TABLE IF NOT EXISTS proposals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  hub_id UUID REFERENCES hubs(id) ON DELETE CASCADE,
  author_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  category_id UUID REFERENCES problem_categories(id),

  title TEXT NOT NULL,
  content TEXT NOT NULL, -- Full proposal text (markdown supported)

  -- Status tracking (Law of Accountability)
  status TEXT CHECK (status IN ('draft', 'active', 'passed', 'rejected', 'implemented')) DEFAULT 'draft',

  -- Voting tallies
  votes_for INT DEFAULT 0,
  votes_against INT DEFAULT 0,
  votes_abstain INT DEFAULT 0,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  voting_ends_at TIMESTAMP WITH TIME ZONE,
  implemented_at TIMESTAMP WITH TIME ZONE,

  -- 3D visualization data
  position_3d JSONB, -- Position in 3D forum space
  color_hex TEXT DEFAULT '#4A90E2'
);

-- Votes (implements Law of Accountability - immutable audit trail)
CREATE TABLE IF NOT EXISTS votes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  proposal_id UUID REFERENCES proposals(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  vote_type TEXT CHECK (vote_type IN ('for', 'against', 'abstain')) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Prevent double voting
  UNIQUE(proposal_id, user_id)
);

-- Comments/discussions (implements Law of Peace, Empathy)
CREATE TABLE IF NOT EXISTS comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  proposal_id UUID REFERENCES proposals(id) ON DELETE CASCADE,
  author_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  parent_comment_id UUID REFERENCES comments(id) ON DELETE CASCADE,

  content TEXT NOT NULL,
  sentiment_score FLOAT, -- -1 (negative) to 1 (positive), null if not analyzed

  -- Moderation (Law of Peace)
  is_flagged BOOLEAN DEFAULT FALSE,
  is_hidden BOOLEAN DEFAULT FALSE,
  moderation_reason TEXT,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Wave access applications
CREATE TABLE IF NOT EXISTS wave_applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  hub_id UUID REFERENCES hubs(id) ON DELETE CASCADE,

  -- Application content
  motivation TEXT NOT NULL, -- Why they want to contribute
  background TEXT, -- Relevant experience

  -- Status
  status TEXT CHECK (status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
  reviewed_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  reviewed_at TIMESTAMP WITH TIME ZONE,
  review_notes TEXT,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  UNIQUE(user_id, hub_id)
);

-- Wave grants (approved builders)
CREATE TABLE IF NOT EXISTS wave_grants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  hub_id UUID REFERENCES hubs(id) ON DELETE CASCADE,
  wave_number INT NOT NULL, -- Which wave they were granted in
  granted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE, -- Optional expiration

  UNIQUE(user_id, hub_id)
);

-- Emergency alerts (for critical system-wide announcements)
CREATE TABLE IF NOT EXISTS emergency_alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,

  title TEXT NOT NULL,
  message TEXT NOT NULL,
  severity TEXT CHECK (severity IN ('info', 'warning', 'critical')) DEFAULT 'info',

  -- Targeting
  hub_id UUID REFERENCES hubs(id), -- NULL = all hubs
  language_code TEXT, -- NULL = all languages

  -- Lifecycle
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE,
  dismissed_by_count INT DEFAULT 0
);

-- Track who has seen/dismissed alerts
CREATE TABLE IF NOT EXISTS alert_dismissals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  alert_id UUID REFERENCES emergency_alerts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  dismissed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  UNIQUE(alert_id, user_id)
);

-- Celebration events (triggered when proposals reach consensus)
CREATE TABLE IF NOT EXISTS celebrations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  proposal_id UUID REFERENCES proposals(id) ON DELETE CASCADE,
  hub_id UUID REFERENCES hubs(id) ON DELETE CASCADE,

  title TEXT NOT NULL,
  message TEXT NOT NULL,
  celebration_type TEXT DEFAULT 'consensus_reached',

  -- Visual effects data
  confetti_config JSONB, -- Configuration for confetti animation

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() + INTERVAL '24 hours'
);

-- Comprehensive activity log for audit trail
CREATE TABLE IF NOT EXISTS activity_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  action_type TEXT NOT NULL, -- e.g., 'vote_cast', 'proposal_created', 'comment_posted'
  entity_type TEXT NOT NULL, -- e.g., 'proposal', 'comment', 'vote'
  entity_id UUID,
  metadata JSONB, -- Additional context
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================================================
-- PROOF STATION TABLES
-- =============================================================================

-- Proof fields/categories
CREATE TABLE IF NOT EXISTS proof_fields (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  color_code TEXT DEFAULT '#3B82F6', -- For UI categorization
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Verified proofs (doctoral-level works)
CREATE TABLE IF NOT EXISTS proofs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  author_id UUID REFERENCES profiles(id) ON DELETE SET NULL,

  -- Core proof data
  name TEXT NOT NULL,
  field_id UUID REFERENCES proof_fields(id) ON DELETE SET NULL,
  proof_links TEXT[] DEFAULT '{}', -- URLs to evidence
  description TEXT,

  -- Verification
  hash TEXT UNIQUE, -- Blockchain hash for immutability
  polygon_timestamp TEXT, -- Polygon network timestamp
  verified_at TIMESTAMP WITH TIME ZONE,

  -- Metrics
  impact_score INT DEFAULT 0,
  endorsement_count INT DEFAULT 0,
  view_count INT DEFAULT 0,

  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Pillar position in 3D space (for rendering)
  pillar_position JSONB -- {x, y, z, rotation}
);

-- Peer endorsements (signatures of support)
CREATE TABLE IF NOT EXISTS endorsements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  proof_id UUID REFERENCES proofs(id) ON DELETE CASCADE,
  endorser_id UUID REFERENCES profiles(id) ON DELETE CASCADE,

  -- Endorsement content
  comment TEXT,
  credibility_score INT CHECK (credibility_score BETWEEN 1 AND 5) DEFAULT 5,

  -- Verification
  signature TEXT, -- Cryptographic signature

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  UNIQUE(proof_id, endorser_id) -- One endorsement per proof per user
);

-- Defense sessions (optional public defenses)
CREATE TABLE IF NOT EXISTS defense_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  proof_id UUID REFERENCES proofs(id) ON DELETE CASCADE,

  -- Session data
  title TEXT NOT NULL,
  description TEXT,
  defense_date TIMESTAMP WITH TIME ZONE,
  recording_url TEXT,
  transcript_url TEXT,

  -- Participants
  defenders TEXT[] DEFAULT '{}', -- Array of defender names/IDs
  reviewers TEXT[] DEFAULT '{}', -- Array of reviewer names/IDs

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Station activity log (for transparency)
CREATE TABLE IF NOT EXISTS station_activity (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,

  activity_type TEXT CHECK (activity_type IN (
    'proof_submitted',
    'proof_endorsed',
    'defense_scheduled',
    'proof_verified',
    'station_visited'
  )),

  target_id UUID, -- proof_id or defense_id
  details JSONB,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================================================
-- INDEXES FOR PERFORMANCE
-- =============================================================================

-- Profiles
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_username ON profiles(username);
CREATE INDEX IF NOT EXISTS idx_profiles_created_at ON profiles(created_at);

-- Hub memberships
CREATE INDEX IF NOT EXISTS idx_hub_memberships_user_id ON hub_memberships(user_id);
CREATE INDEX IF NOT EXISTS idx_hub_memberships_hub_id ON hub_memberships(hub_id);
CREATE INDEX IF NOT EXISTS idx_hub_memberships_role ON hub_memberships(role);

-- Proposals
CREATE INDEX IF NOT EXISTS idx_proposals_hub_id ON proposals(hub_id);
CREATE INDEX IF NOT EXISTS idx_proposals_author_id ON proposals(author_id);
CREATE INDEX IF NOT EXISTS idx_proposals_status ON proposals(status);
CREATE INDEX IF NOT EXISTS idx_proposals_category_id ON proposals(category_id);
CREATE INDEX IF NOT EXISTS idx_proposals_created_at ON proposals(created_at);

-- Votes
CREATE INDEX IF NOT EXISTS idx_votes_proposal_id ON votes(proposal_id);
CREATE INDEX IF NOT EXISTS idx_votes_user_id ON votes(user_id);
CREATE INDEX IF NOT EXISTS idx_votes_created_at ON votes(created_at);

-- Comments
CREATE INDEX IF NOT EXISTS idx_comments_proposal_id ON comments(proposal_id);
CREATE INDEX IF NOT EXISTS idx_comments_author_id ON comments(author_id);
CREATE INDEX IF NOT EXISTS idx_comments_parent_comment_id ON comments(parent_comment_id);

-- Activity logs
CREATE INDEX IF NOT EXISTS idx_activity_logs_user_id ON activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_action_type ON activity_logs(action_type);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON activity_logs(created_at);

-- Proof Station indexes
CREATE INDEX IF NOT EXISTS idx_proofs_author ON proofs(author_id);
CREATE INDEX IF NOT EXISTS idx_proofs_field ON proofs(field_id);
CREATE INDEX IF NOT EXISTS idx_proofs_hash ON proofs(hash);
CREATE INDEX IF NOT EXISTS idx_proofs_impact ON proofs(impact_score DESC);
CREATE INDEX IF NOT EXISTS idx_endorsements_proof ON endorsements(proof_id);
CREATE INDEX IF NOT EXISTS idx_endorsements_endorser ON endorsements(endorser_id);
CREATE INDEX IF NOT EXISTS idx_defense_proof ON defense_sessions(proof_id);
CREATE INDEX IF NOT EXISTS idx_station_activity_user ON station_activity(user_id);
CREATE INDEX IF NOT EXISTS idx_station_activity_type ON station_activity(activity_type);

-- =============================================================================
-- SEED DATA
-- =============================================================================

-- Insert 12 regional hubs + space station
INSERT INTO hubs (slug, name, description, language_codes, position_3d) VALUES
  ('north-america', 'North America', 'Hub for North American contributors', ARRAY['en'], '{"x": 0, "y": 0, "z": 1}'),
  ('latin-america', 'Latin America', 'Hub for Latin American contributors', ARRAY['es', 'pt'], '{"x": 0, "y": -1, "z": 0.8}'),
  ('western-europe', 'Western Europe', 'Hub for Western European contributors', ARRAY['en', 'fr', 'de'], '{"x": 1, "y": 0, "z": 0.5}'),
  ('eastern-europe', 'Eastern Europe', 'Hub for Eastern European contributors', ARRAY['ru', 'pl'], '{"x": 1.2, "y": 0, "z": 0.3}'),
  ('middle-east', 'Middle East', 'Hub for Middle Eastern contributors', ARRAY['ar', 'he'], '{"x": 1.3, "y": 0, "z": 0}'),
  ('africa', 'Africa', 'Hub for African contributors', ARRAY['en', 'fr', 'sw'], '{"x": 1, "y": -0.5, "z": 0}'),
  ('india', 'India', 'Hub for Indian contributors', ARRAY['hi', 'en'], '{"x": 1.5, "y": 0, "z": 0.2}'),
  ('china', 'China', 'Hub for Chinese contributors', ARRAY['zh'], '{"x": 1.8, "y": 0, "z": 0.5}'),
  ('southeast-asia', 'Southeast Asia', 'Hub for Southeast Asian contributors', ARRAY['id', 'th'], '{"x": 1.7, "y": -0.3, "z": 0.3}'),
  ('east-asia', 'East Asia', 'Hub for East Asian contributors', ARRAY['ja', 'ko'], '{"x": 2, "y": 0, "z": 0.6}'),
  ('oceania', 'Oceania', 'Hub for Oceanian contributors', ARRAY['en'], '{"x": 2, "y": -0.8, "z": 0.2}'),
  ('space-station', 'Space Station', 'Global coordination hub for all contributors', ARRAY['en', 'es', 'zh', 'hi', 'ar', 'fr', 'ru', 'pt', 'de', 'ja', 'ko', 'id'], '{"x": 0, "y": 0, "z": 3}')
ON CONFLICT (slug) DO NOTHING;

-- Insert the 58 problem categories (abbreviated list)
INSERT INTO problem_categories (slug, name, description, display_order) VALUES
  ('alignment', 'Alignment', 'Ensuring AGI goals align with human values', 1),
  ('interpretability', 'Interpretability', 'Understanding how AGI makes decisions', 2),
  ('robustness', 'Robustness', 'Making AGI resistant to adversarial attacks', 3),
  ('safety', 'Safety', 'Preventing AGI from causing harm', 4),
  ('ethics', 'Ethics', 'Ethical frameworks for AGI development', 5),
  ('governance', 'Governance', 'Governing AGI development and deployment', 6),
  ('coordination', 'Coordination', 'Global coordination mechanisms', 7),
  ('compute', 'Compute Resources', 'Managing computational resources', 8),
  ('data', 'Data Management', 'Handling training data responsibly', 9),
  ('testing', 'Testing & Validation', 'Validating AGI behavior', 10)
ON CONFLICT (slug) DO NOTHING;

-- Insert proof fields
INSERT INTO proof_fields (slug, name, description, color_code) VALUES
  ('ethics', 'Ethics', 'Moral philosophy and ethical frameworks', '#8B5CF6'),
  ('ai-safety', 'AI Safety', 'Artificial intelligence alignment and safety', '#3B82F6'),
  ('empathy', 'Empathy Studies', 'Research on emotional intelligence and compassion', '#EC4899'),
  ('mental-health', 'Mental Health', 'Psychology, therapy, and wellness research', '#10B981'),
  ('governance', 'Governance', 'Democratic systems and organizational structures', '#F59E0B'),
  ('stewardship', 'Stewardship', 'Environmental and resource management', '#14B8A6'),
  ('education', 'Education', 'Learning systems and pedagogical innovation', '#EF4444'),
  ('peace', 'Peace Studies', 'Conflict resolution and nonviolent communication', '#06B6D4')
ON CONFLICT (slug) DO NOTHING;
