import { createContext, useContext, useState, useEffect } from 'react';

const StudentAuthContext = createContext(null);

export function StudentAuthProvider({ children }) {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Vérifier si l'étudiant est déjà connecté
    const savedStudent = localStorage.getItem('student_auth');
    if (savedStudent) {
      try {
        setStudent(JSON.parse(savedStudent));
      } catch (e) {
        localStorage.removeItem('student_auth');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password, school = 'eugenia') => {
    try {
      const emailLower = email.toLowerCase();
      
      // Vérifier l'email selon l'école
      const emailDomain = school === 'eugenia' ? '@eugeniaschool.com' : '@albertschool.com';
      if (!emailLower.includes(emailDomain)) {
        throw new Error(`Email doit être ${emailDomain}`);
      }

      // Pour l'instant, vérification simple (mdp par défaut: 1234)
      // TODO: Remplacer par un appel API réel
      if (password === '1234') {
        const API_URL = import.meta.env.VITE_API_URL;
        let studentData = null;

        // Si l'email commence par "admin", rediriger vers le dashboard admin
        const isAdminEmail = emailLower.startsWith('admin');
        
        if (isAdminEmail) {
          // Sauvegarder la session admin
          sessionStorage.setItem('admin_authenticated', 'true');
          sessionStorage.setItem('admin_email', emailLower);
          sessionStorage.setItem('admin_school', school);
          
          // Retourner une indication de redirection admin
          return { 
            success: false, 
            error: 'ADMIN_REDIRECT',
            adminSchool: school,
            redirectPath: `/${school}-school/admin`
          };
        } else {
          // Pour les autres emails, créer un profil étudiant par défaut
          // On ne vérifie plus si l'email existe dans la base de données
          const emailParts = emailLower.split('@')[0].split('.');
          const firstName = emailParts[0] || 'etudiant';
          const lastName = emailParts[1] || (school === 'eugenia' ? 'eugenia' : 'albert');
          
          studentData = {
            firstName: firstName.charAt(0).toUpperCase() + firstName.slice(1),
            lastName: lastName.charAt(0).toUpperCase() + lastName.slice(1),
            email: emailLower,
            classe: 'B1',
            totalPoints: 0,
            actionsCount: 0,
            lastUpdate: new Date().toISOString()
          };
          
          // Optionnel : essayer de récupérer les données depuis le leaderboard si disponible
          if (API_URL) {
            try {
              const response = await fetch(`${API_URL}/leaderboard`);
              const leaderboard = await response.json();
              const existingStudent = leaderboard.find(s => s.email === emailLower);
              
              if (existingStudent) {
                // Si l'étudiant existe dans le leaderboard, utiliser ses données
                studentData = {
                  firstName: existingStudent.firstName || existingStudent.first_name || studentData.firstName,
                  lastName: existingStudent.lastName || existingStudent.last_name || studentData.lastName,
                  email: emailLower,
                  classe: existingStudent.classe || studentData.classe,
                  totalPoints: existingStudent.totalPoints || existingStudent.total_points || 0,
                  actionsCount: existingStudent.actionsCount || existingStudent.actions_count || 0,
                  lastUpdate: existingStudent.lastUpdate || existingStudent.last_update || studentData.lastUpdate
                };
              }
            } catch (error) {
              // Si l'API échoue, on continue avec les données par défaut
              console.log('Could not fetch leaderboard, using default student data');
            }
          }
        }

        // Générer le slug à partir du nom (prenom-nom)
        const firstName = studentData.firstName?.toLowerCase().replace(/\s+/g, '-') || 'etudiant';
        const lastName = studentData.lastName?.toLowerCase().replace(/\s+/g, '-') || (school === 'eugenia' ? 'eugenia' : 'albert');
        const slug = `${firstName}-${lastName}`;
        studentData.slug = slug;
        studentData.school = school; // Ajouter l'école

        setStudent(studentData);
        localStorage.setItem('student_auth', JSON.stringify(studentData));
        return { success: true };
      } else {
        throw new Error('Mot de passe incorrect');
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    setStudent(null);
    localStorage.removeItem('student_auth');
  };

  const updateStudent = (updates) => {
    const updated = { ...student, ...updates };
    setStudent(updated);
    localStorage.setItem('student_auth', JSON.stringify(updated));
  };

  return (
    <StudentAuthContext.Provider value={{ student, login, logout, updateStudent, loading }}>
      {children}
    </StudentAuthContext.Provider>
  );
}

export function useStudentAuth() {
  const context = useContext(StudentAuthContext);
  if (!context) {
    throw new Error('useStudentAuth must be used within StudentAuthProvider');
  }
  return context;
}

