import { useState, useEffect } from 'react';
import { getActionTypes, getAutomationRules, saveAutomationRule, deleteAutomationRule } from '../../services/configService.js';

export default function AutomationConfig() {
  const [automations, setAutomations] = useState([]);
  const [actionTypes, setActionTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingAutomation, setEditingAutomation] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    actionTypeId: '',
    enabled: true,
    sheetId: '',
    sheetRange: 'A:Z',
    // Matching ID étudiant
    studentIdType: 'email', // 'email', 'nom', 'prenom', 'nom_complet'
    studentIdColumns: '', // Colonnes Sheet pour ID (ex: 'D,E,F,G')
    // Matching champ formulaire (optionnel)
    formFieldToMatch: '', // Le champ du formulaire (ex: 'date', 'eventName')
    formFieldColumns: '', // Colonnes Sheet pour champ formulaire (ex: 'B')
    formFieldRule: 'exact', // Règle pour champ formulaire
    mappedColumns: []
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setLoading(true);
    try {
      const rules = getAutomationRules();
      const types = getActionTypes();
      setAutomations(rules);
      setActionTypes(types);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingAutomation(null);
    setFormData({
      actionTypeId: '',
      enabled: true,
      sheetId: '',
      sheetRange: 'A:Z',
      studentIdType: 'email',
      studentIdColumns: '',
      formFieldToMatch: '',
      formFieldColumns: '',
      formFieldRule: 'exact',
      mappedColumns: []
    });
    setShowAddForm(true);
  };

  const handleEdit = (automation) => {
    setEditingAutomation(automation);
    setFormData({
      actionTypeId: automation.actionTypeId || '',
      enabled: automation.enabled !== undefined ? automation.enabled : true,
      sheetId: automation.sheetId || '',
      sheetRange: automation.sheetRange || 'A:Z',
      studentIdType: automation.studentIdType || 'email',
      studentIdColumns: automation.studentIdColumns || '',
      formFieldToMatch: automation.formFieldToMatch || '',
      formFieldColumns: automation.formFieldColumns || '',
      formFieldRule: automation.formFieldRule || 'exact',
      mappedColumns: automation.mappedColumns || []
    });
    setShowAddForm(true);
  };

  const handleSave = () => {
    if (!formData.actionTypeId || !formData.sheetId || !formData.studentIdColumns) {
      alert('Veuillez remplir tous les champs obligatoires (Type d\'action, Sheet ID, Colonnes ID étudiant)');
      return;
    }
    
    if (!formData.formFieldToMatch || !formData.formFieldColumns) {
      alert('Veuillez remplir tous les champs obligatoires de l\'étape 2 (Champ du formulaire et Colonnes)');
      return;
    }

    const automation = {
      id: editingAutomation?.id || Date.now().toString(),
      actionTypeId: formData.actionTypeId,
      enabled: formData.enabled,
      sheetId: formData.sheetId,
      sheetRange: formData.sheetRange,
      studentIdType: formData.studentIdType,
      studentIdColumns: formData.studentIdColumns,
      formFieldToMatch: formData.formFieldToMatch,
      formFieldColumns: formData.formFieldColumns,
      formFieldRule: formData.formFieldRule,
      mappedColumns: formData.mappedColumns,
      createdAt: editingAutomation?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    saveAutomationRule(automation);
    loadData();
    setShowAddForm(false);
    setEditingAutomation(null);
  };

  const handleDelete = (id) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette automatisation ?')) {
      deleteAutomationRule(id);
      loadData();
    }
  };

  const handleToggle = (automation) => {
    const updated = { ...automation, enabled: !automation.enabled };
    saveAutomationRule(updated);
    loadData();
  };

  const getActionTypeName = (id) => {
    const type = actionTypes.find(t => t.id === id);
    return type ? `${type.emoji} ${type.label}` : id;
  };

  // Obtenir les champs disponibles pour un type d'action
  const getAvailableFormFields = () => {
    if (!formData.actionTypeId) return [];
    const actionType = actionTypes.find(t => t.id === formData.actionTypeId);
    if (!actionType) return [];
    
    // Retourner tous les champs du formulaire (sans les champs étudiants)
    return (actionType.fields || []).map(field => ({
      name: field.name,
      label: `${field.type === 'date' ? '📅' : '📝'} ${field.label}`,
      type: field.type
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">
          🤖 Configuration des Automatisations
        </h2>
        <button onClick={handleAdd} className="btn btn-primary">
          ➕ Nouvelle automatisation
        </button>
      </div>

      {/* Description */}
      <div className="card bg-blue-50 border-blue-200">
        <h3 className="font-bold mb-3">📖 Comment ça marche ?</h3>
        <p className="text-gray-700 mb-4">
          Les automatisations vérifient en <strong>2 étapes obligatoires</strong> : 
          1️⃣ D'abord identifier l'étudiant (nom, prénom, email)
          2️⃣ Ensuite vérifier un champ du formulaire (date, lieu, événement...)
        </p>
        
        <div className="bg-white rounded-lg p-4 border-2 border-blue-300 space-y-3">
          <h4 className="font-bold text-sm mb-2">🎯 Exemple : Sheet "Événements"</h4>
          <div className="text-xs font-mono bg-gray-900 text-green-400 p-3 rounded overflow-x-auto">
            {`| A (Event)           | B (Dates)    | C (Lieux)    | D (Amb 1)  | E (Amb 2) | F (Amb 3) | G (Amb 4) |
|-------------------|--------------|--------------|------------|-----------|-----------|-----------|
| Vainqueur QVEMA   | 2024-09-13   | Campus       | Bouzidane  | Ansellem  | Ballonad  |           |
| Vainqueur leads   | 2024-09-21   | Paris        |            |           |           |           |`}
          </div>
          <div className="space-y-2 text-xs text-gray-700">
            <p className="font-semibold">Config automatisation :</p>
            <p>1️⃣ <strong>ID étudiant</strong> : Type = "Nom", Colonnes = <code>D,E,F,G</code> (Ambassadeurs)</p>
            <p>2️⃣ <strong>Champ formulaire</strong> : Date = Colonne <code>B</code></p>
            <p className="mt-2 p-2 bg-green-50 border border-green-200 rounded">
              🎉 <strong>Résultat</strong> : "Bouzidane" trouvé dans D ET date OK → validé !
            </p>
          </div>
        </div>
      </div>

      {/* Liste des automatisations */}
      <div className="card">
        <h3 className="text-xl font-bold mb-4">
          Automatisations configurées ({automations.length})
        </h3>

        {automations.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            Aucune automatisation configurée. Ajoutez-en une pour commencer.
          </div>
        ) : (
          <div className="space-y-4">
            {automations.map((automation) => (
              <div
                key={automation.id}
                className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{actionTypes.find(t => t.id === automation.actionTypeId)?.emoji || '📋'}</span>
                      <div>
                        <h4 className="font-bold text-lg">
                          {getActionTypeName(automation.actionTypeId)}
                        </h4>
                        <p className="text-sm text-gray-600">
                          Sheet: <code className="bg-gray-100 px-2 py-0.5 rounded">{automation.sheetId.substring(0, 20)}...</code>
                        </p>
                        <p className="text-sm text-gray-600">
                          Colonne: <code className="bg-gray-100 px-2 py-0.5 rounded">{automation.matchingColumn}</code>
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleToggle(automation)}
                      className={`btn ${automation.enabled ? 'btn-success' : 'btn-secondary'} text-sm`}
                    >
                      {automation.enabled ? '✅ Activée' : '⏸️ Désactivée'}
                    </button>
                    <button
                      onClick={() => handleEdit(automation)}
                      className="btn btn-secondary text-sm"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDelete(automation.id)}
                      className="btn btn-danger text-sm"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Formulaire d'édition */}
      {showAddForm && (
        <div className="card border-2 border-primary-600">
          <h3 className="text-xl font-bold mb-4">
            {editingAutomation ? '✏️ Modifier l\'automatisation' : '➕ Ajouter une automatisation'}
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block font-semibold mb-2">
                Type d'action *
              </label>
              <select
                className="form-control"
                value={formData.actionTypeId}
                onChange={(e) => setFormData({ ...formData, actionTypeId: e.target.value })}
                disabled={!!editingAutomation}
              >
                <option value="">Sélectionner un type</option>
                {actionTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.emoji} {type.label}
                  </option>
                ))}
              </select>
              {editingAutomation && (
                <p className="text-xs text-gray-500 mt-1">Le type d'action ne peut pas être modifié</p>
              )}
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="enabled"
                checked={formData.enabled}
                onChange={(e) => setFormData({ ...formData, enabled: e.target.checked })}
                className="w-5 h-5"
              />
              <label htmlFor="enabled" className="font-semibold">
                Automatisation activée
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold mb-2">
                  ID de la Google Sheet *
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.sheetId}
                  onChange={(e) => setFormData({ ...formData, sheetId: e.target.value })}
                  placeholder="1BxiMVs0XRAY5LGjhKYZekcOO5J8dZWrP6VZnCrFzxqE"
                />
                <p className="text-xs text-gray-500 mt-1">
                  L'ID se trouve dans l'URL de la Google Sheet
                </p>
              </div>

              <div>
                <label className="block font-semibold mb-2">
                  Plage de données
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.sheetRange}
                  onChange={(e) => setFormData({ ...formData, sheetRange: e.target.value })}
                  placeholder="A:Z"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Ex: A1:D100 ou Sheet1!A1:D100
                </p>
              </div>
            </div>

            {/* Section 1 : ID Étudiant */}
            <div className="border-t-2 border-blue-300 pt-4">
              <h4 className="font-bold text-lg mb-3 text-blue-700">
                🎓 Étape 1 : Identifier l'étudiant
              </h4>
              <div className="space-y-4">
                <div>
                  <label className="block font-semibold mb-2">
                    Type d'identifiant étudiant *
                  </label>
                  <select
                    className="form-control"
                    value={formData.studentIdType}
                    onChange={(e) => setFormData({ ...formData, studentIdType: e.target.value })}
                  >
                    <option value="email">📧 Email</option>
                    <option value="nom">👤 Nom</option>
                    <option value="prenom">👤 Prénom</option>
                    <option value="nom_complet">👤 Nom complet (Prénom + Nom)</option>
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    Comment identifier l'étudiant dans votre Sheet ?
                  </p>
                </div>

                <div>
                  <label className="block font-semibold mb-2">
                    Colonne(s) pour ID étudiant *
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.studentIdColumns}
                    onChange={(e) => setFormData({ ...formData, studentIdColumns: e.target.value })}
                    placeholder="D,E,F,G"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Les colonnes où chercher l'identifiant
                  </p>
                  <p className="text-xs text-gray-600 mt-2 bg-blue-50 p-2 rounded border border-blue-200">
                    💡 <strong>Plusieurs colonnes</strong> (ex: Ambassadeur 1-4) : Utilisez des virgules. Ex: <code>D,E,F,G</code>
                  </p>
                </div>
              </div>
            </div>

            {/* Section 2 : Champ formulaire */}
            <div className="border-t-2 border-green-300 pt-4">
              <h4 className="font-bold text-lg mb-3 text-green-700">
                📝 Étape 2 : Vérifier un champ du formulaire
              </h4>
              <div className="space-y-4">
                <div>
                  <label className="block font-semibold mb-2">
                    Champ du formulaire *
                  </label>
                  {formData.actionTypeId ? (
                    <select
                      className="form-control"
                      value={formData.formFieldToMatch}
                      onChange={(e) => setFormData({ ...formData, formFieldToMatch: e.target.value })}
                    >
                      <option value="">Sélectionnez un champ</option>
                      {getAvailableFormFields().map((field) => (
                        <option key={field.name} value={field.name}>
                          {field.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      className="form-control bg-gray-100"
                      value="Sélectionnez d'abord un type d'action"
                      disabled
                    />
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    Quel champ du formulaire voulez-vous vérifier ?
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold mb-2">
                      Colonne(s) pour ce champ *
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.formFieldColumns}
                      onChange={(e) => setFormData({ ...formData, formFieldColumns: e.target.value })}
                      placeholder="B"
                      disabled={!formData.formFieldToMatch}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      La colonne où chercher cette valeur
                    </p>
                  </div>

                  <div>
                    <label className="block font-semibold mb-2">
                      Règle de matching *
                    </label>
                    <select
                      className="form-control"
                      value={formData.formFieldRule}
                      onChange={(e) => setFormData({ ...formData, formFieldRule: e.target.value })}
                      disabled={!formData.formFieldToMatch}
                    >
                      <option value="exact">Exact match</option>
                      <option value="contains">Contient</option>
                      <option value="date">Match par date</option>
                      <option value="partial">Match partiel</option>
                    </select>
                    <p className="text-xs text-gray-500 mt-1">
                      Comment comparer cette valeur ?
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button onClick={handleSave} className="btn btn-primary">
              💾 Enregistrer
            </button>
            <button
              onClick={() => {
                setShowAddForm(false);
                setEditingAutomation(null);
              }}
              className="btn btn-outline"
            >
              Annuler
            </button>
          </div>
        </div>
      )}

      {/* TODO: Instruction pour tester */}
      <div className="card bg-yellow-50 border-yellow-200">
        <h3 className="font-bold mb-2">⚠️ Note technique</h3>
        <p className="text-sm text-gray-700">
          La connexion aux Google Sheets externes nécessite l'implémentation de l'API Google Sheets.
          Actuellement, cette fonctionnalité utilise des données mockées pour le développement.
        </p>
      </div>
    </div>
  );
}

