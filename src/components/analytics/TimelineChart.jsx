import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatDate } from '../../utils/analyticsHelpers';

export default function TimelineChart({ data }) {
  // S'assurer que data est un tableau
  const dataArray = Array.isArray(data) ? data : [];
  
  if (!dataArray || dataArray.length === 0) {
    return (
      <div className="admin-card">
        <h3 className="text-2xl font-bold mb-4" style={{ color: 'var(--eugenia-burgundy)' }}>
          📊 Évolution des Actions
        </h3>
        <p className="text-gray-500 text-center py-8">Aucune donnée disponible</p>
      </div>
    );
  }

  const chartData = dataArray.map(item => ({
    date: formatDate(item.date),
    count: item.count,
  }));

  return (
    <div className="admin-card">
      <h3 className="text-2xl font-bold mb-4" style={{ color: 'var(--eugenia-burgundy)' }}>
        📊 Évolution des Actions
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis dataKey="date" stroke="#666" />
          <YAxis stroke="#666" />
          <Tooltip
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #ddd',
              borderRadius: '8px',
            }}
          />
          <Line
            type="monotone"
            dataKey="count"
            stroke="url(#colorGradient)"
            strokeWidth={3}
            dot={{ fill: 'var(--eugenia-burgundy)', r: 5 }}
          />
          <defs>
            <linearGradient id="colorGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="var(--eugenia-burgundy)" />
              <stop offset="100%" stopColor="var(--eugenia-pink)" />
            </linearGradient>
          </defs>
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

