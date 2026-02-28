import useStore from '../../store/useStore';
import {
  LayoutDashboard, Users, CreditCard, FileUp, Settings,
  ChevronLeft, ChevronRight, LogOut
} from 'lucide-react';

const navItems = [
  { id: 'dashboard',    label: 'Dashboard',     icon: LayoutDashboard },
  { id: 'members',      label: 'Leden',         icon: Users },
  { id: 'payments',     label: 'Betalingen',    icon: CreditCard },
  { id: 'importexport', label: 'Import/Export', icon: FileUp },
  { id: 'settings',     label: 'Instellingen',  icon: Settings },
];

export default function Sidebar({ onClose }) {
  const { sidebarOpen, toggleSidebar, currentPage, setCurrentPage, logout, adminUser } = useStore();

  const handleNav = (id) => {
    setCurrentPage(id);
    onClose?.(); // close mobile drawer on navigation
  };

  return (
    <aside
      className="flex flex-col shrink-0 h-screen sticky top-0 z-40 transition-all duration-300 overflow-hidden geo-pattern"
      style={{
        width: sidebarOpen ? '240px' : '68px',
        background: 'linear-gradient(180deg, #132233 0%, #0d1b2a 100%)',
        borderRight: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      {/* Header */}
      <div
        className="flex items-center gap-3 px-4 py-5"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', minHeight: '68px' }}
      >
        <div
          className="w-9 h-9 rounded shrink-0 flex items-center justify-center"
          style={{ background: '#c8933a' }}
        >
          <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
            <polygon points="10,2 18,6 18,14 10,18 2,14 2,6" fill="white" fillOpacity="0.9"/>
            <polygon points="10,5 15,8 15,12 10,15 5,12 5,8" fill="#c8933a"/>
          </svg>
        </div>
        {sidebarOpen && (
          <div className="overflow-hidden">
            <div
              className="font-display text-white text-xs tracking-widest uppercase whitespace-nowrap"
              style={{ letterSpacing: '0.18em', fontSize: '0.7rem' }}
            >
              PPME
            </div>
            <div className="text-xs whitespace-nowrap" style={{ color: '#4a6d90', fontSize: '0.65rem' }}>
              Al Ikhlash Amsterdam
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 space-y-1 px-2 overflow-y-auto">
        {navItems.map(({ id, label, icon: Icon }) => {
          const active = currentPage === id;
          return (
            <button
              key={id}
              onClick={() => handleNav(id)}
              title={!sidebarOpen ? label : undefined}
              className="flex items-center gap-3 w-full rounded transition-all duration-150 relative group"
              style={{
                padding: sidebarOpen ? '10px 12px' : '10px',
                justifyContent: sidebarOpen ? 'flex-start' : 'center',
                background: active ? 'rgba(200,147,58,0.15)' : 'transparent',
                color: active ? '#c8933a' : '#7094b3',
                border: 'none',
                cursor: 'pointer',
              }}
              onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
              onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent'; }}
            >
              {active && (
                <span
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full"
                  style={{ background: '#c8933a' }}
                />
              )}
              <Icon size={17} strokeWidth={active ? 2.5 : 1.8} />
              {sidebarOpen && (
                <span className="text-sm font-medium whitespace-nowrap" style={{ color: active ? '#c8933a' : '#a5bfd4' }}>
                  {label}
                </span>
              )}
              {/* Tooltip when collapsed (desktop only) */}
              {!sidebarOpen && (
                <span
                  className="absolute left-full ml-3 px-2 py-1 rounded text-xs whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity hidden lg:block"
                  style={{ background: '#0d1b2a', color: 'white', border: '1px solid rgba(255,255,255,0.1)', zIndex: 50 }}
                >
                  {label}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* User + collapse toggle */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        {sidebarOpen && adminUser && (
          <div className="px-4 py-3 flex items-center gap-3">
            <div
              className="w-7 h-7 rounded-full shrink-0 flex items-center justify-center text-xs font-bold"
              style={{ background: '#c8933a', color: 'white' }}
            >
              {adminUser.name[0]}
            </div>
            <div className="overflow-hidden flex-1">
              <div className="text-xs font-medium text-white truncate">{adminUser.name}</div>
              <div className="text-xs truncate" style={{ color: '#4a6d90' }}>{adminUser.role}</div>
            </div>
            <button
              onClick={logout}
              title="Uitloggen"
              className="p-1 rounded transition-colors"
              style={{ color: '#4a6d90', background: 'transparent', border: 'none', cursor: 'pointer' }}
              onMouseEnter={e => { e.currentTarget.style.color = '#f4a0a0'; }}
              onMouseLeave={e => { e.currentTarget.style.color = '#4a6d90'; }}
            >
              <LogOut size={15} />
            </button>
          </div>
        )}
        {/* Hide collapse toggle on mobile — sidebar closes via backdrop */}
        <button
          onClick={toggleSidebar}
          className="hidden lg:flex items-center justify-center w-full py-3 transition-colors"
          style={{ color: '#4a6d90', background: 'transparent', border: 'none', cursor: 'pointer' }}
          onMouseEnter={e => e.currentTarget.style.color = '#7094b3'}
          onMouseLeave={e => e.currentTarget.style.color = '#4a6d90'}
        >
          {sidebarOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
        </button>
      </div>
    </aside>
  );
}
