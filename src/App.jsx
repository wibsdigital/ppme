import { useEffect } from 'react';
import apiStore from './store/apiStore';
import AppLayout from './components/Layout/AppLayout';
import LoginPage from './pages/LoginPage';
import TestAuthPage from './pages/TestAuthPage';
import InitDbPage from './pages/InitDbPage';
import DashboardPage from './pages/DashboardPage';
import MembersPage from './pages/MembersPage';
import PaymentsPage from './pages/PaymentsPage';
import ImportExportPage from './pages/ImportExportPage';
import SettingsPage from './pages/SettingsPage';

const PAGES = {
  initdb:       InitDbPage,
  testauth:      TestAuthPage,
  dashboard:    DashboardPage,
  members:      MembersPage,
  payments:     PaymentsPage,
  importexport: ImportExportPage,
  settings:     SettingsPage,
};

export default function App() {
  const isAuthenticated = apiStore(s => s.isAuthenticated);
  const currentPage     = apiStore(s => s.currentPage);
  const fetchMembers    = apiStore(s => s.fetchMembers);
  const fetchPayments   = apiStore(s => s.fetchPayments);

  // Fetch data when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchMembers();
      fetchPayments();
    }
  }, [isAuthenticated, fetchMembers, fetchPayments]);

  if (!isAuthenticated) return <LoginPage />;

  const PageComponent = PAGES[currentPage] || DashboardPage;

  return (
    <AppLayout>
      <PageComponent />
    </AppLayout>
  );
}
