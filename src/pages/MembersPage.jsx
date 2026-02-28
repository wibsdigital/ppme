import { useState, useMemo } from 'react';
import { Search, Plus, Pencil, Trash2, ChevronUp, ChevronDown, UserCheck, UserX } from 'lucide-react';
import useStore from '../store/useStore';
import { MONTHS } from '../utils/mockData';
import MemberModal from '../components/Members/MemberModal';
import DeleteConfirmModal from '../components/Members/DeleteConfirmModal';

const ITEMS_PER_PAGE = 10;

function StatusBadge({ status }) {
  const styles = {
    Active:   { background: '#e8f5ee', color: '#2d7a4f' },
    Inactive: { background: '#f4f1eb', color: '#7c7870' },
  };
  return (
    <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={styles[status] || styles.Inactive}>
      {status === 'Active' ? 'Actief' : 'Inactief'}
    </span>
  );
}

function PaymentStatusBadge({ status }) {
  const map = {
    Paid:    { label: 'Betaald',       bg: '#e8f5ee', color: '#2d7a4f' },
    Unpaid:  { label: 'Niet betaald',  bg: '#faeaea', color: '#8b3a3a' },
    Partial: { label: 'Gedeeltelijk',  bg: '#fdf3e3', color: '#7a5c2d' },
    None:    { label: '—',             bg: '#f4f1eb', color: '#9b9790' },
  };
  const s = map[status] || map.None;
  return (
    <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ background: s.bg, color: s.color }}>
      {s.label}
    </span>
  );
}

export default function MembersPage() {
  const members  = useStore(s => s.members);
  const payments = useStore(s => s.payments);
  const addMember    = useStore(s => s.addMember);
  const updateMember = useStore(s => s.updateMember);
  const deleteMember = useStore(s => s.deleteMember);

  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear  = now.getFullYear();

  const [search, setSearch]       = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterPayment, setFilterPayment] = useState('');
  const [sortField, setSortField] = useState('lidnummer');
  const [sortDir, setSortDir]     = useState('asc');
  const [page, setPage]           = useState(1);

  const [showModal, setShowModal]   = useState(false);
  const [editMember, setEditMember] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const memberPaymentStatus = useMemo(() => {
    const map = {};
    payments
      .filter(p => p.month === currentMonth && p.year === currentYear)
      .forEach(p => { map[p.member_id] = p.status; });
    return map;
  }, [payments, currentMonth, currentYear]);

  const filtered = useMemo(() => {
    let list = [...members];
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(m =>
        m.voornamen.toLowerCase().includes(q) ||
        m.achternaam.toLowerCase().includes(q) ||
        m.lidnummer.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q)
      );
    }
    if (filterType)    list = list.filter(m => m.membertype === filterType);
    if (filterStatus)  list = list.filter(m => m.status === filterStatus);
    if (filterPayment) list = list.filter(m => (memberPaymentStatus[m.id] || 'Unpaid') === filterPayment);
    list.sort((a, b) => {
      let va = a[sortField] || '';
      let vb = b[sortField] || '';
      if (typeof va === 'string') va = va.toLowerCase();
      if (typeof vb === 'string') vb = vb.toLowerCase();
      if (va < vb) return sortDir === 'asc' ? -1 : 1;
      if (va > vb) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
    return list;
  }, [members, search, filterType, filterStatus, filterPayment, sortField, sortDir, memberPaymentStatus]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated  = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const sort = (field) => {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDir('asc'); }
  };

  const SortIcon = ({ field }) => {
    if (sortField !== field) return null;
    return sortDir === 'asc' ? <ChevronUp size={13} /> : <ChevronDown size={13} />;
  };

  const handleSave = (data) => {
    if (editMember) updateMember(editMember.id, data);
    else addMember(data);
    setShowModal(false);
    setEditMember(null);
  };

  const getRowBorderColor = (id) => {
    const s = memberPaymentStatus[id];
    if (s === 'Paid')    return '#2d7a4f';
    if (s === 'Unpaid')  return '#8b3a3a';
    if (s === 'Partial') return '#7a5c2d';
    return 'transparent';
  };

  return (
    <div className="space-y-4 animate-enter">
      {/* Toolbar */}
      <div
        className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between p-4 rounded-lg"
        style={{ background: 'white', border: '1px solid #e8e3d8' }}
      >
        {/* Search */}
        <div className="relative flex-1 min-w-0 max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#9b9790' }} />
          <input
            type="text"
            placeholder="Zoek op naam, lidnummer…"
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            className="w-full pl-9 pr-3 py-2 text-sm rounded"
            style={{ border: '1px solid #e8e3d8', outline: 'none', background: '#f4f1eb', color: '#0d1b2a' }}
            onFocus={e => e.target.style.borderColor = '#c8933a'}
            onBlur={e => e.target.style.borderColor = '#e8e3d8'}
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={filterType}
            onChange={e => { setFilterType(e.target.value); setPage(1); }}
            className="text-sm px-3 py-2 rounded"
            style={{ border: '1px solid #e8e3d8', background: '#f4f1eb', color: '#5c5852', outline: 'none', cursor: 'pointer' }}
          >
            <option value="">Alle types</option>
            <option>Lid</option><option>Senior</option><option>Bestuur</option>
          </select>
          <select
            value={filterPayment}
            onChange={e => { setFilterPayment(e.target.value); setPage(1); }}
            className="text-sm px-3 py-2 rounded"
            style={{ border: '1px solid #e8e3d8', background: '#f4f1eb', color: '#5c5852', outline: 'none', cursor: 'pointer' }}
          >
            <option value="">Alle betalingen</option>
            <option value="Paid">Betaald</option>
            <option value="Unpaid">Niet betaald</option>
            <option value="Partial">Gedeeltelijk</option>
          </select>
          <select
            value={filterStatus}
            onChange={e => { setFilterStatus(e.target.value); setPage(1); }}
            className="text-sm px-3 py-2 rounded"
            style={{ border: '1px solid #e8e3d8', background: '#f4f1eb', color: '#5c5852', outline: 'none', cursor: 'pointer' }}
          >
            <option value="">Alle statussen</option>
            <option value="Active">Actief</option>
            <option value="Inactive">Inactief</option>
          </select>
          <button
            onClick={() => { setShowModal(true); setEditMember(null); }}
            className="flex items-center gap-2 px-4 py-2 rounded text-sm font-medium transition-colors"
            style={{ background: '#0d1b2a', color: 'white', border: 'none', cursor: 'pointer' }}
            onMouseEnter={e => e.currentTarget.style.background = '#1a2d43'}
            onMouseLeave={e => e.currentTarget.style.background = '#0d1b2a'}
          >
            <Plus size={15} /> Nieuw lid
          </button>
        </div>
      </div>

      {/* Summary */}
      <div className="text-xs" style={{ color: '#9b9790' }}>
        {filtered.length} van {members.length} leden — {MONTHS[currentMonth - 1]} {currentYear}
      </div>

      {/* Table */}
      <div
        className="rounded-lg overflow-hidden"
        style={{ background: 'white', border: '1px solid #e8e3d8' }}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm" style={{ borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f4f1eb', borderBottom: '2px solid #e8e3d8' }}>
                {[
                  { label: 'Lidnummer', field: 'lidnummer' },
                  { label: 'Naam', field: 'achternaam' },
                  { label: 'Type', field: 'membertype' },
                  { label: 'Burgerlijke staat', field: 'burgerlijke_staat' },
                  { label: 'Contributie', field: 'contributietarief' },
                  { label: 'Status', field: 'status' },
                  { label: `Betaling ${MONTHS[currentMonth-1].substring(0,3)}`, field: null },
                  { label: 'Acties', field: null },
                ].map(col => (
                  <th
                    key={col.label}
                    className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider"
                    style={{
                      color: '#7c7870', letterSpacing: '0.08em',
                      cursor: col.field ? 'pointer' : 'default',
                      userSelect: 'none',
                    }}
                    onClick={() => col.field && sort(col.field)}
                  >
                    <div className="flex items-center gap-1">
                      {col.label}
                      {col.field && <SortIcon field={col.field} />}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-12" style={{ color: '#9b9790' }}>
                    Geen leden gevonden
                  </td>
                </tr>
              ) : paginated.map((member, idx) => {
                const payStatus = memberPaymentStatus[member.id];
                return (
                  <tr
                    key={member.id}
                    style={{
                      borderBottom: '1px solid #f0ebe0',
                      borderLeft: `3px solid ${getRowBorderColor(member.id)}`,
                      background: idx % 2 === 0 ? 'white' : '#fdfcf9',
                      transition: 'background 0.1s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = '#f8f5ee'}
                    onMouseLeave={e => e.currentTarget.style.background = idx % 2 === 0 ? 'white' : '#fdfcf9'}
                  >
                    <td className="px-4 py-3 font-mono text-xs" style={{ color: '#4a6d90' }}>
                      {member.lidnummer}
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium" style={{ color: '#0d1b2a' }}>
                        {[member.voornamen, member.tussenvoegsel, member.achternaam].filter(Boolean).join(' ')}
                      </div>
                      <div className="text-xs" style={{ color: '#9b9790' }}>{member.email}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className="px-2 py-0.5 rounded text-xs font-medium"
                        style={{
                          background: member.membertype === 'Bestuur' ? '#eef4f9' : '#f4f1eb',
                          color: member.membertype === 'Bestuur' ? '#2f4f72' : '#5c5852',
                        }}
                      >
                        {member.membertype}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs" style={{ color: '#5c5852' }}>
                      {member.burgerlijke_staat === 'Married' ? 'Gehuwd' : 'Alleenstaand'}
                    </td>
                    <td className="px-4 py-3 font-medium text-xs" style={{ color: '#0d1b2a' }}>
                      € {member.contributietarief}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={member.status} />
                    </td>
                    <td className="px-4 py-3">
                      <PaymentStatusBadge status={payStatus} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => { setEditMember(member); setShowModal(true); }}
                          className="p-1.5 rounded transition-colors"
                          title="Bewerken"
                          style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#7094b3' }}
                          onMouseEnter={e => { e.currentTarget.style.background = '#eef4f9'; e.currentTarget.style.color = '#0d1b2a'; }}
                          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#7094b3'; }}
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(member)}
                          className="p-1.5 rounded transition-colors"
                          title="Verwijderen"
                          style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#c0a0a0' }}
                          onMouseEnter={e => { e.currentTarget.style.background = '#faeaea'; e.currentTarget.style.color = '#8b3a3a'; }}
                          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#c0a0a0'; }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div
            className="flex items-center justify-between px-4 py-3"
            style={{ borderTop: '1px solid #e8e3d8', background: '#f4f1eb' }}
          >
            <span className="text-xs" style={{ color: '#9b9790' }}>
              Pagina {page} van {totalPages} ({filtered.length} leden)
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1.5 rounded text-xs transition-colors"
                style={{
                  background: page === 1 ? 'transparent' : 'white',
                  border: '1px solid #e8e3d8',
                  color: page === 1 ? '#c0b8b0' : '#5c5852',
                  cursor: page === 1 ? 'not-allowed' : 'pointer',
                }}
              >
                ← Vorige
              </button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const p = i + 1;
                return (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className="w-8 h-8 rounded text-xs transition-colors"
                    style={{
                      background: page === p ? '#0d1b2a' : 'white',
                      border: '1px solid #e8e3d8',
                      color: page === p ? 'white' : '#5c5852',
                      cursor: 'pointer',
                    }}
                  >
                    {p}
                  </button>
                );
              })}
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-3 py-1.5 rounded text-xs transition-colors"
                style={{
                  background: page === totalPages ? 'transparent' : 'white',
                  border: '1px solid #e8e3d8',
                  color: page === totalPages ? '#c0b8b0' : '#5c5852',
                  cursor: page === totalPages ? 'not-allowed' : 'pointer',
                }}
              >
                Volgende →
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {showModal && (
        <MemberModal
          member={editMember}
          onClose={() => { setShowModal(false); setEditMember(null); }}
          onSave={handleSave}
        />
      )}
      {deleteTarget && (
        <DeleteConfirmModal
          member={deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onConfirm={deleteMember}
        />
      )}
    </div>
  );
}
