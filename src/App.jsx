import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import Layout from './components/Layout';
import DashboardPage from './pages/DashboardPage';
import UsersPage from './pages/UsersPage';
import LiveMapPage from './pages/LiveMapPage';
import VehiclesPage from './pages/VehiclesPage';
import AnalyticsPage from './pages/AnalyticsPage';
import DevicesPage from './pages/DevicesPage';
import AlertsPage from './pages/AlertsPage';
import MaintenancePage from './pages/MaintenancePage';
import ReportsPage from './pages/ReportsPage';
import PlaybackPage from './pages/PlaybackPage';
import GeofencesPage from './pages/GeofencesPage';
import SettingsPage from './pages/SettingsPage';
import ClientsPage from './pages/ClientsPage';
import TransportersPage from './pages/TransportersPage';
import TechniciansPage from './pages/TechniciansPage';
import CompliancePage from './pages/CompliancePage';
import DistanceReportPage from './pages/DistanceReportPage';
import FuelPricePage from './pages/FuelPricePage';
import AnnouncementsPage from './pages/AnnouncementsPage';
import SupportPage from './pages/SupportPage';
import ComingSoonPage from './pages/ComingSoonPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Dashboard Routes wrapped in Layout */}
        <Route path="/" element={<Layout />}>
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="live-map" element={<LiveMapPage />} />
          <Route path="vehicles" element={<VehiclesPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="devices" element={<DevicesPage />} />
          <Route path="alerts" element={<AlertsPage />} />
          <Route path="maintenance" element={<MaintenancePage />} />

          {/* Main Modules */}
          <Route path="clients" element={<ClientsPage />} />
          <Route path="transporters" element={<TransportersPage />} />
          <Route path="technicians" element={<TechniciansPage />} />
          <Route path="geofences" element={<GeofencesPage />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="playback" element={<PlaybackPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="checks" element={<CompliancePage />} />

          {/* New Page Routes */}
          <Route path="distance-report" element={<DistanceReportPage />} />
          <Route path="fuel-price" element={<FuelPricePage />} />
          <Route path="announcements" element={<AnnouncementsPage />} />
          <Route path="support" element={<SupportPage />} />

          {/* Core App Contexts/Tools */}
          <Route path="transporters" element={<TransportersPage />} />
          <Route path="clients" element={<ClientsPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
