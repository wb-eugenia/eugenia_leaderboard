import Leaderboard from '../components/student/Leaderboard';
import Header from '../components/shared/Header';
import Footer from '../components/shared/Footer';

export default function LeaderboardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-eugenia-burgundy via-eugenia-pink to-eugenia-burgundy">
      <Header />
      <div className="py-12 px-4">
        <Leaderboard />
      </div>
      <Footer />
    </div>
  );
}

