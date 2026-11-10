import React, { useState } from 'react';
import {
  Clock,
  Play,
  Square,
  Lock,
  FileCheck2,
  Calendar,
  AlertCircle,
  Edit3,
  CheckCircle2,
  X
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { TimeRecord } from '../types';

export const ZeiterfassungView: React.FC = () => {
  const { timeRecords, addTimeRecordCorrection, logAudit } = useAppStore();
  const [activePunch, setActivePunch] = useState<boolean>(true);
  const [punchStart, setPunchStart] = useState<string>('06:00:14');
  const [selectedRecordForCorrection, setSelectedRecordForCorrection] = useState<TimeRecord | null>(null);
  const [correctedHours, setCorrectedHours] = useState<number>(8.0);
  const [correctionReason, setCorrectionReason] = useState<string>('');

  const handleApplyCorrection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRecordForCorrection || !correctionReason.trim()) return;

    addTimeRecordCorrection(selectedRecordForCorrection.id, Number(correctedHours), correctionReason.trim());
    setSelectedRecordForCorrection(null);
    setCorrectionReason('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Clock className="h-5 w-5 text-emerald-400" />
            Zeiterfassung & Arbeitszeitkonten
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Abgleich Soll/Ist, Zuschlagsberechnung (Nacht 23-06 Uhr, Sonntag, Feiertag) und revisionssichere Periodenabschlüsse.
          </p>
        </div>

        <button
          onClick={() => {
            logAudit('ZEITERFASSUNG_MONATSABSCHLUSS', 'WORKFORCE', 'Monatsabschluss April 2025 durch Buchhaltung revisionsfest gesperrt.');
            alert('Monatsabschluss April 2025 erfolgreich gesperrt. Nachträgliche Änderungen bedürfen nun einer begründeten Freigabe.');
          }}
          className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition"
        >
          <Lock className="h-3.5 w-3.5 text-emerald-400" />
          Monatsabschluss April 2025 sperren
        </button>
      </div>

      {/* Live Terminal Punch Simulator */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-slate-900 to-slate-950 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center justify-center font-bold">
            <Clock className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white">Digitales Stempelterminal (Wachlokal Tor 1)</h2>
            <p className="text-xs text-slate-400">Aktiver Mitarbeiter: Thomas Kranz (MA-0412) • Dienstbeginn: {punchStart}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setActivePunch(!activePunch)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition ${
              activePunch
                ? 'bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-950'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-950'
            }`}
          >
            {activePunch ? (
              <>
                <Square className="h-3.5 w-3.5" />
                Gehen stempeln (Feierabend)
              </>
            ) : (
              <>
                <Play className="h-3.5 w-3.5" />
                Kommen stempeln (Dienstbeginn)
              </>
            )}
          </button>
        </div>
      </div>

      {/* Time Records Table */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-white">Protokollierte Dienstzeiten & Zuschläge ({timeRecords.length})</h2>
          <span className="text-xs text-slate-400 font-mono">Mai 2025 (Laufend)</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-3">Datum</th>
                <th className="py-2.5 px-3">Sicherheitskraft</th>
                <th className="py-2.5 px-3">Kommen</th>
                <th className="py-2.5 px-3">Gehen</th>
                <th className="py-2.5 px-3">Gesamtstunden</th>
                <th className="py-2.5 px-3">Nachtstunden (+25%)</th>
                <th className="py-2.5 px-3">Sonntagsstd. (+50%)</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Aktion</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {timeRecords.map((r) => (
                <tr key={r.id} className="hover:bg-slate-850/60 transition">
                  <td className="py-3 px-3 font-mono text-slate-300">{r.date}</td>
                  <td className="py-3 px-3 font-semibold text-white">{r.employeeName}</td>
                  <td className="py-3 px-3 font-mono text-emerald-400">{r.clockIn} Uhr</td>
                  <td className="py-3 px-3 font-mono text-slate-300">{r.clockOut} Uhr</td>
                  <td className="py-3 px-3 font-bold text-white">{r.actualHours.toFixed(2)} Std.</td>
                  <td className="py-3 px-3 font-mono text-purple-300">{r.nightHours.toFixed(1)} Std.</td>
                  <td className="py-3 px-3 font-mono text-blue-300">{r.sundayHours.toFixed(1)} Std.</td>
                  <td className="py-3 px-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        r.status === 'Gesperrt'
                          ? 'bg-slate-800 text-slate-400 border border-slate-700'
                          : r.status === 'Freigegeben'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : 'bg-amber-950 text-amber-300 border border-amber-800'
                      }`}
                    >
                      {r.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => {
                        setSelectedRecordForCorrection(r);
                        setCorrectedHours(r.actualHours);
                      }}
                      className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] transition inline-flex items-center gap-1"
                    >
                      <Edit3 className="h-3 w-3" />
                      Korrektur
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Time Correction */}
      {selectedRecordForCorrection && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Edit3 className="h-4 w-4 text-emerald-400" />
                Zeiterfassungskorrektur (ArbZG § 16)
              </h2>
              <button
                onClick={() => setSelectedRecordForCorrection(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-3 rounded bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-1">
              <p><span className="text-slate-400">Mitarbeiter:</span> {selectedRecordForCorrection.employeeName}</p>
              <p><span className="text-slate-400">Datum:</span> {selectedRecordForCorrection.date}</p>
              <p><span className="text-slate-400">Bisherige Ist-Stunden:</span> {selectedRecordForCorrection.actualHours.toFixed(2)}h</p>
            </div>

            <form onSubmit={handleApplyCorrection} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1">Korrigierte Gesamtarbeitszeit (Std.) *</label>
                <input
                  type="number"
                  step="0.25"
                  required
                  value={correctedHours}
                  onChange={(e) => setCorrectedHours(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Gesetzlicher Korrekturgrund (Pflichtfeld) *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="z.B. Nachstempelung wegen verspäteter Schließdienst-Rückkehr bei BMA-Alarm..."
                  value={correctionReason}
                  onChange={(e) => setCorrectionReason(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white focus:outline-none font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedRecordForCorrection(null)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium"
                >
                  Abbrechen
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold"
                >
                  Korrektur revisionssicher buchen
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
