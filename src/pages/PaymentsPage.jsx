import { useState, useMemo, Fragment } from 'react';
import { CheckCircle, Euro, AlertTriangle, Users, ChevronDown, ChevronUp } from 'lucide-react';
import apiStore from '../store/useStore';
import { MONTHS } from '../utils/mockData';
import PaymentModal from '../components/Payments/PaymentModal';

function SummaryCard({ icon: Icon, label, value, sub, accent }) {
  return (
    <div
      className="rounded-lg p-4 relative overflow-hidden"
      style={{ background: 'white', border: '1px solid #e8e3d8' }}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs uppercase tracking-wider font-medium mb-1" style={{ color: '#9b9790', letterSpacing: '0.09em' }}>{label}</p>
          <div className="font-display text-2xl" style={{ fontWeight: 300, color: '#0d1b2a' }}>{value}</div>
          {sub && <p className="text-xs mt-0.5" style={{ color: '#9b9790' }}>{sub}</p>}
        </div>
        <div className="w-9 h-9 rounded flex items-center justify-center" style={{ background: accent || '#f4f1eb' }}>
          <Icon size={16} style={{ color: accent ? 'white' : '#4a6d90' }} />
        </div>
      </div>
      <div className="absolute bottom-0 left-0 h-0.5 w-full" style={{ background: `linear-gradient(90deg, ${accent || '#c8933a'}, transparent)` }} />
    </div>
  );
}

export default function PaymentsPage() {
  const members  = apiStore(s => s.members);
  const payments = apiStore(s => s.payments);
  const updatePayment = apiStore(s => s.updatePayment);
  const markAsPaid    = apiStore(s => s.markAsPaid);
  const bulkMarkPaid  = apiStore(s => s.bulkMarkPaid);
  const addPayment    = apiStore(s => s.addPayment);

  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth() + 1);
  const [selectedYear, setSelectedYear]   = useState(now.getFullYear());
  const [filterStatus, setFilterStatus]   = useState('');
  const [selectedIds, setSelectedIds]     = useState([]);
  const [paymentModal, setPaymentModal]   = useState(null); // { payment, member }
  const [expandedMember, setExpandedMember] = useState(null);

  // Build merged member+payment list for selected month
  const rows = useMemo(() => {
    const activeMembers = members.filter(m => m.status === 'Active');
    return activeMembers.map(member => {
      const payment = payments.find(
        p => p.member_id === member.id && p.month === selectedMonth && p.year === selectedYear
      );
      return {
        member,
        payment: payment || {
          id: null, member_id: member.id,
          month: selectedMonth, year: selectedYear,
          amount_due: member.contributietarief, amount_paid: 0,
          payment_date: null, payment_method: '', reference_note: '',
          status: 'Unpaid',
        },
      };
    });
  }, [members, payments, selectedMonth, selectedYear]);

  const filtered = useMemo(() => {
    if (!filterStatus) return rows;
    return rows.filter(r => r.payment.status === filterStatus);
  }, [rows, filterStatus]);

  const summary = useMemo(() => ({
    total: rows.length,
    paid: rows.filter(r => r.payment.status === 'Paid').length,
    unpaid: rows.filter(r => r.payment.status !== 'Paid').length,
    collected: rows.filter(r => r.payment.status === 'Paid').reduce((s, r) => s + r.payment.amount_paid, 0),
    expected:  rows.reduce((s, r) => s + r.payment.amount_due, 0),
  }), [rows]);

  // Payment history for member
  const getMemberHistory = (memberId) => {
    return payments
      .filter(p => p.member_id === memberId)
      .sort((a, b) => b.year !== a.year ? b.year - a.year : b.month - a.month)
      .slice(0, 12);
  };

  const toggleSelect = (id) => {
    setSelectedIds(ids => ids.includes(id) ? ids.filter(x => x !== id) : [...ids, id]);
  };

  const handleBulkPaid = () => {
    bulkMarkPaid(selectedIds, selectedMonth, selectedYear);
    setSelectedIds([]);
  };

  const handlePaymentSave = (data) => {
    if (paymentModal.payment.id) {
      updatePayment(paymentModal.payment.id, data);
    } else {
      const newP = {
        ...paymentModal.payment, ...data,
        id: Math.random().toString(36).substr(2, 9),
      };
      addPayment(newP);
    }
  };

  const statusColor = (status) => {
    if (status === 'Paid')    return { bg: '#e8f5ee', color: '#2d7a4f', label: 'Betaald' };
    if (status === 'Unpaid')  return { bg: '#faeaea', color: '#8b3a3a', label: 'Niet betaald' };
    if (status === 'Partial') return { bg: '#fdf3e3', color: '#7a5c2d', label: 'Gedeeltelijk' };
    return { bg: '#f4f1eb', color: '#9b9790', label: '—' };
  };

  const years = [now.getFullYear(), now.getFullYear() - 1];

  return (
    <div className="space-y-5 animate-enter">
      {/* Month selector */}
      <div className="flex items-center gap-3">
        <div
          className="flex items-center gap-1 p-1 rounded-lg overflow-x-auto"
          style={{ background: 'white', border: '1px solid #e8e3d8', flexShrink: 1, minWidth: 0 }}
        >
          {MONTHS.map((m, i) => (
            <button
              key={i}
              onClick={() => setSelectedMonth(i + 1)}
              className="px-3 py-1.5 rounded text-xs font-medium transition-all"
              style={{
                background: selectedMonth === i + 1 ? '#0d1b2a' : 'transparent',
                color: selectedMonth === i + 1 ? 'white' : '#7c7870',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              {m.substring(0, 3)}
            </button>
          ))}
        </div>
        <select
          value={selectedYear}
          onChange={e => setSelectedYear(Number(e.target.value))}
          className="px-3 py-2 rounded text-sm"
          style={{ border: '1px solid #e8e3d8', background: 'white', color: '#0d1b2a', outline: 'none', cursor: 'pointer' }}
        >
          {years.map(y => <option key={y}>{y}</option>)}
        </select>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 animate-enter-stagger">
        <SummaryCard icon={Users}        label="Totaal leden"     value={summary.total}                      accent="#0d1b2a" />
        <SummaryCard icon={CheckCircle}  label="Betaald"          value={summary.paid}  sub={`${Math.round(summary.paid/summary.total*100)||0}%`} accent="#2d7a4f" />
        <SummaryCard icon={AlertTriangle} label="Niet betaald"    value={summary.unpaid}                     accent="#8b3a3a" />
        <SummaryCard icon={Euro}         label="Geïnd bedrag"     value={`€ ${summary.collected}`} sub={`van € ${summary.expected}`} accent="#c8933a" />
      </div>

      {/* Controls */}
      <div
        className="flex items-center justify-between gap-3 p-3 rounded-lg flex-wrap"
        style={{ background: 'white', border: '1px solid #e8e3d8' }}
      >
        <div className="flex items-center gap-2">
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="text-sm px-3 py-2 rounded"
            style={{ border: '1px solid #e8e3d8', background: '#f4f1eb', color: '#5c5852', outline: 'none', cursor: 'pointer' }}
          >
            <option value="">Alle statussen</option>
            <option value="Paid">Betaald</option>
            <option value="Unpaid">Niet betaald</option>
            <option value="Partial">Gedeeltelijk</option>
          </select>
          <span className="text-xs" style={{ color: '#9b9790' }}>
            {filtered.length} leden
          </span>
        </div>

        {selectedIds.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-xs" style={{ color: '#5c5852' }}>{selectedIds.length} geselecteerd</span>
            <button
              onClick={handleBulkPaid}
              className="px-3 py-1.5 rounded text-xs font-medium transition-colors"
              style={{ background: '#2d7a4f', color: 'white', border: 'none', cursor: 'pointer' }}
            >
              Markeer betaald
            </button>
            <button
              onClick={() => setSelectedIds([])}
              className="px-3 py-1.5 rounded text-xs transition-colors"
              style={{ background: '#f4f1eb', border: '1px solid #e8e3d8', color: '#5c5852', cursor: 'pointer' }}
            >
              Deselecteer
            </button>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="rounded-lg overflow-hidden" style={{ background: 'white', border: '1px solid #e8e3d8' }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm" style={{ borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f4f1eb', borderBottom: '2px solid #e8e3d8' }}>
                <th className="px-4 py-3 text-left w-8">
                  <input
                    type="checkbox"
                    className="rounded"
                    checked={selectedIds.length === filtered.filter(r => r.payment.status !== 'Paid').length && filtered.filter(r => r.payment.status !== 'Paid').length > 0}
                    onChange={e => {
                      if (e.target.checked) setSelectedIds(filtered.filter(r => r.payment.status !== 'Paid').map(r => r.member.id));
                      else setSelectedIds([]);
                    }}
                  />
                </th>
                {['Lid', 'Type', 'Verwacht', 'Betaald', 'Status', 'Betaaldatum', 'Acties'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: '#7c7870', letterSpacing: '0.08em' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(({ member, payment }, idx) => {
                const sc = statusColor(payment.status);
                const isExpanded = expandedMember === member.id;
                return (
                  <Fragment key={member.id}>
                    <tr
                      style={{
                        borderBottom: isExpanded ? 'none' : '1px solid #f0ebe0',
                        borderLeft: `3px solid ${payment.status === 'Paid' ? '#2d7a4f' : payment.status === 'Partial' ? '#7a5c2d' : '#8b3a3a'}`,
                        background: idx % 2 === 0 ? 'white' : '#fdfcf9',
                        transition: 'background 0.1s',
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = '#f8f5ee'}
                      onMouseLeave={e => e.currentTarget.style.background = idx % 2 === 0 ? 'white' : '#fdfcf9'}
                    >
                      <td className="px-4 py-3">
                        {payment.status !== 'Paid' && (
                          <input
                            type="checkbox"
                            checked={selectedIds.includes(member.id)}
                            onChange={() => toggleSelect(member.id)}
                          />
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-sm" style={{ color: '#0d1b2a' }}>
                          {[member.voornamen, member.tussenvoegsel, member.achternaam].filter(Boolean).join(' ')}
                        </div>
                        <div className="text-xs font-mono" style={{ color: '#4a6d90' }}>{member.lidnummer}</div>
                      </td>
                      <td className="px-4 py-3 text-xs" style={{ color: '#5c5852' }}>{member.membertype}</td>
                      <td className="px-4 py-3 font-medium text-xs" style={{ color: '#0d1b2a' }}>€ {payment.amount_due}</td>
                      <td className="px-4 py-3 font-medium text-xs" style={{ color: payment.amount_paid > 0 ? '#2d7a4f' : '#9b9790' }}>
                        € {payment.amount_paid}
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ background: sc.bg, color: sc.color }}>
                          {sc.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs" style={{ color: '#7c7870' }}>
                        {payment.payment_date || '—'}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          {payment.status !== 'Paid' && (
                            <button
                              onClick={() => setPaymentModal({ payment, member })}
                              className="px-2.5 py-1 rounded text-xs font-medium transition-colors"
                              style={{ background: '#c8933a', color: 'white', border: 'none', cursor: 'pointer' }}
                              onMouseEnter={e => e.currentTarget.style.background = '#daa85a'}
                              onMouseLeave={e => e.currentTarget.style.background = '#c8933a'}
                            >
                              Betaling
                            </button>
                          )}
                          <button
                            onClick={() => setExpandedMember(isExpanded ? null : member.id)}
                            className="p-1.5 rounded transition-colors"
                            style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#9b9790' }}
                            onMouseEnter={e => e.currentTarget.style.background = '#f4f1eb'}
                            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                            title="Betalingshistorie"
                          >
                            {isExpanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                          </button>
                        </div>
                      </td>
                    </tr>
                    {/* Expanded history row */}
                    {isExpanded && (
                      <tr style={{ borderBottom: '1px solid #e8e3d8' }}>
                        <td colSpan={8} style={{ padding: 0 }}>
                          <div className="px-8 py-4" style={{ background: '#faf8f4' }}>
                            <p className="text-xs font-medium uppercase tracking-wider mb-3" style={{ color: '#7c7870', letterSpacing: '0.1em' }}>
                              Betalingshistorie — {[member.voornamen, member.achternaam].join(' ')}
                            </p>
                            <div className="flex gap-2 flex-wrap">
                              {getMemberHistory(member.id).map(h => {
                                const hsc = statusColor(h.status);
                                return (
                                  <div
                                    key={h.id}
                                    className="px-3 py-2 rounded text-xs"
                                    style={{ background: hsc.bg, border: `1px solid ${hsc.color}30` }}
                                  >
                                    <div className="font-medium" style={{ color: hsc.color }}>
                                      {MONTHS[h.month - 1].substring(0, 3)} {h.year}
                                    </div>
                                    <div style={{ color: hsc.color, opacity: 0.8 }}>€ {h.amount_paid} / {h.amount_due}</div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {paymentModal && (
        <PaymentModal
          payment={paymentModal.payment}
          member={paymentModal.member}
          onClose={() => setPaymentModal(null)}
          onSave={handlePaymentSave}
        />
      )}
    </div>
  );
}
