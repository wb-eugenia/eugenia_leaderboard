// Utilitaire pour réinitialiser les données avec les vrais étudiants Eugenia

const REAL_STUDENTS = [
  { firstName: 'Orehn', lastName: 'Ansellem', email: 'oansellem@eugeniaschool.com', totalPoints: 0, actionsCount: 0, classe: 'B1', lastUpdate: new Date().toISOString() },
  { firstName: 'Corentin', lastName: 'Ballonad', email: 'cballonad@eugeniaschool.com', totalPoints: 0, actionsCount: 0, classe: 'B1', lastUpdate: new Date().toISOString() },
  { firstName: 'Walid', lastName: 'Bouzidane', email: 'wbouzidane@eugeniaschool.com', totalPoints: 0, actionsCount: 0, classe: 'B1', lastUpdate: new Date().toISOString() },
  { firstName: 'Clément', lastName: 'Cochod', email: 'ccochod@eugeniaschool.com', totalPoints: 0, actionsCount: 0, classe: 'B1', lastUpdate: new Date().toISOString() },
  { firstName: 'Marc', lastName: 'Coulibaly', email: 'mcoulibaly@eugeniaschool.com', totalPoints: 0, actionsCount: 0, classe: 'B1', lastUpdate: new Date().toISOString() },
  { firstName: 'Bruno', lastName: 'Da Silva Lopez', email: 'bdasilvalopez@eugeniaschool.com', totalPoints: 0, actionsCount: 0, classe: 'B1', lastUpdate: new Date().toISOString() },
  { firstName: 'Gaspard', lastName: 'Debuigne', email: 'gdebuigne@eugeniaschool.com', totalPoints: 0, actionsCount: 0, classe: 'B1', lastUpdate: new Date().toISOString() },
  { firstName: 'Gaspard', lastName: 'Des champs de boishebert', email: 'gdeschampsdeboishebert@eugeniaschool.com', totalPoints: 0, actionsCount: 0, classe: 'B1', lastUpdate: new Date().toISOString() },
  { firstName: 'Amaury', lastName: 'Despretz', email: 'adespretz@eugeniaschool.com', totalPoints: 0, actionsCount: 0, classe: 'B1', lastUpdate: new Date().toISOString() },
  { firstName: 'Maxim', lastName: 'Duprat', email: 'mduprat@eugeniaschool.com', totalPoints: 0, actionsCount: 0, classe: 'B1', lastUpdate: new Date().toISOString() },
  { firstName: 'Jules', lastName: 'Espy', email: 'jespy@eugeniaschool.com', totalPoints: 0, actionsCount: 0, classe: 'B1', lastUpdate: new Date().toISOString() },
  { firstName: 'Abir', lastName: 'Essaidi', email: 'aessaidi@eugeniaschool.com', totalPoints: 0, actionsCount: 0, classe: 'B1', lastUpdate: new Date().toISOString() },
  { firstName: 'Léna', lastName: 'Fitoussi', email: 'lfitoussi@eugeniaschool.com', totalPoints: 0, actionsCount: 0, classe: 'B1', lastUpdate: new Date().toISOString() },
  { firstName: 'Marvyn', lastName: 'Frederick Salva', email: 'mfredericksalva@eugeniaschool.com', totalPoints: 0, actionsCount: 0, classe: 'B1', lastUpdate: new Date().toISOString() },
  { firstName: 'Hector', lastName: 'Lebrun', email: 'hlebrun@eugeniaschool.com', totalPoints: 0, actionsCount: 0, classe: 'B1', lastUpdate: new Date().toISOString() },
  { firstName: 'Léon', lastName: 'Le Calvez', email: 'llecalvez@eugeniaschool.com', totalPoints: 0, actionsCount: 0, classe: 'B1', lastUpdate: new Date().toISOString() },
  { firstName: 'Louise', lastName: 'Lehmann', email: 'llehmann@eugeniaschool.com', totalPoints: 0, actionsCount: 0, classe: 'B1', lastUpdate: new Date().toISOString() },
  { firstName: 'Paul', lastName: 'Marlin', email: 'pmarlin@eugeniaschool.com', totalPoints: 0, actionsCount: 0, classe: 'B1', lastUpdate: new Date().toISOString() },
  { firstName: 'Alexandre', lastName: 'Mc Namara', email: 'amcnamara@eugeniaschool.com', totalPoints: 0, actionsCount: 0, classe: 'B1', lastUpdate: new Date().toISOString() },
  { firstName: 'William', lastName: 'Nehar', email: 'wnehar@eugeniaschool.com', totalPoints: 0, actionsCount: 0, classe: 'B1', lastUpdate: new Date().toISOString() },
  { firstName: 'César', lastName: 'Primet', email: 'cprimet@eugeniaschool.com', totalPoints: 0, actionsCount: 0, classe: 'B1', lastUpdate: new Date().toISOString() },
  { firstName: 'Emilie', lastName: 'Flore Tata', email: 'efloretata@eugeniaschool.com', totalPoints: 0, actionsCount: 0, classe: 'B1', lastUpdate: new Date().toISOString() },
  { firstName: 'Elyot', lastName: 'Trubert', email: 'etrubert@eugeniaschool.com', totalPoints: 0, actionsCount: 0, classe: 'B1', lastUpdate: new Date().toISOString() },
  { firstName: 'Erwan', lastName: 'Zaouaoui', email: 'ezaouaoui@eugeniaschool.com', totalPoints: 0, actionsCount: 0, classe: 'B1', lastUpdate: new Date().toISOString() },
  { firstName: 'Alexandre', lastName: 'DE CARBONNIERES', email: 'adecarbonnieres@eugeniaschool.com', totalPoints: 0, actionsCount: 0, classe: 'B2', lastUpdate: new Date().toISOString() },
  { firstName: 'Enzo', lastName: 'PAROISSIEN', email: 'eparoissien@eugeniaschool.com', totalPoints: 0, actionsCount: 0, classe: 'B2', lastUpdate: new Date().toISOString() },
  { firstName: 'Nicolas', lastName: 'SHAHATA', email: 'nshahata@eugeniaschool.com', totalPoints: 0, actionsCount: 0, classe: 'B2', lastUpdate: new Date().toISOString() },
  { firstName: 'Antoine', lastName: 'MILLOT', email: 'amillot@eugeniaschool.com', totalPoints: 0, actionsCount: 0, classe: 'B2', lastUpdate: new Date().toISOString() },
  { firstName: 'Jonas', lastName: 'LAVIGNE', email: 'jlavigne@eugeniaschool.com', totalPoints: 0, actionsCount: 0, classe: 'B2', lastUpdate: new Date().toISOString() },
  { firstName: 'Raphaël', lastName: 'LASCAR', email: 'rlascar@eugeniaschool.com', totalPoints: 0, actionsCount: 0, classe: 'B2', lastUpdate: new Date().toISOString() },
  { firstName: 'Tara', lastName: 'MENELECK', email: 'tmeneleck@eugeniaschool.com', totalPoints: 0, actionsCount: 0, classe: 'B2', lastUpdate: new Date().toISOString() },
  { firstName: 'Jennie', lastName: 'ANSELLEM', email: 'jansellem@eugeniaschool.com', totalPoints: 0, actionsCount: 0, classe: 'B2', lastUpdate: new Date().toISOString() },
  { firstName: 'Samuel', lastName: 'ZAOUI', email: 'szaoui@eugeniaschool.com', totalPoints: 0, actionsCount: 0, classe: 'B2', lastUpdate: new Date().toISOString() },
  { firstName: 'Alexandre', lastName: 'PALMER', email: 'apalmer@eugeniaschool.com', totalPoints: 0, actionsCount: 0, classe: 'B2', lastUpdate: new Date().toISOString() },
  { firstName: 'Agathe', lastName: 'JOSSERAND', email: 'ajosserand@eugeniaschool.com', totalPoints: 0, actionsCount: 0, classe: 'B2', lastUpdate: new Date().toISOString() }
];

export function resetToRealStudents() {
  localStorage.setItem('eugenia_leaderboard', JSON.stringify(REAL_STUDENTS));
  console.log(`${REAL_STUDENTS.length} étudiants réinitialisés !`);
  window.location.reload();
}

// Fonction pour vider toutes les données
export function clearAllData() {
  localStorage.removeItem('eugenia_leaderboard');
  localStorage.removeItem('eugenia_actions');
  localStorage.removeItem('eugeniaConfig');
  console.log('Toutes les données effacées !');
  window.location.reload();
}

export default {
  resetToRealStudents,
  clearAllData
};

