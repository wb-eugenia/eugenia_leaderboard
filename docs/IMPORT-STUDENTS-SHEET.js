/**
 * Script pour importer les 35 étudiants Eugenia dans Google Sheets
 * 
 * À exécuter dans Apps Script Editor
 */

function importStudents() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('leaderboard');
  
  if (!sheet) {
    Logger.log('Erreur: Onglet "leaderboard" non trouvé');
    return;
  }
  
  // Nettoyer les données existantes (garder l'en-tête)
  const lastRow = sheet.getLastRow();
  if (lastRow > 1) {
    sheet.getRange(2, 1, lastRow - 1, 7).clearContent();
  }
  
  const students = [
    ['Orehn', 'Ansellem', 'B1', 'oansellem@eugeniaschool.com', 0, 0, ''],
    ['Corentin', 'Ballonad', 'B1', 'cballonad@eugeniaschool.com', 0, 0, ''],
    ['Walid', 'Bouzidane', 'B1', 'wbouzidane@eugeniaschool.com', 0, 0, ''],
    ['Clément', 'Cochod', 'B1', 'ccochod@eugeniaschool.com', 0, 0, ''],
    ['Marc', 'Coulibaly', 'B1', 'mcoulibaly@eugeniaschool.com', 0, 0, ''],
    ['Bruno', 'Da Silva Lopez', 'B1', 'bdasilvalopez@eugeniaschool.com', 0, 0, ''],
    ['Gaspard', 'Debuigne', 'B1', 'gdebuigne@eugeniaschool.com', 0, 0, ''],
    ['Gaspard', 'Des champs de boishebert', 'B1', 'gdeschampsdeboishebert@eugeniaschool.com', 0, 0, ''],
    ['Amaury', 'Despretz', 'B1', 'adespretz@eugeniaschool.com', 0, 0, ''],
    ['Maxim', 'Duprat', 'B1', 'mduprat@eugeniaschool.com', 0, 0, ''],
    ['Jules', 'Espy', 'B1', 'jespy@eugeniaschool.com', 0, 0, ''],
    ['Abir', 'Essaidi', 'B1', 'aessaidi@eugeniaschool.com', 0, 0, ''],
    ['Léna', 'Fitoussi', 'B1', 'lfitoussi@eugeniaschool.com', 0, 0, ''],
    ['Marvyn', 'Frederick Salva', 'B1', 'mfredericksalva@eugeniaschool.com', 0, 0, ''],
    ['Hector', 'Lebrun', 'B1', 'hlebrun@eugeniaschool.com', 0, 0, ''],
    ['Léon', 'Le Calvez', 'B1', 'llecalvez@eugeniaschool.com', 0, 0, ''],
    ['Louise', 'Lehmann', 'B1', 'llehmann@eugeniaschool.com', 0, 0, ''],
    ['Paul', 'Marlin', 'B1', 'pmarlin@eugeniaschool.com', 0, 0, ''],
    ['Alexandre', 'Mc Namara', 'B1', 'amcnamara@eugeniaschool.com', 0, 0, ''],
    ['William', 'Nehar', 'B1', 'wnehar@eugeniaschool.com', 0, 0, ''],
    ['César', 'Primet', 'B1', 'cprimet@eugeniaschool.com', 0, 0, ''],
    ['Emilie', 'Flore Tata', 'B1', 'efloretata@eugeniaschool.com', 0, 0, ''],
    ['Elyot', 'Trubert', 'B1', 'etrubert@eugeniaschool.com', 0, 0, ''],
    ['Erwan', 'Zaouaoui', 'B1', 'ezaouaoui@eugeniaschool.com', 0, 0, ''],
    ['Alexandre', 'DE CARBONNIERES', 'B2', 'adecarbonnieres@eugeniaschool.com', 0, 0, ''],
    ['Enzo', 'PAROISSIEN', 'B2', 'eparoissien@eugeniaschool.com', 0, 0, ''],
    ['Nicolas', 'SHAHATA', 'B2', 'nshahata@eugeniaschool.com', 0, 0, ''],
    ['Antoine', 'MILLOT', 'B2', 'amillot@eugeniaschool.com', 0, 0, ''],
    ['Jonas', 'LAVIGNE', 'B2', 'jlavigne@eugeniaschool.com', 0, 0, ''],
    ['Raphaël', 'LASCAR', 'B2', 'rlascar@eugeniaschool.com', 0, 0, ''],
    ['Tara', 'MENELECK', 'B2', 'tmeneleck@eugeniaschool.com', 0, 0, ''],
    ['Jennie', 'ANSELLEM', 'B2', 'jansellem@eugeniaschool.com', 0, 0, ''],
    ['Samuel', 'ZAOUI', 'B2', 'szaoui@eugeniaschool.com', 0, 0, ''],
    ['Alexandre', 'PALMER', 'B2', 'apalmer@eugeniaschool.com', 0, 0, ''],
    ['Agathe', 'JOSSERAND', 'B2', 'ajosserand@eugeniaschool.com', 0, 0, '']
  ];
  
  // Écrire les données
  sheet.getRange(2, 1, students.length, 7).setValues(students);
  
  Logger.log(`${students.length} étudiants importés avec succès !`);
}

