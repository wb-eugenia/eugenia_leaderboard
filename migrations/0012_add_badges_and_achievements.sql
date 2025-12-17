-- Migration: 0012_add_badges_and_achievements.sql
-- Description: Ajoute un système de badges et achievements pour gamifier l'expérience

-- Table des badges disponibles
CREATE TABLE IF NOT EXISTS badges (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  code TEXT UNIQUE NOT NULL, -- Ex: 'first_action', 'top_10', 'social_media_master'
  name TEXT NOT NULL,
  description TEXT,
  emoji TEXT DEFAULT '🏆',
  icon_url TEXT,
  category TEXT DEFAULT 'general', -- general, social, academic, event, special
  points_required INTEGER DEFAULT 0,
  actions_required INTEGER DEFAULT 0,
  rarity TEXT DEFAULT 'common', -- common, rare, epic, legendary
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des badges obtenus par les étudiants
CREATE TABLE IF NOT EXISTS student_badges (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  student_email TEXT NOT NULL,
  badge_id INTEGER NOT NULL,
  earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (badge_id) REFERENCES badges(id) ON DELETE CASCADE,
  UNIQUE(student_email, badge_id)
);

-- Table des achievements (objectifs à atteindre)
CREATE TABLE IF NOT EXISTS achievements (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  emoji TEXT DEFAULT '⭐',
  category TEXT DEFAULT 'general',
  target_value INTEGER NOT NULL, -- Ex: 100 points, 10 actions, etc.
  target_type TEXT NOT NULL, -- points, actions, days_active, etc.
  reward_points INTEGER DEFAULT 0,
  reward_badge_id INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (reward_badge_id) REFERENCES badges(id)
);

-- Table des achievements complétés
CREATE TABLE IF NOT EXISTS student_achievements (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  student_email TEXT NOT NULL,
  achievement_id INTEGER NOT NULL,
  completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  progress INTEGER DEFAULT 100, -- Pourcentage de complétion
  FOREIGN KEY (achievement_id) REFERENCES achievements(id) ON DELETE CASCADE,
  UNIQUE(student_email, achievement_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_student_badges_email ON student_badges(student_email);
CREATE INDEX IF NOT EXISTS idx_student_badges_badge ON student_badges(badge_id);
CREATE INDEX IF NOT EXISTS idx_student_achievements_email ON student_achievements(student_email);
CREATE INDEX IF NOT EXISTS idx_badges_category ON badges(category);
CREATE INDEX IF NOT EXISTS idx_achievements_category ON achievements(category);

-- Badges par défaut
INSERT INTO badges (code, name, description, emoji, category, rarity) VALUES
  ('first_action', 'Première Action', 'Soumettez votre première action', '🎯', 'general', 'common'),
  ('top_10', 'Top 10', 'Atteignez le top 10 du classement', '🥇', 'academic', 'rare'),
  ('top_3', 'Top 3', 'Atteignez le podium', '🏆', 'academic', 'epic'),
  ('social_media_master', 'Maître des Réseaux', '10 posts LinkedIn validés', '📱', 'social', 'rare'),
  ('ambassador', 'Ambassadeur', 'Rejoignez le programme ambassadeur', '🌟', 'special', 'epic'),
  ('association_member', 'Membre Actif', 'Rejoignez une association', '🤝', 'event', 'common'),
  ('portfolio_creator', 'Créateur de Portfolio', 'Créez votre portfolio', '🎨', 'academic', 'common'),
  ('hackathon_winner', 'Vainqueur Hackathon', 'Gagnez un hackathon', '💻', 'academic', 'legendary'),
  ('points_milestone_100', '100 Points', 'Atteignez 100 points', '💯', 'academic', 'common'),
  ('points_milestone_500', '500 Points', 'Atteignez 500 points', '🔥', 'academic', 'rare'),
  ('points_milestone_1000', '1000 Points', 'Atteignez 1000 points', '⚡', 'academic', 'epic'),
  ('streak_7', 'Série de 7', '7 jours consécutifs d''activité', '🔥', 'general', 'rare'),
  ('streak_30', 'Série de 30', '30 jours consécutifs d''activité', '💪', 'general', 'legendary');

-- Achievements par défaut
INSERT INTO achievements (code, name, description, emoji, category, target_type, target_value, reward_points) VALUES
  ('reach_100_points', 'Objectif 100 Points', 'Atteignez 100 points', '💯', 'academic', 'points', 100, 10),
  ('complete_10_actions', '10 Actions', 'Complétez 10 actions', '✅', 'general', 'actions', 10, 20),
  ('active_week', 'Semaine Active', 'Soyez actif 7 jours consécutifs', '📅', 'general', 'days_active', 7, 15),
  ('social_butterfly', 'Papillon Social', 'Partagez 5 posts sur les réseaux', '🦋', 'social', 'actions', 5, 25);










