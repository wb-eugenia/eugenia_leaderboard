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

function App() {
  return (
    <Router>
      <Routes>
        {/* Routes publiques */}
        <Route path="/" element={<HomePage />} />
        <Route path="/leaderboard" element={<LeaderboardPage />} />
        <Route path="/submit" element={<SubmitActionPage />} />
        
        {/* Login admin */}
        <Route path="/admin/login" element={<AdminLogin />} />
        
        {/* Routes admin protégées */}
        <Route path="/admin" element={<AdminAuth><AdminPage /></AdminAuth>}>
          <Route index element={<AdminDashboard />} />
          <Route path="validate" element={<ValidationQueue />} />
          <Route path="actions" element={<ActionTypeEditor />} />
          <Route path="leaderboard" element={<LeaderboardConfig />} />
          <Route path="automations" element={<AutomationConfig />} />
          <Route path="rewards" element={<RewardsConfig />} />
          <Route path="texts" element={<LandingTextsConfig />} />
        </Route>
        
        {/* Route guide admin protégée */}
        <Route path="/admin/guide" element={<AdminAuth><AdminGuide /></AdminAuth>} />
      </Routes>
    </Router>
  );
}

export default App;

