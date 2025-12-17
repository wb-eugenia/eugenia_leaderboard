import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PageLayout from '../components/shared/PageLayout';
import TopAssociations from '../components/student/TopAssociations';
import AssociationApplicationForm from '../components/student/AssociationApplicationForm';
import { getAllAssociations, getAllEvents } from '../services/associationsApi';

export default function AssociationsPage({ school = 'eugenia' }) {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);

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
            🎪 Associations du Campus
          </h1>
          <p className="text-xl md:text-2xl opacity-90 mb-4 max-w-3xl mx-auto">
            Découvrez les associations actives, leurs événements et rejoignez la communauté
          </p>
        </div>
      </section>

      {/* Section Top 3 Associations */}
      <TopAssociations school={school} limit={3} />

      {/* Calendrier des événements */}
      <section className="px-4 py-8 bg-white -mt-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center flex items-center justify-center gap-3">
            <span className="text-eugenia-yellow">📅</span> Calendrier des événements
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

          {!loading && (!Array.isArray(events) || events.length === 0) && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center mt-8">
              <div className="text-6xl mb-4">📅</div>
              <p className="text-xl text-gray-500">
                Aucun événement prévu ce mois-ci
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Liste des événements du mois */}
      {Array.isArray(events) && events.length > 0 && (
        <section className="px-4 py-8 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
              📋 Événements de {months[selectedMonth]} {selectedYear}
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
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ✕
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
                          <span>📅</span>
                          <span>{event.date}</span>
                        </div>
                        {event.time && (
                          <div className="flex items-center gap-1">
                            <span>🕐</span>
                            <span>{event.time}</span>
                          </div>
                        )}
                        {event.location && (
                          <div className="flex items-center gap-1">
                            <span>📍</span>
                            <span>{event.location}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <span>🏢</span>
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
            📅 {eventDate.getDate()} {months[eventDate.getMonth()]} {eventDate.getFullYear()}
          </div>
          {event.time && (
            <div className="flex items-center gap-1">
              🕐 {event.time}
            </div>
          )}
          {event.location && (
            <div className="flex items-center gap-1">
              📍 {event.location}
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
