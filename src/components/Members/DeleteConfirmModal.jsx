import { AlertTriangle, X } from 'lucide-react';

export default function DeleteConfirmModal({ member, onClose, onConfirm }) {
  if (!member) return null;
  const fullName = [member.voornamen, member.tussenvoegsel, member.achternaam].filter(Boolean).join(' ');

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(13,27,42,0.7)', backdropFilter: 'blur(4px)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="w-full max-w-sm rounded-xl shadow-2xl p-6"
        style={{ background: 'white' }}
      >
        <div className="flex items-center gap-3 mb-4">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
            style={{ background: '#faeaea' }}
          >
            <AlertTriangle size={20} style={{ color: '#8b3a3a' }} />
          </div>
          <div>
            <h3 className="font-display text-base" style={{ fontWeight: 400, color: '#0d1b2a' }}>Lid verwijderen</h3>
            <p className="text-xs" style={{ color: '#9b9790' }}>Deze actie kan niet ongedaan worden gemaakt</p>
          </div>
        </div>
        <p className="text-sm mb-6" style={{ color: '#5c5852' }}>
          Weet u zeker dat u <strong>{fullName}</strong> ({member.lidnummer}) wilt verwijderen?
          Alle bijbehorende betalingsgegevens worden ook verwijderd.
        </p>
        <div className="flex items-center gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded text-sm transition-colors"
            style={{ background: '#f4f1eb', border: '1px solid #e8e3d8', color: '#5c5852', cursor: 'pointer' }}
          >
            Annuleren
          </button>
          <button
            onClick={() => { onConfirm(member.id); onClose(); }}
            className="px-4 py-2 rounded text-sm font-medium transition-colors"
            style={{ background: '#8b3a3a', color: 'white', border: 'none', cursor: 'pointer' }}
            onMouseEnter={e => e.currentTarget.style.background = '#a04040'}
            onMouseLeave={e => e.currentTarget.style.background = '#8b3a3a'}
          >
            Verwijderen
          </button>
        </div>
      </div>
    </div>
  );
}
