import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { getSchoolTheme } from '../utils/schoolThemes';

/**
 * Hook pour obtenir le thème de l'école active
 * @param {string} school - École forcée (optionnel)
 * @returns {object} Configuration du thème
 */
export function useSchoolTheme(school = null) {
  const location = useLocation();
  
  const activeSchool = useMemo(() => {
    if (school) return school;
    
    const path = location.pathname;
    if (path.startsWith('/eugenia-school')) return 'eugenia';
    if (path.startsWith('/albert-school')) return 'albert';
    
    return null;
  }, [location.pathname, school]);
  
  return useMemo(() => {
    return getSchoolTheme(activeSchool);
  }, [activeSchool]);
}

