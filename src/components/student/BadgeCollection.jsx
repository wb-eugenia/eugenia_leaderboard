import { useState } from 'react';
import { getBadgeInfo, getAllBadges } from '../../services/gamificationService';

export default function BadgeCollection({ earnedBadges = [], showLocked = true, compact = false }) {
  const [hoveredBadge, setHoveredBadge] = useState(null);
  const allBadges = getAllBadges();
  const earnedBadgeIds = Array.isArray(earnedBadges) ? earnedBadges : [];

  if (compact) {
    return (
      <div className="flex flex-wrap gap-2">
        {earnedBadgeIds.slice(0, 5).map(badgeId => {
          const badge = getBadgeInfo(badgeId);
          return (
            <div
              key={badgeId}
              className="relative group"
              onMouseEnter={() => setHoveredBadge(badgeId)}
              onMouseLeave={() => setHoveredBadge(null)}
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-lg shadow-md transition-transform hover:scale-110"
                style={{ backgroundColor: badge.color + '20', border: `2px solid ${badge.color}` }}
                title={badge.name}
              >
                {badge.icon}
              </div>
              {hoveredBadge === badgeId && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg whitespace-nowrap z-10">
                  <div className="font-semibold">{badge.name}</div>
                  <div className="text-gray-300">{badge.description}</div>
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                </div>
              )}
            </div>
          );
        })}
        {earnedBadgeIds.length > 5 && (
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-xs font-semibold text-gray-600">
            +{earnedBadgeIds.length - 5}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="w-full">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Badges</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {allBadges.map(badgeId => {
          const badge = getBadgeInfo(badgeId);
          const isEarned = earnedBadgeIds.includes(badgeId);
          
          return (
            <div
              key={badgeId}
              className={`relative group cursor-pointer transition-all ${
                isEarned ? 'opacity-100' : 'opacity-40'
              }`}
              onMouseEnter={() => setHoveredBadge(badgeId)}
              onMouseLeave={() => setHoveredBadge(null)}
            >
              <div
                className={`w-full aspect-square rounded-xl flex flex-col items-center justify-center p-3 shadow-md transition-transform ${
                  isEarned 
                    ? 'hover:scale-110 hover:shadow-lg' 
                    : 'grayscale'
                }`}
                style={{
                  backgroundColor: isEarned ? badge.color + '20' : '#F3F4F6',
                  border: `2px solid ${isEarned ? badge.color : '#D1D5DB'}`,
                }}
              >
                <div className="text-3xl mb-2">{badge.icon}</div>
                <div className={`text-xs font-semibold text-center ${isEarned ? 'text-gray-900' : 'text-gray-400'}`}>
                  {badge.name}
                </div>
                {!isEarned && showLocked && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                )}
              </div>

              {/* Tooltip */}
              {hoveredBadge === badgeId && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg whitespace-nowrap z-10">
                  <div className="font-semibold">{badge.name}</div>
                  <div className="text-gray-300">{badge.description}</div>
                  {!isEarned && (
                    <div className="text-yellow-400 mt-1">Verrouillé</div>
                  )}
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Statistiques */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Badges obtenus</span>
          <span className="text-lg font-bold" style={{ color: getBadgeInfo('champion').color }}>
            {earnedBadgeIds.length} / {allBadges.length}
          </span>
        </div>
        <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${(earnedBadgeIds.length / allBadges.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}

