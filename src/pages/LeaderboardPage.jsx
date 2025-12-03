import Leaderboard from '../components/student/Leaderboard';
import PageLayout from '../components/shared/PageLayout';

export default function LeaderboardPage({ school = 'eugenia' }) {
  return (
    <PageLayout school={school}>
      <div className="min-h-screen bg-gray-50">
      
      {/* Hero Section */}
      <section className="student-hero-section py-20 px-4 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            📊 Classement Général
          </h1>
          <p className="text-xl md:text-2xl opacity-90 mb-8 max-w-3xl mx-auto">
            Suivez les performances des étudiants et des classes en temps réel
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 -mt-10 pb-20 relative z-10">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden min-h-[500px]">
           <Leaderboard />
        </div>
      </div>
      </div>
    </PageLayout>
  );
}

