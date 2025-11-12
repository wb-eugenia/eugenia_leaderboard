import React from 'react';

export default function TopStudentsTable({ students }) {
  // S'assurer que students est un tableau
  const studentsArray = Array.isArray(students) ? students : [];
  
  if (!studentsArray || studentsArray.length === 0) {
    return (
      <div className="admin-card">
        <h3 className="text-2xl font-bold mb-4" style={{ color: 'var(--eugenia-burgundy)' }}>
          🏆 Top 10 Étudiants Actifs
        </h3>
        <p className="text-gray-500 text-center py-8">Aucune donnée disponible</p>
      </div>
    );
  }

  const getRankIcon = (rank) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  return (
    <div className="admin-card">
      <h3 className="text-2xl font-bold mb-4" style={{ color: 'var(--eugenia-burgundy)' }}>
        🏆 Top 10 Étudiants Actifs
      </h3>
      <div className="overflow-x-auto">
        <table className="admin-table w-full">
          <thead>
            <tr>
              <th className="px-4 py-3 text-left">Position</th>
              <th className="px-4 py-3 text-left">Nom</th>
              <th className="px-4 py-3 text-left">Classe</th>
              <th className="px-4 py-3 text-right">Actions</th>
              <th className="px-4 py-3 text-right">Points</th>
            </tr>
          </thead>
          <tbody>
            {studentsArray.map((student) => (
              <tr key={student.rank} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-bold">{getRankIcon(student.rank)}</td>
                <td className="px-4 py-3">
                  {student.firstName} {student.lastName}
                </td>
                <td className="px-4 py-3">{student.class}</td>
                <td className="px-4 py-3 text-right">{student.actionsCount}</td>
                <td className="px-4 py-3 text-right font-bold" style={{ color: 'var(--eugenia-burgundy)' }}>
                  {student.points} pts
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

