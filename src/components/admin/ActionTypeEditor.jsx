import { useState, useEffect } from 'react';
import { getActionTypes, saveActionType, deleteActionType } from '../../services/configService';

export default function ActionTypeEditor({ school = 'eugenia' }) {
  const [actionTypes, setActionTypes] = useState([]);
  const [editingType, setEditingType] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    loadActionTypes();
  }, [school]);

  const loadActionTypes = async () => {
    const allTypes = await getActionTypes();
    // Filtrer par école
    const filteredTypes = allTypes.filter(type => {
      if (type.school) {
        return type.school === school;
      }
      // Pour compatibilité, garder les types sans école
      return true;
    });
    setActionTypes(filteredTypes);
  };

  const handleEdit = (type) => {
    setEditingType({ ...type });
    setShowForm(true);
  };

  const handleNew = () => {
    setEditingType({
      id: `new-type-${Date.now()}`,
      label: '',
      emoji: '📝',
      category: '',
      points: 50,
      autoValidation: false,
      fields: [],
      school: school // Ajouter l'école au nouveau type
    });
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!editingType.label || !editingType.id) {
      alert('Veuillez remplir tous les champs requis');
      return;
    }
    
    // Ajouter l'école au type d'action
    const actionTypeWithSchool = {
      ...editingType,
      school: school
    };
    
    await saveActionType(actionTypeWithSchool);
    await loadActionTypes();
    setShowForm(false);
    setEditingType(null);
  };

  const handleDelete = async (id) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce type d\'action ?')) {
      await deleteActionType(id);
      await loadActionTypes();
    }
  };

  const addField = () => {
    setEditingType({
      ...editingType,
      fields: [
        ...editingType.fields,
        {
          name: '',
          type: 'text',
          label: '',
          placeholder: '',
          required: false
        }
      ]
    });
  };

  const updateField = (index, key, value) => {
    const newFields = [...editingType.fields];
    newFields[index][key] = value;
    setEditingType({ ...editingType, fields: newFields });
  };

  const removeField = (index) => {
    const newFields = editingType.fields.filter((_, i) => i !== index);
    setEditingType({ ...editingType, fields: newFields });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">
          ⚙️ Types d'actions
        </h2>
        <button onClick={handleNew} className="btn btn-primary">
          ➕ Nouveau type
        </button>
      </div>

      {/* Liste des types existants */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {actionTypes.map((type) => (
          <div key={type.id} className="card">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-3xl">{type.emoji}</span>
                <h3 className="text-xl font-bold">{type.label}</h3>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-eugenia-yellow">
                  {type.points}
                </div>
                <div className="text-xs text-gray-500">points</div>
              </div>
            </div>
            <div className="text-sm text-gray-600 mb-4">
              Catégorie: {type.category}
            </div>
            <div className="text-sm text-gray-500 mb-4">
              {type.fields?.length || 0} champ(s)
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(type)}
                className="btn btn-secondary flex-1"
              >
                ✏️ Modifier
              </button>
              <button
                onClick={() => handleDelete(type.id)}
                className="btn btn-danger flex-1"
              >
                🗑️ Supprimer
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Formulaire d'édition */}
      {showForm && editingType && (
        <div className="card border-2 border-primary-600">
          <h3 className="text-xl font-bold mb-4">
            {editingType.id.startsWith('new') ? '➕ Nouveau type' : '✏️ Modifier le type'}
          </h3>

          <div className="space-y-4">
            {/* Emoji */}
            <div>
              <label className="block font-semibold mb-2">Emoji</label>
              <input
                type="text"
                className="form-control w-20"
                value={editingType.emoji}
                onChange={(e) => setEditingType({ ...editingType, emoji: e.target.value })}
              />
            </div>

            {/* Label */}
            <div>
              <label className="block font-semibold mb-2">Nom *</label>
              <input
                type="text"
                className="form-control"
                value={editingType.label}
                onChange={(e) => setEditingType({ ...editingType, label: e.target.value })}
                placeholder="Post LinkedIn"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block font-semibold mb-2">Catégorie</label>
              <input
                type="text"
                className="form-control"
                value={editingType.category}
                onChange={(e) => setEditingType({ ...editingType, category: e.target.value })}
                placeholder="Social Media"
              />
            </div>

            {/* Points */}
            <div>
              <label className="block font-semibold mb-2">Points</label>
              <input
                type="number"
                className="form-control w-32"
                value={editingType.points}
                onChange={(e) => setEditingType({ ...editingType, points: parseInt(e.target.value) || 0 })}
              />
            </div>

            {/* Champs */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="font-semibold">Champs du formulaire</label>
                <button onClick={addField} className="btn btn-secondary">
                  ➕ Ajouter champ
                </button>
              </div>

              <div className="space-y-2">
                {editingType.fields.map((field, index) => (
                  <div key={index} className="border rounded-lg p-3">
                    <div className="grid grid-cols-2 gap-2 mb-2">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Nom du champ"
                        value={field.name}
                        onChange={(e) => updateField(index, 'name', e.target.value)}
                      />
                      <select
                        className="form-control"
                        value={field.type}
                        onChange={(e) => updateField(index, 'type', e.target.value)}
                      >
                        <option value="text">Texte</option>
                        <option value="url">URL</option>
                        <option value="date">Date</option>
                        <option value="textarea">Texte long</option>
                        <option value="number">Nombre</option>
                      </select>
                    </div>
                    <input
                      type="text"
                      className="form-control mb-2"
                      placeholder="Label"
                      value={field.label}
                      onChange={(e) => updateField(index, 'label', e.target.value)}
                    />
                    <input
                      type="text"
                      className="form-control mb-2"
                      placeholder="Placeholder"
                      value={field.placeholder}
                      onChange={(e) => updateField(index, 'placeholder', e.target.value)}
                    />
                    <div className="flex items-center justify-between">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={field.required}
                          onChange={(e) => updateField(index, 'required', e.target.checked)}
                        />
                        Requis
                      </label>
                      <button
                        onClick={() => removeField(index)}
                        className="btn btn-danger"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-4">
              <button onClick={handleSave} className="btn btn-success flex-1">
                💾 Enregistrer
              </button>
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingType(null);
                }}
                className="btn btn-secondary flex-1"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

