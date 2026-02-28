import { useMemo } from 'react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { Users, Euro, AlertTriangle, TrendingUp, UserPlus, CheckCircle } from 'lucide-react';
import useStore from '../store/useStore';
import { MONTHS } from '../utils/mockData';

function StatCard({ icon: Icon, label, value, sub, accent, trend }) {
  return (
    <div
      className="relative rounded-lg p-5 overflow-hidden transition-shadow hover:shadow-md"
      style={{ background: 'white', border: '1px solid #e8e3d8' }}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider mb-2" style={{ color: '#9b9790', letterSpacing: '0.1em' }}>
            {label}
          </p>
          <div className="font-display text-3xl" style={{ fontWeight: 300, color: '#0d1b2a' }}>{value}</div>
          {sub && <p className="text-xs mt-1" style={{ color: '#9b9790' }}>{sub}</p>}
        </div>
        <div
          className="w-10 h-10 rounded flex items-center justify-center"
          style={{ background: accent || '#eef4f9' }}
        >
          <Icon size={18} style={{ color: accent ? 'white' : '#4a6d90' }} />
        </div>
      </div>
      {trend !== undefined && (
        <div className="mt-3 flex items-center gap-1.5">
          <TrendingUp size={12} style={{ color: '#2d7a4f' }} />
          <span className="text-xs" style={{ color: '#2d7a4f' }}>{trend}</span>
        </div>
      )}
      {/* Bottom accent bar */}
      <div
        className="absolute bottom-0 left-0 h-0.5 w-full"
        style={{ background: `linear-gradient(90deg, ${accent || '#c8933a'}, transparent)` }}
      />
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="px-3 py-2 rounded shadow-lg text-xs"
      style={{ background: '#0d1b2a', color: 'white', border: '1px solid rgba(255,255,255,0.1)' }}
    >
      <p className="font-medium mb-1" style={{ color: '#c8933a' }}>{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color || 'white' }}>{p.name}: € {p.value}</p>
      ))}
    </div>
  );
};

export default function DashboardPage() {
  const members = useStore(s => s.members);
  const payments = useStore(s => s.payments);
  const setCurrentPage = useStore(s => s.setCurrentPage);

  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

  const stats = useMemo(() => {
    const activeMembers = members.filter(m => m.status === 'Active');
    const currentPayments = payments.filter(p => p.month === currentMonth && p.year === currentYear);
    const paid = currentPayments.filter(p => p.status === 'Paid');
    const unpaid = currentPayments.filter(p => p.status === 'Unpaid');
    const collected = paid.reduce((s, p) => s + p.amount_paid, 0);
    const expected = activeMembers.reduce((s, m) => s + m.contributietarief, 0);
    return { activeMembers: activeMembers.length, paid: paid.length, unpaid: unpaid.length, collected, expected };
  }, [members, payments, currentMonth, currentYear]);

  // Monthly revenue for last 6 months
  const revenueData = useMemo(() => {
    return Array.from({ length: 6 }, (_, i) => {
      let month = currentMonth - (5 - i);
      let year = currentYear;
      if (month <= 0) { month += 12; year -= 1; }
      const monthPayments = payments.filter(p => p.month === month && p.year === year);
      const collected = monthPayments.reduce((s, p) => s + p.amount_paid, 0);
      const expected = monthPayments.reduce((s, p) => s + p.amount_due, 0);
      return { month: MONTHS[month - 1].substring(0, 3), collected, expected };
    });
  }, [payments, currentMonth, currentYear]);

  // Paid vs Unpaid pie
  const pieData = useMemo(() => {
    const curr = payments.filter(p => p.month === currentMonth && p.year === currentYear);
    const paid = curr.filter(p => p.status === 'Paid').length;
    const unpaid = curr.filter(p => p.status === 'Unpaid').length;
    const partial = curr.filter(p => p.status === 'Partial').length;
    return [
      { name: 'Betaald', value: paid, color: '#2d7a4f' },
      { name: 'Niet betaald', value: unpaid, color: '#8b3a3a' },
      { name: 'Gedeeltelijk', value: partial, color: '#7a5c2d' },
    ].filter(d => d.value > 0);
  }, [payments, currentMonth, currentYear]);

  // Recent unpaid
  const recentUnpaid = useMemo(() => {
    const curr = payments.filter(p => p.month === currentMonth && p.year === currentYear && p.status !== 'Paid');
    return curr
      .map(p => ({ ...p, member: members.find(m => m.id === p.member_id) }))
      .filter(p => p.member)
      .slice(0, 5);
  }, [payments, members, currentMonth, currentYear]);

  return (
    <div className="space-y-6 animate-enter">
      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-enter-stagger">
        <StatCard
          icon={Users} label="Actieve leden" value={stats.activeMembers}
          sub={`${members.filter(m => m.status === 'Inactive').length} inactief`}
          accent="#0d1b2a"
        />
        <StatCard
          icon={Euro} label="Geïnd deze maand" value={`€ ${stats.collected}`}
          sub={`Van € ${stats.expected} verwacht`}
          accent="#c8933a"
          trend={`${Math.round((stats.collected / stats.expected || 0) * 100)}% geïnd`}
        />
        <StatCard
          icon={AlertTriangle} label="Niet betaald" value={stats.unpaid}
          sub="leden deze maand"
          accent="#8b3a3a"
        />
        <StatCard
          icon={CheckCircle} label="Betaald" value={stats.paid}
          sub={`${MONTHS[currentMonth - 1]} ${currentYear}`}
          accent="#2d7a4f"
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Revenue area chart */}
        <div
          className="lg:col-span-2 rounded-lg p-5"
          style={{ background: 'white', border: '1px solid #e8e3d8' }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-display text-base" style={{ fontWeight: 400, color: '#0d1b2a' }}>
                Maandelijkse Inkomsten
              </h3>
              <p className="text-xs" style={{ color: '#9b9790' }}>Afgelopen 6 maanden</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="collectedGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#c8933a" stopOpacity={0.15}/>
                  <stop offset="95%" stopColor="#c8933a" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="expectedGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7094b3" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#7094b3" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0ebe0" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9b9790' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#9b9790' }} axisLine={false} tickLine={false} tickFormatter={v => `€${v}`} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="expected" name="Verwacht" stroke="#a5bfd4" strokeWidth={1.5} fill="url(#expectedGrad)" strokeDasharray="4 2" />
              <Area type="monotone" dataKey="collected" name="Geïnd" stroke="#c8933a" strokeWidth={2} fill="url(#collectedGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Pie chart */}
        <div
          className="rounded-lg p-5"
          style={{ background: 'white', border: '1px solid #e8e3d8' }}
        >
          <div className="mb-4">
            <h3 className="font-display text-base" style={{ fontWeight: 400, color: '#0d1b2a' }}>
              Status Verdeling
            </h3>
            <p className="text-xs" style={{ color: '#9b9790' }}>{MONTHS[currentMonth - 1]} {currentYear}</p>
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie
                data={pieData} cx="50%" cy="50%"
                innerRadius={45} outerRadius={70}
                paddingAngle={3} dataKey="value"
              >
                {pieData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(v, n) => [`${v} leden`, n]} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {pieData.map(d => (
              <div key={d.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: d.color }} />
                  <span style={{ color: '#5c5852' }}>{d.name}</span>
                </div>
                <span className="font-medium" style={{ color: '#0d1b2a' }}>{d.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Unpaid list */}
        <div
          className="rounded-lg p-5"
          style={{ background: 'white', border: '1px solid #e8e3d8' }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-base" style={{ fontWeight: 400, color: '#0d1b2a' }}>
              Achterstallige Betalingen
            </h3>
            <button
              onClick={() => setCurrentPage('payments')}
              className="text-xs px-3 py-1.5 rounded transition-colors"
              style={{ color: '#c8933a', background: '#fdf7ef', border: '1px solid #f2d9a8', cursor: 'pointer' }}
            >
              Alles bekijken
            </button>
          </div>
          {recentUnpaid.length === 0 ? (
            <div className="text-center py-8" style={{ color: '#9b9790' }}>
              <CheckCircle size={28} className="mx-auto mb-2" style={{ color: '#2d7a4f' }} />
              <p className="text-sm">Iedereen heeft betaald!</p>
            </div>
          ) : (
            <div className="space-y-2">
              {recentUnpaid.map(p => (
                <div
                  key={p.id}
                  className="flex items-center justify-between py-2.5 px-3 rounded"
                  style={{ background: '#fdf7ef', border: '1px solid #f2d9a8' }}
                >
                  <div>
                    <div className="text-sm font-medium" style={{ color: '#0d1b2a' }}>
                      {p.member.voornamen} {p.member.achternaam}
                    </div>
                    <div className="text-xs" style={{ color: '#9b9790' }}>{p.member.lidnummer}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium" style={{ color: '#8b3a3a' }}>€ {p.amount_due}</div>
                    <div
                      className="text-xs px-2 py-0.5 rounded-full inline-block"
                      style={{
                        background: p.status === 'Partial' ? '#fdf3e3' : '#faeaea',
                        color: p.status === 'Partial' ? '#7a5c2d' : '#8b3a3a'
                      }}
                    >
                      {p.status === 'Partial' ? 'Gedeeltelijk' : 'Niet betaald'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick actions */}
        <div
          className="rounded-lg p-5"
          style={{ background: 'white', border: '1px solid #e8e3d8' }}
        >
          <h3 className="font-display text-base mb-4" style={{ fontWeight: 400, color: '#0d1b2a' }}>
            Snelle Acties
          </h3>
          <div className="space-y-3">
            {[
              { icon: UserPlus, label: 'Nieuw lid toevoegen', sub: 'Voeg een nieuw lid toe aan het systeem', page: 'members', accent: '#0d1b2a' },
              { icon: CheckCircle, label: 'Betaling registreren', sub: 'Registreer een contributie-betaling', page: 'payments', accent: '#2d7a4f' },
              { icon: Euro, label: 'Exporteer onbetaald', sub: 'Download lijst met achterstalligen', page: 'importexport', accent: '#8b3a3a' },
            ].map(action => (
              <button
                key={action.label}
                onClick={() => setCurrentPage(action.page)}
                className="flex items-center gap-4 w-full p-4 rounded text-left transition-all"
                style={{
                  background: '#f4f1eb',
                  border: '1px solid #e8e3d8',
                  cursor: 'pointer',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = action.accent; e.currentTarget.style.background = '#eef4f9'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#e8e3d8'; e.currentTarget.style.background = '#f4f1eb'; }}
              >
                <div
                  className="w-9 h-9 rounded flex items-center justify-center shrink-0"
                  style={{ background: action.accent }}
                >
                  <action.icon size={16} color="white" />
                </div>
                <div>
                  <div className="text-sm font-medium" style={{ color: '#0d1b2a' }}>{action.label}</div>
                  <div className="text-xs" style={{ color: '#9b9790' }}>{action.sub}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
