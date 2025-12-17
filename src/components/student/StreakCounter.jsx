import { useEffect, useState } from 'react';

export default function StreakCounter({ currentStreak = 0, longestStreak = 0, animated = true }) {
  const [displayStreak, setDisplayStreak] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (animated && currentStreak > 0) {
      setIsAnimating(true);
      // Animation du compteur
      const duration = 800;
      const steps = 30;
      const increment = currentStreak / steps;
      let current = 0;
      
      const timer = setInterval(() => {
        current += increment;
        if (current >= currentStreak) {
          setDisplayStreak(currentStreak);
          setIsAnimating(false);
          clearInterval(timer);
        } else {
          setDisplayStreak(Math.floor(current));
        }
      }, duration / steps);

      return () => clearInterval(timer);
    } else {
      setDisplayStreak(currentStreak);
    }
  }, [currentStreak, animated]);

  const isActive = currentStreak > 0;
  const isMilestone7 = currentStreak >= 7;
  const isMilestone30 = currentStreak >= 30;
  const nextMilestone = currentStreak < 7 ? 7 : currentStreak < 30 ? 30 : null;

  return (
    <div className="w-full">
      <div className={`relative p-6 rounded-xl border-2 transition-all ${
        isActive 
          ? 'bg-gradient-to-br from-orange-50 to-red-50 border-orange-300 shadow-lg' 
          : 'bg-gray-50 border-gray-200'
      }`}>
        {/* Icône feu */}
        <div className="flex items-center justify-center mb-4">
          <div className={`relative ${isActive ? 'animate-pulse' : ''}`}>
            <svg 
              className={`w-16 h-16 ${isActive ? 'text-orange-500' : 'text-gray-400'}`}
              fill="currentColor" 
              viewBox="0 0 20 20"
            >
              <path 
                fillRule="evenodd" 
                d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" 
                clipRule="evenodd" 
              />
            </svg>
            {isActive && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 bg-orange-400 rounded-full blur-md opacity-75 animate-ping"></div>
              </div>
            )}
          </div>
        </div>

        {/* Compteur */}
        <div className="text-center">
          <div className={`text-4xl font-bold mb-1 ${isActive ? 'text-orange-600' : 'text-gray-400'}`}>
            {displayStreak}
          </div>
          <div className="text-sm text-gray-600 mb-4">
            {isActive ? 'jours consécutifs' : 'Aucun streak actif'}
          </div>

          {/* Meilleur streak */}
          {longestStreak > 0 && (
            <div className="text-xs text-gray-500">
              Meilleur : {longestStreak} jour{longestStreak > 1 ? 's' : ''}
            </div>
          )}
        </div>

        {/* Milestones */}
        {(isMilestone7 || isMilestone30) && (
          <div className="mt-4 pt-4 border-t border-orange-200">
            <div className="flex items-center justify-center gap-2 text-sm">
              {isMilestone7 && (
                <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full font-semibold">
                  🔥 7 jours
                </span>
              )}
              {isMilestone30 && (
                <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full font-semibold">
                  🔥🔥 30 jours
                </span>
              )}
            </div>
          </div>
        )}

        {/* Progression vers milestone */}
        {nextMilestone && currentStreak < nextMilestone && (
          <div className="mt-4">
            <div className="text-xs text-gray-600 mb-1 text-center">
              {nextMilestone - currentStreak} jour{nextMilestone - currentStreak > 1 ? 's' : ''} pour le milestone {nextMilestone}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-orange-400 to-red-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${(currentStreak / nextMilestone) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Message d'encouragement */}
        {!isActive && (
          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500">
              Soumettez une action aujourd'hui pour commencer votre streak !
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

