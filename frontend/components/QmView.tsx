import React, { useState } from 'react';
import {
  Award,
  Plus,
  CheckCircle2,
  AlertTriangle,
  FileCheck2,
  Calendar,
  X
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

export const QmView: React.FC = () => {
  const { qmAudits, objects, addQmAudit } = useAppStore();
  const [showAuditModal, setShowAuditModal] = useState<boolean>(false);

  // Form state
  const [formObjId, setFormObjId] = useState<string>(objects[0]?.id || '');
  const [formAuditor, setFormAuditor] = useState<string>('Klaus Lindemann (QM DIN 77200)');
  const [formScore, setFormScore] = useState<number>(94);
  const [formDefects, setFormDefects] = useState<number>(0);
  const [formMeasures, setFormMeasures] = useState<string>('');

  const handleCreateAuditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const obj = objects.find(o => o.id === formObjId);
    if (!obj || !formMeasures.trim()) return;

    addQmAudit({
      objectId: obj.id,
      objectName: obj.name,
      auditorName: formAuditor,
      auditDate: new Date().toISOString().split('T')[0],
      scorePercent: Number(formScore),
      defectsCount: Number(formDefects),
      status: Number(formScore) >= 90 ? 'In Ordnung' : 'Nachbesserung gefordert',
      measuresSummary: formMeasures.trim()
    });

    setShowAuditModal(false);
    setFormMeasures('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Award className="h-5 w-5 text-emerald-400" />
            Qualitätsmanagement (DIN 77200 & ISO 9001)
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Regelmäßige Objektkontrollen, Mängelverwaltung, Abstellmaßnahmen und Unterweisungsnachweise.
          </p>
        </div>

        <button
          onClick={() => setShowAuditModal(true)}
          className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md shadow-emerald-950 transition"
        >
          <Plus className="h-4 w-4" />
          Neues QM-Audit anlegen
        </button>
      </div>

      <div className="space-y-3">
        {qmAudits.map((a) => (
          <div
            key={a.id}
            className="p-5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition space-y-3"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-2 border-b border-slate-800 text-xs">
              <div>
                <span className="font-mono font-bold text-emerald-400">{a.auditNumber}</span>
                <span className="text-slate-400 ml-2">({a.auditDate})</span>
                <h3 className="font-bold text-white text-sm mt-0.5">{a.objectName}</h3>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-white font-mono bg-slate-800 px-2.5 py-1 rounded">
                  Score: {a.scorePercent}%
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    a.status === 'In Ordnung'
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      : 'bg-amber-950 text-amber-300 border border-amber-800'
                  }`}
                >
                  {a.status}
                </span>
              </div>
            </div>

            <div className="text-xs text-slate-300 font-mono bg-slate-950 p-3 rounded-lg border border-slate-800">
              <span className="text-slate-400 block mb-1">Festgestellte Maßnahmen & Auditbericht:</span>
              {a.measuresSummary}
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span>Auditor: {a.auditorName}</span>
              <span className="text-emerald-400 font-mono">{a.defectsCount} festgestellte Mängel</span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal: New Audit */}
      {showAuditModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Award className="h-4 w-4 text-emerald-400" />
                Neues DIN 77200 QM-Audit erfassen
              </h2>
              <button
                onClick={() => setShowAuditModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreateAuditSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1">Schutzobjekt *</label>
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

              <div>
                <label className="block text-slate-300 mb-1">Auditor (Name & Zertifikat) *</label>
                <input
                  type="text"
                  required
                  value={formAuditor}
                  onChange={(e) => setFormAuditor(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-300 mb-1">Erreichte Gesamtpunktzahl (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    required
                    value={formScore}
                    onChange={(e) => setFormScore(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Anzahl Mängel</label>
                  <input
                    type="number"
                    min="0"
                    value={formDefects}
                    onChange={(e) => setFormDefects(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Mängelbericht & Abstellmaßnahmen *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Überprüfung Dienstausweise, Wachfunk, Schutzausrüstung, Schlüsselplomben..."
                  value={formMeasures}
                  onChange={(e) => setFormMeasures(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white focus:outline-none font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAuditModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium"
                >
                  Abbrechen
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold"
                >
                  Audit protokollieren
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
