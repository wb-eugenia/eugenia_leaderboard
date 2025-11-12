import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const colors = ['var(--eugenia-burgundy)', 'var(--eugenia-pink)', 'var(--eugenia-yellow)', '#671324', '#E91E63'];

export default function PopularActionsChart({ data }) {
  // S'assurer que data est un tableau
  const dataArray = Array.isArray(data) ? data : [];
  
  if (!dataArray || dataArray.length === 0) {
    return (
      <div className="admin-card">
        <h3 className="text-2xl font-bold mb-4" style={{ color: 'var(--eugenia-burgundy)' }}>
          🎯 Actions les Plus Populaires
        </h3>
        <p className="text-gray-500 text-center py-8">Aucune donnée disponible</p>
      </div>
    );
  }

  const chartData = dataArray.map((item, index) => ({
    name: `${item.emoji || ''} ${item.type}`,
    count: item.count,
    color: colors[index % colors.length],
  }));

  return (
    <div className="admin-card">
      <h3 className="text-2xl font-bold mb-4" style={{ color: 'var(--eugenia-burgundy)' }}>
        🎯 Actions les Plus Populaires
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis dataKey="name" stroke="#666" angle={-45} textAnchor="end" height={100} />
          <YAxis stroke="#666" />
          <Tooltip
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #ddd',
              borderRadius: '8px',
            }}
          />
          <Bar dataKey="count" fill="var(--eugenia-burgundy)" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

