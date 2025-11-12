-- Eugenia Challenge - Action Types and Landing Page Config
-- Migration: 0003_add_action_types_and_landing.sql

-- Action Types table (normalized)
CREATE TABLE IF NOT EXISTS action_types (
  id TEXT PRIMARY KEY, -- e.g. 'linkedin-post', 'jpo-participation'
  label TEXT NOT NULL,
  emoji TEXT,
  category TEXT NOT NULL,
  points INTEGER DEFAULT 0,
  auto_validation INTEGER DEFAULT 0, -- 0 = false, 1 = true (SQLite boolean)
  fields TEXT, -- JSON array of field definitions
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes pour action_types
CREATE INDEX IF NOT EXISTS idx_action_types_category ON action_types(category);
CREATE INDEX IF NOT EXISTS idx_action_types_enabled ON action_types(auto_validation);

-- Landing Page Config table (specific config keys)
CREATE TABLE IF NOT EXISTS landing_page_config (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  key TEXT UNIQUE NOT NULL, -- e.g. 'heroTitle', 'heroSubtitle', 'totalPrizePool', 'deadline'
  value TEXT NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index pour landing_page_config
CREATE INDEX IF NOT EXISTS idx_landing_config_key ON landing_page_config(key);

