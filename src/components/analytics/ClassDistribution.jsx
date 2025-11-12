import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const COLORS = ['#671324', '#E91E63', '#DBA12D', '#8B1A3D', '#F06292', '#FFC107'];

export default function ClassDistribution({ data }) {
  // S'assurer que data est un tableau
  const dataArray = Array.isArray(data) ? data : [];
  
  if (!dataArray || dataArray.length === 0) {
    return (
      <div className="admin-card">
        <h3 className="text-2xl font-bold mb-4" style={{ color: 'var(--eugenia-burgundy)' }}>
          🏫 Répartition par Classe
        </h3>
        <p className="text-gray-500 text-center py-8">Aucune donnée disponible</p>
      </div>
    );
  }

  const chartData = dataArray.map(item => ({
    name: item.class,
    value: item.count,
    percentage: item.percentage,
  }));
  
  const onlyOneClass = dataArray.length === 1;

  return (
    <div className="admin-card">
      <h3 className="text-2xl font-bold mb-4" style={{ color: 'var(--eugenia-burgundy)' }}>
        🏫 Répartition par Classe
      </h3>
      {onlyOneClass && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            ⚠️ Seulement 1 classe active actuellement ({dataArray[0].class})
          </p>
        </div>
      )}
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percentage }) => `${name}: ${percentage}%`}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #ddd',
              borderRadius: '8px',
            }}
            formatter={(value, name, props) => [
              `${value} actions (${props.payload.percentage}%)`,
              name,
            ]}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

