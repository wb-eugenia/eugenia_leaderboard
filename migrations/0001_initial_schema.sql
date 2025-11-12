-- Eugenia Challenge - Schema D1 Migration
-- Migration: 0001_initial_schema.sql

-- Leaderboard/Users table
CREATE TABLE IF NOT EXISTS leaderboard (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  classe TEXT,
  total_points INTEGER DEFAULT 0,
  actions_count INTEGER DEFAULT 0,
  last_update TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes pour leaderboard (après création de la table)
CREATE INDEX IF NOT EXISTS idx_leaderboard_email ON leaderboard(email);
CREATE INDEX IF NOT EXISTS idx_leaderboard_points ON leaderboard(total_points DESC);
CREATE INDEX IF NOT EXISTS idx_leaderboard_classe ON leaderboard(classe);

-- Actions table
CREATE TABLE IF NOT EXISTS actions (
  id TEXT PRIMARY KEY, -- Format: 'act_1234567890_abc123'
  email TEXT NOT NULL,
  type TEXT NOT NULL,
  data TEXT, -- JSON stocké en TEXT
  status TEXT NOT NULL DEFAULT 'pending', -- pending, validated, rejected
  submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  validated_at TIMESTAMP,
  decision TEXT, -- validated, rejected
  points INTEGER DEFAULT 0,
  comment TEXT,
  validated_by TEXT -- Email ou 'system' ou 'Admin'
);

-- Indexes pour actions
CREATE INDEX IF NOT EXISTS idx_actions_email ON actions(email);
CREATE INDEX IF NOT EXISTS idx_actions_status ON actions(status);
CREATE INDEX IF NOT EXISTS idx_actions_type ON actions(type);
CREATE INDEX IF NOT EXISTS idx_actions_submitted_at ON actions(submitted_at DESC);

-- Config table (key-value store)
CREATE TABLE IF NOT EXISTS config (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  key TEXT UNIQUE NOT NULL,
  value TEXT, -- JSON stocké en TEXT
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index pour config
CREATE INDEX IF NOT EXISTS idx_config_key ON config(key);

-- Automations table
CREATE TABLE IF NOT EXISTS automations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  action_type_id TEXT NOT NULL,
  enabled INTEGER DEFAULT 1, -- 0 = disabled, 1 = enabled (SQLite boolean)
  sheet_id TEXT,
  sheet_range TEXT DEFAULT 'A:Z',
  student_id_type TEXT DEFAULT 'email', -- email, nom, prenom, nom_complet
  student_id_columns TEXT,
  form_field_to_match TEXT,
  form_field_columns TEXT,
  form_field_rule TEXT DEFAULT 'exact',
  mapped_columns TEXT, -- JSON array
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes pour automations
CREATE INDEX IF NOT EXISTS idx_automations_enabled ON automations(enabled);
CREATE INDEX IF NOT EXISTS idx_automations_action_type ON automations(action_type_id);

