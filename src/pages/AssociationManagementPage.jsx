import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import PageLayout from '../components/shared/PageLayout';
import { useAssociation } from '../hooks/useAssociation';
import { useAssociationAuth } from '../hooks/useAssociationAuth';
import AssociationApplicationsQueue from '../components/student/AssociationApplicationsQueue';
import AssociationMembersList from '../components/student/AssociationMembersList';
import AssociationEventsManager from '../components/student/AssociationEventsManager';
import { updateAssociation } from '../services/associationsApi';
import { useStudentAuth } from '../contexts/StudentAuthContext';
import { useSchoolTheme } from '../hooks/useSchoolTheme';

export default function AssociationManagementPage({ school = 'eugenia' }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { student } = useStudentAuth();
  const theme = useSchoolTheme(school);
  const schoolPath = school === 'eugenia' ? '/eugenia-school' : '/albert-school';
  
  const { association, members, events, loading, error, refetch } = useAssociation(id);
  const { isAdmin, isMember, loading: authLoading } = useAssociationAuth(id);
  
  const [activeTab, setActiveTab] = useState('applications');
  const [settingsData, setSettingsData] = useState({
    description: '',
    category: ''
  });
  const [savingSettings, setSavingSettings] = useState(false);

  // Initialiser les données de settings quand l'association est chargée
  useEffect(() => {
    if (association) {
      setSettingsData({
        description: association.description || '',
        category: association.category || ''
      });
    }
  }, [association]);

  // Rediriger si pas admin
  if (!authLoading && !isAdmin) {
    return (
      <PageLayout school={school}>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md text-center">
            <div className="text-6xl mb-4">🔒</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Accès refusé</h2>
            <p className="text-gray-600 mb-6">
              Vous devez être administrateur de cette association pour accéder à cette page.
            </p>
            <Link
              to={`${schoolPath}/associations`}
              className="inline-block px-6 py-3 bg-gradient-to-r from-eugenia-burgundy to-eugenia-pink text-white font-semibold rounded-xl hover:shadow-lg transition-all"
            >
              Retour aux associations
            </Link>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (loading || authLoading) {
    return (
      <PageLayout school={school}>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="text-4xl mb-4 animate-pulse">⏳</div>
            <div className="text-gray-500">Chargement...</div>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (error || !association) {
    return (
      <PageLayout school={school}>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md text-center">
            <div className="text-6xl mb-4">❌</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Erreur</h2>
            <p className="text-gray-600 mb-6">
              {error || 'Association introuvable'}
            </p>
            <Link
              to={`${schoolPath}/associations`}
              className="inline-block px-6 py-3 bg-gradient-to-r from-eugenia-burgundy to-eugenia-pink text-white font-semibold rounded-xl hover:shadow-lg transition-all"
            >
              Retour aux associations
            </Link>
          </div>
        </div>
      </PageLayout>
    );
  }

  const handleSaveSettings = async () => {
    try {
      setSavingSettings(true);
      await updateAssociation(id, {
        ...settingsData,
        email: student.email
      });
      refetch();
      alert('Paramètres sauvegardés avec succès !');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Erreur lors de la sauvegarde : ' + (error.message || 'Erreur inconnue'));
    } finally {
      setSavingSettings(false);
    }
  };

  const tabs = [
    { id: 'applications', label: '📋 Candidatures', icon: '📋' },
    { id: 'members', label: '👥 Membres', icon: '👥' },
    { id: 'events', label: '📅 Événements', icon: '📅' },
    { id: 'settings', label: '⚙️ Paramètres', icon: '⚙️' }
  ];

  return (
    <PageLayout school={school}>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <Link
                  to={`${schoolPath}/associations`}
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  ← Retour
                </Link>
                <div className="text-4xl">{association.emoji || '🤝'}</div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{association.name}</h1>
                  <p className="text-sm text-gray-600">
                    {association.membersCount || 0} membre{association.membersCount !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
            </div>

            {/* Onglets */}
            <div className="flex gap-2 border-b border-gray-200">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    px-6 py-3 font-semibold transition-colors border-b-2
                    ${activeTab === tab.id
                      ? 'border-eugenia-burgundy text-eugenia-burgundy'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                    }
                  `}
                  style={activeTab === tab.id ? { borderBottomColor: theme.primary } : {}}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Contenu */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          {activeTab === 'applications' && (
            <AssociationApplicationsQueue
              associationId={id}
              onUpdate={refetch}
            />
          )}

          {activeTab === 'members' && (
            <AssociationMembersList
              associationId={id}
              members={members}
              onUpdate={refetch}
            />
          )}

          {activeTab === 'events' && (
            <AssociationEventsManager
              associationId={id}
              events={events}
              onUpdate={refetch}
            />
          )}

          {activeTab === 'settings' && (
            <div className="bg-white rounded-xl p-8 border border-gray-200 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Paramètres de l'association</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={settingsData.description}
                    onChange={(e) => setSettingsData({ ...settingsData, description: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-eugenia-yellow focus:border-eugenia-yellow outline-none resize-none"
                    placeholder="Description de l'association..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Catégorie
                  </label>
                  <select
                    value={settingsData.category}
                    onChange={(e) => setSettingsData({ ...settingsData, category: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-eugenia-yellow focus:border-eugenia-yellow outline-none"
                  >
                    <option value="Culture">Culture</option>
                    <option value="Sport">Sport</option>
                    <option value="Social">Social</option>
                    <option value="Innovation">Innovation</option>
                    <option value="Autre">Autre</option>
                  </select>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleSaveSettings}
                    disabled={savingSettings}
                    className="px-6 py-3 bg-gradient-to-r from-eugenia-burgundy to-eugenia-pink text-white font-semibold rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
                  >
                    {savingSettings ? '⏳ Sauvegarde...' : '💾 Sauvegarder'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
}

