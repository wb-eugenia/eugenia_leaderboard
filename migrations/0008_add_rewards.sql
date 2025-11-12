-- Eugenia Challenge - Rewards Table
-- Migration: 0008_add_rewards.sql

CREATE TABLE IF NOT EXISTS rewards (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  rank INTEGER NOT NULL,
  position TEXT NOT NULL,
  emoji TEXT,
  amount TEXT,
  benefits TEXT, -- JSON array of benefits
  gradient TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index pour rewards
CREATE INDEX IF NOT EXISTS idx_rewards_rank ON rewards(rank);

