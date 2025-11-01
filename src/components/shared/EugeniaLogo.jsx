import React from 'react';

/**
 * Logo Eugenia School
 * Cercle doré avec cercle burgundy qui se chevauche, suivi du texte EUGENIASCHOOL
 */
export default function EugeniaLogo({ className = "" }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Emblem: Two overlapping circles */}
      <div className="relative flex items-center">
        {/* Large yellow circle */}
        <div 
          className="rounded-full"
          style={{
            width: '48px',
            height: '48px',
            backgroundColor: '#DBA12D'
          }}
        />
        {/* Small white circle overlapping */}
        <div 
          className="absolute rounded-full"
          style={{
            width: '28px',
            height: '28px',
            backgroundColor: '#FFFFFF',
            left: '-8px',
            top: '8px'
          }}
        />
      </div>
      
      {/* Text EUGENIASCHOOL */}
      <span 
        className="text-2xl font-bold tracking-wide text-white"
      >
        EUGENIASCHOOL
      </span>
    </div>
  );
}

