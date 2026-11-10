import React, { useState } from 'react';
import {
  FileText,
  Upload,
  Download,
  Eye,
  CheckCircle2,
  AlertCircle,
  X
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { DocumentItem } from '../types';

export const DocsView: React.FC = () => {
  const { documents, addDocument, acknowledgeDocument, objects } = useAppStore();
  const [showUploadModal, setShowUploadModal] = useState<boolean>(false);

  // Form state
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState<DocumentItem['category']>('Dienstanweisung');
  const [formRefName, setFormRefName] = useState(objects[0]?.name || 'Allgemein');
  const [formVersion, setFormVersion] = useState('2.5');
  const [formRequiresAck, setFormRequiresAck] = useState(true);

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    addDocument({
      title: formTitle.trim(),
      category: formCategory,
      referenceType: 'Objekt',
      referenceName: formRefName,
      version: formVersion,
      fileSize: '1.8 MB (PDF/A)',
      requiresAcknowledgment: formRequiresAck
    });

    setShowUploadModal(false);
    setFormTitle('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <FileText className="h-5 w-5 text-emerald-400" />
            Dokumentenmanagement (DMS)
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Zentrales Archiv für Dienstanweisungen, Alarmpläne, Sachkundenachweise und verbindliche Lesebestätigungen.
          </p>
        </div>

        <button
          onClick={() => setShowUploadModal(true)}
          className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md shadow-emerald-950 transition"
        >
          <Upload className="h-4 w-4" />
          Neues Dokument hochladen
        </button>
      </div>

      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-3">Dokumentenbezeichnung</th>
                <th className="py-2.5 px-3">Kategorie</th>
                <th className="py-2.5 px-3">Zuordnung</th>
                <th className="py-2.5 px-3">Version</th>
                <th className="py-2.5 px-3">Dateigröße</th>
                <th className="py-2.5 px-3">Lesebestätigungen</th>
                <th className="py-2.5 px-3 text-right">Aktion</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {documents.map((doc) => (
                <tr key={doc.id} className="hover:bg-slate-850/60 transition">
                  <td className="py-3 px-3 font-semibold text-white">{doc.title}</td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 text-[10px]">
                      {doc.category}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-300">{doc.referenceName}</td>
                  <td className="py-3 px-3 font-mono text-emerald-400">v{doc.version}</td>
                  <td className="py-3 px-3 text-slate-400 font-mono">{doc.fileSize}</td>
                  <td className="py-3 px-3">
                    {doc.requiresAcknowledgment ? (
                      <span className="text-emerald-400 font-medium">
                        {doc.acknowledgedCount} MA bestätigt
                      </span>
                    ) : (
                      <span className="text-slate-500">Nicht erforderlich</span>
                    )}
                  </td>
                  <td className="py-3 px-3 text-right space-x-1.5">
                    {doc.requiresAcknowledgment && (
                      <button
                        onClick={() => {
                          acknowledgeDocument(doc.id);
                          alert(`Kenntnisnahme für "${doc.title}" wurde revisionssicher gezeichnet.`);
                        }}
                        className="px-2 py-1 rounded bg-slate-800 hover:bg-emerald-600 text-slate-200 hover:text-white text-[11px] transition"
                        title="Verbindlich quittieren"
                      >
                        Quittieren
                      </button>
                    )}
                    <button
                      onClick={() => alert(`Download für ${doc.title} wird ausgeführt.`)}
                      className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition inline-flex items-center"
                      title="Herunterladen"
                    >
                      <Download className="h-3.5 w-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Upload Document */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Upload className="h-4 w-4 text-emerald-400" />
                Neues Dokument ins DMS einstellen
              </h2>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1">Titel / Bezeichnung *</label>
                <input
                  type="text"
                  required
                  placeholder="z.B. Dienstanweisung DA-2025-02 Pforte Süd"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-300 mb-1">Kategorie</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as DocumentItem['category'])}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white focus:outline-none"
                  >
                    <option value="Dienstanweisung">Dienstanweisung</option>
                    <option value="Alarmplan">Alarmplan</option>
                    <option value="Objektplan">Objektplan</option>
                    <option value="QM-Protokoll">QM-Protokoll</option>
                    <option value="Sachkunde §34a">Sachkunde §34a</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Version</label>
                  <input
                    type="text"
                    required
                    value={formVersion}
                    onChange={(e) => setFormVersion(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Objekt-Zuordnung</label>
                <select
                  value={formRefName}
                  onChange={(e) => setFormRefName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white focus:outline-none"
                >
                  {objects.map(o => (
                    <option key={o.id} value={o.name}>{o.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="chkAck"
                  checked={formRequiresAck}
                  onChange={(e) => setFormRequiresAck(e.target.checked)}
                  className="rounded bg-slate-950 border-slate-700 text-emerald-600 focus:ring-0"
                />
                <label htmlFor="chkAck" className="text-slate-300">
                  Verbindliche Lesebestätigung (DIN 77200) für Wachkräfte anfordern
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium"
                >
                  Abbrechen
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold"
                >
                  Dokument archivieren
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
