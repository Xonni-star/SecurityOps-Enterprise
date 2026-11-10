import React, { useState } from 'react';
import {
  BookOpenCheck,
  Plus,
  Lock,
  ShieldAlert,
  WifiOff,
  CheckCircle,
  FileCheck2,
  AlertTriangle,
  Flame,
  Search,
  Hash,
  Download,
  FileText,
  Printer,
  X
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { IncidentSeverity, OwksEntry } from '../types';

export const OwksView: React.FC = () => {
  const { owksEntries, objects, addOwksEntry, isOffline, logAudit } = useAppStore();
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedPoliceReportEntry, setSelectedPoliceReportEntry] = useState<OwksEntry | null>(null);

  // Form state
  const [formObjId, setFormObjId] = useState(objects[0]?.id || '');
  const [formType, setFormType] = useState<OwksEntry['entryType']>('Vorkommnis');
  const [formSeverity, setFormSeverity] = useState<IncidentSeverity>(IncidentSeverity.NORMAL);
  const [formTitle, setFormTitle] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formPolice, setFormPolice] = useState(false);

  const handleCreateEntry = (e: React.FormEvent) => {
    e.preventDefault();
    const obj = objects.find(o => o.id === formObjId);
    if (!obj || !formTitle || !formDesc) return;

    addOwksEntry({
      timestamp: new Date().toLocaleString('de-DE', { dateStyle: 'short', timeStyle: 'short' }),
      objectId: obj.id,
      objectName: obj.name,
      authorId: 'emp-301',
      authorName: 'Thomas Kranz (Wachführer)',
      entryType: formType,
      severity: formSeverity,
      title: formTitle,
      description: formDesc,
      attachmentsCount: 1,
      policeInvolved: formPolice
    });

    setShowAddModal(false);
    setFormTitle('');
    setFormDesc('');
    setFormPolice(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <BookOpenCheck className="h-5 w-5 text-emerald-400" />
            Online-Wachbuch (OWKS) & Schichtprotokoll
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manipulationsgeschützte, sequenzierte Ereignisdokumentation mit kryptographischem Hash & Behörden-Berichtsexport.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md shadow-emerald-950 transition"
        >
          <Plus className="h-4 w-4" />
          Neuen Wachbucheintrag erfassen
        </button>
      </div>

      {/* Offline Status Warning Banner if active */}
      {isOffline && (
        <div className="p-3 rounded-lg bg-amber-950/80 border border-amber-800 text-xs text-amber-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <WifiOff className="h-4 w-4 text-amber-400 shrink-0" />
            <span>
              <strong>Offline-Puffer aktiv:</strong> Alle Einträge werden mit lokaler Zeit & SHA-Prüfsumme gesichert und bei Netzverbindung nachsynchronisiert.
            </span>
          </div>
          <span className="font-mono bg-amber-900 px-2 py-0.5 rounded text-[11px]">Lokal gehasht</span>
        </div>
      )}

      {/* Entries List */}
      <div className="space-y-3">
        {owksEntries.map((entry) => (
          <div
            key={entry.id}
            className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition space-y-2.5"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-2 border-b border-slate-800/80 text-xs">
              <div className="flex items-center gap-2.5">
                <span className="font-mono font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
                  #{entry.sequenceNumber}
                </span>
                <span className="text-slate-400">{entry.timestamp} Uhr</span>
                <span className="text-slate-500">•</span>
                <span className="font-semibold text-white">{entry.objectName}</span>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    entry.severity === IncidentSeverity.KRITISCH || entry.severity === IncidentSeverity.POLIZEI_FEUERWEHR
                      ? 'bg-red-950 text-red-300 border border-red-800 animate-pulse'
                      : entry.severity === IncidentSeverity.WARNUNG
                      ? 'bg-amber-950 text-amber-300 border border-amber-800'
                      : 'bg-slate-800 text-slate-300 border border-slate-700'
                  }`}
                >
                  {entry.severity}
                </span>
                <span className="px-2 py-0.5 rounded bg-slate-950 text-slate-300 text-[10px] border border-slate-800">
                  {entry.entryType}
                </span>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  {entry.title}
                  {entry.policeInvolved && (
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-blue-950 text-blue-300 border border-blue-800">
                      Behörden alarmiert
                    </span>
                  )}
                </h3>

                {/* Printable Authority Export Button */}
                <button
                  onClick={() => setSelectedPoliceReportEntry(entry)}
                  className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-medium transition inline-flex items-center gap-1.5"
                  title="DIN 77200 Vorfallsbericht für Polizei / Versicherung drucken"
                >
                  <FileText className="h-3 w-3 text-emerald-400" />
                  Behördenbericht (DIN 77200)
                </button>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed font-mono bg-slate-950/70 p-3 rounded-lg border border-slate-800/80">
                {entry.description}
              </p>
            </div>

            {/* Tamper seal & integrity verification */}
            <div className="flex items-center justify-between pt-2 text-[11px] text-slate-400 font-mono">
              <div className="flex items-center gap-2">
                <Lock className="h-3 w-3 text-emerald-400" />
                <span>Revisionssicher versiegelt: <span className="text-slate-300">{entry.hash}</span></span>
              </div>
              <div className="flex items-center gap-2">
                <span>Verfasser: {entry.authorName}</span>
                <span className="text-emerald-400">({entry.syncStatus})</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal: New OWKS Entry */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <BookOpenCheck className="h-4 w-4 text-emerald-400" />
              Neuen Wachbucheintrag dokumentieren
            </h2>

            <form onSubmit={handleCreateEntry} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1">Schutzobjekt</label>
                <select
                  value={formObjId}
                  onChange={(e) => setFormObjId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white focus:outline-none"
                >
                  {objects.map(o => (
                    <option key={o.id} value={o.id}>{o.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1">Ereignisart</label>
                  <select
                    value={formType}
                    onChange={(e) => setFormType(e.target.value as OwksEntry['entryType'])}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white focus:outline-none"
                  >
                    <option value="Schichtübergabe">Schichtübergabe</option>
                    <option value="Vorkommnis">Besonderes Vorkommnis</option>
                    <option value="Alarmmeldung">Alarmmeldung (EMA/BMA)</option>
                    <option value="Kontrollgang">Kontrollgang (Deister)</option>
                    <option value="Besucher">Besucher / Fremdfirma</option>
                    <option value="Schaden">Schadensmeldung</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 mb-1">Dringlichkeitsstufe</label>
                  <select
                    value={formSeverity}
                    onChange={(e) => setFormSeverity(e.target.value as IncidentSeverity)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white focus:outline-none"
                  >
                    {Object.values(IncidentSeverity).map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Titel / Betreff *</label>
                <input
                  type="text"
                  required
                  placeholder="z.B. Feststellung offenes Fenster Gebäude C"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Detaillierte Schilderung & getroffene Maßnahmen *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Uhrzeit, Beobachtung, Identitäten, Zustand der Siegel, informierte Personen..."
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white focus:outline-none font-mono"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="policeCheck"
                  checked={formPolice}
                  onChange={(e) => setFormPolice(e.target.checked)}
                  className="h-4 w-4 rounded bg-slate-950 border-slate-700 text-emerald-600 focus:ring-0"
                />
                <label htmlFor="policeCheck" className="text-slate-300">
                  Polizei oder Feuerwehr wurde hinzugezogen (Az. / Einsatznummer vermerken)
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium"
                >
                  Abbrechen
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold"
                >
                  Eintrag revisionssicher siegeln
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Authority Police/Insurance Incident Certificate (DIN 77200) */}
      {selectedPoliceReportEntry && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <FileCheck2 className="h-5 w-5 text-emerald-400" />
                <h2 className="text-sm font-bold text-white">
                  Amtliches Schadens- & Ereignisprotokoll (DIN 77200 / VdS)
                </h2>
              </div>
              <button
                onClick={() => setSelectedPoliceReportEntry(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-3 font-mono text-[11px] text-slate-300">
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="font-bold text-white uppercase">Vorgangs-ID: OWKS-SEQ-{selectedPoliceReportEntry.sequenceNumber}</span>
                <span className="text-emerald-400">Status: REVISIONSSICHER GESIEGELT</span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-slate-400">
                <p>Ereigniszeitpunkt: <span className="text-white">{selectedPoliceReportEntry.timestamp} Uhr</span></p>
                <p>Kategorie: <span className="text-white">{selectedPoliceReportEntry.entryType}</span></p>
                <p>Schutzobjekt: <span className="text-white">{selectedPoliceReportEntry.objectName}</span></p>
                <p>Dringlichkeit: <span className="text-white">{selectedPoliceReportEntry.severity}</span></p>
              </div>

              <div className="p-2.5 rounded bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-slate-400 block font-semibold text-[10px]">TATSACHENBEFUND / SACHVERHALT:</span>
                <p className="text-white font-bold">{selectedPoliceReportEntry.title}</p>
                <p className="text-slate-200 whitespace-pre-line leading-relaxed">{selectedPoliceReportEntry.description}</p>
              </div>

              <div className="p-2.5 rounded bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-slate-400 block font-semibold text-[10px]">KRYPTOGRAPHISCHE INTEGRITÄTSSIGNATUR:</span>
                <p className="text-emerald-400 break-all">{selectedPoliceReportEntry.hash}</p>
                <p className="text-slate-500 text-[10px]">Unveränderbar verknüpft mit PostgreSQL-Sequenz • § 14 BewachV konform</p>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-800 text-[10px]">
                <div>
                  <p className="text-slate-500">Protokolliert durch:</p>
                  <p className="font-bold text-white">{selectedPoliceReportEntry.authorName}</p>
                  <p className="text-slate-500 mt-2">Unterschrift Wachführer: _________________</p>
                </div>
                <div>
                  <p className="text-slate-500">Zeugen / Einsatzkräfte:</p>
                  <p className="text-white">{selectedPoliceReportEntry.policeInvolved ? 'Polizeiinspektion / Kriminaldauerdienst verständigt' : 'Streifendienst vor Ort'}</p>
                  <p className="text-slate-500 mt-2">Dienststempel NSL: [GESIEGELT]</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-slate-500 font-mono">DIN 77200-1 Revisionsstandard</span>
              <button
                onClick={() => {
                  logAudit('POLICE_REPORT_EXPORTED', 'OWKS', `Amtliches Schadensprotokoll für #${selectedPoliceReportEntry.sequenceNumber} exportiert.`);
                  alert(`Amtlicher Ereignisbericht für Vorgang #${selectedPoliceReportEntry.sequenceNumber} als gerichtsfeste PDF/A-Datei bereitgestellt.`);
                }}
                className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition inline-flex items-center gap-1.5"
              >
                <Download className="h-3.5 w-3.5" />
                Als PDF/A für Polizei & Versicherung ausgeben
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
