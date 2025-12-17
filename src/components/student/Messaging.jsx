import { useState, useEffect } from 'react';
import { useStudentAuth } from '../../contexts/StudentAuthContext';

const API_URL = import.meta.env.VITE_API_URL;

export default function Messaging() {
  const { student } = useStudentAuth();
  const [activeTab, setActiveTab] = useState('inbox'); // inbox, sent, new
  const [messages, setMessages] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState({
    recipientEmail: '',
    subject: '',
    content: ''
  });

  useEffect(() => {
    if (student) {
      loadMessages();
      loadConversations();
    }
  }, [student, activeTab]);

  const loadMessages = async () => {
    if (!student) return;
    setLoading(true);
    try {
      const endpoint = activeTab === 'inbox' ? '/messages/inbox' : '/messages/sent';
      const response = await fetch(`${API_URL}${endpoint}`, {
        headers: {
          'X-User-Email': student.email
        }
      });
      const data = await response.json();
      setMessages(Array.isArray(data) ? data : (data.data || []));
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadConversations = async () => {
    if (!student) return;
    try {
      const response = await fetch(`${API_URL}/messages/conversations`, {
        headers: {
          'X-User-Email': student.email
        }
      });
      const data = await response.json();
      setConversations(Array.isArray(data) ? data : (data.data || []));
    } catch (error) {
      console.error('Error loading conversations:', error);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!student || !newMessage.recipientEmail || !newMessage.subject || !newMessage.content) return;

    try {
      const response = await fetch(`${API_URL}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Email': student.email
        },
        body: JSON.stringify(newMessage)
      });

      if (response.ok) {
        alert('Message envoyé !');
        setNewMessage({ recipientEmail: '', subject: '', content: '' });
        setActiveTab('sent');
        loadMessages();
        loadConversations();
      } else {
        alert('Erreur lors de l\'envoi');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Erreur lors de l\'envoi');
    }
  };

  const markAsRead = async (messageId) => {
    try {
      await fetch(`${API_URL}/messages/${messageId}/read`, {
        method: 'PATCH',
        headers: {
          'X-User-Email': student.email
        }
      });
      loadMessages();
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  if (!student) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p>Vous devez être connecté pour accéder à la messagerie</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
        {/* Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setActiveTab('inbox')}
            className={`px-6 py-4 font-semibold transition-colors border-b-2 ${
              activeTab === 'inbox'
                ? 'border-eugenia-burgundy text-eugenia-burgundy'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
            }`}
          >
            📥 Boîte de réception ({messages.filter(m => !m.read).length})
          </button>
          <button
            onClick={() => setActiveTab('sent')}
            className={`px-6 py-4 font-semibold transition-colors border-b-2 ${
              activeTab === 'sent'
                ? 'border-eugenia-burgundy text-eugenia-burgundy'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
            }`}
          >
            📤 Messages envoyés
          </button>
          <button
            onClick={() => setActiveTab('new')}
            className={`px-6 py-4 font-semibold transition-colors border-b-2 ${
              activeTab === 'new'
                ? 'border-eugenia-burgundy text-eugenia-burgundy'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
            }`}
          >
            ✉️ Nouveau message
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'new' && (
            <form onSubmit={sendMessage} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Destinataire (email)
                </label>
                <input
                  type="email"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  value={newMessage.recipientEmail}
                  onChange={(e) => setNewMessage({ ...newMessage, recipientEmail: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Sujet
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  value={newMessage.subject}
                  onChange={(e) => setNewMessage({ ...newMessage, subject: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Message
                </label>
                <textarea
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  rows="6"
                  value={newMessage.content}
                  onChange={(e) => setNewMessage({ ...newMessage, content: e.target.value })}
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-eugenia-burgundy text-white py-2 rounded-lg font-semibold hover:bg-opacity-90"
              >
                Envoyer
              </button>
            </form>
          )}

          {(activeTab === 'inbox' || activeTab === 'sent') && (
            <div className="space-y-3">
              {loading ? (
                <div className="text-center py-8">Chargement...</div>
              ) : messages.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <div className="text-4xl mb-2">📭</div>
                  <p>Aucun message</p>
                </div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={`p-4 rounded-lg border ${
                      !message.read && activeTab === 'inbox'
                        ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
                        : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600'
                    }`}
                    onClick={() => !message.read && activeTab === 'inbox' && markAsRead(message.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-gray-900 dark:text-white">
                            {activeTab === 'inbox' ? message.sender_name || message.sender_email : message.recipient_name || message.recipient_email}
                          </span>
                          {!message.read && activeTab === 'inbox' && (
                            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                          )}
                        </div>
                        <h4 className="font-bold text-gray-900 dark:text-white mb-1">
                          {message.subject}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                          {message.content}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                          {new Date(message.created_at).toLocaleString('fr-FR')}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}










