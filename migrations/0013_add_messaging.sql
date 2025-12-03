-- Migration: 0013_add_messaging.sql
-- Description: Ajoute un système de messagerie interne

CREATE TABLE IF NOT EXISTS messages (
  id TEXT PRIMARY KEY,
  sender_email TEXT NOT NULL,
  recipient_email TEXT NOT NULL,
  subject TEXT NOT NULL,
  content TEXT NOT NULL,
  read BOOLEAN DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  parent_message_id TEXT, -- Pour les réponses
  FOREIGN KEY (parent_message_id) REFERENCES messages(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_messages_sender ON messages(sender_email);
CREATE INDEX IF NOT EXISTS idx_messages_recipient ON messages(recipient_email);
CREATE INDEX IF NOT EXISTS idx_messages_read ON messages(read);
CREATE INDEX IF NOT EXISTS idx_messages_created ON messages(created_at DESC);

-- Table pour les conversations (groupes de messages)
CREATE TABLE IF NOT EXISTS conversations (
  id TEXT PRIMARY KEY,
  participant1_email TEXT NOT NULL,
  participant2_email TEXT NOT NULL,
  last_message_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(participant1_email, participant2_email)
);

CREATE INDEX IF NOT EXISTS idx_conversations_participant1 ON conversations(participant1_email);
CREATE INDEX IF NOT EXISTS idx_conversations_participant2 ON conversations(participant2_email);
CREATE INDEX IF NOT EXISTS idx_conversations_last_message ON conversations(last_message_at DESC);







