import { useState } from 'react';
import { X } from 'lucide-react';
import { PAYMENT_METHODS } from '../../utils/mockData';

const inputCls = "w-full px-3 py-2 rounded text-sm border transition-colors";
const inputStyle = { border: '1px solid #e8e3d8', outline: 'none', background: 'white', color: '#0d1b2a' };

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-xs font-medium mb-1.5 uppercase tracking-wide" style={{ color: '#7c7870', letterSpacing: '0.08em' }}>
        {label}
      </label>
      {children}
    </div>
  );
}

export default function PaymentModal({ payment, member, onClose, onSave }) {
  const [form, setForm] = useState({
    amount_paid: payment?.amount_paid || payment?.amount_due || 0,
    payment_date: payment?.payment_date || new Date().toISOString().split('T')[0],
    payment_method: payment?.payment_method || member?.betaal_methode || 'Bank Transfer',
    reference_note: payment?.reference_note || '',
  });

  const set = (field, value) => setForm(f => ({ ...f, [field]: value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...form, amount_paid: parseFloat(form.amount_paid) || 0 });
    onClose();
  };

  const fullName = member
    ? [member.voornamen, member.tussenvoegsel, member.achternaam].filter(Boolean).join(' ')
    : '—';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(13,27,42,0.6)', backdropFilter: 'blur(4px)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="w-full max-w-md rounded-xl shadow-2xl" style={{ background: 'white' }}>
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4"
          style={{ borderBottom: '1px solid #e8e3d8', background: '#f4f1eb', borderRadius: '12px 12px 0 0' }}
        >
          <div>
            <h2 className="font-display text-base" style={{ fontWeight: 400, color: '#0d1b2a' }}>
              Betaling registreren
            </h2>
            {member && (
              <p className="text-xs mt-0.5" style={{ color: '#9b9790' }}>
                {fullName} · € {payment?.amount_due} verwacht
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded transition-colors"
            style={{ background: 'transparent', border: 'none', color: '#7c7870', cursor: 'pointer' }}
            onMouseEnter={e => e.currentTarget.style.background = '#e8e3d8'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <Field label="Betaald bedrag (€)">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm" style={{ color: '#9b9790' }}>€</span>
              <input
                type="number"
                min="0"
                step="0.01"
                className={inputCls}
                style={{ ...inputStyle, paddingLeft: '28px' }}
                value={form.amount_paid}
                onChange={e => set('amount_paid', e.target.value)}
                onFocus={e => e.target.style.borderColor = '#c8933a'}
                onBlur={e => e.target.style.borderColor = '#e8e3d8'}
                required
              />
            </div>
          </Field>

          <Field label="Betaaldatum">
            <input
              type="date"
              className={inputCls}
              style={inputStyle}
              value={form.payment_date}
              onChange={e => set('payment_date', e.target.value)}
              onFocus={e => e.target.style.borderColor = '#c8933a'}
              onBlur={e => e.target.style.borderColor = '#e8e3d8'}
              required
            />
          </Field>

          <Field label="Betaalmethode">
            <select
              className={inputCls}
              style={inputStyle}
              value={form.payment_method}
              onChange={e => set('payment_method', e.target.value)}
            >
              {PAYMENT_METHODS.map(m => <option key={m}>{m}</option>)}
            </select>
          </Field>

          <Field label="Referentie / opmerking">
            <input
              className={inputCls}
              style={inputStyle}
              value={form.reference_note}
              onChange={e => set('reference_note', e.target.value)}
              placeholder="Bijv. bankreferentie..."
              onFocus={e => e.target.style.borderColor = '#c8933a'}
              onBlur={e => e.target.style.borderColor = '#e8e3d8'}
            />
          </Field>

          {/* Quick fill */}
          {payment?.amount_due && (
            <button
              type="button"
              onClick={() => set('amount_paid', payment.amount_due)}
              className="w-full py-2 rounded text-xs font-medium transition-colors"
              style={{ background: '#f4f1eb', border: '1px solid #e8e3d8', color: '#5c5852', cursor: 'pointer' }}
              onMouseEnter={e => e.currentTarget.style.background = '#e8e3d8'}
              onMouseLeave={e => e.currentTarget.style.background = '#f4f1eb'}
            >
              Volledig bedrag invullen (€ {payment.amount_due})
            </button>
          )}
        </form>

        <div
          className="flex items-center justify-end gap-3 px-6 py-4"
          style={{ borderTop: '1px solid #e8e3d8', background: '#f4f1eb', borderRadius: '0 0 12px 12px' }}
        >
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded text-sm transition-colors"
            style={{ background: 'white', border: '1px solid #e8e3d8', color: '#5c5852', cursor: 'pointer' }}
          >
            Annuleren
          </button>
          <button
            onClick={handleSubmit}
            className="px-5 py-2 rounded text-sm font-medium transition-colors"
            style={{ background: '#c8933a', color: 'white', border: 'none', cursor: 'pointer' }}
            onMouseEnter={e => e.currentTarget.style.background = '#daa85a'}
            onMouseLeave={e => e.currentTarget.style.background = '#c8933a'}
          >
            Betaling opslaan
          </button>
        </div>
      </div>
    </div>
  );
}
