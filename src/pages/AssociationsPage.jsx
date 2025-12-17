import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PageLayout from '../components/shared/PageLayout';
import TopAssociations from '../components/student/TopAssociations';
import AssociationApplicationForm from '../components/student/AssociationApplicationForm';
import CreateAssociationForm from '../components/student/CreateAssociationForm';
import { getAllAssociations, getAllEvents } from '../services/associationsApi';
import { useSchoolTheme } from '../hooks/useSchoolTheme';
import { useStudentAuth } from '../contexts/StudentAuthContext';

export default function AssociationsPage({ school = 'eugenia' }) {
  const theme = useSchoolTheme(school);
  const navigate = useNavigate();
  const { student } = useStudentAuth();
  const schoolPath = school === 'eugenia' ? '/eugenia-school' : '/albert-school';
  
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  
  // États pour la liste des associations
  const [allAssociations, setAllAssociations] = useState([]);
  const [filteredAssociations, setFilteredAssociations] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('members'); // 'members', 'name', 'recent'
  const [loadingAssociations, setLoadingAssociations] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];

  useEffect(() => {
    async function fetchEvents() {
      try {
        setLoading(true);
        const monthStr = String(selectedMonth + 1).padStart(2, '0');
        const yearStr = String(selectedYear);
        const data = await getAllEvents(monthStr, yearStr);
        
        // Vérifier si c'est une erreur
        if (data && data.error) {
          console.error('API error:', data.error);
          setEvents([]);
          return;
        }
        
        // S'assurer que data est un tableau
        if (Array.isArray(data)) {
          setEvents(data);
        } else if (data && Array.isArray(data.events)) {
          setEvents(data.events);
        } else if (data && Array.isArray(data.data)) {
          setEvents(data.data);
        } else {
          console.warn('getAllEvents returned non-array data:', data);
          setEvents([]);
        }
      } catch (error) {
        console.error('Error fetching events:', error);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();
  }, [selectedMonth, selectedYear]);

  // Charger toutes les associations
  useEffect(() => {
    async function fetchAllAssociations() {
      try {
        setLoadingAssociations(true);
        const data = await getAllAssociations();
        const associations = Array.isArray(data) ? data : (data?.associations || []);
        setAllAssociations(associations);
      } catch (error) {
        console.error('Error fetching associations:', error);
        setAllAssociations([]);
      } finally {
        setLoadingAssociations(false);
      }
    }
    fetchAllAssociations();
  }, []);

  // Filtrer et trier les associations
  useEffect(() => {
    let filtered = [...allAssociations];

    // Filtre par recherche
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(asso => 
        asso.name?.toLowerCase().includes(query) ||
        asso.description?.toLowerCase().includes(query) ||
        asso.category?.toLowerCase().includes(query)
      );
    }

    // Filtre par catégorie
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(asso => asso.category === selectedCategory);
    }

    // Tri
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'members':
          return (b.membersCount || 0) - (a.membersCount || 0);
        case 'name':
          return (a.name || '').localeCompare(b.name || '');
        case 'recent':
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        default:
          return 0;
      }
    });

    setFilteredAssociations(filtered);
  }, [allAssociations, searchQuery, selectedCategory, sortBy]);

  // Récupérer les catégories uniques
  const categories = ['all', ...new Set(allAssociations.map(a => a.category).filter(Boolean))];

  const handlePreviousMonth = () => {
    if (selectedMonth === 0) {
      setSelectedMonth(11);
      setSelectedYear(selectedYear - 1);
    } else {
      setSelectedMonth(selectedMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (selectedMonth === 11) {
      setSelectedMonth(0);
      setSelectedYear(selectedYear + 1);
    } else {
      setSelectedMonth(selectedMonth + 1);
    }
  };

  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month, year) => {
    return new Date(year, month, 1).getDay();
  };

  const getEventsForDay = (day) => {
    if (!Array.isArray(events)) {
      return [];
    }
    return events.filter(event => {
      if (!event || !event.date) return false;
      const eventDate = new Date(event.date);
      return eventDate.getDate() === day && 
             eventDate.getMonth() === selectedMonth && 
             eventDate.getFullYear() === selectedYear;
    });
  };

  const daysInMonth = getDaysInMonth(selectedMonth, selectedYear);
  const firstDay = getFirstDayOfMonth(selectedMonth, selectedYear);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptyDays = Array.from({ length: firstDay === 0 ? 6 : firstDay - 1 }, (_, i) => i);

  return (
    <PageLayout school={school}>
      <div className="min-h-screen bg-gray-50">
      
      {/* Hero Section */}
      <section className="student-hero-section py-12 px-4 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Associations du Campus
          </h1>
          <p className="text-xl md:text-2xl opacity-90 mb-4 max-w-3xl mx-auto">
            Découvrez les associations actives, leurs événements et rejoignez la communauté
          </p>
        </div>
      </section>

      {/* Section Top 3 Associations */}
      <TopAssociations school={school} limit={3} />

      {/* Section Liste complète des associations */}
      <section className="px-4 py-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
            <h2 className="text-3xl font-bold text-gray-900">
              Toutes les associations
            </h2>
            {student && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-6 py-3 bg-gradient-to-r from-eugenia-burgundy to-eugenia-pink text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 flex items-center gap-2"
                style={{
                  background: `linear-gradient(135deg, ${theme.primary} 0%, ${theme.secondary} 100%)`
                }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>Créer une association</span>
              </button>
            )}
          </div>

          {/* Barre de recherche et filtres */}
          <div className="bg-white rounded-xl shadow-sm p-4 mb-6 border border-gray-200">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Recherche */}
              <div className="flex-1">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Rechercher une association..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-eugenia-yellow focus:border-eugenia-yellow outline-none"
                  />
                  <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>

              {/* Filtre catégorie */}
              <div className="md:w-48">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-eugenia-yellow focus:border-eugenia-yellow outline-none"
                >
                  <option value="all">Toutes les catégories</option>
                  {categories.filter(c => c !== 'all').map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Tri */}
              <div className="md:w-48">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-eugenia-yellow focus:border-eugenia-yellow outline-none"
                >
                  <option value="members">Plus de membres</option>
                  <option value="name">Nom (A-Z)</option>
                  <option value="recent">Plus récentes</option>
                </select>
              </div>
            </div>

            {/* Résultats */}
            <div className="mt-4 text-sm text-gray-600">
              {filteredAssociations.length} association{filteredAssociations.length !== 1 ? 's' : ''} trouvée{filteredAssociations.length !== 1 ? 's' : ''}
            </div>
          </div>

          {/* Liste des associations */}
          {loadingAssociations ? (
            <div className="text-center py-12">
              <svg className="animate-spin h-12 w-12 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <div className="text-gray-500">Chargement des associations...</div>
            </div>
          ) : filteredAssociations.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-200">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Aucune association trouvée</h3>
              <p className="text-gray-600">
                {searchQuery || selectedCategory !== 'all' 
                  ? 'Essayez de modifier vos critères de recherche'
                  : 'Aucune association disponible pour le moment'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredAssociations.map(asso => (
                <Link
                  key={asso.id}
                  to={`${schoolPath}/associations/${asso.id}`}
                  className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 hover:border-eugenia-pink group"
                >
                  <div className="p-6">
                    {/* Emoji */}
                    <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-full flex items-center justify-center text-4xl shadow-inner group-hover:scale-110 transition-transform duration-300">
                      {asso.emoji || '🤝'}
                    </div>

                    {/* Nom */}
                    <h3 className="text-xl font-bold text-gray-900 mb-2 text-center group-hover:text-eugenia-burgundy transition-colors">
                      {asso.name}
                    </h3>

                    {/* Description */}
                    {asso.description && (
                      <p className="text-sm text-gray-600 mb-4 text-center line-clamp-2 min-h-[2.5rem]">
                        {asso.description}
                      </p>
                    )}

                    {/* Catégorie */}
                    {asso.category && (
                      <div className="flex justify-center mb-4">
                        <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-semibold">
                          {asso.category}
                        </span>
                      </div>
                    )}

                    {/* Stats */}
                    <div className="flex items-center justify-center gap-4 pt-4 border-t border-gray-100">
                      <div className="text-center">
                        <div className="text-lg font-bold" style={{ color: theme.primary }}>
                          {asso.membersCount || 0}
                        </div>
                        <div className="text-xs text-gray-500">Membres</div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Calendrier des événements */}
      <section className="px-4 py-8 bg-white -mt-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center flex items-center justify-center gap-3">
            <svg className="w-8 h-8 text-eugenia-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Calendrier des événements
          </h2>
          
          {/* Navigation mois */}
          <div className="flex justify-center items-center gap-4 mb-6">
            <button
              onClick={handlePreviousMonth}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              aria-label="Mois précédent"
            >
              ←
            </button>
            <div className="bg-eugenia-yellow text-eugenia-black px-6 py-2 rounded-full font-semibold shadow-md min-w-[200px] text-center">
              {months[selectedMonth]} {selectedYear}
            </div>
            <button
              onClick={handleNextMonth}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              aria-label="Mois suivant"
            >
              →
            </button>
          </div>

          {/* Légende */}
          {Array.isArray(events) && events.length > 0 && (
            <div className="mb-6 flex flex-wrap justify-center gap-4">
              <div className="text-sm text-gray-600 font-semibold">Légende :</div>
              {[...new Set(events.map(e => e.associationName))].slice(0, 5).map(assoName => {
                const event = events.find(e => e.associationName === assoName);
                return (
                  <div key={assoName} className="flex items-center gap-2 text-sm">
                    <span className="text-xl">{event?.associationEmoji}</span>
                    <span className="text-gray-700">{assoName}</span>
                  </div>
                );
              })}
            </div>
          )}

          {/* Calendrier */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="grid grid-cols-7 gap-2 mb-4 border-b border-gray-100 pb-4">
              {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map(day => (
                <div key={day} className="text-center font-bold text-gray-400 text-sm uppercase tracking-wider">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-2">
              {/* Jours vides au début */}
              {emptyDays.map((_, index) => (
                <div key={`empty-${index}`} className="min-h-[100px]"></div>
              ))}
              
              {/* Jours du mois */}
              {days.map(day => {
                const dayEvents = getEventsForDay(day);
                const isToday = day === new Date().getDate() && 
                               selectedMonth === new Date().getMonth() && 
                               selectedYear === new Date().getFullYear();
                
                return (
                  <div
                    key={day}
                    className={`
                      min-h-[100px] p-2 border rounded-xl transition-all cursor-pointer
                      ${dayEvents.length > 0 
                        ? 'bg-gray-50 hover:bg-gray-100 ring-1 ring-gray-200' 
                        : 'bg-white border-gray-100'
                      }
                      ${isToday ? 'ring-2 ring-eugenia-yellow' : ''}
                    `}
                    onClick={() => dayEvents.length > 0 && setSelectedEvent({ day, events: dayEvents })}
                  >
                    <div className={`
                      text-sm font-bold mb-2
                      ${dayEvents.length > 0 ? 'text-eugenia-burgundy' : 'text-gray-400'}
                      ${isToday ? 'text-eugenia-yellow' : ''}
                    `}>
                      {day}
                    </div>
                    <div className="space-y-1">
                      {dayEvents.slice(0, 2).map(event => (
                        <div
                          key={event.id}
                          className="text-xs bg-white border border-gray-200 text-gray-700 p-1.5 rounded-lg shadow-sm hover:border-eugenia-pink hover:text-eugenia-pink transition-colors truncate"
                          title={`${event.associationEmoji} ${event.title} - ${event.time || ''}`}
                        >
                          {event.associationEmoji} {event.title}
                        </div>
                      ))}
                      {dayEvents.length > 2 && (
                        <div className="text-xs text-gray-500 font-semibold">
                          +{dayEvents.length - 2} autre(s)
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {loading && (
            <div className="text-center py-8 text-gray-500">
              Chargement des événements...
            </div>
          )}

        </div>
      </section>

      {/* Liste des événements du mois */}
      {Array.isArray(events) && events.length > 0 && (
        <section className="px-4 py-8 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
              Événements de {months[selectedMonth]} {selectedYear}
            </h2>
            <div className="space-y-4">
              {events.map(event => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Section Postuler */}
      <section className="px-4 py-8 bg-white -mt-4">
        <div className="max-w-7xl mx-auto">
          <AssociationApplicationForm school={school} />
        </div>
      </section>

      {/* Modal création d'association */}
      {showCreateModal && (
        <div 
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setShowCreateModal(false)}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <CreateAssociationForm
              school={school}
              onSuccess={(associationId) => {
                setShowCreateModal(false);
                // Recharger les associations
                window.location.reload();
                // Optionnel : rediriger vers la page de gestion
                // navigate(`${schoolPath}/associations/${associationId}/manage`);
              }}
              onClose={() => setShowCreateModal(false)}
            />
          </div>
        </div>
      )}

      {/* Modal événement */}
      {selectedEvent && (
        <div 
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedEvent(null)}
        >
          <div 
            className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-2xl font-bold text-gray-900">
                Événements du {selectedEvent.day} {months[selectedMonth]} {selectedYear}
              </h3>
              <button
                onClick={() => setSelectedEvent(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-4">
              {selectedEvent.events.map(event => (
                <div key={event.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start gap-4">
                    <div className="text-3xl">{event.associationEmoji}</div>
                    <div className="flex-1">
                      <h4 className="font-bold text-lg text-gray-900 mb-2">{event.title}</h4>
                      <p className="text-gray-600 mb-3">{event.description}</p>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span>{event.date}</span>
                        </div>
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
                        <div className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                          <span>{event.associationName}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      </div>
    </PageLayout>
  );
}

function EventCard({ event }) {
  const months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
  const eventDate = new Date(event.date);
  
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col md:flex-row items-center gap-6">
      <div className="w-16 h-16 rounded-xl bg-eugenia-yellow/10 flex items-center justify-center text-3xl flex-shrink-0">
        {event.associationEmoji || '📅'}
      </div>
      
      <div className="flex-1 text-center md:text-left">
        <div className="flex flex-col md:flex-row md:items-center gap-2 mb-2">
          <h3 className="text-lg font-bold text-gray-900">{event.title}</h3>
          <span className="inline-block px-2 py-1 bg-gray-100 rounded text-xs text-gray-500 font-medium">
            {event.associationName}
          </span>
        </div>
        
        {event.description && (
          <p className="text-gray-600 text-sm mb-3">{event.description}</p>
        )}
        
        <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {eventDate.getDate()} {months[eventDate.getMonth()]} {eventDate.getFullYear()}
          </div>
          {event.time && (
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {event.time}
            </div>
          )}
          {event.location && (
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {event.location}
            </div>
          )}
        </div>
      </div>
      
      <button className="btn btn-primary px-6 py-2 text-sm whitespace-nowrap">
        Participer
      </button>
    </div>
  );
}
