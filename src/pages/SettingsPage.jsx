import { useState } from 'react';
import { Save, Shield, Building, Euro, User } from 'lucide-react';
import apiStore from '../store/apiStore';

function SettingSection({ icon: Icon, title, children }) {
  return (
    <div className="rounded-lg overflow-hidden" style={{ background: 'white', border: '1px solid #e8e3d8' }}>
      <div
        className="flex items-center gap-3 px-5 py-4"
        style={{ borderBottom: '1px solid #e8e3d8', background: '#f4f1eb' }}
      >
        <div className="w-8 h-8 rounded flex items-center justify-center" style={{ background: '#0d1b2a' }}>
          <Icon size={14} color="white" />
        </div>
        <h3 className="font-display text-base" style={{ fontWeight: 400, color: '#0d1b2a' }}>{title}</h3>
      </div>
      <div className="p-5 space-y-4">{children}</div>
    </div>
  );
}

const inputCls = "w-full px-3 py-2 rounded text-sm border transition-colors";
const inputStyle = { border: '1px solid #e8e3d8', outline: 'none', background: 'white', color: '#0d1b2a' };

function Field({ label, sub, children }) {
  return (
    <div>
      <label className="block text-xs font-medium mb-1 uppercase tracking-wide" style={{ color: '#7c7870', letterSpacing: '0.08em' }}>
        {label}
      </label>
      {sub && <p className="text-xs mb-1.5" style={{ color: '#9b9790' }}>{sub}</p>}
      {children}
    </div>
  );
}

export default function SettingsPage() {
  const settings = apiStore(s => s.settings);
  const updateSettings = apiStore(s => s.updateSettings);
  const adminUser = apiStore(s => s.adminUser);
  const logout = apiStore(s => s.logout);

  const [form, setForm] = useState({ ...settings });
  const [saved, setSaved] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ current: '', newPw: '', confirm: '' });
  const [pwError, setPwError] = useState('');

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = (e) => {
    e.preventDefault();
    updateSettings(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (passwordForm.current !== 'ppme2024') { setPwError('Huidig wachtwoord onjuist.'); return; }
    if (passwordForm.newPw !== passwordForm.confirm) { setPwError('Wachtwoorden komen niet overeen.'); return; }
    if (passwordForm.newPw.length < 6) { setPwError('Wachtwoord moet minimaal 6 tekens zijn.'); return; }
    setPwError('');
    setPasswordForm({ current: '', newPw: '', confirm: '' });
    alert('Wachtwoord bijgewerkt (demo: alleen visuele feedback)');
  };

  return (
    <div className="space-y-5 animate-enter max-w-2xl">
      {/* Org settings */}
      <SettingSection icon={Building} title="Organisatie-instellingen">
        <form onSubmit={handleSave} className="space-y-4">
          <Field label="Naam organisatie">
            <input
              className={inputCls}
              style={inputStyle}
              value={form.organizationName}
              onChange={e => set('organizationName', e.target.value)}
              onFocus={e => e.target.style.borderColor = '#c8933a'}
              onBlur={e => e.target.style.borderColor = '#e8e3d8'}
            />
          </Field>
          <Field label="Valuta">
            <select
              className={inputCls}
              style={inputStyle}
              value={form.currency}
              onChange={e => set('currency', e.target.value)}
            >
              <option value="EUR">EUR — Euro</option>
              <option value="USD">USD — Dollar</option>
              <option value="GBP">GBP — Pond</option>
            </select>
          </Field>
          <Field label="Standaard betaalmethode">
            <select
              className={inputCls}
              style={inputStyle}
              value={form.defaultPaymentMethod}
              onChange={e => set('defaultPaymentMethod', e.target.value)}
            >
              {['Bank Transfer', 'Cash', 'iDEAL', 'Other'].map(m => <option key={m}>{m}</option>)}
            </select>
          </Field>
        </form>
      </SettingSection>

      {/* Contribution rates */}
      <SettingSection icon={Euro} title="Contributietarieven">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Tarief gehuwd (€/maand)" sub="Leden met burgerlijke staat: Gehuwd">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm" style={{ color: '#9b9790' }}>€</span>
              <input
                type="number"
                min="1"
                className={inputCls}
                style={{ ...inputStyle, paddingLeft: '28px' }}
                value={form.contributionMarried}
                onChange={e => set('contributionMarried', Number(e.target.value))}
                onFocus={e => e.target.style.borderColor = '#c8933a'}
                onBlur={e => e.target.style.borderColor = '#e8e3d8'}
              />
            </div>
          </Field>
          <Field label="Tarief alleenstaand (€/maand)" sub="Leden met burgerlijke staat: Single">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm" style={{ color: '#9b9790' }}>€</span>
              <input
                type="number"
                min="1"
                className={inputCls}
                style={{ ...inputStyle, paddingLeft: '28px' }}
                value={form.contributionSingle}
                onChange={e => set('contributionSingle', Number(e.target.value))}
                onFocus={e => e.target.style.borderColor = '#c8933a'}
                onBlur={e => e.target.style.borderColor = '#e8e3d8'}
              />
            </div>
          </Field>
        </div>
        <div
          className="p-3 rounded text-xs"
          style={{ background: '#fdf7ef', border: '1px solid #f2d9a8', color: '#7a5c2d' }}
        >
          Wijzigingen aan tarieven zijn alleen van toepassing op nieuwe leden. Bestaande leden moeten handmatig worden bijgewerkt.
        </div>
      </SettingSection>

      {/* Save button */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-5 py-2.5 rounded text-sm font-medium transition-colors"
          style={{ background: '#0d1b2a', color: 'white', border: 'none', cursor: 'pointer' }}
          onMouseEnter={e => e.currentTarget.style.background = '#1a2d43'}
          onMouseLeave={e => e.currentTarget.style.background = '#0d1b2a'}
        >
          <Save size={15} /> Instellingen opslaan
        </button>
        {saved && (
          <span className="text-sm" style={{ color: '#2d7a4f' }}>✓ Opgeslagen</span>
        )}
      </div>

      {/* Account */}
      <SettingSection icon={User} title="Accountbeheer">
        <div
          className="flex items-center gap-4 p-4 rounded"
          style={{ background: '#f4f1eb', border: '1px solid #e8e3d8' }}
        >
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold"
            style={{ background: '#0d1b2a', color: 'white' }}
          >
            {adminUser?.name[0]}
          </div>
          <div>
            <div className="font-medium" style={{ color: '#0d1b2a' }}>{adminUser?.name}</div>
            <div className="text-xs" style={{ color: '#9b9790' }}>{adminUser?.role} · {adminUser?.username}</div>
          </div>
        </div>

        <form onSubmit={handlePasswordChange} className="space-y-3">
          <p className="text-xs font-medium uppercase tracking-wider" style={{ color: '#7c7870', letterSpacing: '0.08em' }}>
            Wachtwoord wijzigen
          </p>
          <input
            type="password"
            className={inputCls}
            style={inputStyle}
            value={passwordForm.current}
            onChange={e => setPasswordForm(f => ({ ...f, current: e.target.value }))}
            placeholder="Huidig wachtwoord"
            onFocus={e => e.target.style.borderColor = '#c8933a'}
            onBlur={e => e.target.style.borderColor = '#e8e3d8'}
          />
          <input
            type="password"
            className={inputCls}
            style={inputStyle}
            value={passwordForm.newPw}
            onChange={e => setPasswordForm(f => ({ ...f, newPw: e.target.value }))}
            placeholder="Nieuw wachtwoord"
            onFocus={e => e.target.style.borderColor = '#c8933a'}
            onBlur={e => e.target.style.borderColor = '#e8e3d8'}
          />
          <input
            type="password"
            className={inputCls}
            style={inputStyle}
            value={passwordForm.confirm}
            onChange={e => setPasswordForm(f => ({ ...f, confirm: e.target.value }))}
            placeholder="Bevestig nieuw wachtwoord"
            onFocus={e => e.target.style.borderColor = '#c8933a'}
            onBlur={e => e.target.style.borderColor = '#e8e3d8'}
          />
          {pwError && <p className="text-xs" style={{ color: '#8b3a3a' }}>{pwError}</p>}
          <button
            type="submit"
            className="px-4 py-2 rounded text-sm transition-colors"
            style={{ background: '#f4f1eb', border: '1px solid #e8e3d8', color: '#5c5852', cursor: 'pointer' }}
            onMouseEnter={e => e.currentTarget.style.background = '#e8e3d8'}
            onMouseLeave={e => e.currentTarget.style.background = '#f4f1eb'}
          >
            Wachtwoord bijwerken
          </button>
        </form>
      </SettingSection>

      {/* Security */}
      <SettingSection icon={Shield} title="Beveiliging">
        <div className="space-y-3">
          {[
            { label: 'Twee-factor authenticatie', sub: 'Extra beveiliging voor uw account (coming soon)', enabled: false },
            { label: 'Sessie-timeout', sub: 'Automatisch uitloggen na 30 minuten inactiviteit', enabled: true },
            { label: 'Audit log', sub: 'Alle acties worden gelogd voor veiligheidscontrole', enabled: true },
          ].map(item => (
            <div key={item.label} className="flex items-center justify-between py-2">
              <div>
                <div className="text-sm font-medium" style={{ color: '#0d1b2a' }}>{item.label}</div>
                <div className="text-xs" style={{ color: '#9b9790' }}>{item.sub}</div>
              </div>
              <div
                className="w-10 h-5 rounded-full relative transition-colors"
                style={{ background: item.enabled ? '#2d7a4f' : '#e8e3d8', cursor: 'not-allowed' }}
              >
                <div
                  className="absolute top-0.5 w-4 h-4 rounded-full transition-all"
                  style={{
                    background: 'white',
                    left: item.enabled ? '22px' : '2px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </SettingSection>

      {/* Logout */}
      <div
        className="p-4 rounded-lg flex items-center justify-between"
        style={{ background: '#faeaea', border: '1px solid #f0c0c0' }}
      >
        <div>
          <p className="text-sm font-medium" style={{ color: '#8b3a3a' }}>Uitloggen</p>
          <p className="text-xs" style={{ color: '#b07070' }}>U kunt op elk moment uitloggen uit het systeem</p>
        </div>
        <button
          onClick={logout}
          className="px-4 py-2 rounded text-sm font-medium transition-colors"
          style={{ background: '#8b3a3a', color: 'white', border: 'none', cursor: 'pointer' }}
          onMouseEnter={e => e.currentTarget.style.background = '#a04040'}
          onMouseLeave={e => e.currentTarget.style.background = '#8b3a3a'}
        >
          Uitloggen
        </button>
      </div>
    </div>
  );
}
