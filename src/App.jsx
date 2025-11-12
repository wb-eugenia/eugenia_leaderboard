import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LeaderboardPage from './pages/LeaderboardPage';
import SubmitActionPage from './pages/SubmitActionPage';
import AdminPage from './pages/AdminPage';
import AdminDashboard from './pages/AdminDashboard';
import AdminGuide from './pages/AdminGuide';
import AdminLogin from './components/admin/AdminLogin';
import AdminAuth from './components/admin/AdminAuth';
import ValidationQueue from './components/admin/ValidationQueue';
import ActionTypeEditor from './components/admin/ActionTypeEditor';
import LeaderboardConfig from './components/admin/LeaderboardConfig';
import AutomationConfig from './components/admin/AutomationConfig';
import RewardsConfig from './components/admin/RewardsConfig';
import LandingTextsConfig from './components/admin/LandingTextsConfig';
import LandingConfig from './components/admin/LandingConfig';
import Analytics from './pages/Analytics';
import GoogleOAuthCallback from './pages/GoogleOAuthCallback';
import GoogleSheetsSetup from './pages/GoogleSheetsSetup';

function App() {
  return (
    <Router>
      <Routes>
        {/* Routes publiques */}
        <Route path="/" element={<HomePage />} />
        <Route path="/leaderboard" element={<LeaderboardPage />} />
        <Route path="/submit" element={<SubmitActionPage />} />
        <Route path="/google-oauth/callback" element={<GoogleOAuthCallback />} />
        
        {/* Login admin */}
        <Route path="/admin/login" element={<AdminLogin />} />
        
        {/* Routes admin protégées */}
        <Route path="/admin" element={<AdminAuth><AdminPage /></AdminAuth>}>
          <Route index element={<AdminDashboard />} />
          <Route path="validate" element={<ValidationQueue />} />
          <Route path="actions" element={<ActionTypeEditor />} />
          <Route path="leaderboard" element={<LeaderboardConfig />} />
          <Route path="automations" element={<AutomationConfig />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="google-sheets" element={<GoogleSheetsSetup />} />
          <Route path="rewards" element={<LandingConfig />} />
          <Route path="texts" element={<LandingConfig />} />
        </Route>
        
        {/* Route guide admin protégée */}
        <Route path="/admin/guide" element={<AdminAuth><AdminGuide /></AdminAuth>} />
      </Routes>
    </Router>
  );
}

export default App;

