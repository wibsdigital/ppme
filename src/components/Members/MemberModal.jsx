import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { MEMBER_TYPES, CIVIL_STATUS, PAYMENT_METHODS, CONTRIBUTION_RATES } from '../../utils/mockData';

const initialForm = {
  voornamen: '', tussenvoegsel: '', achternaam: '', lidnummer: '',
  membertype: 'Lid', burgerlijke_staat: 'Single', betaal_methode: 'Bank Transfer',
  adres: '', postcode: '', woonplaats: '', geboortedatum: '', geboorteplaats: '',
  email: '', telefoonnummer: '', status: 'Active',
};

function Field({ label, required, children }) {
  return (
    <div>
      <label className="block text-xs font-medium mb-1.5 uppercase tracking-wide" style={{ color: '#7c7870', letterSpacing: '0.08em' }}>
        {label}{required && <span style={{ color: '#c8933a' }}> *</span>}
      </label>
      {children}
    </div>
  );
}

const inputCls = "w-full px-3 py-2 rounded text-sm border transition-colors";
const inputStyle = { border: '1px solid #e8e3d8', outline: 'none', background: 'white', color: '#0d1b2a' };

export default function MemberModal({ member, onClose, onSave }) {
  const [form, setForm] = useState(member ? { ...member } : { ...initialForm });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setForm(f => ({
      ...f,
      contributietarief: CONTRIBUTION_RATES[f.burgerlijke_staat] || 10
    }));
  }, [form.burgerlijke_staat]);

  const set = (field, value) => {
    setForm(f => ({ ...f, [field]: value }));
    setErrors(e => ({ ...e, [field]: undefined }));
  };

  const validate = () => {
    const e = {};
    if (!form.voornamen.trim()) e.voornamen = 'Verplicht';
    if (!form.achternaam.trim()) e.achternaam = 'Verplicht';
    if (!form.lidnummer.trim()) e.lidnummer = 'Verplicht';
    if (!form.email.trim()) e.email = 'Verplicht';
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Ongeldig e-mailadres';
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    onSave({ ...form, contributietarief: CONTRIBUTION_RATES[form.burgerlijke_staat] || 10 });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(13,27,42,0.6)', backdropFilter: 'blur(4px)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden"
        style={{ background: 'white', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4 shrink-0"
          style={{ borderBottom: '1px solid #e8e3d8', background: '#f4f1eb' }}
        >
          <div>
            <h2 className="font-display text-lg" style={{ fontWeight: 400, color: '#0d1b2a' }}>
              {member ? 'Lid bewerken' : 'Nieuw lid toevoegen'}
            </h2>
            <p className="text-xs" style={{ color: '#9b9790' }}>
              Contributietarief: € {CONTRIBUTION_RATES[form.burgerlijke_staat] || 10}/maand
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded hover:bg-gray-100 transition-colors"
            style={{ cursor: 'pointer' }}
          >
            <X size={20} style={{ color: '#5c5852' }} />
          </button>
        </div>

        {/* Form - Scrollable */}
        <div className="overflow-y-auto" style={{ flex: 1, minHeight: 0 }}>
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Name row */}
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-1">
                <Field label="Voornamen" required>
                  <input
                    className={inputCls}
                    style={{ ...inputStyle, borderColor: errors.voornamen ? '#8b3a3a' : '#e8e3d8' }}
                    value={form.voornamen}
                    onChange={e => set('voornamen', e.target.value)}
                    onFocus={e => e.target.style.borderColor = '#c8933a'}
                    onBlur={e => e.target.style.borderColor = errors.voornamen ? '#8b3a3a' : '#e8e3d8'}
                  />
                  {errors.voornamen && <p className="text-xs mt-1" style={{ color: '#8b3a3a' }}>{errors.voornamen}</p>}
                </Field>
              </div>
              <div>
                <Field label="Tussenvoegsel">
                  <input
                    className={inputCls}
                    style={inputStyle}
                    value={form.tussenvoegsel}
                    onChange={e => set('tussenvoegsel', e.target.value)}
                    onFocus={e => e.target.style.borderColor = '#c8933a'}
                    onBlur={e => e.target.style.borderColor = '#e8e3d8'}
                  />
                </Field>
              </div>
              <div>
                <Field label="Achternaam" required>
                  <input
                    className={inputCls}
                    style={{ ...inputStyle, borderColor: errors.achternaam ? '#8b3a3a' : '#e8e3d8' }}
                    value={form.achternaam}
                    onChange={e => set('achternaam', e.target.value)}
                    onFocus={e => e.target.style.borderColor = '#c8933a'}
                    onBlur={e => e.target.style.borderColor = errors.achternaam ? '#8b3a3a' : '#e8e3d8'}
                  />
                  {errors.achternaam && <p className="text-xs mt-1" style={{ color: '#8b3a3a' }}>{errors.achternaam}</p>}
                </Field>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Field label="Lidnummer" required>
                <input
                  className={inputCls}
                  style={{ ...inputStyle, borderColor: errors.lidnummer ? '#8b3a3a' : '#e8e3d8' }}
                  value={form.lidnummer}
                  onChange={e => set('lidnummer', e.target.value)}
                  placeholder="AG-013"
                  onFocus={e => e.target.style.borderColor = '#c8933a'}
                  onBlur={e => e.target.style.borderColor = errors.lidnummer ? '#8b3a3a' : '#e8e3d8'}
                />
                {errors.lidnummer && <p className="text-xs mt-1" style={{ color: '#8b3a3a' }}>{errors.lidnummer}</p>}
              </Field>
              <Field label="Lidtype">
                <select
                  className={inputCls}
                  style={inputStyle}
                  value={form.membertype}
                  onChange={e => set('membertype', e.target.value)}
                >
                  {MEMBER_TYPES.map(t => <option key={t}>{t}</option>)}
                </select>
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Field label="Burgerlijke staat">
                <select
                  className={inputCls}
                  style={inputStyle}
                  value={form.burgerlijke_staat}
                  onChange={e => set('burgerlijke_staat', e.target.value)}
                >
                  {CIVIL_STATUS.map(s => <option key={s}>{s}</option>)}
                </select>
              </Field>
              <Field label="Betaalmethode">
                <select
                  className={inputCls}
                  style={inputStyle}
                  value={form.betaal_methode}
                  onChange={e => set('betaal_methode', e.target.value)}
                >
                  {PAYMENT_METHODS.map(m => <option key={m}>{m}</option>)}
                </select>
              </Field>
            </div>

            {/* Contact */}
            <div className="grid grid-cols-2 gap-3">
              <Field label="E-mailadres" required>
                <input
                  type="email"
                  className={inputCls}
                  style={{ ...inputStyle, borderColor: errors.email ? '#8b3a3a' : '#e8e3d8' }}
                  value={form.email}
                  onChange={e => set('email', e.target.value)}
                  onFocus={e => e.target.style.borderColor = '#c8933a'}
                  onBlur={e => e.target.style.borderColor = errors.email ? '#8b3a3a' : '#e8e3d8'}
                />
                {errors.email && <p className="text-xs mt-1" style={{ color: '#8b3a3a' }}>{errors.email}</p>}
              </Field>
              <Field label="Telefoonnummer">
                <input
                  className={inputCls}
                  style={inputStyle}
                  value={form.telefoonnummer}
                  onChange={e => set('telefoonnummer', e.target.value)}
                  placeholder="+31612345678"
                  onFocus={e => e.target.style.borderColor = '#c8933a'}
                  onBlur={e => e.target.style.borderColor = '#e8e3d8'}
                />
              </Field>
            </div>

            {/* Address */}
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2">
                <Field label="Adres">
                  <input
                    className={inputCls}
                    style={inputStyle}
                    value={form.adres}
                    onChange={e => set('adres', e.target.value)}
                    onFocus={e => e.target.style.borderColor = '#c8933a'}
                    onBlur={e => e.target.style.borderColor = '#e8e3d8'}
                  />
                </Field>
              </div>
              <Field label="Postcode">
                <input
                  className={inputCls}
                  style={inputStyle}
                  value={form.postcode}
                  onChange={e => set('postcode', e.target.value)}
                  onFocus={e => e.target.style.borderColor = '#c8933a'}
                  onBlur={e => e.target.style.borderColor = '#e8e3d8'}
                />
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Field label="Woonplaats">
                <input
                  className={inputCls}
                  style={inputStyle}
                  value={form.woonplaats}
                  onChange={e => set('woonplaats', e.target.value)}
                  onFocus={e => e.target.style.borderColor = '#c8933a'}
                  onBlur={e => e.target.style.borderColor = '#e8e3d8'}
                />
              </Field>
              <Field label="Status">
                <select
                  className={inputCls}
                  style={inputStyle}
                  value={form.status}
                  onChange={e => set('status', e.target.value)}
                >
                  <option>Active</option>
                  <option>Inactive</option>
                </select>
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Field label="Geboortedatum">
                <input
                  type="date"
                  className={inputCls}
                  style={inputStyle}
                  value={form.geboortedatum}
                  onChange={e => set('geboortedatum', e.target.value)}
                  onFocus={e => e.target.style.borderColor = '#c8933a'}
                  onBlur={e => e.target.style.borderColor = '#e8e3d8'}
                />
              </Field>
              <Field label="Geboorteplaats">
                <input
                  className={inputCls}
                  style={inputStyle}
                  value={form.geboorteplaats}
                  onChange={e => set('geboorteplaats', e.target.value)}
                  onFocus={e => e.target.style.borderColor = '#c8933a'}
                  onBlur={e => e.target.style.borderColor = '#e8e3d8'}
                />
              </Field>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div
          className="flex items-center justify-end gap-3 px-6 py-4 shrink-0"
          style={{ borderTop: '1px solid #e8e3d8', background: '#f4f1eb' }}
        >
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded text-sm transition-colors"
            style={{ background: 'white', border: '1px solid #e8e3d8', color: '#5c5852', cursor: 'pointer' }}
            onMouseEnter={e => e.currentTarget.style.background = '#e8e3d8'}
            onMouseLeave={e => e.currentTarget.style.background = 'white'}
          >
            Annuleren
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            className="px-4 py-2 rounded text-sm transition-colors"
            style={{ background: '#c8933a', color: 'white', border: 'none', cursor: 'pointer' }}
            onMouseEnter={e => e.currentTarget.style.background = '#daa85a'}
            onMouseLeave={e => e.currentTarget.style.background = '#c8933a'}
          >
            {member ? 'Bijwerken' : 'Toevoegen'}
          </button>
        </div>
      </div>
    </div>
  );
}
