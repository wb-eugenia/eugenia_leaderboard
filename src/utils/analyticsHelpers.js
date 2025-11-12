/**
 * Utilitaires pour les analytics
 */

export function formatDate(dateString) {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.toLocaleDateString('fr-FR', { month: 'short' });
  return `${day} ${month}`;
}

export function formatDateTime(dateString) {
  const date = new Date(dateString);
  return date.toLocaleString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function getTrendColor(trend) {
  if (trend > 0) return '#28a745'; // Vert
  if (trend < 0) return '#dc3545'; // Rouge
  return '#6c757d'; // Gris
}

export function getTrendIcon(trend) {
  if (trend > 0) return '↑';
  if (trend < 0) return '↓';
  return '→';
}

export function exportToCSV(data, filename) {
  if (!data || data.length === 0) return;

  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => headers.map(header => `"${row[header] || ''}"`).join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

