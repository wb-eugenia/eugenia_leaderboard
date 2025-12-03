-- Migration 0015: Tables pour les associations
-- Création des tables pour gérer les associations, membres, candidatures et événements

-- Table des associations
CREATE TABLE IF NOT EXISTS associations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    emoji TEXT NOT NULL DEFAULT '🤝',
    description TEXT,
    category TEXT NOT NULL DEFAULT 'Autre',
    created_by TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Table des membres d'associations
CREATE TABLE IF NOT EXISTS association_members (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    association_id INTEGER NOT NULL,
    student_email TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'member' CHECK(role IN ('member', 'admin')),
    joined_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status TEXT NOT NULL DEFAULT 'active' CHECK(status IN ('active', 'inactive')),
    FOREIGN KEY (association_id) REFERENCES associations(id) ON DELETE CASCADE,
    UNIQUE(association_id, student_email)
);

-- Table des candidatures aux associations
CREATE TABLE IF NOT EXISTS association_applications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    association_id INTEGER NOT NULL,
    student_email TEXT NOT NULL,
    message TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending', 'accepted', 'rejected')),
    applied_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    reviewed_at TEXT,
    reviewed_by TEXT,
    FOREIGN KEY (association_id) REFERENCES associations(id) ON DELETE CASCADE
);

-- Table des événements des associations
CREATE TABLE IF NOT EXISTS association_events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    association_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    date TEXT NOT NULL,
    time TEXT,
    location TEXT,
    created_by TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (association_id) REFERENCES associations(id) ON DELETE CASCADE
);

-- Index pour optimiser les requêtes
CREATE INDEX IF NOT EXISTS idx_association_members_association ON association_members(association_id);
CREATE INDEX IF NOT EXISTS idx_association_members_email ON association_members(student_email);
CREATE INDEX IF NOT EXISTS idx_association_applications_association ON association_applications(association_id);
CREATE INDEX IF NOT EXISTS idx_association_applications_status ON association_applications(status);
CREATE INDEX IF NOT EXISTS idx_association_events_association ON association_events(association_id);
CREATE INDEX IF NOT EXISTS idx_association_events_date ON association_events(date);

