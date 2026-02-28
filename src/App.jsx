import useStore from './store/useStore';
import AppLayout from './components/Layout/AppLayout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import MembersPage from './pages/MembersPage';
import PaymentsPage from './pages/PaymentsPage';
import ImportExportPage from './pages/ImportExportPage';
import SettingsPage from './pages/SettingsPage';

const PAGES = {
  dashboard:    DashboardPage,
  members:      MembersPage,
  payments:     PaymentsPage,
  importexport: ImportExportPage,
  settings:     SettingsPage,
};

export default function App() {
  const isAuthenticated = useStore(s => s.isAuthenticated);
  const currentPage     = useStore(s => s.currentPage);

  if (!isAuthenticated) return <LoginPage />;

  const PageComponent = PAGES[currentPage] || DashboardPage;

  return (
    <AppLayout>
      <PageComponent />
    </AppLayout>
  );
}
