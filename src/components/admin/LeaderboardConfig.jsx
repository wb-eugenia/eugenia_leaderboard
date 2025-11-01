import { useState, useEffect } from 'react';
import { getLeaderboard } from '../../services/googleSheets';

export default function LeaderboardConfig() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const loadLeaderboard = async () => {
    try {
      const data = await getLeaderboard();
      setLeaderboard(data);
    } catch (error) {
      console.error('Error loading leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user) => {
    setEditingUser({ ...user });
    setShowAddForm(false);
  };

  const handleAdd = () => {
    setEditingUser({
      firstName: '',
      lastName: '',
      email: '',
      classe: 'B1',
      totalPoints: 0,
      actionsCount: 0
    });
    setShowAddForm(true);
  };

  const handleSave = () => {
    if (!editingUser.email || !editingUser.firstName) {
      alert('Veuillez remplir email et prénom');
      return;
    }

    // Ici on devrait appeler updateLeaderboard mais pour l'instant on met à jour localStorage
    const stored = localStorage.getItem('eugenia_leaderboard');
    const users = stored ? JSON.parse(stored) : [];
    
    const existingIndex = users.findIndex(u => u.email === editingUser.email);
    
    if (existingIndex >= 0) {
      users[existingIndex] = editingUser;
    } else {
      users.push(editingUser);
    }
    
    localStorage.setItem('eugenia_leaderboard', JSON.stringify(users));
    loadLeaderboard();
    setEditingUser(null);
    setShowAddForm(false);
  };

  const handleDelete = (email) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet étudiant ?')) {
      const stored = localStorage.getItem('eugenia_leaderboard');
      const users = stored ? JSON.parse(stored) : [];
      const filtered = users.filter(u => u.email !== email);
      localStorage.setItem('eugenia_leaderboard', JSON.stringify(filtered));
      loadLeaderboard();
    }
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
          🏆 Configuration Leaderboard
        </h2>
        <button onClick={handleAdd} className="btn btn-primary">
          ➕ Ajouter un étudiant
        </button>
      </div>

      {/* Liste des étudiants */}
      <div className="card">
        <h3 className="text-xl font-bold mb-4">
          Étudiants ({leaderboard.length})
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 font-semibold">Rang</th>
                <th className="text-left py-3 px-4 font-semibold">Prénom</th>
                <th className="text-left py-3 px-4 font-semibold">Nom</th>
                <th className="text-left py-3 px-4 font-semibold">Classe</th>
                <th className="text-left py-3 px-4 font-semibold">Email</th>
                <th className="text-left py-3 px-4 font-semibold">Points</th>
                <th className="text-left py-3 px-4 font-semibold">Actions</th>
                <th className="text-right py-3 px-4 font-semibold">Opérations</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((user, index) => (
                <tr key={user.email} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <span className="font-bold text-primary-600">
                      {index < 3 ? ['🥇', '🥈', '🥉'][index] : user.rank}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-semibold">{user.firstName}</td>
                  <td className="py-3 px-4 font-semibold">{user.lastName}</td>
                  <td className="py-3 px-4 text-gray-600">{user.classe || '-'}</td>
                  <td className="py-3 px-4 text-gray-600">{user.email}</td>
                  <td className="py-3 px-4">
                    <span className="font-bold text-eugenia-yellow">{user.totalPoints}</span>
                  </td>
                  <td className="py-3 px-4 text-gray-600">{user.actionsCount}</td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={() => handleEdit(user)}
                        className="btn btn-secondary text-sm"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDelete(user.email)}
                        className="btn btn-danger text-sm"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Formulaire d'édition */}
      {editingUser && (
        <div className="card border-2 border-primary-600">
          <h3 className="text-xl font-bold mb-4">
            {showAddForm ? '➕ Ajouter un étudiant' : '✏️ Modifier l\'étudiant'}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold mb-2">Prénom *</label>
              <input
                type="text"
                className="form-control"
                value={editingUser.firstName}
                onChange={(e) => setEditingUser({ ...editingUser, firstName: e.target.value })}
                placeholder="Jean"
              />
            </div>

            <div>
              <label className="block font-semibold mb-2">Nom</label>
              <input
                type="text"
                className="form-control"
                value={editingUser.lastName}
                onChange={(e) => setEditingUser({ ...editingUser, lastName: e.target.value })}
                placeholder="Dupont"
              />
            </div>

            <div>
              <label className="block font-semibold mb-2">Classe</label>
              <input
                type="text"
                className="form-control"
                value={editingUser.classe}
                onChange={(e) => setEditingUser({ ...editingUser, classe: e.target.value })}
                placeholder="B1"
              />
            </div>

            <div>
              <label className="block font-semibold mb-2">Email *</label>
              <input
                type="email"
                className="form-control"
                value={editingUser.email}
                onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                placeholder="jean.dupont@eugeniaschool.com"
                disabled={!showAddForm}
              />
              {!showAddForm && (
                <p className="text-xs text-gray-500 mt-1">L'email ne peut pas être modifié</p>
              )}
            </div>

            <div>
              <label className="block font-semibold mb-2">Points</label>
              <input
                type="number"
                className="form-control"
                value={editingUser.totalPoints}
                onChange={(e) => setEditingUser({ ...editingUser, totalPoints: parseInt(e.target.value) || 0 })}
                min="0"
              />
            </div>

            <div>
              <label className="block font-semibold mb-2">Nombre d'actions</label>
              <input
                type="number"
                className="form-control"
                value={editingUser.actionsCount}
                onChange={(e) => setEditingUser({ ...editingUser, actionsCount: parseInt(e.target.value) || 0 })}
                min="0"
              />
            </div>
          </div>

          <div className="flex gap-2 mt-6">
            <button onClick={handleSave} className="btn btn-success flex-1">
              💾 Enregistrer
            </button>
            <button
              onClick={() => {
                setEditingUser(null);
                setShowAddForm(false);
              }}
              className="btn btn-secondary flex-1"
            >
              Annuler
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

