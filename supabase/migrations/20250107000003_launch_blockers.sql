-- LAUNCH BLOCKERS MIGRATION
-- This migration adds all critical features needed for launch

-- =============================================================================
-- 1. UPDATE HUBS WITH BETTER POSITIONS & DESCRIPTIONS
-- =============================================================================

-- Delete existing hubs to re-seed with improved data
DELETE FROM hubs;

-- Insert 12 regional hubs + space station with improved positions and descriptions
INSERT INTO hubs (slug, name, description, language_codes, position_3d) VALUES
('north-america', 'North America', 'Canada, USA, Mexico', ARRAY['en', 'es', 'fr'], '{"x": -0.5, "y": 0.5, "z": 0}'),
('latin-america', 'Latin America', 'Central & South America', ARRAY['es', 'pt'], '{"x": -0.3, "y": -0.5, "z": 0.2}'),
('western-europe', 'Western Europe', 'UK, France, Germany, Spain, Italy', ARRAY['en', 'fr', 'de', 'es', 'it'], '{"x": 0.1, "y": 0.4, "z": 0.3}'),
('eastern-europe', 'Eastern Europe', 'Russia, Poland, Ukraine, Balkans', ARRAY['ru', 'pl', 'uk'], '{"x": 0.3, "y": 0.5, "z": 0.1}'),
('middle-east', 'Middle East', 'Arab States, Turkey, Iran, Israel', ARRAY['ar', 'tr', 'fa', 'he'], '{"x": 0.3, "y": 0.2, "z": 0.4}'),
('africa', 'Africa', 'Sub-Saharan & North Africa', ARRAY['en', 'fr', 'ar', 'sw'], '{"x": 0.2, "y": -0.2, "z": 0.5}'),
('india', 'India', 'Indian Subcontinent', ARRAY['hi', 'en', 'bn', 'te', 'ta'], '{"x": 0.5, "y": 0.1, "z": 0.3}'),
('china', 'China', 'PRC, Taiwan, Hong Kong', ARRAY['zh'], '{"x": 0.7, "y": 0.3, "z": 0.1}'),
('southeast-asia', 'Southeast Asia', 'ASEAN nations', ARRAY['id', 'th', 'vi', 'tl'], '{"x": 0.7, "y": -0.1, "z": 0.3}'),
('east-asia', 'East Asia', 'Japan, Korea, Mongolia', ARRAY['ja', 'ko'], '{"x": 0.8, "y": 0.4, "z": 0.0}'),
('oceania', 'Oceania', 'Australia, NZ, Pacific Islands', ARRAY['en'], '{"x": 0.8, "y": -0.5, "z": -0.2}'),
('space-station', 'Space Station', 'Universal coordination hub - no geographic boundaries', ARRAY['en', 'zh', 'es', 'hi', 'ar', 'fr', 'ru', 'pt', 'de', 'ja', 'ko', 'it'], '{"x": 0, "y": 0, "z": 1.5}')
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  language_codes = EXCLUDED.language_codes,
  position_3d = EXCLUDED.position_3d;

-- =============================================================================
-- 2. SEED 58 PROBLEM CATEGORIES
-- =============================================================================

-- Delete existing categories to re-seed
DELETE FROM problem_categories;

-- Category 1: Value Alignment Research (12 problems)
INSERT INTO problem_categories (slug, name, description, display_order) VALUES
('value-learning', 'Value Learning', 'How AGI learns human values from observation and interaction', 1),
('preference-aggregation', 'Preference Aggregation', 'Combining diverse human preferences into coherent goals', 2),
('moral-uncertainty', 'Moral Uncertainty', 'Handling disagreement about what is right', 3),
('corrigibility', 'Corrigibility', 'Ensuring AGI accepts corrections and oversight', 4),
('reward-modeling', 'Reward Modeling', 'Accurately capturing human intent in reward functions', 5),
('inverse-reinforcement', 'Inverse Reinforcement Learning', 'Inferring goals from human behavior', 6),
('value-extrapolation', 'Value Extrapolation', 'Predicting human values in novel situations', 7),
('cultural-values', 'Cultural Value Representation', 'Respecting diverse cultural moral frameworks', 8),
('long-term-values', 'Long-term Value Preservation', 'Maintaining alignment as society evolves', 9),
('implicit-values', 'Implicit Value Detection', 'Discovering unstated human preferences', 10),
('value-stability', 'Value Stability', 'Preventing value drift during training', 11),
('human-feedback', 'Human Feedback Integration', 'Incorporating real-time human guidance', 12),

-- Category 2: Interpretability & Safety (15 problems)
('mechanistic-interp', 'Mechanistic Interpretability', 'Understanding internal model computations', 13),
('activation-analysis', 'Activation Analysis', 'Decoding meaning from neural activations', 14),
('circuit-discovery', 'Circuit Discovery', 'Mapping functional circuits in neural networks', 15),
('adversarial-robustness', 'Adversarial Robustness', 'Resistance to manipulated inputs', 16),
('out-of-distribution', 'Out-of-Distribution Detection', 'Recognizing unfamiliar scenarios', 17),
('uncertainty-quantification', 'Uncertainty Quantification', 'Knowing when the model is uncertain', 18),
('deceptive-alignment', 'Deceptive Alignment Detection', 'Identifying hidden misaligned goals', 19),
('inner-alignment', 'Inner Alignment', 'Ensuring learned optimization aligns with intended goals', 20),
('mesa-optimization', 'Mesa-Optimization Prevention', 'Preventing emergent internal optimizers', 21),
('goal-misgeneralization', 'Goal Misgeneralization', 'Detecting proxy goal formation', 22),
('capability-control', 'Capability Control', 'Limiting dangerous capabilities while preserving useful ones', 23),
('shutdown-problem', 'Shutdown Problem', 'Safe interruption and termination protocols', 24),
('embedded-agency', 'Embedded Agency', 'AGI reasoning about itself and its environment', 25),
('logical-uncertainty', 'Logical Uncertainty', 'Reasoning under computational limits', 26),
('transparency-tools', 'Transparency Tools', 'Building auditable AI systems', 27),

-- Category 3: Technical Architecture (11 problems)
('scalable-oversight', 'Scalable Oversight', 'Supervising superhuman AGI behavior', 28),
('recursive-improvement', 'Recursive Improvement Safety', 'Safe self-improvement protocols', 29),
('capability-evaluation', 'Capability Evaluation', 'Measuring AGI abilities accurately', 30),
('containment', 'Containment Protocols', 'Preventing uncontrolled AGI deployment', 31),
('sandboxing', 'Sandboxing & Simulation', 'Safe testing environments', 32),
('formal-verification', 'Formal Verification', 'Mathematical proofs of safety properties', 33),
('differential-privacy', 'Differential Privacy', 'Protecting training data privacy', 34),
('federated-learning', 'Federated Learning', 'Distributed training without data sharing', 35),
('compute-governance', 'Compute Governance', 'Managing access to training resources', 36),
('hardware-security', 'Hardware Security', 'Securing physical infrastructure', 37),
('model-watermarking', 'Model Watermarking', 'Tracking AI system provenance', 38),

-- Category 4: Governance & Coordination (10 problems)
('global-coordination', 'Global Coordination', 'International cooperation on AGI development', 39),
('decision-authority', 'Decision Authority', 'Who decides AGI development direction', 40),
('racing-dynamics', 'Racing Dynamics', 'Preventing dangerous competitive pressure', 41),
('benefit-distribution', 'Benefit Distribution', 'Ensuring equitable access to AGI benefits', 42),
('regulatory-frameworks', 'Regulatory Frameworks', 'Effective governance structures', 43),
('liability-attribution', 'Liability Attribution', 'Responsibility for AGI actions', 44),
('public-input', 'Public Input Mechanisms', 'Democratic participation in AGI governance', 45),
('expert-disagreement', 'Expert Disagreement Resolution', 'Handling conflicting technical opinions', 46),
('emergency-response', 'Emergency Response', 'Rapid response to AGI incidents', 47),
('international-treaties', 'International Treaties', 'Binding agreements on AGI safety', 48),

-- Category 5: Documentation & Replication (10 problems)
('reproducibility', 'Reproducibility', 'Ensuring research can be verified', 49),
('benchmark-design', 'Benchmark Design', 'Creating meaningful evaluation metrics', 50),
('failure-case-documentation', 'Failure Case Documentation', 'Systematic recording of problems', 51),
('open-source-safety', 'Open Source Safety', 'Balancing transparency and security', 52),
('research-communication', 'Research Communication', 'Making safety research accessible', 53),
('interdisciplinary-bridge', 'Interdisciplinary Bridges', 'Connecting AI safety with other fields', 54),
('talent-pipeline', 'Talent Pipeline', 'Training AGI safety researchers', 55),
('funding-mechanisms', 'Funding Mechanisms', 'Sustaining safety research', 56),
('infrastructure-sharing', 'Infrastructure Sharing', 'Collaborative research platforms', 57),
('knowledge-preservation', 'Knowledge Preservation', 'Maintaining institutional memory', 58)
ON CONFLICT (slug) DO NOTHING;

-- =============================================================================
-- 3. SYBIL RESISTANCE SYSTEM
-- =============================================================================

-- Trust scores for each user
CREATE TABLE IF NOT EXISTS trust_scores (
  user_id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  behavioral_score FLOAT CHECK (behavioral_score BETWEEN 0 AND 1) DEFAULT 0.5,
  network_score FLOAT CHECK (network_score BETWEEN 0 AND 1) DEFAULT 0.5,
  consistency_score FLOAT CHECK (consistency_score BETWEEN 0 AND 1) DEFAULT 0.5,
  time_weighted_score FLOAT CHECK (time_weighted_score BETWEEN 0 AND 1) DEFAULT 0.5,
  combined_trust FLOAT GENERATED ALWAYS AS (
    (behavioral_score * 0.3 + network_score * 0.3 +
     consistency_score * 0.2 + time_weighted_score * 0.2)
  ) STORED,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Voucher chains (who vouches for whom)
CREATE TABLE IF NOT EXISTS voucher_chains (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  voucher_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  vouched_for_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(voucher_id, vouched_for_id)
);

-- Vouching privileges
CREATE TABLE IF NOT EXISTS vouching_privileges (
  user_id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  vouches_remaining INT DEFAULT 3,
  vouches_used INT DEFAULT 0,
  vouched_users UUID[] DEFAULT '{}',
  privilege_suspended BOOLEAN DEFAULT FALSE,
  suspension_reason TEXT
);

-- Voucher reputation (track if vouched users turn out good/bad)
CREATE TABLE IF NOT EXISTS voucher_reputation (
  voucher_id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  successful_vouches INT DEFAULT 0,
  failed_vouches INT DEFAULT 0,
  reputation_score FLOAT GENERATED ALWAYS AS (
    CASE
      WHEN (successful_vouches + failed_vouches) = 0 THEN 0.5
      ELSE successful_vouches::FLOAT / (successful_vouches + failed_vouches)
    END
  ) STORED
);

-- Indexes for trust system
CREATE INDEX IF NOT EXISTS idx_trust_scores_combined ON trust_scores(combined_trust DESC);
CREATE INDEX IF NOT EXISTS idx_voucher_chains_voucher ON voucher_chains(voucher_id);
CREATE INDEX IF NOT EXISTS idx_voucher_chains_vouched_for ON voucher_chains(vouched_for_id);

-- =============================================================================
-- 4. VALUES MANIPULATION DETECTION
-- =============================================================================

-- Anomaly alerts for suspicious value shifts
CREATE TABLE IF NOT EXISTS value_anomaly_alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  dimension TEXT NOT NULL,
  region TEXT,
  suspicion_level TEXT CHECK (suspicion_level IN ('low', 'medium', 'high')) DEFAULT 'low',
  reason TEXT CHECK (reason IN ('rapid_shift', 'unnatural_consensus', 'coordinated_timing', 'statistical_outlier')) NOT NULL,
  affected_sample_size INT DEFAULT 0,
  historical_baseline FLOAT,
  current_value FLOAT,
  sigma_deviation FLOAT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  resolved BOOLEAN DEFAULT FALSE,
  resolution_notes TEXT
);

-- Answer patterns (detect suspicious response behavior)
CREATE TABLE IF NOT EXISTS answer_patterns (
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  pattern_type TEXT CHECK (pattern_type IN ('too_consistent', 'too_fast', 'contradictory', 'bot_like')) NOT NULL,
  confidence FLOAT CHECK (confidence BETWEEN 0 AND 1) DEFAULT 0.5,
  detected_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  details JSONB
);

-- Indexes for anomaly detection
CREATE INDEX IF NOT EXISTS idx_value_anomaly_alerts_dimension ON value_anomaly_alerts(dimension);
CREATE INDEX IF NOT EXISTS idx_value_anomaly_alerts_region ON value_anomaly_alerts(region);
CREATE INDEX IF NOT EXISTS idx_value_anomaly_alerts_suspicion ON value_anomaly_alerts(suspicion_level);
CREATE INDEX IF NOT EXISTS idx_value_anomaly_alerts_created ON value_anomaly_alerts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_answer_patterns_user ON answer_patterns(user_id);
CREATE INDEX IF NOT EXISTS idx_answer_patterns_type ON answer_patterns(pattern_type);

-- =============================================================================
-- 5. AGAME QUESTION IMPROVEMENTS
-- =============================================================================

-- Add metadata columns to agame_questions
ALTER TABLE agame_questions ADD COLUMN IF NOT EXISTS question_type TEXT
  CHECK (question_type IN ('dilemma', 'paired_comparison', 'implicit', 'timed')) DEFAULT 'dilemma';
ALTER TABLE agame_questions ADD COLUMN IF NOT EXISTS cognitive_load TEXT
  CHECK (cognitive_load IN ('low', 'medium', 'high')) DEFAULT 'medium';
ALTER TABLE agame_questions ADD COLUMN IF NOT EXISTS time_limit_seconds INT;

-- =============================================================================
-- 6. GOVERNANCE FORK SYSTEM
-- =============================================================================

-- Track governance forks
CREATE TABLE IF NOT EXISTS governance_forks (
  fork_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  forked_from UUID REFERENCES hubs(id) ON DELETE SET NULL,
  modified_laws JSONB, -- Which of the 7 Laws they changed
  participant_count INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  reason TEXT,
  fork_url TEXT,
  original_maintainer_endorsement BOOLEAN DEFAULT FALSE
);

-- Law interpretation votes
CREATE TABLE IF NOT EXISTS law_interpretation_votes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  hub_id UUID REFERENCES hubs(id) ON DELETE CASCADE,
  proposal_id UUID REFERENCES proposals(id) ON DELETE CASCADE,
  disputed_law TEXT CHECK (disputed_law IN ('truth', 'empathy', 'peace', 'autonomy', 'accountability', 'stewardship', 'integrity')) NOT NULL,
  interpretation TEXT NOT NULL,
  votes_for INT DEFAULT 0,
  votes_against INT DEFAULT 0,
  requires_70_percent BOOLEAN DEFAULT TRUE,
  resolved BOOLEAN DEFAULT FALSE,
  resolution TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_governance_forks_forked_from ON governance_forks(forked_from);
CREATE INDEX IF NOT EXISTS idx_law_interpretation_hub ON law_interpretation_votes(hub_id);
CREATE INDEX IF NOT EXISTS idx_law_interpretation_proposal ON law_interpretation_votes(proposal_id);

-- =============================================================================
-- 7. LEGAL AGREEMENTS
-- =============================================================================

CREATE TABLE IF NOT EXISTS legal_agreements (
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  agreement_type TEXT CHECK (agreement_type IN ('terms', 'privacy', 'code_of_conduct')) NOT NULL,
  version TEXT NOT NULL,
  accepted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ip_address INET,
  PRIMARY KEY (user_id, agreement_type, version)
);

CREATE INDEX IF NOT EXISTS idx_legal_agreements_user ON legal_agreements(user_id);
CREATE INDEX IF NOT EXISTS idx_legal_agreements_type ON legal_agreements(agreement_type);

-- =============================================================================
-- 8. FUNCTIONS FOR ANOMALY DETECTION
-- =============================================================================

-- Function: Detect rapid value shifts
CREATE OR REPLACE FUNCTION detect_value_anomalies()
RETURNS void AS $$
DECLARE
  v_dimension RECORD;
  v_historical_avg FLOAT;
  v_current_avg FLOAT;
  v_std_dev FLOAT;
  v_sigma FLOAT;
BEGIN
  -- Check each value dimension
  FOR v_dimension IN SELECT DISTINCT value_dimension FROM values_map LOOP
    -- Calculate historical average (older than 7 days)
    SELECT AVG(global_average) INTO v_historical_avg
    FROM values_map
    WHERE value_dimension = v_dimension.value_dimension
      AND last_updated < NOW() - INTERVAL '7 days';

    -- Calculate current average (last 24 hours)
    SELECT AVG(global_average) INTO v_current_avg
    FROM values_map
    WHERE value_dimension = v_dimension.value_dimension
      AND last_updated > NOW() - INTERVAL '24 hours';

    -- Calculate standard deviation
    SELECT STDDEV(global_average) INTO v_std_dev
    FROM values_map
    WHERE value_dimension = v_dimension.value_dimension
      AND last_updated < NOW() - INTERVAL '7 days';

    -- Calculate sigma deviation
    IF v_std_dev > 0 AND v_historical_avg IS NOT NULL AND v_current_avg IS NOT NULL THEN
      v_sigma := ABS(v_current_avg - v_historical_avg) / v_std_dev;

      -- Alert if >3 sigma
      IF v_sigma > 3 THEN
        INSERT INTO value_anomaly_alerts (
          dimension, suspicion_level, reason,
          historical_baseline, current_value, sigma_deviation
        ) VALUES (
          v_dimension.value_dimension,
          CASE
            WHEN v_sigma > 5 THEN 'high'
            WHEN v_sigma > 4 THEN 'medium'
            ELSE 'low'
          END,
          'rapid_shift',
          v_historical_avg,
          v_current_avg,
          v_sigma
        );
      END IF;
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Function: Update trust scores
CREATE OR REPLACE FUNCTION update_trust_scores()
RETURNS void AS $$
BEGIN
  -- Update behavioral scores based on response patterns
  UPDATE trust_scores ts
  SET
    behavioral_score = GREATEST(0, LEAST(1, 0.5 - (
      SELECT COUNT(*) * 0.1
      FROM answer_patterns ap
      WHERE ap.user_id = ts.user_id
        AND ap.detected_at > NOW() - INTERVAL '30 days'
    ))),
    last_updated = NOW()
  WHERE EXISTS (
    SELECT 1 FROM answer_patterns ap
    WHERE ap.user_id = ts.user_id
      AND ap.detected_at > NOW() - INTERVAL '30 days'
  );

  -- Update network scores based on voucher chain
  UPDATE trust_scores ts
  SET
    network_score = LEAST(1, (
      SELECT COUNT(*) * 0.2
      FROM voucher_chains vc
      WHERE vc.vouched_for_id = ts.user_id
    )),
    last_updated = NOW();
END;
$$ LANGUAGE plpgsql;
