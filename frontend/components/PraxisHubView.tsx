import React, { useState } from 'react';
import {
  Zap,
  UserX,
  UserCheck,
  ShieldCheck,
  AlertTriangle,
  Clock,
  Sparkles,
  BellRing,
  CheckCircle2,
  CalendarDays,
  Smartphone,
  BookOpenCheck,
  Send,
  Building,
  Key,
  Radio,
  FileCheck2,
  ArrowRight
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { UserRole, IncidentSeverity, ShiftType, TaskPriority, TaskStatus } from '../types';

export const PraxisHubView: React.FC = () => {
  const {
    currentRole,
    setCurrentRole,
    shifts,
    employees,
    objects,
    reportSickLeaveAndReplace,
    addOwksEntry,
    scanCheckpoint,
    sendDispatchMessage,
    addTask
  } = useAppStore();

  // Active sub-tab
  const [activeSubTab, setActiveSubTab] = useState<'springer' | 'automations' | 'terminal'>('springer');

  // Springer / Sick leave form state
  const [sickShiftId, setSickShiftId] = useState<string>(shifts[0]?.id || '');
  const [replacementEmpId, setReplacementEmpId] = useState<string>('');
  const [actionFeedback, setActionFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Wachlokal Quick-Terminal state
  const [terminalObjId, setTerminalObjId] = useState<string>(objects[0]?.id || '');
  const [terminalIncidentText, setTerminalIncidentText] = useState<string>('');
  const [terminalStatusMsg, setTerminalStatusMsg] = useState<string | null>(null);

  const selectedShift = shifts.find(s => s.id === sickShiftId);
  const currentAssignedEmp = employees.find(e => e.id === selectedShift?.employeeId);

  // Filter qualified and available replacement candidates (Springers)
  const candidateEmployees = employees.filter(emp => {
    // Cannot replace self
    if (emp.id === currentAssignedEmp?.id) return false;
    // Must be active
    if (emp.status !== 'Aktiv') return false;
    // If shift requires 34a, emp must have certificate
    if (selectedShift?.is34aRequired && !emp.has34aCertificate) return false;
    return true;
  });

  const handleExecuteReplacement = () => {
    if (!selectedShift || !selectedShift.employeeId || !replacementEmpId) {
      setActionFeedback({
        type: 'error',
        message: 'Bitte wählen Sie eine besetzte Schicht und eine qualifizierte Ersatzkraft (Springer) aus.'
      });
      return;
    }

    const result = reportSickLeaveAndReplace(selectedShift.id, selectedShift.employeeId, replacementEmpId);
    if (result.success) {
      setActionFeedback({ type: 'success', message: result.message });
      setReplacementEmpId('');
    } else {
      setActionFeedback({ type: 'error', message: result.message });
    }
  };

  const handleTerminalFastIncident = (e: React.FormEvent) => {
    e.preventDefault();
    if (!terminalIncidentText.trim()) return;

    const obj = objects.find(o => o.id === terminalObjId);
    addOwksEntry({
      timestamp: new Date().toLocaleString('de-DE', { dateStyle: 'short', timeStyle: 'short' }),
      objectId: obj?.id || 'obj-201',
      objectName: obj?.name || 'BMW Werk Regensburg Tor 1',
      authorId: 'emp-301',
      authorName: `${currentRole} (Terminal-Schnelleintrag)`,
      entryType: 'Vorkommnis',
      severity: IncidentSeverity.NORMAL,
      title: 'Wachlokal Schnell-Meldung',
      description: terminalIncidentText.trim(),
      attachmentsCount: 0,
      policeInvolved: false
    });

    setTerminalIncidentText('');
    setTerminalStatusMsg('Meldung mit kryptographischem Hash erfolgreich im Wachbuch versiegelt.');
    setTimeout(() => setTerminalStatusMsg(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-md bg-emerald-500/20 text-emerald-400">
              <Zap className="h-5 w-5" />
            </span>
            <h1 className="text-lg font-bold text-white tracking-wide">
              OPERATIVES PRAXIS-HUB & NOTFALLZENTRALE
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Praxisoptimierte Workflows für Einsatzleitung, Disposition und Wachpersonal: Springer-Notfallassistent, automatisierte Fristen & Schnell-Terminal.
          </p>
        </div>

        {/* Persona Quick Switcher */}
        <div className="flex items-center gap-2 bg-slate-950/80 border border-slate-800 p-1.5 rounded-lg text-xs">
          <span className="text-slate-400 text-[11px] font-medium hidden sm:inline">Perspektive:</span>
          <select
            value={currentRole}
            onChange={(e) => setCurrentRole(e.target.value as UserRole)}
            className="bg-transparent text-xs text-emerald-400 font-bold focus:outline-none cursor-pointer"
          >
            {Object.values(UserRole).map(role => (
              <option key={role} value={role} className="bg-slate-900 text-slate-200">
                {role}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex gap-2 border-b border-slate-800 pb-2 text-xs overflow-x-auto">
        <button
          onClick={() => setActiveSubTab('springer')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-semibold transition ${
            activeSubTab === 'springer'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950'
              : 'bg-slate-900 text-slate-400 hover:text-white'
          }`}
        >
          <UserX className="h-4 w-4" />
          Springer- & Notfall-Vertretungsassistent
        </button>

        <button
          onClick={() => setActiveSubTab('automations')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-semibold transition ${
            activeSubTab === 'automations'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950'
              : 'bg-slate-900 text-slate-400 hover:text-white'
          }`}
        >
          <Sparkles className="h-4 w-4" />
          Intelligente Automations- & Fristenzentrale
        </button>

        <button
          onClick={() => setActiveSubTab('terminal')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-semibold transition ${
            activeSubTab === 'terminal'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950'
              : 'bg-slate-900 text-slate-400 hover:text-white'
          }`}
        >
          <Smartphone className="h-4 w-4" />
          Wachlokal Schnell-Terminal (Pforten-Modus)
        </button>
      </div>

      {/* SUB-TAB 1: Springer & Notfall-Vertretung */}
      {activeSubTab === 'springer' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h2 className="text-sm font-bold text-white flex items-center gap-2">
                  <UserX className="h-4 w-4 text-amber-400" />
                  Ad-hoc Krankmeldung & automatische Springer-Zuteilung
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Löst Schichtausfälle sofort rechtssicher mit automatischem IHK § 34a- und ArbZG-Abgleich.
                </p>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                Live Dispositions-Engine
              </span>
            </div>

            {actionFeedback && (
              <div
                className={`p-3 rounded-lg text-xs flex items-start gap-2 ${
                  actionFeedback.type === 'success'
                    ? 'bg-emerald-950/80 border border-emerald-800 text-emerald-200'
                    : 'bg-red-950/80 border border-red-800 text-red-200'
                }`}
              >
                {actionFeedback.type === 'success' ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
                )}
                <div className="whitespace-pre-line text-[11px] leading-relaxed">
                  {actionFeedback.message}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {/* Select Shift to replace */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  1. Betroffene Schicht auswählen:
                </label>
                <select
                  value={sickShiftId}
                  onChange={(e) => {
                    setSickShiftId(e.target.value);
                    setActionFeedback(null);
                  }}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none"
                >
                  {shifts.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.date} - {s.shiftType.split('(')[0]} [{s.objectName.split('-')[0]}] ({s.employeeName || 'UNBESETZT'})
                    </option>
                  ))}
                </select>

                {selectedShift && (
                  <div className="mt-2.5 p-3 rounded-lg bg-slate-950 border border-slate-800/80 space-y-1 text-[11px]">
                    <p><span className="text-slate-400">Objekt:</span> <strong className="text-white">{selectedShift.objectName}</strong></p>
                    <p><span className="text-slate-400">Einsatzzeit:</span> {selectedShift.startTime} - {selectedShift.endTime} Uhr ({selectedShift.plannedHours} Std.)</p>
                    <p><span className="text-slate-400">Aktuell eingeteilt:</span> <span className="text-amber-400 font-bold">{selectedShift.employeeName || 'Niemand'}</span></p>
                    <p><span className="text-slate-400">Anforderung:</span> {selectedShift.is34aRequired ? '§ 34a GewO Sachkunde zwingend' : 'Unterweisung ausreichend'}</p>
                  </div>
                )}
              </div>

              {/* Select Springer Candidate */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  2. Verfügbare Springer-Fachkraft zuteilen:
                </label>
                <select
                  value={replacementEmpId}
                  onChange={(e) => {
                    setReplacementEmpId(e.target.value);
                    setActionFeedback(null);
                  }}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none"
                >
                  <option value="">-- Geeignete Ersatzkraft wählen --</option>
                  {candidateEmployees.map(emp => (
                    <option key={emp.id} value={emp.id}>
                      {emp.firstName} {emp.lastName} ({emp.employeeNumber}) {emp.has34aCertificate ? '• §34a OK' : '• kein §34a'}
                    </option>
                  ))}
                </select>

                <div className="mt-2.5 p-3 rounded-lg bg-emerald-950/30 border border-emerald-900/60 text-[11px] text-emerald-300 space-y-1">
                  <p className="font-semibold flex items-center gap-1.5 text-emerald-400">
                    <ShieldCheck className="h-3.5 w-3.5" /> Automatische Vorabprüfung:
                  </p>
                  <p>• Nur Sicherheitskräfte ohne bestehende Schichtkollision am selben Tag.</p>
                  <p>• Einhaltung der gesetzlichen Mindestruhezeit von 11 Stunden (ArbZG).</p>
                  <p>• Automatische Dokumentation im Revisions-Wachbuch (OWKS) und Audit-Log.</p>
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={handleExecuteReplacement}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-950 transition"
              >
                <UserCheck className="h-4 w-4" />
                Krankmeldung bestätigen & Springer einsetzen
              </button>
            </div>
          </div>

          {/* Quick Staff Readiness Status */}
          <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-3 text-xs">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Clock className="h-4 w-4 text-emerald-400" />
              Verfügbarkeits- & Statusübersicht
            </h3>

            <div className="space-y-2">
              {employees.map(emp => (
                <div key={emp.id} className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-white">{emp.firstName} {emp.lastName}</span>
                    <p className="text-[10px] text-slate-400 font-mono">{emp.employeeNumber} • {emp.targetHoursPerMonth}h Soll</p>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      emp.status === 'Aktiv'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        : emp.status === 'In Urlaub'
                        ? 'bg-blue-950 text-blue-300 border border-blue-800'
                        : 'bg-red-950 text-red-300 border border-red-800'
                    }`}
                  >
                    {emp.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: Intelligente Automationszentrale */}
      {activeSubTab === 'automations' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          {/* Automation Rule 1: Expiring Certs */}
          <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-400" />
                <span className="font-bold text-white">DGUV / §34a Fristenüberwachung</span>
              </div>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                Aktiv
              </span>
            </div>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              Eskaliert automatisch, wenn Ersthelfer- oder Brandschutzbescheinigungen innerhalb von 60 Tagen ablaufen.
            </p>
            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 space-y-1 text-[11px]">
              <span className="font-semibold text-slate-200">Gefundene Warnung:</span>
              <p className="text-amber-400 font-mono">Igor Petrov (MA-0504) - Ersthelfer fällig</p>
            </div>
            <button
              onClick={() => {
                addTask({
                  title: 'DRK-Ersthelferschulung für Igor Petrov buchen',
                  description: 'Voraussetzung für Alleindienst auf Tor 1 Werkschutz.',
                  priority: TaskPriority.HOCH,
                  status: TaskStatus.OFFEN,
                  assignedTo: 'Personalabteilung',
                  dueDate: '2025-05-20',
                  createdBy: 'Automations-Engine'
                });
                alert('Aufgabe erfolgreich an die Personalabteilung übermittelt.');
              }}
              className="w-full py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium transition"
            >
              Schulungs-Ticket erzeugen
            </button>
          </div>

          {/* Automation Rule 2: Unstaffed Shifts Alert */}
          <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-red-400" />
                <span className="font-bold text-white">Vakanzen-Frühwarnsystem (24h)</span>
              </div>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                Aktiv
              </span>
            </div>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              Erkennt unbesetzte Schichten in den nächsten 24 Stunden und warnt Einsatzleitung & Leitstand.
            </p>
            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 space-y-1 text-[11px]">
              <span className="font-semibold text-slate-200">Kritische Schicht:</span>
              <p className="text-red-400 font-mono">Einkaufszentrum Galerie Am Dom (Spätdienst)</p>
            </div>
            <button
              onClick={() => {
                sendDispatchMessage('Leitzentrale', 'KRITISCHE VAKANZ: Galerie Am Dom Spätdienst unbesetzt. Sofortige Springerprüfung einleiten!', true);
                alert('Dringender Funkspruch an Leitzentrale abgesetzt.');
              }}
              className="w-full py-1.5 rounded bg-red-950/80 hover:bg-red-900 text-red-200 font-medium border border-red-800 transition"
            >
              Leitstellen-Alarm auslösen
            </button>
          </div>

          {/* Automation Rule 3: Standing Orders acknowledgment */}
          <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <FileCheck2 className="h-4 w-4 text-emerald-400" />
                <span className="font-bold text-white">Dienstanweisungs-Ablauf</span>
              </div>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                Aktiv
              </span>
            </div>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              DIN 77200 Konformität: Überwacht, ob alle Wachkräfte neue Revisionen der Dienstanweisung quittiert haben.
            </p>
            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 space-y-1 text-[11px]">
              <span className="font-semibold text-slate-200">Gültige DA:</span>
              <p className="text-emerald-400 font-mono">DA-2025-01 Werkschutz Tor 1 (14 Bestätigungen)</p>
            </div>
            <div className="p-2 text-center text-slate-400 text-[10px] bg-slate-950 rounded">
              Status: 100% DIN 77200 Revisionskonform
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: Wachlokal Schnell-Terminal */}
      {activeSubTab === 'terminal' && (
        <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 space-y-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Smartphone className="h-5 w-5 text-emerald-400" />
                Wachlokal Schnell-Terminal (Pforten-Modus)
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Optimiert für Touchscreens & Tablets am Werkstor: Schnellerfassung von Schichtmeldungen & Deister-Scan.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-400">Standort:</span>
              <select
                value={terminalObjId}
                onChange={(e) => setTerminalObjId(e.target.value)}
                className="bg-slate-950 border border-slate-700 text-white font-semibold rounded-lg px-3 py-1.5 focus:outline-none"
              >
                {objects.map(o => (
                  <option key={o.id} value={o.id}>{o.name}</option>
                ))}
              </select>
            </div>
          </div>

          {terminalStatusMsg && (
            <div className="p-3 rounded-lg bg-emerald-950/80 border border-emerald-800 text-emerald-200 text-xs flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>{terminalStatusMsg}</span>
            </div>
          )}

          {/* Quick Action Buttons for Guards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <button
              onClick={() => {
                scanCheckpoint('cp-01');
                setTerminalStatusMsg('Kontrollpunkt CP-01 Schranke Nord erfolgreich gescannt.');
                setTimeout(() => setTerminalStatusMsg(null), 3000);
              }}
              className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-emerald-500/80 text-left transition space-y-1 group"
            >
              <Radio className="h-5 w-5 text-emerald-400 group-hover:scale-110 transition" />
              <span className="font-bold text-white text-xs block">NFC Deister-Scan</span>
              <span className="text-[10px] text-slate-400">Schrankenanlage Nord</span>
            </button>

            <button
              onClick={() => {
                addOwksEntry({
                  timestamp: new Date().toLocaleString('de-DE', { dateStyle: 'short', timeStyle: 'short' }),
                  objectId: terminalObjId,
                  objectName: objects.find(o => o.id === terminalObjId)?.name || 'Schutzobjekt',
                  authorId: 'emp-301',
                  authorName: 'Wachführer Tor 1',
                  entryType: 'Schichtübergabe',
                  severity: IncidentSeverity.NORMAL,
                  title: 'Wachübernahme bestätigt',
                  description: 'Schlüsselkasten vollzählig. Schranken und ZKS funktionsgeprüft.',
                  attachmentsCount: 0,
                  policeInvolved: false
                });
                setTerminalStatusMsg('Schichtübergabe erfolgreich mit SHA-256 gesiegelt.');
                setTimeout(() => setTerminalStatusMsg(null), 3000);
              }}
              className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-emerald-500/80 text-left transition space-y-1 group"
            >
              <Key className="h-5 w-5 text-amber-400 group-hover:scale-110 transition" />
              <span className="font-bold text-white text-xs block">Schlüssel-Appell</span>
              <span className="text-[10px] text-slate-400">Vollzählig quittiert</span>
            </button>

            <button
              onClick={() => {
                sendDispatchMessage('Streife Funk Kanal 2', 'LKW-Anlieferung Tor Nord abgeschlossen. Einfahrt frei.', false);
                setTerminalStatusMsg('Meldung an Streifenfunk Kanal 2 abgesetzt.');
                setTimeout(() => setTerminalStatusMsg(null), 3000);
              }}
              className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-emerald-500/80 text-left transition space-y-1 group"
            >
              <Send className="h-5 w-5 text-blue-400 group-hover:scale-110 transition" />
              <span className="font-bold text-white text-xs block">Funkspruch senden</span>
              <span className="text-[10px] text-slate-400">Kanal 2 (Tor / Streife)</span>
            </button>

            <button
              onClick={() => {
                addOwksEntry({
                  timestamp: new Date().toLocaleString('de-DE', { dateStyle: 'short', timeStyle: 'short' }),
                  objectId: terminalObjId,
                  objectName: objects.find(o => o.id === terminalObjId)?.name || 'Schutzobjekt',
                  authorId: 'emp-301',
                  authorName: 'Wachführer Tor 1',
                  entryType: 'Besucher',
                  severity: IncidentSeverity.NORMAL,
                  title: 'Besucher/Fremdfirma registriert',
                  description: 'Fremdfirmen-Ausweis ausgegeben nach Identitätsprüfung.',
                  attachmentsCount: 0,
                  policeInvolved: false
                });
                setTerminalStatusMsg('Besuchereintrag im OWKS gespeichert.');
                setTimeout(() => setTerminalStatusMsg(null), 3000);
              }}
              className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-emerald-500/80 text-left transition space-y-1 group"
            >
              <Building className="h-5 w-5 text-purple-400 group-hover:scale-110 transition" />
              <span className="font-bold text-white text-xs block">Besucherprotokoll</span>
              <span className="text-[10px] text-slate-400">Ausweis & ZKS</span>
            </button>
          </div>

          {/* Quick Incident Form */}
          <form onSubmit={handleTerminalFastIncident} className="space-y-3 pt-2">
            <label className="block text-xs font-semibold text-slate-300">
              Schnellerfassung für das Online-Wachbuch (OWKS):
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                required
                placeholder="Kurze Ereignismeldung (z.B. LKW ohne Frachtpapiere abgewiesen)..."
                value={terminalIncidentText}
                onChange={(e) => setTerminalIncidentText(e.target.value)}
                className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono"
              />
              <button
                type="submit"
                className="px-4 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center justify-center gap-2"
              >
                <BookOpenCheck className="h-4 w-4" />
                Sofort Versiegeln
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
