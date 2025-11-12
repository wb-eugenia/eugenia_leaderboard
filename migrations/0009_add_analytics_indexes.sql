-- Eugenia Challenge - Analytics Indexes
-- Migration: 0009_add_analytics_indexes.sql

-- Index pour optimiser les requêtes analytics sur submitted_at
CREATE INDEX IF NOT EXISTS idx_actions_submitted_at_analytics ON actions(submitted_at);

-- Index composite pour status + submitted_at (utilisé dans plusieurs endpoints analytics)
CREATE INDEX IF NOT EXISTS idx_actions_status_submitted ON actions(status, submitted_at);

-- Index pour optimiser les jointures avec students (déjà existe, mais on le garde)
CREATE INDEX IF NOT EXISTS idx_actions_email_analytics ON actions(email);

-- Index pour optimiser les jointures avec action_types (via type)
CREATE INDEX IF NOT EXISTS idx_actions_type_analytics ON actions(type);

-- Index pour leaderboard queries
CREATE INDEX IF NOT EXISTS idx_leaderboard_email_analytics ON leaderboard(email);
CREATE INDEX IF NOT EXISTS idx_leaderboard_total_points_analytics ON leaderboard(total_points);

