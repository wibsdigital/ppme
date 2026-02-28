import { useState, useRef } from 'react';
import { Download, Upload, FileText, AlertTriangle, CheckCircle, X } from 'lucide-react';
import useStore from '../store/useStore';
import { MONTHS } from '../utils/mockData';

function Section({ title, sub, icon: Icon, children }) {
  return (
    <div className="rounded-lg overflow-hidden" style={{ background: 'white', border: '1px solid #e8e3d8' }}>
      <div
        className="flex items-center gap-3 px-5 py-4"
        style={{ borderBottom: '1px solid #e8e3d8', background: '#f4f1eb' }}
      >
        <div className="w-8 h-8 rounded flex items-center justify-center" style={{ background: '#0d1b2a' }}>
          <Icon size={15} color="white" />
        </div>
        <div>
          <h3 className="font-display text-base" style={{ fontWeight: 400, color: '#0d1b2a' }}>{title}</h3>
          <p className="text-xs" style={{ color: '#9b9790' }}>{sub}</p>
        </div>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

export default function ImportExportPage() {
  const members  = useStore(s => s.members);
  const payments = useStore(s => s.payments);
  const addMember = useStore(s => s.addMember);

  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear  = now.getFullYear();

  const [exportType, setExportType] = useState('all');
  const [importFile, setImportFile] = useState(null);
  const [importPreview, setImportPreview] = useState([]);
  const [importDupes, setImportDupes]     = useState([]);
  const [importDone, setImportDone]       = useState(false);
  const [toast, setToast] = useState(null);
  const fileRef = useRef();

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Export helpers
  const toCSV = (rows, headers) => {
    const lines = [headers.join(',')];
    rows.forEach(row => lines.push(headers.map(h => `"${row[h] ?? ''}"`).join(',')));
    return lines.join('\n');
  };

  const downloadCSV = (content, filename) => {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const url  = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
  };

  const handleExport = () => {
    let list = [...members];
    const stamp = `${currentYear}${String(currentMonth).padStart(2,'0')}`;

    if (exportType === 'all') {
      const headers = ['lidnummer','voornamen','tussenvoegsel','achternaam','membertype','burgerlijke_staat','contributietarief','email','telefoonnummer','adres','postcode','woonplaats','status'];
      downloadCSV(toCSV(list, headers), `leden-alle-${stamp}.csv`);
    } else if (exportType === 'unpaid') {
      const unpaidIds = payments
        .filter(p => p.month === currentMonth && p.year === currentYear && p.status !== 'Paid')
        .map(p => p.member_id);
      list = list.filter(m => unpaidIds.includes(m.id));
      const headers = ['lidnummer','voornamen','achternaam','email','telefoonnummer','contributietarief'];
      downloadCSV(toCSV(list, headers), `leden-onbetaald-${stamp}.csv`);
    } else if (exportType === 'filtered') {
      const curr = payments.filter(p => p.month === currentMonth && p.year === currentYear);
      const rows = list.map(m => {
        const p = curr.find(x => x.member_id === m.id);
        return { ...m, payment_status: p?.status || 'Unpaid', amount_paid: p?.amount_paid || 0 };
      });
      const headers = ['lidnummer','voornamen','achternaam','membertype','contributietarief','payment_status','amount_paid'];
      downloadCSV(toCSV(rows, headers), `leden-maand-${stamp}.csv`);
    }

    showToast('Export succesvol gedownload');
  };

  const handleExportPayments = () => {
    const rows = payments.map(p => {
      const member = members.find(m => m.id === p.member_id);
      return {
        lidnummer: member?.lidnummer || '',
        naam: member ? `${member.voornamen} ${member.achternaam}` : '',
        maand: MONTHS[p.month - 1],
        jaar: p.year,
        verwacht: p.amount_due,
        betaald: p.amount_paid,
        status: p.status,
        betaaldatum: p.payment_date || '',
        methode: p.payment_method,
        referentie: p.reference_note,
      };
    }).sort((a, b) => b.jaar - a.jaar || MONTHS.indexOf(b.maand) - MONTHS.indexOf(a.maand));
    const headers = ['lidnummer','naam','maand','jaar','verwacht','betaald','status','betaaldatum','methode','referentie'];
    downloadCSV(toCSV(rows, headers), `betalingen-export.csv`);
    showToast('Betalingshistorie geëxporteerd');
  };

  // Import CSV
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImportFile(file);
    setImportDone(false);

    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target.result;
      const lines = text.trim().split('\n');
      if (lines.length < 2) return;
      const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim().toLowerCase());
      const rows = lines.slice(1).map(line => {
        const vals = line.split(',').map(v => v.replace(/"/g, '').trim());
        const obj = {};
        headers.forEach((h, i) => obj[h] = vals[i] || '');
        return obj;
      }).filter(r => Object.values(r).some(Boolean));

      // Check dupes by email or lidnummer
      const dupes = rows.filter(r =>
        members.some(m => m.email === r.email || m.lidnummer === r.lidnummer)
      );
      setImportPreview(rows.slice(0, 5));
      setImportDupes(dupes.map(d => d.lidnummer || d.email));
    };
    reader.readAsText(file);
  };

  const handleImport = () => {
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target.result;
      const lines = text.trim().split('\n');
      const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim().toLowerCase());
      const rows = lines.slice(1).map(line => {
        const vals = line.split(',').map(v => v.replace(/"/g, '').trim());
        const obj = {};
        headers.forEach((h, i) => obj[h] = vals[i] || '');
        return obj;
      }).filter(r => Object.values(r).some(Boolean));

      const newRows = rows.filter(r =>
        !members.some(m => m.email === r.email || m.lidnummer === r.lidnummer)
      );

      newRows.forEach(r => {
        addMember({
          voornamen: r.voornamen || r.firstname || '',
          tussenvoegsel: r.tussenvoegsel || '',
          achternaam: r.achternaam || r.lastname || '',
          lidnummer: r.lidnummer || r.id || '',
          membertype: r.membertype || 'Lid',
          burgerlijke_staat: r.burgerlijke_staat || 'Single',
          betaal_methode: r.betaal_methode || 'Bank Transfer',
          adres: r.adres || '',
          postcode: r.postcode || '',
          woonplaats: r.woonplaats || 'Amsterdam',
          geboortedatum: r.geboortedatum || '',
          geboorteplaats: r.geboorteplaats || '',
          email: r.email || '',
          telefoonnummer: r.telefoonnummer || '',
        });
      });

      setImportDone(true);
      showToast(`${newRows.length} leden geïmporteerd (${rows.length - newRows.length} duplicaten overgeslagen)`);
    };
    reader.readAsText(importFile);
  };

  const downloadTemplate = () => {
    const template = 'lidnummer,voornamen,tussenvoegsel,achternaam,membertype,burgerlijke_staat,betaal_methode,adres,postcode,woonplaats,geboortedatum,geboorteplaats,email,telefoonnummer\nAG-013,Mohammed,,Amin,Lid,Single,Bank Transfer,"Nieuwmarkt 8","1011 PW",Amsterdam,1995-03-20,Amsterdam,m.amin@email.com,+31612345679';
    downloadCSV(template, 'leden-import-template.csv');
    showToast('Template gedownload');
  };

  return (
    <div className="space-y-5 animate-enter max-w-3xl">
      {/* Toast */}
      {toast && (
        <div
          className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg animate-enter"
          style={{
            background: toast.type === 'success' ? '#0d1b2a' : '#8b3a3a',
            color: 'white',
            border: `1px solid ${toast.type === 'success' ? '#c8933a' : '#c05050'}`,
          }}
        >
          {toast.type === 'success' ? <CheckCircle size={15} style={{ color: '#c8933a' }} /> : <AlertTriangle size={15} />}
          <span className="text-sm">{toast.msg}</span>
          <button onClick={() => setToast(null)} style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer' }}>
            <X size={13} />
          </button>
        </div>
      )}

      {/* Export */}
      <Section icon={Download} title="Exporteer Leden" sub="Download ledenlijst als CSV-bestand">
        <div className="space-y-4">
          <div className="flex gap-3 flex-wrap">
            {[
              { value: 'all', label: 'Alle leden', count: members.length },
              { value: 'unpaid', label: 'Onbetaald deze maand', count: payments.filter(p => p.month === currentMonth && p.year === currentYear && p.status !== 'Paid').length },
              { value: 'filtered', label: 'Met betaalstatus', count: members.filter(m => m.status === 'Active').length },
            ].map(opt => (
              <button
                key={opt.value}
                onClick={() => setExportType(opt.value)}
                className="flex items-center gap-2 px-4 py-2.5 rounded text-sm transition-all"
                style={{
                  background: exportType === opt.value ? '#0d1b2a' : '#f4f1eb',
                  color: exportType === opt.value ? 'white' : '#5c5852',
                  border: `1px solid ${exportType === opt.value ? '#0d1b2a' : '#e8e3d8'}`,
                  cursor: 'pointer',
                }}
              >
                <span>{opt.label}</span>
                <span
                  className="px-1.5 py-0.5 rounded-full text-xs"
                  style={{
                    background: exportType === opt.value ? 'rgba(255,255,255,0.15)' : '#e8e3d8',
                    color: exportType === opt.value ? 'white' : '#7c7870',
                  }}
                >
                  {opt.count}
                </span>
              </button>
            ))}
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-5 py-2.5 rounded text-sm font-medium transition-colors"
              style={{ background: '#c8933a', color: 'white', border: 'none', cursor: 'pointer' }}
              onMouseEnter={e => e.currentTarget.style.background = '#daa85a'}
              onMouseLeave={e => e.currentTarget.style.background = '#c8933a'}
            >
              <Download size={15} />
              Download CSV
            </button>
            <button
              onClick={handleExportPayments}
              className="flex items-center gap-2 px-5 py-2.5 rounded text-sm font-medium transition-colors"
              style={{ background: '#f4f1eb', color: '#0d1b2a', border: '1px solid #e8e3d8', cursor: 'pointer' }}
              onMouseEnter={e => e.currentTarget.style.background = '#e8e3d8'}
              onMouseLeave={e => e.currentTarget.style.background = '#f4f1eb'}
            >
              <Download size={15} />
              Export betalingen
            </button>
          </div>
        </div>
      </Section>

      {/* Import */}
      <Section icon={Upload} title="Importeer Leden" sub="Upload een CSV-bestand om leden toe te voegen">
        <div className="space-y-4">
          {/* Download template */}
          <button
            onClick={downloadTemplate}
            className="flex items-center gap-2 px-3 py-2 rounded text-xs transition-colors"
            style={{ background: '#eef4f9', color: '#2f4f72', border: '1px solid #a5bfd4', cursor: 'pointer' }}
          >
            <FileText size={13} /> Download import-sjabloon
          </button>

          {/* Drop zone */}
          <div
            className="border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer"
            style={{ borderColor: '#e8e3d8', background: '#faf8f4' }}
            onClick={() => fileRef.current?.click()}
            onDragOver={e => { e.preventDefault(); e.currentTarget.style.borderColor = '#c8933a'; }}
            onDragLeave={e => e.currentTarget.style.borderColor = '#e8e3d8'}
            onDrop={e => {
              e.preventDefault();
              e.currentTarget.style.borderColor = '#e8e3d8';
              const file = e.dataTransfer.files[0];
              if (file) { const dt = new DataTransfer(); dt.items.add(file); fileRef.current.files = dt.files; handleFileChange({ target: { files: [file] } }); }
            }}
          >
            <input ref={fileRef} type="file" accept=".csv" className="hidden" onChange={handleFileChange} />
            <Upload size={28} className="mx-auto mb-3" style={{ color: '#9b9790' }} />
            <p className="text-sm font-medium" style={{ color: '#5c5852' }}>
              {importFile ? importFile.name : 'Klik of sleep een CSV-bestand hier'}
            </p>
            <p className="text-xs mt-1" style={{ color: '#9b9790' }}>Alleen .csv bestanden</p>
          </div>

          {/* Preview */}
          {importPreview.length > 0 && !importDone && (
            <div className="space-y-3">
              <div>
                <p className="text-xs font-medium mb-2 uppercase tracking-wider" style={{ color: '#7c7870', letterSpacing: '0.08em' }}>
                  Voorbeeld (eerste 5 rijen)
                </p>
                <div className="overflow-x-auto rounded" style={{ border: '1px solid #e8e3d8' }}>
                  <table className="w-full text-xs" style={{ borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ background: '#f4f1eb' }}>
                        {Object.keys(importPreview[0]).map(k => (
                          <th key={k} className="px-3 py-2 text-left font-medium" style={{ color: '#7c7870', borderBottom: '1px solid #e8e3d8' }}>{k}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {importPreview.map((row, i) => (
                        <tr key={i} style={{ borderBottom: '1px solid #f0ebe0' }}>
                          {Object.values(row).map((v, j) => (
                            <td key={j} className="px-3 py-2" style={{ color: '#5c5852' }}>{v}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {importDupes.length > 0 && (
                <div
                  className="flex items-start gap-2 p-3 rounded"
                  style={{ background: '#fdf3e3', border: '1px solid #e8c080' }}
                >
                  <AlertTriangle size={15} style={{ color: '#7a5c2d', marginTop: 1 }} />
                  <div>
                    <p className="text-xs font-medium" style={{ color: '#7a5c2d' }}>
                      {importDupes.length} duplicaat(en) gevonden
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: '#9b7840' }}>
                      {importDupes.join(', ')} — worden overgeslagen bij import
                    </p>
                  </div>
                </div>
              )}

              <button
                onClick={handleImport}
                className="flex items-center gap-2 px-5 py-2.5 rounded text-sm font-medium transition-colors"
                style={{ background: '#0d1b2a', color: 'white', border: 'none', cursor: 'pointer' }}
                onMouseEnter={e => e.currentTarget.style.background = '#1a2d43'}
                onMouseLeave={e => e.currentTarget.style.background = '#0d1b2a'}
              >
                <Upload size={15} /> Importeer leden
              </button>
            </div>
          )}

          {importDone && (
            <div
              className="flex items-center gap-2 p-3 rounded"
              style={{ background: '#e8f5ee', border: '1px solid #a0c8b0' }}
            >
              <CheckCircle size={15} style={{ color: '#2d7a4f' }} />
              <span className="text-sm" style={{ color: '#2d7a4f' }}>Import succesvol afgerond!</span>
            </div>
          )}
        </div>
      </Section>

      {/* CSV format info */}
      <Section icon={FileText} title="CSV Formaat" sub="Verwachte kolommen voor import">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {[
            'lidnummer', 'voornamen', 'tussenvoegsel', 'achternaam',
            'membertype', 'burgerlijke_staat', 'betaal_methode',
            'adres', 'postcode', 'woonplaats',
            'geboortedatum', 'geboorteplaats', 'email', 'telefoonnummer'
          ].map(field => (
            <div
              key={field}
              className="px-3 py-2 rounded text-xs font-mono"
              style={{ background: '#f4f1eb', color: '#4a6d90', border: '1px solid #e8e3d8' }}
            >
              {field}
            </div>
          ))}
        </div>
        <p className="text-xs mt-3" style={{ color: '#9b9790' }}>
          Verplichte velden: voornamen, achternaam, lidnummer, email
        </p>
      </Section>
    </div>
  );
}
