import React from 'react';

/**
 * Logo Albert School
 * Cercle bleu avec cercle blanc qui se chevauche, suivi du texte ALBERTSCHOOL
 */
export default function AlbertLogo({ className = "" }) {
  return (
    <div className={`flex items-center gap-2 md:gap-3 ${className}`}>
      {/* Emblem: Two overlapping circles */}
      <div className="relative flex items-center">
        {/* Large blue circle */}
        <div 
          className="w-10 h-10 md:w-12 md:h-12 rounded-full"
          style={{
            backgroundColor: '#1E40AF'
          }}
        />
        {/* Small white circle overlapping */}
        <div 
          className="w-6 h-6 md:w-7 md:h-7 absolute rounded-full bg-white -left-1.5 top-1.5 md:-left-2 md:top-2"
        />
      </div>
      
      {/* Text ALBERTSCHOOL */}
      <span 
        className="text-xl md:text-2xl font-bold tracking-wide text-white"
      >
        ALBERTSCHOOL
      </span>
    </div>
  );
}

