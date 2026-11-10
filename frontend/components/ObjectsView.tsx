import React, { useState } from 'react';
import {
  ShieldCheck,
  Plus,
  Key,
  Radio,
  MapPin,
  Flame,
  Camera,
  AlertOctagon,
  FileCheck,
  CheckCircle2,
  Clock,
  UserCheck,
  Building
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { SecurityObject, SecurityLevel } from '../types';

export const ObjectsView: React.FC = () => {
  const { objects, customers, addObject, checkpoints, scanCheckpoint, keyLogs, issueKey, returnKey } = useAppStore();
  const [selectedObj, setSelectedObj] = useState<SecurityObject>(objects[0]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showKeyModal, setShowKeyModal] = useState(false);

  // New object form state
  const [formName, setFormName] = useState('');
  const [formCustId, setFormCustId] = useState(customers[0]?.id || '');
  const [formAddress, setFormAddress] = useState('');
  const [formCity, setFormCity] = useState('');
  const [formSecLevel, setFormSecLevel] = useState<SecurityLevel>(SecurityLevel.STUFE_2);
  const [formLead, setFormLead] = useState('');
  const [formEmergency, setFormEmergency] = useState('+49 ');
  const [formOrders, setFormOrders] = useState('');

  // Key issuance form state
  const [keyNum, setKeyNum] = useState('SCHL-');
  const [keyLabel, setKeyLabel] = useState('');
  const [borrowerName, setBorrowerName] = useState('');
  const [borrowerCompany, setBorrowerCompany] = useState('');

  const handleCreateObject = (e: React.FormEvent) => {
    e.preventDefault();
    const cust = customers.find(c => c.id === formCustId);
    if (!formName || !cust) return;

    addObject({
      name: formName,
      customerId: cust.id,
      customerName: cust.companyName,
      locationAddress: formAddress,
      city: formCity,
      securityLevel: formSecLevel,
      status: 'Aktiv',
      objectLeadName: formLead || 'Bereitschaft Einsatzleitung',
      emergencyPhone: formEmergency,
      alarmSystems: {
        emaConnected: true,
        bmaConnected: true,
        cctvMonitoring: true,
        nsheConnected: false
      },
      keysCount: 24,
      transpondersCount: 40,
      checkpointsCount: 12,
      standingOrdersSnippet: formOrders || 'Standard-Dienstanweisung für Pforten- und Schließdienst.'
    });

    setShowAddModal(false);
    setFormName('');
    setFormAddress('');
  };

  const handleIssueKeySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyNum || !borrowerName || !selectedObj) return;

    issueKey(keyNum, keyLabel || 'Allgemeiner Schlüssel', borrowerName, borrowerCompany || 'Fremdfirma', selectedObj.id);
    setShowKeyModal(false);
    setKeyNum('SCHL-');
    setKeyLabel('');
    setBorrowerName('');
    setBorrowerCompany('');
  };

  const objectCheckpoints = checkpoints.filter(cp => cp.objectId === selectedObj?.id);
  const objectKeyLogs = keyLogs.filter(kl => kl.objectId === selectedObj?.id);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-emerald-400" />
            Objektverwaltung (Digitale Objektakte)
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Sicherheitsstufen (KRITIS), Gefährdungsbeurteilung, EMA/BMA Aufschaltung, Schlüsselbuch & Deister-Kontrollpunkte.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowKeyModal(true)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition"
          >
            <Key className="h-4 w-4 text-amber-400" />
            Schlüssel ausgeben
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md shadow-emerald-950 transition"
          >
            <Plus className="h-4 w-4" />
            Neues Schutzobjekt erfassen
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Objects Selector */}
        <div className="lg:col-span-1 space-y-2">
          <div className="text-xs font-semibold text-slate-400 px-1 uppercase tracking-wider">
            Objektverzeichnis ({objects.length})
          </div>

          <div className="space-y-2">
            {objects.map((obj) => {
              const isSelected = selectedObj?.id === obj.id;
              return (
                <div
                  key={obj.id}
                  onClick={() => setSelectedObj(obj)}
                  className={`p-3.5 rounded-xl border transition cursor-pointer ${
                    isSelected
                      ? 'bg-slate-800/90 border-emerald-500/80 shadow-md ring-1 ring-emerald-500/20'
                      : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="font-semibold text-white text-sm">{obj.name}</span>
                      <p className="text-xs text-slate-400 mt-0.5">{obj.customerName}</p>
                    </div>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                      {obj.status}
                    </span>
                  </div>

                  <div className="mt-2 text-xs text-slate-400 flex items-center gap-1.5">
                    <MapPin className="h-3 w-3 text-slate-400 shrink-0" />
                    <span className="truncate">{obj.locationAddress}, {obj.city}</span>
                  </div>

                  <div className="mt-2.5 pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                    <span className="font-mono">{obj.objectNumber}</span>
                    <span className="text-amber-400 text-[10px] font-semibold">{obj.securityLevel.split(' ')[0]}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Object Details Dossier */}
        <div className="lg:col-span-2">
          {selectedObj && (
            <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-5 border-b border-slate-800 gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-white">{selectedObj.name}</h2>
                    <span className="px-2 py-0.5 text-xs rounded bg-purple-950 text-purple-300 border border-purple-800 font-mono">
                      {selectedObj.securityLevel}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Objektnummer: <span className="text-slate-200 font-mono">{selectedObj.objectNumber}</span> • Kunde: <span className="text-emerald-400 font-semibold">{selectedObj.customerName}</span>
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-400 block">Objektleiter:</span>
                  <span className="text-xs font-semibold text-white">{selectedObj.objectLeadName}</span>
                  <span className="text-[11px] text-slate-400 block font-mono mt-0.5">{selectedObj.emergencyPhone}</span>
                </div>
              </div>

              {/* Security Equipment & Telemetry */}
              <div>
                <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2.5">
                  Sicherheitsausstattung & Leitstellen-Kopplung
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center gap-2.5">
                    <AlertOctagon className={`h-4 w-4 ${selectedObj.alarmSystems.emaConnected ? 'text-emerald-400' : 'text-slate-600'}`} />
                    <div>
                      <p className="font-semibold text-white">EMA Aufschaltung</p>
                      <span className="text-[10px] text-emerald-400">Direkt VdS-C</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center gap-2.5">
                    <Flame className={`h-4 w-4 ${selectedObj.alarmSystems.bmaConnected ? 'text-emerald-400' : 'text-slate-600'}`} />
                    <div>
                      <p className="font-semibold text-white">BMA Direktschaltung</p>
                      <span className="text-[10px] text-emerald-400">Feuerwehr Leitstelle</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center gap-2.5">
                    <Camera className={`h-4 w-4 ${selectedObj.alarmSystems.cctvMonitoring ? 'text-emerald-400' : 'text-slate-600'}`} />
                    <div>
                      <p className="font-semibold text-white">CCTV Überwachung</p>
                      <span className="text-[10px] text-emerald-400">KI-Perimeterzaun</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center gap-2.5">
                    <Radio className="h-4 w-4 text-emerald-400" />
                    <div>
                      <p className="font-semibold text-white">Wachfunk</p>
                      <span className="text-[10px] text-emerald-400">DMR Digitalfunk</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Digitales Schlüsselbuch (BewachV Konform) */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Key className="h-3.5 w-3.5 text-amber-400" /> Elektronisches Schlüsselbuch
                  </h3>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {objectKeyLogs.filter(k => k.status === 'Ausgegeben').length} Schlüssel aktuell entliehen
                  </span>
                </div>

                <div className="space-y-2">
                  {objectKeyLogs.length > 0 ? (
                    objectKeyLogs.map((kl) => (
                      <div
                        key={kl.id}
                        className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs gap-2"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-white">{kl.keyNumber}</span>
                            <span className="text-slate-300 font-medium">({kl.keyLabel})</span>
                            <span
                              className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
                                kl.status === 'Ausgegeben'
                                  ? 'bg-amber-950 text-amber-300 border border-amber-800'
                                  : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                              }`}
                            >
                              {kl.status}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            Empfänger: <strong className="text-slate-200">{kl.borrowerName}</strong> ({kl.borrowerCompany}) • Ausgabe: {kl.issuedAt} Uhr von {kl.issuedBy}
                            {kl.returnedAt && ` • Rückgabe: ${kl.returnedAt} Uhr`}
                          </p>
                        </div>

                        {kl.status === 'Ausgegeben' && (
                          <button
                            onClick={() => returnKey(kl.id)}
                            className="px-2.5 py-1 rounded bg-slate-800 hover:bg-emerald-600 hover:text-white text-slate-300 text-xs font-medium transition"
                          >
                            Rückgabe quittieren
                          </button>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="p-3 text-center text-xs text-slate-400 bg-slate-950 rounded-lg">
                      Aktuell keine Schlüssel für dieses Objekt ausgegeben.
                    </div>
                  )}
                </div>
              </div>

              {/* Standing Orders (Dienstanweisung) */}
              <div>
                <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Gültige Dienstanweisung (Auszug)
                </h3>
                <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300 font-mono leading-relaxed">
                  {selectedObj.standingOrdersSnippet}
                </div>
              </div>

              {/* Checkpoints for this object */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Zugeordnete Kontrollpunkte / Deister-Punkte
                  </h3>
                  <span className="text-[11px] text-slate-400">Live-Simulation via NFC/QR</span>
                </div>

                <div className="space-y-2">
                  {objectCheckpoints.length > 0 ? (
                    objectCheckpoints.map(cp => (
                      <div
                        key={cp.id}
                        className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-slate-400 text-[11px]">#{cp.orderIndex}</span>
                          <span className="font-medium text-white">{cp.name}</span>
                          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-1.5 py-0.5 rounded border border-emerald-800">
                            {cp.code}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-slate-400 text-[11px]">
                            {cp.lastScanned ? `Scan: ${cp.lastScanned}` : 'Ausstehend'}
                          </span>
                          <button
                            onClick={() => scanCheckpoint(cp.id)}
                            className="px-2 py-1 rounded bg-slate-800 hover:bg-emerald-600 hover:text-white text-slate-300 text-[10px] font-mono transition"
                          >
                            Jetzt Scannen
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-3 text-center text-xs text-slate-400 bg-slate-950 rounded-lg">
                      Für dieses Objekt sind derzeit keine separaten Streifenpunkte hinterlegt.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal: New Object */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <h2 className="text-base font-bold text-white">Neues Schutzobjekt anlegen</h2>
            <form onSubmit={handleCreateObject} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1">Objektbezeichnung *</label>
                <input
                  type="text"
                  required
                  placeholder="z.B. Logistikzentrum Tor West"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1">Zugeordneter Kunde</label>
                  <select
                    value={formCustId}
                    onChange={(e) => setFormCustId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white focus:outline-none"
                  >
                    {customers.map(c => (
                      <option key={c.id} value={c.id}>{c.companyName}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Sicherheitsstufe</label>
                  <select
                    value={formSecLevel}
                    onChange={(e) => setFormSecLevel(e.target.value as SecurityLevel)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white focus:outline-none"
                  >
                    {Object.values(SecurityLevel).map(lvl => (
                      <option key={lvl} value={lvl}>{lvl}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2">
                  <label className="block text-slate-300 mb-1">Standortadresse</label>
                  <input
                    type="text"
                    placeholder="Hafenallee 8"
                    value={formAddress}
                    onChange={(e) => setFormAddress(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Stadt</label>
                  <input
                    type="text"
                    placeholder="Hamburg"
                    value={formCity}
                    onChange={(e) => setFormCity(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-300 mb-1">Objektleiter (Name)</label>
                  <input
                    type="text"
                    placeholder="z.B. Jürgen Bauer"
                    value={formLead}
                    onChange={(e) => setFormLead(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Notruf-Telefonzentrale</label>
                  <input
                    type="text"
                    placeholder="+49 89 123456"
                    value={formEmergency}
                    onChange={(e) => setFormEmergency(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Dienstanweisung (Wesentliche Punkte)</label>
                <textarea
                  rows={2}
                  placeholder="Einfahrtskontrollen, Ausweispflicht..."
                  value={formOrders}
                  onChange={(e) => setFormOrders(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white focus:outline-none"
                />
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
                  Objekt speichern
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Issue Key */}
      {showKeyModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Key className="h-4 w-4 text-amber-400" />
              Schlüsselausgabe protokollieren (BewachV)
            </h2>
            <form onSubmit={handleIssueKeySubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1">Schlüsselnummer *</label>
                <input
                  type="text"
                  required
                  placeholder="SCHL-099"
                  value={keyNum}
                  onChange={(e) => setKeyNum(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Bezeichnung / Zylinder</label>
                <input
                  type="text"
                  placeholder="z.B. Heizungskeller Gebäude D"
                  value={keyLabel}
                  onChange={(e) => setKeyLabel(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-300 mb-1">Empfänger (Name) *</label>
                  <input
                    type="text"
                    required
                    placeholder="Max Mustermann"
                    value={borrowerName}
                    onChange={(e) => setBorrowerName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Firma / Gewerk</label>
                  <input
                    type="text"
                    placeholder="Kone Aufzugservice"
                    value={borrowerCompany}
                    onChange={(e) => setBorrowerCompany(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="p-2.5 rounded bg-slate-950 border border-slate-800 text-[11px] text-slate-400">
                Die Ausgabe wird unter der Benutzerkennung <strong className="text-white">Objektleitung</strong> mit aktuellem Zeitstempel revisionssicher im Schlüsselbuch erfasst.
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowKeyModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium"
                >
                  Abbrechen
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold"
                >
                  Ausgabe quittieren
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
