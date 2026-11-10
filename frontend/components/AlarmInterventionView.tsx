import React, { useState, useEffect } from 'react';
import {
  Siren,
  ShieldAlert,
  Flame,
  Radio,
  Clock,
  Camera,
  Car,
  CheckCircle2,
  AlertTriangle,
  Play,
  Download,
  Search,
  Building,
  Key,
  X,
  Plus,
  Send,
  FileCheck2,
  Lock,
  PhoneCall,
  Activity,
  AlertOctagon,
  Sparkles
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { AlarmTriggerType, InterventionStatus, AlarmIntervention } from '../types';
import { apiService } from '../services/apiService';

export const AlarmInterventionView: React.FC = () => {
  const {
    interventions,
    objects,
    employees,
    triggerAlarm,
    verifyAlarmKamera,
    verifyAlarmClientCall,
    dispatchPatrolUnit,
    confirmAlarmArrival,
    completeInterventionProtocol,
    logAudit
  } = useAppStore();

  const [selectedAlarm, setSelectedAlarm] = useState<AlarmIntervention | null>(interventions[0] || null);
  const [filterStatus, setFilterStatus] = useState<string>('Alle');
  const [nowTimestamp, setNowTimestamp] = useState<number>(Date.now());

  // Trigger modal state
  const [showTriggerModal, setShowTriggerModal] = useState<boolean>(false);
  const [trigObjId, setTrigObjId] = useState<string>(objects[0]?.id || '');
  const [trigType, setTrigType] = useState<AlarmTriggerType>(AlarmTriggerType.EMA_EINBRUCH);
  const [trigZone, setTrigZone] = useState<string>('Melderlinie 08 / Fensterkontakt Erdgeschoss Ost');
  const [trigSla, setTrigSla] = useState<number>(15);

  // CCTV / Call note form state
  const [cctvNotes, setCctvNotes] = useState<string>('PTZ-Kamera schwenkt auf Sektor. Keine Personenbewegung.');
  const [selectedPatrolUnit, setSelectedPatrolUnit] = useState<string>('Streifenfahrzeug Revier 1 (Funk: Adler 1)');

  // Completion modal state
  const [showCompleteModal, setShowCompleteModal] = useState<boolean>(false);
  const [compOutcome, setCompOutcome] = useState<'ECHT' | 'FEHL'>('FEHL');
  const [compFindings, setCompFindings] = useState<string>('Keine Aufbruchspuren. Witterungsbedingte Fehlauslösung.');
  const [compMeasures, setCompMeasures] = useState<string>('Außensicherung und Schließzustand der Tore kontrolliert. Anlage zurückgestellt.');
  const [compPolice, setCompPolice] = useState<boolean>(false);
  const [compPoliceFile, setCompPoliceFile] = useState<string>('');

  // Live timer tick for SLA count down
  useEffect(() => {
    const timer = setInterval(() => {
      setNowTimestamp(Date.now());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const filteredAlarms = interventions.filter(a => {
    if (filterStatus === 'Alle') return true;
    if (filterStatus === 'Aktiv') {
      return a.status !== InterventionStatus.ABGESCHLOSSEN_ECHT && a.status !== InterventionStatus.ABGESCHLOSSEN_FEHL;
    }
    if (filterStatus === 'Abgeschlossen') {
      return a.status === InterventionStatus.ABGESCHLOSSEN_ECHT || a.status === InterventionStatus.ABGESCHLOSSEN_FEHL;
    }
    return a.status === filterStatus;
  });

  const handleSimulateTrigger = (e: React.FormEvent) => {
    e.preventDefault();
    triggerAlarm(trigObjId, trigType, trigZone, Number(trigSla));
    setShowTriggerModal(false);
  };

  const handleCompleteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAlarm) return;

    completeInterventionProtocol(
      selectedAlarm.id,
      compOutcome,
      compFindings,
      compMeasures,
      compPolice,
      compPoliceFile
    );

    setShowCompleteModal(false);
  };

  const handleExportProtocol = () => {
    const headers = ['Alarmnummer', 'Objekt', 'Kunde', 'Alarmauslöser', 'Melderlinie', 'Eingegangen', 'Status', 'Interventionseinheit', 'SLA (Min)', 'Befund', 'Hash'];
    const rows = interventions.map(a => [
      a.alarmNumber,
      a.objectName,
      a.customerName,
      a.triggerType,
      a.detectorZone,
      a.receivedAt,
      a.status,
      a.dispatchedUnit || '-',
      a.slaMinutes,
      a.findings,
      a.tamperHash || '-'
    ]);
    apiService.exportDataToCsv('VdS2172_Interventionsprotokoll', headers, rows);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-md bg-red-500/20 text-red-400 animate-pulse">
              <Siren className="h-5 w-5" />
            </span>
            <h1 className="text-lg font-bold text-white tracking-wide">
              NOTRUF- & SERVICE-LEITSTELLE (NSL) & VdS 2172 INTERVENTION
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Rechtskonforme EMA/BMA-Aufschaltung, optische CCTV-Vorprüfung, Streifen-Disponierung mit SLA-Countdown und revisionsfeste Befundung.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap text-xs">
          <button
            onClick={handleExportProtocol}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold transition"
          >
            <Download className="h-3.5 w-3.5" />
            VdS-Protokoll exportieren
          </button>

          <button
            onClick={() => setShowTriggerModal(true)}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold shadow-lg shadow-red-950 transition"
          >
            <Siren className="h-4 w-4" />
            Alarm auslösen (Simulation)
          </button>
        </div>
      </div>

      {/* SLA Status Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Laufende Einsätze</span>
            <Activity className="h-4 w-4 text-red-400" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-red-400">
            {interventions.filter(a => a.status === InterventionStatus.ANFAHRT || a.status === InterventionStatus.VOR_ORT || a.status === InterventionStatus.EINGEGANGEN).length} aktiv
          </div>
          <p className="text-[11px] text-slate-400 mt-1">1 Alarm in Anfahrt</p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">VdS 2172 SLA-Quote</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-emerald-400">
            100%
          </div>
          <p className="text-[11px] text-slate-400 mt-1">&lt; 15 Min Interventionszeit</p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Aufgeschaltete Melder</span>
            <Building className="h-4 w-4 text-blue-400" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-white">
            1.240 Linien
          </div>
          <p className="text-[11px] text-slate-400 mt-1">EMA / BMA VdS-Klasse C</p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Einsatzfahrzeuge (DMR)</span>
            <Car className="h-4 w-4 text-purple-400" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-purple-400">
            3 Streifen
          </div>
          <p className="text-[11px] text-slate-400 mt-1">GPS-Telemetrie aktiv</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-slate-800 pb-2 text-xs overflow-x-auto">
        {(['Alle', 'Aktiv', 'Abgeschlossen'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setFilterStatus(tab)}
            className={`px-3 py-1.5 rounded-lg font-medium transition ${
              filterStatus === tab
                ? 'bg-red-600 text-white'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            {tab} ({
              tab === 'Alle'
                ? interventions.length
                : tab === 'Aktiv'
                ? interventions.filter(a => a.status !== InterventionStatus.ABGESCHLOSSEN_ECHT && a.status !== InterventionStatus.ABGESCHLOSSEN_FEHL).length
                : interventions.filter(a => a.status === InterventionStatus.ABGESCHLOSSEN_ECHT || a.status === InterventionStatus.ABGESCHLOSSEN_FEHL).length
            })
          </button>
        ))}
      </div>

      {/* Main Grid: Alarms List & Detail/Intervention Control */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Alarms Feed */}
        <div className="lg:col-span-1 space-y-2.5">
          <div className="text-xs font-semibold text-slate-400 px-1 uppercase tracking-wider">
            Alarmeingänge ({filteredAlarms.length})
          </div>

          <div className="space-y-2 overflow-y-auto max-h-[640px] pr-1">
            {filteredAlarms.map((alm) => {
              const isSelected = selectedAlarm?.id === alm.id;
              const isUrgentActive = alm.status === InterventionStatus.EINGEGANGEN || alm.status === InterventionStatus.ANFAHRT;

              // Calculate remaining seconds if SLA target timestamp exists
              let remainingSeconds = 0;
              if (alm.slaTargetTimestamp && isUrgentActive) {
                remainingSeconds = Math.max(0, Math.floor((alm.slaTargetTimestamp - nowTimestamp) / 1000));
              }
              const remMinutes = Math.floor(remainingSeconds / 60);
              const remSecs = remainingSeconds % 60;

              return (
                <div
                  key={alm.id}
                  onClick={() => setSelectedAlarm(alm)}
                  className={`p-3.5 rounded-xl border transition cursor-pointer ${
                    isSelected
                      ? 'bg-slate-800/90 border-red-500 shadow-lg ring-1 ring-red-500/30'
                      : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className={`p-1 rounded ${isUrgentActive ? 'bg-red-950 text-red-400 animate-pulse' : 'bg-slate-800 text-slate-400'}`}>
                        {alm.triggerType.includes('BMA') ? <Flame className="h-4 w-4 text-orange-400" /> : <AlertOctagon className="h-4 w-4" />}
                      </span>
                      <div>
                        <span className="font-mono font-bold text-white text-xs">{alm.alarmNumber}</span>
                        <h4 className="font-semibold text-white text-xs mt-0.5">{alm.objectName.split('-')[0]}</h4>
                      </div>
                    </div>

                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded ${
                        alm.status === InterventionStatus.EINGEGANGEN
                          ? 'bg-red-950 text-red-300 border border-red-800 animate-pulse'
                          : alm.status === InterventionStatus.ANFAHRT
                          ? 'bg-amber-950 text-amber-300 border border-amber-800'
                          : alm.status === InterventionStatus.VOR_ORT
                          ? 'bg-blue-950 text-blue-300 border border-blue-800'
                          : 'bg-slate-800 text-slate-400 border border-slate-700'
                      }`}
                    >
                      {alm.status.split('(')[0].trim()}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-400 mt-2 font-mono truncate">
                    {alm.detectorZone}
                  </p>

                  {/* SLA Countdown pill if active */}
                  {isUrgentActive && (
                    <div className="mt-2.5 p-2 rounded-lg bg-red-950/40 border border-red-900/60 flex items-center justify-between text-xs">
                      <span className="text-[10px] text-slate-400 flex items-center gap-1">
                        <Clock className="h-3 w-3 text-red-400" /> VdS 2172 SLA:
                      </span>
                      <span className={`font-mono font-bold ${remMinutes < 5 ? 'text-red-400 animate-pulse' : 'text-amber-300'}`}>
                        {String(remMinutes).padStart(2, '0')}:{String(remSecs).padStart(2, '0')} Min verbleibend
                      </span>
                    </div>
                  )}

                  <div className="mt-2 text-[10px] text-slate-500 font-mono flex items-center justify-between">
                    <span>Eingang: {alm.receivedAt.split(',')[1] || alm.receivedAt}</span>
                    <span>SLA: {alm.slaMinutes} Min</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Alarm Intervention Center (2 cols) */}
        <div className="lg:col-span-2">
          {selectedAlarm ? (
            <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 space-y-6">
              {/* Header Info */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-red-400 text-sm">{selectedAlarm.alarmNumber}</span>
                    <span className="px-2 py-0.5 text-xs rounded bg-red-950 text-red-300 border border-red-800 font-bold">
                      {selectedAlarm.triggerType}
                    </span>
                  </div>
                  <h2 className="text-base font-bold text-white mt-1">{selectedAlarm.objectName}</h2>
                  <p className="text-xs text-slate-400 mt-0.5">Kunde: <strong className="text-slate-200">{selectedAlarm.customerName}</strong></p>
                </div>

                <div className="text-right">
                  <span className="text-xs text-slate-400 block">Aktueller VdS-Status:</span>
                  <span className="text-xs font-bold font-mono text-emerald-400">{selectedAlarm.status}</span>
                </div>
              </div>

              {/* Detector & Location Telemetry */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-slate-400 uppercase text-[10px] font-semibold">Ausgelöste Melderlinie</span>
                  <p className="font-mono text-white text-[11px]">{selectedAlarm.detectorZone}</p>
                  <p className="text-slate-500 text-[10px]">Eingang: {selectedAlarm.receivedAt} Uhr</p>
                </div>

                <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-slate-400 uppercase text-[10px] font-semibold">Interventionseinheit</span>
                  <p className="text-white text-[11px] font-bold">
                    {selectedAlarm.dispatchedUnit || 'Noch keine Streife zugewiesen'}
                  </p>
                  <p className="text-slate-400 text-[10px]">
                    {selectedAlarm.dispatchedAt ? `Alarmiert um: ${selectedAlarm.dispatchedAt}` : 'Sofortige Entsendung erforderlich'}
                  </p>
                </div>
              </div>

              {/* Step-by-Step VdS 2172 Intervention Pipeline */}
              <div className="space-y-3">
                <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  VdS 2172 Interventions-Ablauf & Maßnahmen
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  {/* Step 1: CCTV Pre-Verification */}
                  <div className={`p-3.5 rounded-lg border space-y-2 ${selectedAlarm.cctvVerified ? 'bg-emerald-950/30 border-emerald-800 text-emerald-200' : 'bg-slate-950 border-slate-800 text-slate-300'}`}>
                    <div className="flex items-center justify-between">
                      <span className="font-bold flex items-center gap-1.5">
                        <Camera className="h-4 w-4 text-emerald-400" /> 1. CCTV Vorprüfung
                      </span>
                      {selectedAlarm.cctvVerified && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />}
                    </div>
                    <p className="text-[11px] text-slate-400">
                      PTZ-Kameraschwenk zur Verifikation von Falschauslösungen (Witterung / Tiere).
                    </p>
                    {!selectedAlarm.cctvVerified && (
                      <button
                        onClick={() => verifyAlarmKamera(selectedAlarm.id, cctvNotes)}
                        className="w-full py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-medium transition"
                      >
                        Kamerabefund bestätigen
                      </button>
                    )}
                  </div>

                  {/* Step 2: Client Call */}
                  <div className={`p-3.5 rounded-lg border space-y-2 ${selectedAlarm.clientContacted ? 'bg-emerald-950/30 border-emerald-800 text-emerald-200' : 'bg-slate-950 border-slate-800 text-slate-300'}`}>
                    <div className="flex items-center justify-between">
                      <span className="font-bold flex items-center gap-1.5">
                        <PhoneCall className="h-4 w-4 text-blue-400" /> 2. Rückfrage Kunde
                      </span>
                      {selectedAlarm.clientContacted && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />}
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Rücksprache mit Objektverantwortlichem oder Werkschutz vor Ort.
                    </p>
                    {!selectedAlarm.clientContacted && (
                      <button
                        onClick={() => verifyAlarmClientCall(selectedAlarm.id)}
                        className="w-full py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-medium transition"
                      >
                        Telefonrückruf quittieren
                      </button>
                    )}
                  </div>

                  {/* Step 3: Patrol Dispatch */}
                  <div className={`p-3.5 rounded-lg border space-y-2 ${selectedAlarm.dispatchedUnit ? 'bg-emerald-950/30 border-emerald-800 text-emerald-200' : 'bg-slate-950 border-slate-800 text-slate-300'}`}>
                    <div className="flex items-center justify-between">
                      <span className="font-bold flex items-center gap-1.5">
                        <Car className="h-4 w-4 text-amber-400" /> 3. Streife entsenden
                      </span>
                      {selectedAlarm.dispatchedUnit && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />}
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Sofortige Zuweisung einer Interventionskraft via DMR-Funk (SLA-Start).
                    </p>
                    {!selectedAlarm.dispatchedUnit && (
                      <div className="space-y-1.5">
                        <select
                          value={selectedPatrolUnit}
                          onChange={(e) => setSelectedPatrolUnit(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-700 rounded p-1 text-[10px] text-white"
                        >
                          <option value="Streifenfahrzeug Revier 1 (Funk: Adler 1)">Streife Revier 1 (Funk: Adler 1)</option>
                          <option value="Streifenfahrzeug Revier 2 (Funk: Adler 2)">Streife Revier 2 (Funk: Adler 2)</option>
                          <option value="Hundeführer-Streife (Funk: Wolf 1)">Hundeführer (Funk: Wolf 1)</option>
                        </select>
                        <button
                          onClick={() => dispatchPatrolUnit(selectedAlarm.id, selectedPatrolUnit)}
                          className="w-full py-1.5 rounded bg-red-600 hover:bg-red-500 text-white font-bold text-[11px] transition"
                        >
                          Streife Alarmieren (SLA Start)
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Status Update / Arrival / Completion Actions */}
              <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-3 text-xs">
                <span className="font-bold text-white block">Interventions-Protokollfortschritt:</span>
                <p className="text-slate-300 text-[11px] font-mono leading-relaxed bg-slate-900 p-2.5 rounded border border-slate-800">
                  {selectedAlarm.measuresTaken}
                </p>

                {selectedAlarm.findings && (
                  <p className="text-slate-300 text-[11px] font-mono leading-relaxed bg-slate-900 p-2.5 rounded border border-slate-800">
                    Befund: {selectedAlarm.findings}
                  </p>
                )}

                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800">
                  {selectedAlarm.status === InterventionStatus.ANFAHRT && (
                    <button
                      onClick={() => confirmAlarmArrival(selectedAlarm.id)}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold transition text-xs"
                    >
                      <Car className="h-4 w-4" />
                      Eintreffen vor Ort bestätigen (Befundung)
                    </button>
                  )}

                  {selectedAlarm.status === InterventionStatus.VOR_ORT && (
                    <button
                      onClick={() => setShowCompleteModal(true)}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition text-xs"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      VdS 2172 Interventionsprotokoll abschließen & siegeln
                    </button>
                  )}

                  {selectedAlarm.tamperHash && (
                    <div className="flex items-center gap-2 text-[11px] text-emerald-400 font-mono">
                      <Lock className="h-3.5 w-3.5" />
                      Revisionssicher versiegelt im OWKS: <span>{selectedAlarm.tamperHash}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 rounded-xl bg-slate-900 border border-slate-800 text-center text-slate-400 text-xs">
              Wählen Sie einen Alarm aus der linken Spalte aus.
            </div>
          )}
        </div>
      </div>

      {/* Modal: Simulate / Trigger Alarm */}
      {showTriggerModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Siren className="h-5 w-5 text-red-400 animate-pulse" />
                Alarmauslösung simulieren (EMA / BMA / Sabotage)
              </h2>
              <button
                onClick={() => setShowTriggerModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSimulateTrigger} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1">Schutzobjekt *</label>
                <select
                  value={trigObjId}
                  onChange={(e) => setTrigObjId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white focus:outline-none"
                >
                  {objects.map(o => (
                    <option key={o.id} value={o.id}>{o.name} ({o.customerName})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Alarmauslöser / Typ *</label>
                <select
                  value={trigType}
                  onChange={(e) => setTrigType(e.target.value as AlarmTriggerType)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white focus:outline-none"
                >
                  {Object.values(AlarmTriggerType).map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Melderlinie / Sektor *</label>
                <input
                  type="text"
                  required
                  placeholder="z.B. Melderlinie 12 / Notausgang Halle C"
                  value={trigZone}
                  onChange={(e) => setTrigZone(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">VdS 2172 Interventionsfrist (SLA in Minuten)</label>
                <select
                  value={trigSla}
                  onChange={(e) => setTrigSla(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white focus:outline-none font-mono"
                >
                  <option value={15}>15 Minuten (VdS 2172 Standard Gewerbe)</option>
                  <option value={20}>20 Minuten (Umland / Industriegebiet)</option>
                  <option value={30}>30 Minuten (Ländlicher Raum)</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowTriggerModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium"
                >
                  Abbrechen
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold"
                >
                  Alarm jetzt auslösen
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Complete VdS 2172 Intervention */}
      {showCompleteModal && selectedAlarm && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <FileCheck2 className="h-5 w-5 text-emerald-400" />
                VdS 2172 Interventionsbericht abschließen
              </h2>
              <button
                onClick={() => setShowCompleteModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCompleteSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1">Einsatzergebnis *</label>
                <select
                  value={compOutcome}
                  onChange={(e) => setCompOutcome(e.target.value as 'ECHT' | 'FEHL')}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white focus:outline-none"
                >
                  <option value="FEHL">Falschalarm (Technisch / Witterung / Bedienfehler VdS)</option>
                  <option value="ECHT">Echteinsatz (Einbruchversuch / Schadenseintritt / Täterkontakt)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Detaillierter Vor-Ort-Befund *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Genaue Feststellungen der Streife vor Ort..."
                  value={compFindings}
                  onChange={(e) => setCompFindings(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Getroffene Sicherungsmaßnahmen *</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Verschlusskontrolle, Zurückstellung Melder, Hausmeisterübergabe..."
                  value={compMeasures}
                  onChange={(e) => setCompMeasures(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white focus:outline-none font-mono"
                />
              </div>

              <div className="space-y-2 p-3 rounded-lg bg-slate-950 border border-slate-800">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="policeChk"
                    checked={compPolice}
                    onChange={(e) => setCompPolice(e.target.checked)}
                    className="rounded bg-slate-900 border-slate-700 text-emerald-600 focus:ring-0"
                  />
                  <label htmlFor="policeChk" className="text-slate-200 font-medium">
                    Polizei oder Feuerwehr wurde hinzugezogen
                  </label>
                </div>
                {compPolice && (
                  <div>
                    <label className="block text-slate-400 text-[11px] mb-1">Aktenzeichen / Tagebuchnummer</label>
                    <input
                      type="text"
                      placeholder="z.B. POL-BY-2025-1102"
                      value={compPoliceFile}
                      onChange={(e) => setCompPoliceFile(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-white font-mono"
                    />
                  </div>
                )}
              </div>

              <div className="p-2.5 rounded bg-slate-950 border border-slate-800 text-[11px] text-slate-400">
                Der Bericht wird automatisch im manipulationsgeschützten Wachbuch (OWKS) mit SHA-256 Block-Hash versiegelt und im Revisions-Auditlogger archiviert.
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCompleteModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium"
                >
                  Abbrechen
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
                >
                  Protokoll revisionssicher siegeln
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
