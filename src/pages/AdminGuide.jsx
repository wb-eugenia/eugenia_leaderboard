import { Link } from 'react-router-dom';

export default function AdminGuide() {
  const sections = [
    {
      id: 'dashboard',
      icon: '📊',
      title: 'Dashboard',
      description: 'Vue d\'ensemble du système',
      items: [
        {
          question: 'Que montre le Dashboard ?',
          answer: 'Le Dashboard affiche un aperçu de l\'activité : nombre d\'actions en attente de validation, total des actions soumises, nombre de participants actifs, et points distribués. C\'est votre page d\'accueil pour surveiller l\'état général du challenge.'
        },
        {
          question: 'Comment rafraîchir les données ?',
          answer: 'Les données se mettent automatiquement à jour lors de la navigation. Si nécessaire, rechargez la page ou naviguez vers une autre section puis revenez.'
        },
        {
          question: 'Puis-je réinitialiser les étudiants ?',
          answer: 'Oui ! Le bouton "🔄 Réinitialiser avec les vrais étudiants Eugenia" permet de remettre la liste à zéro avec les 35 étudiants (B1 + B2) à 0 point.'
        }
      ]
    },
    {
      id: 'validation',
      icon: '📋',
      title: 'File de Validation',
      description: 'Valider ou refuser les actions soumises',
      items: [
        {
          question: 'Comment fonctionne la validation ?',
          answer: 'La file de validation liste toutes les actions soumises par les étudiants avec le statut "pending". Cliquez sur une action pour voir ses détails et décider de la valider ou de la refuser.'
        },
        {
          question: 'Que puis-je faire dans le modal de détail ?',
          answer: 'Vous pouvez : voir toutes les informations de l\'action (liens, descriptions, dates), vérifier les liens externes (LinkedIn, etc.), modifier le nombre de points à attribuer, ajouter un commentaire pour l\'étudiant, valider ou refuser l\'action.'
        },
        {
          question: 'Les points sont-ils modifiables ?',
          answer: 'Oui ! Vous pouvez ajuster le nombre de points avant de valider une action. Cela permet d\'attribuer des bonus ou des malus selon la qualité de la soumission.'
        },
        {
          question: 'Que se passe-t-il après validation ?',
          answer: 'Après validation : l\'action passe au statut "validated", les points sont ajoutés au total de l\'étudiant, le leaderboard est mis à jour, et l\'étudiant reçoit un email de confirmation (si configuré).'
        },
        {
          question: 'Et en cas de refus ?',
          answer: 'Si vous refusez : l\'action passe au statut "rejected", aucun point n\'est attribué, et l\'étudiant reçoit un email avec votre commentaire expliquant le refus.'
        }
      ]
    },
    {
      id: 'actions',
      icon: '⚙️',
      title: 'Configuration des Types d\'Actions',
      description: 'Créer et personnaliser les actions',
      items: [
        {
          question: 'Qu\'est-ce qu\'un type d\'action ?',
          answer: 'Un type d\'action définit les catégories d\'actions que les étudiants peuvent soumettre : Post LinkedIn, Participation JPO, Hackathon, Association, etc. Chaque type a ses propres champs et points.'
        },
        {
          question: 'Comment créer un nouveau type ?',
          answer: 'Cliquez sur "➕ Nouveau type d\'action", remplissez le formulaire : nom, emoji, catégorie, points par défaut, et ajoutez les champs requis. Sauvegardez et le type sera immédiatement disponible pour les étudiants.'
        },
        {
          question: 'Comment ajouter des champs à un type ?',
          answer: 'Dans le formulaire de création/édition, utilisez "➕ Ajouter un champ". Choisissez le type (texte, URL, date, etc.), le label, et si le champ est obligatoire.'
        },
        {
          question: 'C\'est quoi la validation auto ?',
          answer: 'La validation automatique permet à certaines actions d\'être validées sans intervention manuelle. Pour l\'activer, créez une règle d\'automatisation correspondante (voir section Automatisations).'
        },
        {
          question: 'Le preview est-il en temps réel ?',
          answer: 'Oui ! Le preview s\'actualise automatiquement quand vous modifiez les champs, vous permettant de voir exactement ce que verront les étudiants.'
        }
      ]
    },
    {
      id: 'leaderboard',
      icon: '🏆',
      title: 'Configuration Leaderboard',
      description: 'Gérer les étudiants et le classement',
      items: [
        {
          question: 'Comment gérer les étudiants ?',
          answer: 'Depuis cette section, vous pouvez : voir tous les étudiants inscrits, ajouter de nouveaux étudiants, modifier les informations existantes, supprimer des étudiants, et ajuster manuellement les points si nécessaire.'
        },
        {
          question: 'Comment fonctionnent les ex aequo ?',
          answer: 'Si plusieurs étudiants ont le même nombre de points, ils partagent le même rang. Par exemple : Rang 1 (100 pts), Rang 1 (100 pts), Rang 3 (50 pts). Le suivant est automatiquement décalé.'
        },
        {
          question: 'Puis-je modifier les points manuellement ?',
          answer: 'Oui ! Dans la table de gestion des étudiants, cliquez sur "✏️" à côté d\'un étudiant. Vous pouvez ajuster ses points, ce qui mettra à jour son rang immédiatement.'
        },
        {
          question: 'Les classes sont-elles importantes ?',
          answer: 'Les classes (B1, B2, etc.) servent à identifier les niveaux des étudiants. Elles sont affichées dans le leaderboard public pour permettre un filtrage futur si nécessaire.'
        }
      ]
    },
    {
      id: 'automations',
      icon: '🤖',
      title: 'Automatisations',
      description: 'Validation automatique via Google Sheets',
      items: [
        {
          question: 'C\'est quoi une automatisation ?',
          answer: 'Une automatisation vérifie automatiquement si une action est légitime en consultant une Google Sheet externe. Par exemple : vérifier si un étudiant était bien présent à une JPO en cherchant son email dans la liste des participants.'
        },
        {
          question: 'Comment configurer une automatisation ?',
          answer: 'Cliquez "➕ Nouvelle automatisation", sélectionnez le type d\'action, entrez l\'ID de la Google Sheet externe, indiquez la colonne à vérifier (ex: colonne B pour les emails), choisissez la règle de matching, et activez-la.'
        },
        {
          question: 'Quelles règles de matching existe-t-il ?',
          answer: 'Il y a 3 règles : Exact match (correspondance exacte, pour emails), Contains (contient la chaîne, pour recherches partielles), et Date (correspondance par date, pour événements).'
        },
        {
          question: 'Où trouver l\'ID d\'une Google Sheet ?',
          answer: 'L\'ID se trouve dans l\'URL de la Sheet : https://docs.google.com/spreadsheets/d/[ID_ICI]/edit. Copiez la partie entre "/d/" et "/edit".'
        },
        {
          question: 'Comment tester une automatisation ?',
          answer: 'Actuellement en développement. Une fois l\'API Google Sheets intégrée, un bouton "Tester" sera disponible dans chaque automatisation pour vérifier qu\'elle fonctionne correctement.'
        },
        {
          question: 'Les automatisations sont-elles obligatoires ?',
          answer: 'Non ! Elles sont optionnelles. Les actions non-automatisées passent en file de validation manuelle. Vous pouvez activer/désactiver une automatisation à tout moment.'
        }
      ]
    },
    {
      id: 'sheets',
      icon: '📗',
      title: 'Google Sheets',
      description: 'Connexion et synchronisation avec Sheets',
      items: [
        {
          question: 'Dois-je connecter Google Sheets ?',
          answer: 'Non, pas nécessaire pour le développement. L\'application utilise localStorage par défaut. La connexion à Google Sheets est nécessaire uniquement pour la production et les automatisations.'
        },
        {
          question: 'Comment connecter Google Sheets ?',
          answer: 'Suivez les instructions dans apps-script/README.md : créez un projet Apps Script, déployez-le en Web App, configurez les permissions, et mettez à jour l\'URL dans le code.'
        },
        {
          question: 'Quelle structure doit avoir la Sheet ?',
          answer: 'La Sheet doit avoir 3 onglets : "leaderboard" (colonnes A-E : Prénom, Nom, Classe, Email, Points), "actions" (pour stocker les soumissions), et optionnellement "FormConfig" (pour configuration avancée).'
        },
        {
          question: 'Les données sont-elles synchronisées ?',
          answer: 'Actuellement non, l\'application utilise localStorage. Une fois Google Sheets connecté, les données seront lues et écrites en temps réel dans la Sheet.'
        }
      ]
    },
    {
      id: 'best-practices',
      icon: '💡',
      title: 'Bonnes Pratiques',
      description: 'Conseils pour une gestion efficace',
      items: [
        {
          question: 'À quelle fréquence dois-je valider ?',
          answer: 'Idéalement, vérifiez la file de validation quotidiennement ou configurez des automatisations pour les actions récurrentes. Les étudiants attendent une validation rapide pour voir leurs points monter !'
        },
        {
          question: 'Comment attribuer les points équitablement ?',
          answer: 'Suivez la grille de points configurée par type d\'action, mais n\'hésitez pas à ajuster selon la qualité : un post LinkedIn exceptionnel peut mériter un bonus, tandis qu\'une participation minimale peut recevoir moins.'
        },
        {
          question: 'Que faire si un étudiant triche ?',
          answer: 'Refusez l\'action avec un commentaire explicite, puis vérifiez son historique. Si récidive, vous pouvez bloquer temporairement via la gestion des étudiants.'
        },
        {
          question: 'Comment gérer les automatisations ?',
          answer: 'Testez-les une fois configurées avec une action fictive. Vérifiez régulièrement qu\'elles fonctionnent (Sheet accessible, colonnes correctes). Désactivez-les si elles posent problème.'
        },
        {
          question: 'Puis-je personnaliser l\'interface ?',
          answer: 'Oui ! Modifiez les types d\'actions pour refléter les activités de votre campus. Ajoutez des catégories spécifiques, ajustez les points selon vos objectifs pédagogiques.'
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-md border-b-2 border-eugenia-yellow">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/admin" className="text-gray-600 hover:text-primary-600">
                ← Retour au Panel Admin
              </Link>
              <h1 className="text-2xl font-bold text-eugenia-burgundy">
                📚 Guide Administrateur
              </h1>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Introduction */}
        <div className="card mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Bienvenue dans le Guide Admin ! 👋
          </h2>
          <p className="text-gray-700 text-lg mb-4">
            Ce guide vous explique en détail chaque section de l'interface d'administration
            du <strong>Eugenia Challenge</strong>. Naviguez librement pour trouver les réponses
            à vos questions.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-blue-800">
              <strong>💡 Astuce :</strong> Utilisez Ctrl+F (Cmd+F sur Mac) pour rechercher
              un mot-clé dans cette page.
            </p>
          </div>
        </div>

        {/* Navigation rapide */}
        <div className="card mb-8">
          <h3 className="text-xl font-bold mb-4">Navigation rapide</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {sections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="btn btn-outline text-left flex items-center gap-2"
              >
                <span className="text-2xl">{section.icon}</span>
                <span className="font-semibold">{section.title}</span>
              </a>
            ))}
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-8">
          {sections.map((section) => (
            <div key={section.id} id={section.id} className="card">
              <div className="flex items-center gap-4 mb-4">
                <span className="text-4xl">{section.icon}</span>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {section.title}
                  </h2>
                  <p className="text-gray-600">{section.description}</p>
                </div>
              </div>

              <div className="space-y-4 mt-6">
                {section.items.map((item, index) => (
                  <div
                    key={index}
                    className="border-l-4 border-primary-500 pl-4 py-2"
                  >
                    <h3 className="font-bold text-lg text-gray-900 mb-2">
                      ❓ {item.question}
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      {item.answer}
                    </p>
                  </div>
                ))}
              </div>

              {/* Link to section */}
              <div className="mt-6 pt-4 border-t">
                <Link
                  to={`/admin/${section.id === 'dashboard' ? '' : section.id}`}
                  className="btn btn-primary"
                >
                  Ouvrir la section →
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="card mt-8 bg-gradient-to-r from-eugenia-yellow to-eugenia-pink text-white">
          <h3 className="text-xl font-bold mb-3">
            💪 Prêt à gérer le challenge !
          </h3>
          <p className="text-white/90 mb-4">
            Si vous avez encore des questions ou rencontrez un problème,
            consultez la documentation technique ou contactez l'équipe de développement.
          </p>
          <div className="flex gap-3">
            <Link to="/admin" className="btn bg-white text-eugenia-burgundy hover:bg-gray-100">
              Retour au Dashboard
            </Link>
            <a
              href="https://github.com/eugeniaschool/challenge"
              target="_blank"
              rel="noopener noreferrer"
              className="btn bg-white/20 text-white hover:bg-white/30"
            >
              📖 Documentation
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}

