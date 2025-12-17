import { useState, useEffect } from 'react';
import PageLayout from '../components/shared/PageLayout';
import { useStudentAuth } from '../contexts/StudentAuthContext';

const API_URL = import.meta.env.VITE_API_URL;

export default function NotificationsPage({ school = 'eugenia' }) {
  const { student } = useStudentAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (student?.email) {
      loadNotifications();
      // Polling toutes les 30 secondes
      const interval = setInterval(loadNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [student?.email]);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      // Pour l'instant, on utilise localStorage
      // TODO: Créer endpoint API /notifications
      const stored = localStorage.getItem(`notifications_${student.email}`);
      if (stored) {
        const notifs = JSON.parse(stored);
        setNotifications(notifs);
        setUnreadCount(notifs.filter(n => !n.read).length);
      } else {
        setNotifications([]);
        setUnreadCount(0);
      }
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = (notificationId) => {
    const updated = notifications.map(n => 
      n.id === notificationId ? { ...n, read: true } : n
    );
    setNotifications(updated);
    localStorage.setItem(`notifications_${student.email}`, JSON.stringify(updated));
    setUnreadCount(updated.filter(n => !n.read).length);
  };

  const markAllAsRead = () => {
    const updated = notifications.map(n => ({ ...n, read: true }));
    setNotifications(updated);
    localStorage.setItem(`notifications_${student.email}`, JSON.stringify(updated));
    setUnreadCount(0);
  };

  const deleteNotification = (notificationId) => {
    const updated = notifications.filter(n => n.id !== notificationId);
    setNotifications(updated);
    localStorage.setItem(`notifications_${student.email}`, JSON.stringify(updated));
    setUnreadCount(updated.filter(n => !n.read).length);
  };

  if (!student) {
    return (
      <PageLayout school={school}>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md text-center">
            <p className="text-gray-600">Vous devez être connecté pour voir vos notifications.</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout school={school}>
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="student-hero-section py-12 px-4 text-white">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              🔔 Notifications
            </h1>
            <p className="text-xl md:text-2xl opacity-90">
              Restez informé de toutes vos activités
            </p>
          </div>
        </section>

        {/* Contenu principal */}
        <div className="max-w-4xl mx-auto px-4 py-8 -mt-10 relative z-10">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Mes notifications
                </h2>
                {unreadCount > 0 && (
                  <p className="text-sm text-gray-600 mt-1">
                    {unreadCount} notification{unreadCount !== 1 ? 's' : ''} non lue{unreadCount !== 1 ? 's' : ''}
                  </p>
                )}
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="px-4 py-2 bg-eugenia-burgundy text-white rounded-lg hover:bg-eugenia-pink transition-colors font-semibold"
                >
                  Tout marquer lu
                </button>
              )}
            </div>

            {/* Liste des notifications */}
            {loading ? (
              <div className="p-12 text-center">
                <div className="text-4xl mb-4 animate-pulse">⏳</div>
                <p className="text-gray-500">Chargement des notifications...</p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-12 text-center">
                <div className="text-6xl mb-4">🔔</div>
                <p className="text-xl text-gray-500 mb-2">Aucune notification</p>
                <p className="text-gray-400">Vous serez notifié lorsque de nouveaux événements se produiront.</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`p-6 hover:bg-gray-50 transition-colors ${
                      !notif.read ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="text-3xl flex-shrink-0">
                          {notif.emoji || '🔔'}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-bold text-gray-900 text-lg">
                              {notif.title}
                            </h3>
                            {!notif.read && (
                              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                            )}
                          </div>
                          <p className="text-gray-600 mb-2">
                            {notif.message}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(notif.createdAt).toLocaleDateString('fr-FR', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        {!notif.read && (
                          <button
                            onClick={() => markAsRead(notif.id)}
                            className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                            title="Marquer comme lu"
                          >
                            ✓ Lu
                          </button>
                        )}
                        <button
                          onClick={() => deleteNotification(notif.id)}
                          className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                          title="Supprimer"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </PageLayout>
  );
}




