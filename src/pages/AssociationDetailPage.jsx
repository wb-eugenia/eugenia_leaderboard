import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import PageLayout from '../components/shared/PageLayout';
import { getAssociationById, getAssociationMembers, getAssociationEvents, applyToAssociation } from '../services/associationsApi';
import { useStudentAuth } from '../contexts/StudentAuthContext';
import { useSchoolTheme } from '../hooks/useSchoolTheme';
import AssociationApplicationForm from '../components/student/AssociationApplicationForm';

export default function AssociationDetailPage({ school = 'eugenia' }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { student } = useStudentAuth();
  const theme = useSchoolTheme(school);
  const schoolPath = school === 'eugenia' ? '/eugenia-school' : '/albert-school';

  const [association, setAssociation] = useState(null);
  const [members, setMembers] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);

        const [assoData, membersData, eventsData] = await Promise.all([
          getAssociationById(id),
          getAssociationMembers(id),
          getAssociationEvents(id)
        ]);

        setAssociation(assoData);
        setMembers(Array.isArray(membersData) ? membersData : (membersData?.members || []));
        setEvents(Array.isArray(eventsData) ? eventsData : (eventsData?.events || []));
      } catch (err) {
        console.error('Error fetching association data:', err);
        setError(err.message || 'Erreur lors du chargement des données');
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchData();
    }
  }, [id]);

  if (loading) {
    return (
      <PageLayout school={school}>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <svg className="animate-spin h-12 w-12 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
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
            <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Erreur</h2>
            <p className="text-gray-600 mb-6">{error || 'Association introuvable'}</p>
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

  const isMember = members.some(m => m.email === student?.email && m.status === 'active');
  const isAdmin = members.some(m => m.email === student?.email && m.role === 'admin');

  const tabs = [
    { id: 'overview', label: 'Vue d\'ensemble' },
    { id: 'members', label: 'Membres' },
    { id: 'events', label: 'Événements' }
  ];

  return (
    <PageLayout school={school}>
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="student-hero-section py-12 px-4 text-white">
          <div className="max-w-7xl mx-auto">
            <Link
              to={`${schoolPath}/associations`}
              className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Retour aux associations
            </Link>
            
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <div className="w-32 h-32 rounded-full bg-white/20 backdrop-blur-lg flex items-center justify-center text-6xl shadow-xl">
                {association.emoji || '🤝'}
              </div>
              
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">{association.name}</h1>
                {association.description && (
                  <p className="text-xl opacity-90 mb-4">{association.description}</p>
                )}
                
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                  {association.category && (
                    <span className="px-4 py-2 bg-white/20 backdrop-blur-lg rounded-full text-sm font-semibold">
                      {association.category}
                    </span>
                  )}
                  <span className="px-4 py-2 bg-white/20 backdrop-blur-lg rounded-full text-sm flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    {association.membersCount || members.length} membre{association.membersCount !== 1 ? 's' : ''}
                  </span>
                  {events.length > 0 && (
                    <span className="px-4 py-2 bg-white/20 backdrop-blur-lg rounded-full text-sm flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {events.length} événement{events.length !== 1 ? 's' : ''}
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-3 mt-6 justify-center md:justify-start">
                  {isAdmin && (
                    <Link
                      to={`${schoolPath}/associations/${id}/manage`}
                      className="px-6 py-3 bg-white text-eugenia-burgundy font-semibold rounded-xl hover:shadow-lg transition-all flex items-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Gérer l'association
                    </Link>
                  )}
                  {!isMember && student && (
                    <button
                      onClick={() => setActiveTab('apply')}
                      className="px-6 py-3 bg-white text-eugenia-burgundy font-semibold rounded-xl hover:shadow-lg transition-all flex items-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      Postuler
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contenu */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Onglets */}
          <div className="bg-white rounded-xl shadow-sm mb-6 border border-gray-200">
            <div className="flex gap-2 border-b border-gray-200 p-4">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-3 font-semibold transition-colors border-b-2 ${
                    activeTab === tab.id
                      ? 'border-eugenia-burgundy text-eugenia-burgundy'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                  style={activeTab === tab.id ? { borderBottomColor: theme.primary } : {}}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Contenu des onglets */}
            <div className="p-6">
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {association.description && (
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3">À propos</h3>
                      <p className="text-gray-700 leading-relaxed">{association.description}</p>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-50 rounded-xl p-6">
                      <h4 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        Membres
                      </h4>
                      <p className="text-3xl font-bold" style={{ color: theme.primary }}>
                        {association.membersCount || members.length}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">membres actifs</p>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-6">
                      <h4 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Événements
                      </h4>
                      <p className="text-3xl font-bold" style={{ color: theme.primary }}>
                        {events.length}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">événements à venir</p>
                    </div>
                  </div>

                  {members.length > 0 && (
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-4">Administrateurs</h3>
                      <div className="flex flex-wrap gap-3">
                        {members
                          .filter(m => m.role === 'admin')
                          .slice(0, 5)
                          .map(member => (
                            <div
                              key={member.id}
                              className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full"
                            >
                              <span className="text-lg">👤</span>
                              <span className="text-sm font-medium text-gray-700">
                                {member.firstName} {member.lastName}
                              </span>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'members' && (
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    Membres ({members.filter(m => m.status === 'active').length})
                  </h3>
                  {members.filter(m => m.status === 'active').length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                      Aucun membre pour le moment
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {members
                        .filter(m => m.status === 'active')
                        .map(member => (
                          <div
                            key={member.id}
                            className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                              </div>
                              <div className="flex-1">
                                <div className="font-semibold text-gray-900">
                                  {member.firstName} {member.lastName}
                                </div>
                                <div className="text-sm text-gray-600">{member.email}</div>
                                {member.role && (
                                  <span className={`inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded text-xs font-semibold ${
                                    member.role === 'admin' 
                                      ? 'bg-red-100 text-red-700' 
                                      : 'bg-blue-100 text-blue-700'
                                  }`}>
                                    {member.role === 'admin' && (
                                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                      </svg>
                                    )}
                                    {member.role === 'admin' ? 'Admin' : 'Membre'}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'events' && (
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    Événements ({events.length})
                  </h3>
                  {events.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                      Aucun événement prévu pour le moment
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {events.map(event => (
                        <div
                          key={event.id}
                          className="bg-gray-50 rounded-lg p-6 border border-gray-200 hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-lg bg-gray-200 flex items-center justify-center text-2xl flex-shrink-0">
                              {event.associationEmoji || association.emoji || '📅'}
                            </div>
                            <div className="flex-1">
                              <h4 className="text-lg font-bold text-gray-900 mb-2">{event.title}</h4>
                              {event.description && (
                                <p className="text-gray-600 mb-3">{event.description}</p>
                              )}
                              <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                                {event.date && (
                                  <div className="flex items-center gap-1">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <span>{new Date(event.date).toLocaleDateString('fr-FR')}</span>
                                  </div>
                                )}
                                {event.time && (
                                  <div className="flex items-center gap-1">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span>{event.time}</span>
                                  </div>
                                )}
                                {event.location && (
                                  <div className="flex items-center gap-1">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    <span>{event.location}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'apply' && (
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Postuler à cette association</h3>
                  <AssociationApplicationForm 
                    school={school} 
                    onSuccess={() => {
                      setActiveTab('overview');
                      // Recharger les données
                      window.location.reload();
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}

