import { useNavigate } from 'react-router-dom';
import SalesHeader from '../components/shared/SalesHeader';
import SalesFooter from '../components/shared/SalesFooter';
import EugeniaLogo from '../components/shared/EugeniaLogo';
import AlbertLogo from '../components/shared/AlbertLogo';

export default function SelectSchoolPage() {
  const navigate = useNavigate();

  const schools = [
    {
      id: 'eugenia',
      name: 'Eugenia School',
      description: 'Rejoignez la communauté Eugenia et découvrez les talents, portfolios et initiatives de vos camarades.',
      logo: <EugeniaLogo />,
      colors: 'from-[#671324] via-[#E33054] to-[#671324]',
      loginPath: '/eugenia-school/login'
    },
    {
      id: 'albert',
      name: 'Albert School',
      description: 'Explorez la vie étudiante Albert, participez aux programmes et valorisez vos réalisations.',
      logo: <AlbertLogo />,
      colors: 'from-[#1E40AF] via-[#3B82F6] to-[#1E40AF]',
      loginPath: '/albert-school/login'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <SalesHeader />
      
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Choisissez votre école
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Sélectionnez votre établissement pour accéder à votre espace communautaire
            </p>
          </div>

          {/* Schools Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {schools.map((school) => (
              <div
                key={school.id}
                onClick={() => navigate(school.loginPath)}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all cursor-pointer transform hover:scale-105 border-2 border-transparent hover:border-gray-200"
              >
                {/* Logo Section */}
                <div className={`bg-gradient-to-br ${school.colors} rounded-xl p-8 mb-6 flex items-center justify-center`}>
                  <div className="text-white">
                    {school.logo}
                  </div>
                </div>

                {/* School Info */}
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  {school.name}
                </h2>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {school.description}
                </p>

                {/* CTA Button */}
                <button className="w-full px-6 py-3 bg-gray-900 text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors">
                  Se connecter
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SalesFooter />
    </div>
  );
}

