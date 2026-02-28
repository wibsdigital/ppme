import { Bell, Search, Menu } from 'lucide-react';
import useStore from '../../store/useStore';

const PAGE_TITLES = {
  dashboard:    { title: 'Dashboard',     sub: 'Overzicht van leden en betalingen' },
  members:      { title: 'Leden',         sub: 'Beheer van alle leden' },
  payments:     { title: 'Betalingen',    sub: 'Maandelijkse contributie-overzicht' },
  importexport: { title: 'Import/Export', sub: 'Leden en betalingen importeren of exporteren' },
  settings:     { title: 'Instellingen',  sub: 'Systeem- en organisatie-instellingen' },
};

export default function Topbar({ onMenuToggle }) {
  const { currentPage, adminUser } = useStore();
  const page = PAGE_TITLES[currentPage] || PAGE_TITLES.dashboard;

  return (
    <header
      className="flex items-center justify-between px-4 lg:px-6 py-4 shrink-0"
      style={{
        background: 'white',
        borderBottom: '1px solid #e8e3d8',
        minHeight: '68px',
      }}
    >
      <div className="flex items-center gap-3">
        {/* Mobile hamburger */}
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 rounded transition-colors"
          style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#0d1b2a' }}
          onMouseEnter={e => e.currentTarget.style.background = '#f4f1eb'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          aria-label="Menu openen"
        >
          <Menu size={20} />
        </button>

        <div>
          <h1
            className="font-display leading-none"
            style={{ fontSize: '1.25rem', fontWeight: 400, color: '#0d1b2a' }}
          >
            {page.title}
          </h1>
          <p className="text-xs mt-0.5 hidden sm:block" style={{ color: '#9b9790' }}>{page.sub}</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Search hint — desktop only */}
        <div
          className="hidden sm:flex items-center gap-2 px-3 py-2 rounded text-xs"
          style={{ background: '#f4f1eb', color: '#9b9790', border: '1px solid #e8e3d8', cursor: 'default' }}
        >
          <Search size={13} />
          <span>Zoeken…</span>
        </div>

        {/* Notification bell */}
        <button
          className="relative p-2 rounded transition-colors"
          style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#7c7870' }}
          onMouseEnter={e => e.currentTarget.style.background = '#f4f1eb'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        >
          <Bell size={18} />
          <span
            className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
            style={{ background: '#c8933a' }}
          />
        </button>

        {/* Avatar */}
        {adminUser && (
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
              style={{ background: '#0d1b2a', color: 'white' }}
            >
              {adminUser.name[0]}
            </div>
            <div className="hidden md:block">
              <div className="text-xs font-medium" style={{ color: '#0d1b2a' }}>{adminUser.name}</div>
              <div className="text-xs" style={{ color: '#9b9790' }}>{adminUser.role}</div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
