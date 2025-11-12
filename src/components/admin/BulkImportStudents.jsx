import { useState } from 'react';
import { bulkImportStudents } from '../../services/googleSheets';

export default function BulkImportStudents({ onImportComplete }) {
  const [importMode, setImportMode] = useState('csv'); // 'csv' or 'manual'
  const [csvFile, setCsvFile] = useState(null);
  const [csvText, setCsvText] = useState('');
  const [manualStudents, setManualStudents] = useState([
    { firstName: '', lastName: '', email: '', classe: 'B1', totalPoints: 0 }
  ]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [errors, setErrors] = useState([]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCsvFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setCsvText(event.target.result);
      };
      reader.readAsText(file);
    }
  };

  const addManualStudent = () => {
    setManualStudents([
      ...manualStudents,
      { firstName: '', lastName: '', email: '', classe: 'B1', totalPoints: 0 }
    ]);
  };

  const removeManualStudent = (index) => {
    setManualStudents(manualStudents.filter((_, i) => i !== index));
  };

  const updateManualStudent = (index, field, value) => {
    const updated = [...manualStudents];
    updated[index][field] = value;
    setManualStudents(updated);
  };

  const parseCSV = (text) => {
    const lines = text.split('\n').filter(line => line.trim());
    if (lines.length === 0) return [];

    // Détecter le séparateur (virgule ou point-virgule)
    const firstLine = lines[0];
    const separator = firstLine.includes(';') ? ';' : ',';

    // Vérifier si la première ligne est un header
    const hasHeader = firstLine.toLowerCase().includes('email') || 
                     firstLine.toLowerCase().includes('prénom') ||
                     firstLine.toLowerCase().includes('prenom');

    const startIndex = hasHeader ? 1 : 0;
    const students = [];

    for (let i = startIndex; i < lines.length; i++) {
      const parts = lines[i].split(separator).map(p => p.trim().replace(/^"|"$/g, ''));
      
      if (parts.length < 3) continue; // Minimum: prénom, nom, email

      // Formats possibles:
      // Format 1: Prénom, Nom, Email, Classe, Points
      // Format 2: Email, Prénom, Nom, Classe, Points
      // Format 3: Prénom, Nom, Email, Classe
      
      let firstName = '';
      let lastName = '';
      let email = '';
      let classe = 'B1';
      let totalPoints = 0;

      // Essayer de détecter l'email (contient @)
      const emailIndex = parts.findIndex(p => p.includes('@'));
      
      if (emailIndex !== -1) {
        email = parts[emailIndex];
        
        // Si email est en position 0, format: Email, Prénom, Nom, ...
        if (emailIndex === 0) {
          firstName = parts[1] || '';
          lastName = parts[2] || '';
          classe = parts[3] || 'B1';
          totalPoints = parseInt(parts[4]) || 0;
        } else {
          // Format: Prénom, Nom, Email, ...
          firstName = parts[0] || '';
          lastName = parts[1] || '';
          classe = parts[3] || 'B1';
          totalPoints = parseInt(parts[4]) || 0;
        }
      } else {
        // Pas d'email trouvé, utiliser les 3 premières colonnes
        firstName = parts[0] || '';
        lastName = parts[1] || '';
        email = parts[2] || '';
        classe = parts[3] || 'B1';
        totalPoints = parseInt(parts[4]) || 0;
      }

      if (firstName && email) {
        students.push({
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: email.trim().toLowerCase(),
          classe: classe.trim() || 'B1',
          totalPoints: isNaN(totalPoints) ? 0 : totalPoints
        });
      }
    }

    return students;
  };

  const validateStudents = (students) => {
    const errors = [];
    const emails = new Set();

    students.forEach((student, index) => {
      if (!student.firstName || !student.firstName.trim()) {
        errors.push(`Ligne ${index + 1}: Prénom manquant`);
      }
      if (!student.email || !student.email.trim()) {
        errors.push(`Ligne ${index + 1}: Email manquant`);
      } else if (!student.email.includes('@')) {
        errors.push(`Ligne ${index + 1}: Email invalide (${student.email})`);
      } else if (emails.has(student.email.toLowerCase())) {
        errors.push(`Ligne ${index + 1}: Email dupliqué (${student.email})`);
      } else {
        emails.add(student.email.toLowerCase());
      }
    });

    return errors;
  };

  const handleImport = async () => {
    setErrors([]);
    setResult(null);
    setLoading(true);

    try {
      let studentsToImport = [];

      if (importMode === 'csv') {
        if (!csvText.trim()) {
          setErrors(['Veuillez sélectionner un fichier CSV ou coller le contenu CSV']);
          setLoading(false);
          return;
        }
        studentsToImport = parseCSV(csvText);
      } else {
        // Mode manuel
        studentsToImport = manualStudents.filter(s => 
          s.firstName.trim() && s.email.trim()
        );
      }

      if (studentsToImport.length === 0) {
        setErrors(['Aucun étudiant valide à importer']);
        setLoading(false);
        return;
      }

      // Valider les étudiants
      const validationErrors = validateStudents(studentsToImport);
      if (validationErrors.length > 0) {
        setErrors(validationErrors);
        setLoading(false);
        return;
      }

      // Envoyer à l'API
      const response = await bulkImportStudents(studentsToImport);

      if (response.success) {
        setResult({
          success: true,
          imported: response.imported || studentsToImport.length,
          updated: response.updated || 0,
          errors: response.errors || []
        });
        
        // Réinitialiser les formulaires
        if (importMode === 'csv') {
          setCsvFile(null);
          setCsvText('');
        } else {
          setManualStudents([
            { firstName: '', lastName: '', email: '', classe: 'B1', totalPoints: 0 }
          ]);
        }
        
        // Appeler le callback pour rafraîchir la liste
        if (onImportComplete) {
          onImportComplete();
        }
      } else {
        setErrors([response.error || 'Erreur lors de l\'import']);
      }
    } catch (error) {
      console.error('Import error:', error);
      setErrors([`Erreur: ${error.message}`]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">

      {/* Mode sélection */}
      <div className="admin-card">
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setImportMode('csv')}
            className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
              importMode === 'csv'
                ? 'bg-eugenia-burgundy text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            📄 Fichier CSV
          </button>
          <button
            onClick={() => setImportMode('manual')}
            className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
              importMode === 'manual'
                ? 'bg-eugenia-burgundy text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            ✏️ Saisie Manuelle
          </button>
        </div>

        {/* Mode CSV */}
        {importMode === 'csv' && (
          <div className="space-y-4">
            <div>
              <label className="block font-semibold mb-2">
                📎 Sélectionner un fichier CSV
              </label>
              <input
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="form-control"
              />
              <p className="text-sm text-gray-600 mt-2">
                Format attendu: Prénom, Nom, Email, Classe (optionnel), Points (optionnel)
                <br />
                Ou: Email, Prénom, Nom, Classe, Points
                <br />
                Séparateur: virgule (,) ou point-virgule (;)
              </p>
            </div>

            <div>
              <label className="block font-semibold mb-2">
                📋 Ou coller le contenu CSV ici
              </label>
              <textarea
                value={csvText}
                onChange={(e) => setCsvText(e.target.value)}
                placeholder="Prénom, Nom, Email, Classe, Points
Jean, Dupont, jean.dupont@eugeniaschool.com, B1, 0
Marie, Martin, marie.martin@eugeniaschool.com, B2, 0"
                className="form-control"
                rows="10"
              />
            </div>

            {csvText && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="font-semibold text-blue-900 mb-2">
                  📊 Aperçu ({parseCSV(csvText).length} étudiants détectés)
                </p>
                <div className="max-h-40 overflow-y-auto">
                  {parseCSV(csvText).slice(0, 5).map((student, idx) => (
                    <div key={idx} className="text-sm text-blue-800">
                      {student.firstName} {student.lastName} - {student.email} ({student.classe})
                    </div>
                  ))}
                  {parseCSV(csvText).length > 5 && (
                    <div className="text-sm text-blue-600 italic">
                      ... et {parseCSV(csvText).length - 5} autres
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Mode Manuel */}
        {importMode === 'manual' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-lg">Étudiants à importer</h3>
              <button
                onClick={addManualStudent}
                className="btn-admin-primary text-sm"
              >
                ➕ Ajouter un étudiant
              </button>
            </div>

            <div className="space-y-4">
              {manualStudents.map((student, index) => (
                <div key={index} className="border rounded-lg p-4 bg-gray-50">
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-semibold text-gray-700">
                      Étudiant #{index + 1}
                    </span>
                    {manualStudents.length > 1 && (
                      <button
                        onClick={() => removeManualStudent(index)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        🗑️ Supprimer
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
                    <div>
                      <label className="block text-sm font-semibold mb-1">Prénom *</label>
                      <input
                        type="text"
                        value={student.firstName}
                        onChange={(e) => updateManualStudent(index, 'firstName', e.target.value)}
                        className="form-control"
                        placeholder="Jean"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-1">Nom</label>
                      <input
                        type="text"
                        value={student.lastName}
                        onChange={(e) => updateManualStudent(index, 'lastName', e.target.value)}
                        className="form-control"
                        placeholder="Dupont"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-1">Email *</label>
                      <input
                        type="email"
                        value={student.email}
                        onChange={(e) => updateManualStudent(index, 'email', e.target.value.toLowerCase())}
                        className="form-control"
                        placeholder="jean.dupont@eugeniaschool.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-1">Classe</label>
                      <input
                        type="text"
                        value={student.classe}
                        onChange={(e) => updateManualStudent(index, 'classe', e.target.value)}
                        className="form-control"
                        placeholder="B1"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-1">Points</label>
                      <input
                        type="number"
                        value={student.totalPoints}
                        onChange={(e) => updateManualStudent(index, 'totalPoints', parseInt(e.target.value) || 0)}
                        className="form-control"
                        min="0"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bouton Import */}
        <div className="mt-6 flex gap-3">
          <button
            onClick={handleImport}
            disabled={loading}
            className="btn-admin-primary flex-1"
          >
            {loading ? '⏳ Import en cours...' : '📥 Importer les étudiants'}
          </button>
        </div>
      </div>

      {/* Erreurs */}
      {errors.length > 0 && (
        <div className="admin-card bg-red-50 border-red-200">
          <h3 className="font-semibold text-red-900 mb-2">❌ Erreurs de validation</h3>
          <ul className="list-disc list-inside space-y-1 text-red-800">
            {errors.map((error, idx) => (
              <li key={idx}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Résultat */}
      {result && (
        <div className={`admin-card ${result.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
          <h3 className={`font-semibold mb-2 ${result.success ? 'text-green-900' : 'text-red-900'}`}>
            {result.success ? '✅ Import réussi' : '❌ Erreur lors de l\'import'}
          </h3>
          {result.success && (
            <div className="space-y-2 text-green-800">
              <p>✅ {result.imported} étudiant(s) importé(s)</p>
              {result.updated > 0 && (
                <p>🔄 {result.updated} étudiant(s) mis à jour</p>
              )}
              {result.errors && result.errors.length > 0 && (
                <div className="mt-4">
                  <p className="font-semibold">⚠️ Erreurs partielles:</p>
                  <ul className="list-disc list-inside mt-2">
                    {result.errors.map((error, idx) => (
                      <li key={idx}>{error}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Guide */}
      <div className="admin-card bg-blue-50 border-blue-200">
        <h3 className="font-semibold text-blue-900 mb-2">ℹ️ Guide d'utilisation</h3>
        <div className="text-sm text-blue-800 space-y-2">
          <p><strong>Format CSV:</strong></p>
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li>Prénom, Nom, Email, Classe (optionnel), Points (optionnel)</li>
            <li>Le séparateur peut être une virgule (,) ou un point-virgule (;)</li>
            <li>Les champs optionnels peuvent être vides</li>
            <li>La première ligne peut être un header (sera ignorée si elle contient "email" ou "prénom")</li>
          </ul>
          <p className="mt-3"><strong>⚠️ Important:</strong></p>
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li>L'email est obligatoire et unique</li>
            <li>Si un étudiant existe déjà (même email), il sera mis à jour</li>
            <li>Les points et actions_count existants seront conservés lors de la mise à jour</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

