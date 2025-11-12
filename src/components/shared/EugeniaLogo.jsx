import React from 'react';

/**
 * Logo Eugenia School
 * Cercle doré avec cercle burgundy qui se chevauche, suivi du texte EUGENIASCHOOL
 */
export default function EugeniaLogo({ className = "" }) {
  return (
    <div className={`flex items-center gap-2 md:gap-3 ${className}`}>
      {/* Emblem: Two overlapping circles */}
      <div className="relative flex items-center">
        {/* Large yellow circle */}
        <div 
          className="w-10 h-10 md:w-12 md:h-12 rounded-full"
          style={{
            backgroundColor: '#DBA12D'
          }}
        />
        {/* Small white circle overlapping */}
        <div 
          className="w-6 h-6 md:w-7 md:h-7 absolute rounded-full bg-white -left-1.5 top-1.5 md:-left-2 md:top-2"
        />
      </div>
      
      {/* Text EUGENIASCHOOL */}
      <span 
        className="text-xl md:text-2xl font-bold tracking-wide text-white"
      >
        EUGENIASCHOOL
      </span>
    </div>
  );
}

