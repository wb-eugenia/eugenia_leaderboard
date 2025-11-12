-- Eugenia Challenge - Seed Landing Page Config Default Values
-- Migration: 0007_seed_landing_page_config.sql

-- Insérer la configuration par défaut de la landing page
-- Utiliser INSERT OR IGNORE pour éviter les erreurs si les valeurs existent déjà

-- Configuration globale
INSERT OR IGNORE INTO landing_page_config (key, value, updated_at) VALUES
  ('totalPrizePool', '+500€', CURRENT_TIMESTAMP),
  ('deadline', '31 janvier 2026', CURRENT_TIMESTAMP);

-- Textes de la landing page
INSERT OR IGNORE INTO landing_page_config (key, value, updated_at) VALUES
  ('landingTexts.heroTitle', '🏆 EUGENIA CHALLENGE 2025 🏆', CURRENT_TIMESTAMP),
  ('landingTexts.heroSubtitle', 'Gagne des points, monte dans le classement, deviens le champion du campus !', CURRENT_TIMESTAMP),
  ('landingTexts.prizeBadge', '+500€ DE CAGNOTTE\naio gagner ce semestre !', CURRENT_TIMESTAMP),
  ('landingTexts.sectionRewardsTitle', 'Récompenses à gagner', CURRENT_TIMESTAMP),
  ('landingTexts.sectionHowItWorksTitle', 'Comment participer ?', CURRENT_TIMESTAMP),
  ('landingTexts.step1Title', 'Choisis une action', CURRENT_TIMESTAMP),
  ('landingTexts.step1Desc', 'Post LinkedIn, JPO, Hackathon, Association...', CURRENT_TIMESTAMP),
  ('landingTexts.step2Title', 'Soumets ta preuve', CURRENT_TIMESTAMP),
  ('landingTexts.step2Desc', 'Lien, date ou photo', CURRENT_TIMESTAMP),
  ('landingTexts.step3Title', 'Gagne des points !', CURRENT_TIMESTAMP),
  ('landingTexts.step3Desc', 'Monte dans le top 3 et gagne !', CURRENT_TIMESTAMP),
  ('landingTexts.sectionActionsTitle', 'Comment gagner des points ?', CURRENT_TIMESTAMP),
  ('landingTexts.sectionLeaderboardTitle', 'Classement en direct - Course aux {amount}', CURRENT_TIMESTAMP),
  ('landingTexts.sectionLeaderboardSubtitle', 'Cagnotte : {amount} | Fin : {deadline}', CURRENT_TIMESTAMP),
  ('landingTexts.sectionFinalCTATitle', 'La course aux {amount} est lancée !', CURRENT_TIMESTAMP),
  ('landingTexts.sectionFinalCTADesc', 'Soumets ta première action maintenant et commence à grimper dans le classement', CURRENT_TIMESTAMP);

-- Note: Cette migration utilise INSERT OR IGNORE pour éviter les erreurs
-- si les valeurs existent déjà. Pour forcer la mise à jour des valeurs existantes,
-- utilisez INSERT OR REPLACE à la place.

