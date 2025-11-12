-- Migration: 0005_add_google_oauth.sql
-- Table pour stocker les tokens OAuth Google

CREATE TABLE IF NOT EXISTS google_oauth_tokens (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_email TEXT NOT NULL UNIQUE, -- Email de l'admin qui a connecté (UNIQUE pour ON CONFLICT)
  access_token TEXT NOT NULL,
  refresh_token TEXT,
  expires_at TIMESTAMP,
  scope TEXT, -- Scopes accordés (ex: 'https://www.googleapis.com/auth/spreadsheets.readonly')
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_google_oauth_user ON google_oauth_tokens(user_email);
CREATE INDEX IF NOT EXISTS idx_google_oauth_expires ON google_oauth_tokens(expires_at);

