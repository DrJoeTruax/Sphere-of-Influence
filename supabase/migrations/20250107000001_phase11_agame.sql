-- Phase 11: Project Agame Database Schema
-- Run this migration to add Agame tables

-- Agame Questions Bank
CREATE TABLE IF NOT EXISTS agame_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL, -- 'ethics', 'freedom', 'wellbeing', 'fairness', etc.
  difficulty INTEGER CHECK (difficulty BETWEEN 1 AND 10), -- 1-10, gets harder as you go
  question_text TEXT NOT NULL,
  option_a_text TEXT NOT NULL,
  option_b_text TEXT NOT NULL,
  option_a_represents TEXT, -- 'utilitarian', 'deontological', 'virtue-ethics', etc.
  option_b_represents TEXT,
  times_presented INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- User Responses
CREATE TABLE IF NOT EXISTS agame_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  question_id UUID REFERENCES agame_questions(id),
  choice TEXT CHECK (choice IN ('A', 'B', 'skip')),
  response_time_ms INTEGER, -- How long they took to decide
  certainty INTEGER CHECK (certainty BETWEEN 1 AND 5), -- How sure are they?
  created_at TIMESTAMP DEFAULT NOW(),
  user_region TEXT, -- Which hub they're from
  user_age_group TEXT, -- Optional demographic data
  UNIQUE(user_id, question_id)
);

-- Aggregate Values Map
CREATE TABLE IF NOT EXISTS values_map (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  value_dimension TEXT NOT NULL, -- 'individual_vs_collective', 'safety_vs_freedom', etc.
  name TEXT NOT NULL, -- Human-readable name
  question_ids UUID[], -- Which questions contribute to this dimension
  global_average FLOAT, -- -1 to 1 scale
  by_region JSONB, -- {"north-america": 0.6, "india": -0.2, ...}
  by_age_group JSONB,
  sample_size INTEGER DEFAULT 0,
  last_updated TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_agame_responses_user ON agame_responses(user_id);
CREATE INDEX IF NOT EXISTS idx_agame_responses_question ON agame_responses(question_id);
CREATE INDEX IF NOT EXISTS idx_agame_responses_created ON agame_responses(created_at);
CREATE INDEX IF NOT EXISTS idx_agame_questions_category ON agame_questions(category);
CREATE INDEX IF NOT EXISTS idx_agame_questions_difficulty ON agame_questions(difficulty);

-- Add agame_score to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS agame_score INTEGER DEFAULT 0;

-- Function: Get next question for user
CREATE OR REPLACE FUNCTION get_next_agame_question(
  p_user_id UUID,
  difficulty_level INTEGER
)
RETURNS TABLE (
  id UUID,
  category TEXT,
  difficulty INTEGER,
  question_text TEXT,
  option_a_text TEXT,
  option_b_text TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    q.id,
    q.category,
    q.difficulty,
    q.question_text,
    q.option_a_text,
    q.option_b_text
  FROM agame_questions q
  LEFT JOIN agame_responses r ON q.id = r.question_id AND r.user_id = p_user_id
  WHERE r.id IS NULL
    AND q.difficulty <= difficulty_level
  ORDER BY q.times_presented ASC, RANDOM()
  LIMIT 1;
END;
$$ LANGUAGE plpgsql;

-- Function: Get question statistics
CREATE OR REPLACE FUNCTION get_question_stats(p_question_id UUID)
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'total_responses', COUNT(*),
    'option_a_count', COUNT(*) FILTER (WHERE choice = 'A'),
    'option_b_count', COUNT(*) FILTER (WHERE choice = 'B'),
    'option_a_percentage', ROUND(
      (COUNT(*) FILTER (WHERE choice = 'A')::FLOAT / NULLIF(COUNT(*) FILTER (WHERE choice IN ('A', 'B')), 0)) * 100, 1
    ),
    'option_b_percentage', ROUND(
      (COUNT(*) FILTER (WHERE choice = 'B')::FLOAT / NULLIF(COUNT(*) FILTER (WHERE choice IN ('A', 'B')), 0)) * 100, 1
    ),
    'avg_response_time_ms', AVG(response_time_ms),
    'by_region', (
      SELECT json_agg(
        json_build_object(
          'name', user_region,
          'option_a_percentage', ROUND(
            (COUNT(*) FILTER (WHERE choice = 'A')::FLOAT / NULLIF(COUNT(*) FILTER (WHERE choice IN ('A', 'B')), 0)) * 100, 1
          ),
          'option_b_percentage', ROUND(
            (COUNT(*) FILTER (WHERE choice = 'B')::FLOAT / NULLIF(COUNT(*) FILTER (WHERE choice IN ('A', 'B')), 0)) * 100, 1
          )
        )
      )
      FROM agame_responses
      WHERE agame_responses.question_id = p_question_id
      GROUP BY user_region
    )
  ) INTO result
  FROM agame_responses
  WHERE agame_responses.question_id = p_question_id;

  RETURN COALESCE(result, '{}'::json);
END;
$$ LANGUAGE plpgsql;

-- Function: Update values map (run periodically)
CREATE OR REPLACE FUNCTION update_values_map()
RETURNS void AS $$
BEGIN
  UPDATE values_map vm
  SET
    global_average = (
      SELECT AVG(
        CASE
          WHEN choice = 'A' THEN -1
          WHEN choice = 'B' THEN 1
          ELSE 0
        END
      )
      FROM agame_responses r
      JOIN agame_questions q ON r.question_id = q.id
      WHERE q.id = ANY(vm.question_ids)
    ),
    by_region = (
      SELECT jsonb_object_agg(
        user_region,
        avg_value
      )
      FROM (
        SELECT
          user_region,
          AVG(
            CASE
              WHEN choice = 'A' THEN -1
              WHEN choice = 'B' THEN 1
              ELSE 0
            END
          ) as avg_value
        FROM agame_responses r
        JOIN agame_questions q ON r.question_id = q.id
        WHERE q.id = ANY(vm.question_ids)
        GROUP BY user_region
      ) subq
    ),
    sample_size = (
      SELECT COUNT(*)
      FROM agame_responses r
      JOIN agame_questions q ON r.question_id = q.id
      WHERE q.id = ANY(vm.question_ids)
    ),
    last_updated = NOW();
END;
$$ LANGUAGE plpgsql;
