-- Migration: 0014_add_moderation_levels.sql
-- Description: Ajoute un système de modération multi-niveaux

-- Table des modérateurs avec niveaux
CREATE TABLE IF NOT EXISTS moderators (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  level INTEGER DEFAULT 1, -- 1: Basic, 2: Advanced, 3: Super Admin
  permissions TEXT, -- JSON array des permissions
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des workflows de modération
CREATE TABLE IF NOT EXISTS moderation_workflows (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  content_type TEXT NOT NULL, -- 'action', 'report', 'portfolio', etc.
  content_id TEXT NOT NULL,
  current_level INTEGER DEFAULT 1,
  status TEXT DEFAULT 'pending', -- pending, approved, rejected, escalated
  assigned_to TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(content_type, content_id)
);

-- Table de l'historique de modération
CREATE TABLE IF NOT EXISTS moderation_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  workflow_id INTEGER NOT NULL,
  moderator_email TEXT NOT NULL,
  action TEXT NOT NULL, -- 'approve', 'reject', 'escalate', 'comment'
  comment TEXT,
  previous_level INTEGER,
  new_level INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (workflow_id) REFERENCES moderation_workflows(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_moderation_workflows_status ON moderation_workflows(status);
CREATE INDEX IF NOT EXISTS idx_moderation_workflows_assigned ON moderation_workflows(assigned_to);
CREATE INDEX IF NOT EXISTS idx_moderation_history_workflow ON moderation_history(workflow_id);

-- Insérer les admins par défaut comme modérateurs niveau 3
-- (sera fait via l'API ou manuellement)










