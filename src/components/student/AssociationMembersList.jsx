import { useState } from 'react';
import { removeAssociationMember, updateMemberRole } from '../../services/associationsApi';
import { useStudentAuth } from '../../contexts/StudentAuthContext';

export default function AssociationMembersList({ associationId, members, onUpdate }) {
  const { student } = useStudentAuth();
  const [processing, setProcessing] = useState(null);
  const [filter, setFilter] = useState('all'); // all, admin, member

  const handleRemoveMember = async (email) => {
    if (!confirm(`Êtes-vous sûr de vouloir retirer ${email} de l'association ?`)) {
      return;
    }

    try {
      setProcessing(email);
      await removeAssociationMember(associationId, email, student.email);
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Error removing member:', error);
      alert('Erreur lors du retrait : ' + (error.message || 'Erreur inconnue'));
    } finally {
      setProcessing(null);
    }
  };

  const handleChangeRole = async (email, newRole) => {
    const action = newRole === 'admin' ? 'promouvoir administrateur' : 'rétrograder en membre';
    if (!confirm(`Êtes-vous sûr de vouloir ${action} pour ${email} ?`)) {
      return;
    }

    try {
      setProcessing(email);
      await updateMemberRole(associationId, email, newRole, student.email);
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Error updating role:', error);
      alert('Erreur lors du changement de rôle : ' + (error.message || 'Erreur inconnue'));
    } finally {
      setProcessing(null);
    }
  };

  const filteredMembers = members.filter(member => {
    if (filter === 'admin') return member.role === 'admin';
    if (filter === 'member') return member.role === 'member';
    return true;
  });

  const admins = members.filter(m => m.role === 'admin');
  const regularMembers = members.filter(m => m.role === 'member');

  return (
    <div className="space-y-6">
      {/* Filtres */}
      <div className="flex gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
            filter === 'all'
              ? 'bg-eugenia-burgundy text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Tous ({members.length})
        </button>
        <button
          onClick={() => setFilter('admin')}
          className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
            filter === 'admin'
              ? 'bg-eugenia-burgundy text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Admins ({admins.length})
        </button>
        <button
          onClick={() => setFilter('member')}
          className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
            filter === 'member'
              ? 'bg-eugenia-burgundy text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Membres ({regularMembers.length})
        </button>
      </div>

      {/* Liste des membres */}
      {filteredMembers.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-8 text-center border border-gray-200">
          <div className="text-4xl mb-2">👥</div>
          <p className="text-gray-500">Aucun membre trouvé</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredMembers.map(member => (
            <div
              key={member.id}
              className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-semibold text-gray-900">
                      {member.firstName} {member.lastName}
                    </span>
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      member.role === 'admin'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {member.role === 'admin' ? '👑 Admin' : '👤 Membre'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{member.email}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Membre depuis {new Date(member.joinedAt).toLocaleDateString('fr-FR')}
                  </p>
                </div>

                <div className="flex gap-2">
                  {member.role === 'member' && (
                    <button
                      onClick={() => handleChangeRole(member.email, 'admin')}
                      disabled={processing === member.email}
                      className="px-3 py-1 bg-purple-600 text-white rounded text-sm font-semibold hover:bg-purple-700 transition-colors disabled:opacity-50"
                      title="Promouvoir administrateur"
                    >
                      {processing === member.email ? '⏳' : '👑'}
                    </button>
                  )}
                  {member.role === 'admin' && member.email.toLowerCase() !== student?.email?.toLowerCase() && (
                    <button
                      onClick={() => handleChangeRole(member.email, 'member')}
                      disabled={processing === member.email}
                      className="px-3 py-1 bg-gray-600 text-white rounded text-sm font-semibold hover:bg-gray-700 transition-colors disabled:opacity-50"
                      title="Rétrograder en membre"
                    >
                      {processing === member.email ? '⏳' : '⬇️'}
                    </button>
                  )}
                  {member.email.toLowerCase() !== student?.email?.toLowerCase() && (
                    <button
                      onClick={() => handleRemoveMember(member.email)}
                      disabled={processing === member.email}
                      className="px-3 py-1 bg-red-600 text-white rounded text-sm font-semibold hover:bg-red-700 transition-colors disabled:opacity-50"
                      title="Retirer de l'association"
                    >
                      {processing === member.email ? '⏳' : '🗑️'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

