-- Migration: 0006_add_oauth_credentials.sql
-- Stocker les credentials OAuth Google dans la DB (comme n8n)

-- Table pour stocker les credentials OAuth (Client ID, Secret, etc.)
CREATE TABLE IF NOT EXISTS oauth_credentials (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  provider TEXT NOT NULL DEFAULT 'google' UNIQUE,
  client_id TEXT,
  client_secret TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index pour provider
CREATE INDEX IF NOT EXISTS idx_oauth_credentials_provider ON oauth_credentials(provider);

-- Insérer une ligne par défaut pour Google
INSERT OR IGNORE INTO oauth_credentials (provider, client_id, client_secret) 
VALUES ('google', NULL, NULL);

