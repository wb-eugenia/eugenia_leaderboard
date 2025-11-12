-- Eugenia Challenge - Seed Action Types
-- Migration: 0004_seed_action_types.sql
-- Insère les types d'actions par défaut

INSERT OR IGNORE INTO action_types (id, label, emoji, category, points, auto_validation, fields) VALUES
('linkedin-post', 'Post LinkedIn', '📱', 'Social Media', 50, 0, '[
  {
    "name": "link",
    "type": "url",
    "label": "Lien du post",
    "placeholder": "https://www.linkedin.com/posts/...",
    "required": true,
    "validation": {
      "pattern": "linkedin.com",
      "message": "Le lien doit être une URL LinkedIn valide"
    }
  },
  {
    "name": "description",
    "type": "textarea",
    "label": "Description du post",
    "placeholder": "Décrivez votre post...",
    "required": false
  }
]'),
('jpo-participation', 'Participation JPO', '🎓', 'Événements', 100, 0, '[
  {
    "name": "date",
    "type": "date",
    "label": "Date de participation",
    "required": true
  },
  {
    "name": "location",
    "type": "text",
    "label": "Lieu",
    "placeholder": "Campus Paris",
    "required": false
  },
  {
    "name": "notes",
    "type": "textarea",
    "label": "Notes",
    "placeholder": "Ajoutez des informations complémentaires...",
    "required": false
  }
]'),
('hackathon-victory', 'Victoire Hackathon', '🏆', 'Compétitions', 200, 0, '[
  {
    "name": "eventName",
    "type": "text",
    "label": "Nom de l''événement",
    "placeholder": "Hackathon AI 2024",
    "required": true
  },
  {
    "name": "teamName",
    "type": "text",
    "label": "Nom de l''équipe",
    "required": false
  },
  {
    "name": "date",
    "type": "date",
    "label": "Date de l''événement",
    "required": true
  }
]'),
('association-create', 'Création Association', '🤝', 'Étudiants', 150, 0, '[
  {
    "name": "associationName",
    "type": "text",
    "label": "Nom de l''association",
    "placeholder": "BDE Campus",
    "required": true
  },
  {
    "name": "role",
    "type": "text",
    "label": "Votre rôle",
    "placeholder": "Président, Trésorier...",
    "required": false
  }
]');

