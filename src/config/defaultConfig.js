// Configuration par défaut de l'application Eugenia Challenge

export const defaultConfig = {
  appName: "🏆 Eugenia Challenge",
  appTagline: "Défie-toi, accumule des points, deviens champion du campus !",
  
  // Configuration des types d'actions
  actionTypes: [
    {
      id: "linkedin-post",
      label: "Post LinkedIn",
      emoji: "📱",
      category: "Social Media",
      points: 50,
      autoValidation: false,
      fields: [
        {
          name: "link",
          type: "url",
          label: "Lien du post",
          placeholder: "https://www.linkedin.com/posts/...",
          required: true,
          validation: {
            pattern: "linkedin.com",
            message: "Le lien doit être une URL LinkedIn valide"
          }
        },
        {
          name: "description",
          type: "textarea",
          label: "Description du post",
          placeholder: "Décrivez votre post...",
          required: false
        }
      ]
    },
    {
      id: "jpo-participation",
      label: "Participation JPO",
      emoji: "🎓",
      category: "Événements",
      points: 100,
      autoValidation: false,
      fields: [
        {
          name: "date",
          type: "date",
          label: "Date de participation",
          required: true
        },
        {
          name: "location",
          type: "text",
          label: "Lieu",
          placeholder: "Campus Paris",
          required: false
        },
        {
          name: "notes",
          type: "textarea",
          label: "Notes",
          placeholder: "Ajoutez des informations complémentaires...",
          required: false
        }
      ]
    },
    {
      id: "hackathon-victory",
      label: "Victoire Hackathon",
      emoji: "🏆",
      category: "Compétitions",
      points: 200,
      autoValidation: false,
      fields: [
        {
          name: "eventName",
          type: "text",
          label: "Nom de l'événement",
          placeholder: "Hackathon AI 2024",
          required: true
        },
        {
          name: "teamName",
          type: "text",
          label: "Nom de l'équipe",
          required: false
        },
        {
          name: "date",
          type: "date",
          label: "Date de l'événement",
          required: true
        }
      ]
    },
    {
      id: "association-create",
      label: "Création Association",
      emoji: "🤝",
      category: "Étudiants",
      points: 150,
      autoValidation: false,
      fields: [
        {
          name: "associationName",
          type: "text",
          label: "Nom de l'association",
          placeholder: "BDE Campus",
          required: true
        },
        {
          name: "role",
          type: "text",
          label: "Votre rôle",
          placeholder: "Président, Trésorier...",
          required: false
        }
      ]
    }
  ],
  
  // Configuration du leaderboard
  leaderboard: {
    columns: ["rank", "name", "points", "actions"],
    displayAvatars: true,
    pointsCalculation: "sum"
  },
  
  // Email domain autorisé
  allowedEmailDomain: "@eugeniaschool.com",
  
  // Configuration par défaut des automatisations
  automations: []
};

// Stockage des données
export const SHEETS_CONFIG = {
  SHEET_ID: 'YOUR_GOOGLE_SHEET_ID', // À remplacer
  
  TABS: {
    ACTIONS: 'Actions',
    LEADERBOARD: 'Leaderboard',
    CONFIG: 'Config'
  },
  
  // Structure de l'onglet Actions
  ACTIONS_COLUMNS: {
    ID: 'A',
    EMAIL: 'B',
    TYPE: 'C',
    DATA: 'D',
    DATE: 'E',
    STATUS: 'F',
    DECISION: 'G',
    POINTS: 'H',
    COMMENT: 'I',
    VALIDATED_BY: 'J',
    VALIDATED_AT: 'K'
  },
  
  // Structure de l'onglet Leaderboard
  LEADERBOARD_COLUMNS: {
    FIRST_NAME: 'A',
    LAST_NAME: 'B',
    EMAIL: 'C',
    TOTAL_POINTS: 'D',
    ACTIONS_COUNT: 'E',
    LAST_UPDATE: 'F'
  }
};

export default defaultConfig;

