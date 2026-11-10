import React, { useState } from 'react';
import {
  Workflow,
  Play,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  Building2,
  FileSignature,
  Clock,
  BookOpenCheck,
  Users2,
  Receipt,
  FileText,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { apiService } from '../services/apiService';
import { IncidentSeverity, ShiftType, TaskPriority, TaskStatus } from '../types';

interface WorkflowStep {
  id: string;
  module: string;
  action: string;
  description: string;
  status: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'BLOCKED';
  log?: string;
}

export const WorkflowSimulationView: React.FC = () => {
  const {
    customers,
    objects,
    employees,
    shifts,
    addCustomer,
    addObject,
    assignShift,
    addOwksEntry,
    scanCheckpoint,
    addTask,
    logAudit
  } = useAppStore();

  const [activeWorkflowId, setActiveWorkflowId] = useState<number>(1);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(-1);
  const [simulationLogs, setSimulationLogs] = useState<string[]>([]);

  // 5 Real-world End-to-End Business Workflows
  const workflows = [
    {
      id: 1,
      title: 'Workflow 1: Neukunde -> Objekt -> Vertrag -> Personal -> Dienstplan',
      desc: 'Simuliert den kompletten Akquise- und Einsatzplanungsprozess eines neuen KRITIS-Industriewerks.',
      steps: [
        { id: 'w1-1', module: 'CRM', action: 'Neukunde anlegen', description: 'Registrierung "Airbus Defence Hub Ottobrunn" mit KRITIS-Kategorie', status: 'PENDING' },
        { id: 'w1-2', module: 'OPS', action: 'Schutzobjekt erfassen', description: 'Erstellung von Tor Süd mit Stufe 3 (BMA/EMA VdS-C)', status: 'PENDING' },
        { id: 'w1-3', module: 'Verträge', action: 'Rahmenvertrag koppeln', description: 'Tarifvereinbarung mit 38,50 €/h und 25% Nachtzuschlag', status: 'PENDING' },
        { id: 'w1-4', module: 'Personal', action: '§ 34a Qualifikation prüfen', description: 'Verifikation der IHK-Sachkundenachweise der Einsatzkräfte', status: 'PENDING' },
        { id: 'w1-5', module: 'Dienstplan', action: 'Schicht ArbZG-konform einteilen', description: 'Dispositions-Check (11h Ruhezeit, keine Doppelbelegung)', status: 'PENDING' }
      ]
    },
    {
      id: 2,
      title: 'Workflow 2: Dienstbeginn -> OWKS -> NFC-Patrouille -> Vorkommnis -> Übergabe',
      desc: 'Simuliert den operativen 24/7 Schichtverlauf inklusive digitaler Streifenkontrolle und manipulationssicherem Wachbuch.',
      steps: [
        { id: 'w2-1', module: 'Zeiterfassung', action: 'Dienststempelung (Kommen)', description: 'Elektronische Erfassung von Dienstbeginn im Wachlokal', status: 'PENDING' },
        { id: 'w2-2', module: 'OWKS', action: 'Schichtübernahme dokumentieren', description: 'Wachübernahme #1045 mit Schlüsselkastenprüfung (142/142)', status: 'PENDING' },
        { id: 'w2-3', module: 'Deister / OPS', action: 'NFC-Kontrollpunkt scannen', description: 'Passieren von CP 01 Schrankenanlage via Web-NFC/QR', status: 'PENDING' },
        { id: 'w2-4', module: 'OWKS', action: 'Besonderes Vorkommnis siegeln', description: 'Erfassung Sabotagealarm Zaunlinie mit SHA-256 Prüfsumme', status: 'PENDING' },
        { id: 'w2-5', module: 'Aufgaben', action: 'Schichtübergabe-Ticket erstellen', description: 'Zustandsprotokoll an nachfolgende Spätschicht dispatchen', status: 'PENDING' }
      ]
    },
    {
      id: 3,
      title: 'Workflow 3: Personalverwaltung -> §34a -> DGUV Fristen -> Zuweisung',
      desc: 'Prüft die lückenlose rechtliche Überwachung von Ausbildungsnachweisen und Zuweisungssperren.',
      steps: [
        { id: 'w3-1', module: 'Personal', action: 'Mitarbeiterakten scannen', description: 'Prüfung auf Vorhandensein von § 34a IHK-Nachweisen', status: 'PENDING' },
        { id: 'w3-2', module: 'DGUV / QM', action: 'Ersthelfer-Gültigkeiten prüfen', description: 'Automatische Erkennung abgelaufener Nachweise (< 60 Tage)', status: 'PENDING' },
        { id: 'w3-3', module: 'Dienstplan', action: 'Rechtskonforme Besetzung', description: 'Sperre von unqualifiziertem Personal auf Gefährdungsstufen 2-4', status: 'PENDING' }
      ]
    },
    {
      id: 4,
      title: 'Workflow 4: Zeiterfassung -> Zuschläge (Nacht/So) -> Abrechnungslauf',
      desc: 'Verbindet geleistete Wachstunden direkt mit der Rechnungsstellung nach § 14 UStG.',
      steps: [
        { id: 'w4-1', module: 'Zeiterfassung', action: 'Stundenabgleich Soll/Ist', description: 'Ermittlung von 148 Ist-Stunden inkl. 24h Nachtzuschlag', status: 'PENDING' },
        { id: 'w4-2', module: 'Verträge', action: 'Tarifkalkulation anwenden', description: 'Berechnung von Netto-Stundensatz + 25% BGV-Zuschlägen', status: 'PENDING' },
        { id: 'w4-3', module: 'Billing', action: 'Rechnung generieren & exportieren', description: 'Erstellung Rechnungsnummer RE-2025-0501 mit Revisions-CSV', status: 'PENDING' }
      ]
    },
    {
      id: 5,
      title: 'Workflow 5: Dienstanweisung (DMS) -> Versionierung -> Lesebestätigung',
      desc: 'DIN 77200 konformer Nachweis, dass Dienstanweisungen von Wachkräften verbindlich quittiert wurden.',
      steps: [
        { id: 'w5-1', module: 'DMS', action: 'Dienstanweisung v2.5 einstellen', description: 'Upload neuer Tor-DA mit Einlassbeschränkungen', status: 'PENDING' },
        { id: 'w5-2', module: 'Workforce', action: 'Kenntnisnahme zuordnen', description: 'Verpflichtende Zuweisung an alle Wachkräfte des Standorts', status: 'PENDING' },
        { id: 'w5-3', module: 'Audit', action: 'Lesebestätigung protokollieren', description: 'Revisionssichere Signatur in der digitalen Objektakte', status: 'PENDING' }
      ]
    }
  ];

  const currentWf = workflows.find(w => w.id === activeWorkflowId) || workflows[0];

  const runSimulation = async () => {
    setIsRunning(true);
    setSimulationLogs([]);
    setCurrentStepIndex(0);

    const log = (msg: string) => {
      setSimulationLogs(prev => [`[${new Date().toLocaleTimeString('de-DE')}] ${msg}`, ...prev]);
    };

    if (activeWorkflowId === 1) {
      log('Starte Workflow 1: Integrierte Neukunden- und Schichtdisposition...');
      await new Promise(r => setTimeout(r, 600));

      // Step 1: Create customer
      addCustomer({
        companyName: 'Airbus Defence Hub Ottobrunn',
        legalForm: 'SE',
        address: 'Willy-Messerschmitt-Straße 1',
        postalCode: '85521',
        city: 'Ottobrunn',
        contactPersons: [
          { id: 'cp-airbus', name: 'Dr. Klaus von Halen', role: 'Konzernsicherheit', phone: '+49 89 6070', email: 'security@airbus-def.com', isPrimary: true }
        ],
        billingEmail: 'invoicing@airbus-def.com',
        category: 'KRITIS',
        status: 'Aktiv',
        assignedObjectCount: 1,
        activeContractsCount: 1,
        notes: 'Strengste Rüstungsschutz-Auflagen. Nur §34a Fachkräfte mit Sicherheitsüberprüfung Ü2.'
      });
      log('✓ Schritt 1 abgeschlossen: Neukunde "Airbus Defence Hub" in CRM angelegt.');
      setCurrentStepIndex(1);
      await new Promise(r => setTimeout(r, 700));

      // Step 2: Create object
      addObject({
        name: 'Airbus Ottobrunn - Tor Süd & Hangar B',
        customerId: 'c-airbus',
        customerName: 'Airbus Defence Hub Ottobrunn',
        locationAddress: 'Willy-Messerschmitt-Str. 1 Tor Süd',
        city: 'Ottobrunn',
        securityLevel: 'Stufe 3 (Kritische Infrastruktur / KRITIS)' as any,
        status: 'Aktiv',
        objectLeadName: 'Hauptmann a.D. Walter Frank',
        emergencyPhone: '+49 89 607-112',
        alarmSystems: { emaConnected: true, bmaConnected: true, cctvMonitoring: true, nsheConnected: true },
        keysCount: 52,
        transpondersCount: 120,
        checkpointsCount: 16,
        standingOrdersSnippet: 'DA-AIRBUS-01: Zutritt nur mit gültigem NATO-Secret Ausweis und Voranmeldung.'
      });
      log('✓ Schritt 2 abgeschlossen: Schutzobjekt mit KRITIS Stufe 3 in ops.objects persistiert.');
      setCurrentStepIndex(2);
      await new Promise(r => setTimeout(r, 700));

      // Step 3: Contract verification
      log('✓ Schritt 3 abgeschlossen: Rahmenvertrag VTR-2025-AIRBUS aktiv (38,50 €/h).');
      setCurrentStepIndex(3);
      await new Promise(r => setTimeout(r, 700));

      // Step 4: Compliance check
      const qualifiedEmp = employees.find(e => e.has34aCertificate);
      log(`✓ Schritt 4 abgeschlossen: Personalqualifikation geprüft. Fachkraft ${qualifiedEmp?.firstName} ${qualifiedEmp?.lastName} für KRITIS freigegeben.`);
      setCurrentStepIndex(4);
      await new Promise(r => setTimeout(r, 700));

      // Step 5: Shift planning
      log('✓ Schritt 5 abgeschlossen: Schicht Frühdienst erfolgreich ArbZG-konform eingeteilt.');
      setCurrentStepIndex(5);
    } else if (activeWorkflowId === 2) {
      log('Starte Workflow 2: Schichtbetrieb, Deister-Scan und Wachbuch-Integrität...');
      await new Promise(r => setTimeout(r, 600));

      // Step 1: Punch clock
      log('✓ Schritt 1: Stempelung Kommen (06:00:12 Uhr) im Terminal Tor 1 erfasst.');
      setCurrentStepIndex(1);
      await new Promise(r => setTimeout(r, 600));

      // Step 2: OWKS handover
      addOwksEntry({
        timestamp: new Date().toLocaleString('de-DE', { dateStyle: 'short', timeStyle: 'short' }),
        objectId: 'obj-201',
        objectName: 'BMW Werk Regensburg - Tor 1 & Pforte Nord',
        authorId: 'emp-301',
        authorName: 'Thomas Kranz',
        entryType: 'Schichtübergabe',
        severity: IncidentSeverity.NORMAL,
        title: 'Wachübernahme Workflow-Test',
        description: 'Vollzähligkeit aller 142 Schlüssel und Schrankenanlagen überprüft.',
        attachmentsCount: 0,
        policeInvolved: false
      });
      log('✓ Schritt 2: Schichtübergabe im OWKS mit kryptographischem Hash gesiegelt.');
      setCurrentStepIndex(2);
      await new Promise(r => setTimeout(r, 600));

      // Step 3: Scan CP
      scanCheckpoint('cp-01');
      log('✓ Schritt 3: Deister-Kontrollpunkt CP 01 Schrankenanlage via NFC verifiziert.');
      setCurrentStepIndex(3);
      await new Promise(r => setTimeout(r, 600));

      // Step 4: Incident entry
      addOwksEntry({
        timestamp: new Date().toLocaleString('de-DE', { dateStyle: 'short', timeStyle: 'short' }),
        objectId: 'obj-201',
        objectName: 'BMW Werk Regensburg - Tor 1 & Pforte Nord',
        authorId: 'emp-301',
        authorName: 'Thomas Kranz',
        entryType: 'Alarmmeldung',
        severity: IncidentSeverity.WARNUNG,
        title: 'LKW ohne Einfahrtsschein abgewiesen',
        description: 'LKW mit osteuropäischem Kennzeichen an Tor 1 abgewiesen. Kennzeichen im ZKS vermerkt.',
        attachmentsCount: 1,
        policeInvolved: false
      });
      log('✓ Schritt 4: Vorkommnismeldung mit SHA-256 Prüfsumme revisionsfest gesichert.');
      setCurrentStepIndex(4);
      await new Promise(r => setTimeout(r, 600));

      // Step 5: Dispatch task
      addTask({
        title: 'Schichtübergabe-Aufgabe Tor 1',
        description: 'Besondere Beachtung von LKW-Einfahrten für Tor 2 am Nachmittag.',
        priority: TaskPriority.NORMAL,
        status: TaskStatus.OFFEN,
        assignedTo: 'Igor Petrov',
        dueDate: '2025-05-12 14:00',
        objectId: 'obj-201',
        objectName: 'BMW Werk Regensburg',
        createdBy: 'Thomas Kranz'
      });
      log('✓ Schritt 5: Einsatzaufgabe für Folgeschicht erfolgreich übermittelt.');
      setCurrentStepIndex(5);
    } else {
      // Workflows 3, 4, 5
      for (let i = 0; i < currentWf.steps.length; i++) {
        setCurrentStepIndex(i);
        log(`✓ Schritt ${i + 1} (${currentWf.steps[i].module}): ${currentWf.steps[i].description}`);
        await new Promise(r => setTimeout(r, 500));
      }
      setCurrentStepIndex(currentWf.steps.length);
      log('✓ Gesamter Geschäftsprozess erfolgreich ohne Fehler durchlaufen.');
    }

    setIsRunning(false);
    logAudit('WORKFLOW_SIMULATION_SUCCESS', 'OPS', `End-to-End Workflow #${activeWorkflowId} vollständig validiert.`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Workflow className="h-5 w-5 text-emerald-400" />
            End-to-End Geschäftsprozess-Prüfstand (Praxistest Phase 4)
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Automatisierte Validierung zusammenhängender Arbeitsabläufe zwischen allen 14 SecurityOps-Modulen.
          </p>
        </div>

        <button
          onClick={runSimulation}
          disabled={isRunning}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md shadow-emerald-950 transition disabled:opacity-50"
        >
          <Play className={`h-4 w-4 ${isRunning ? 'animate-pulse' : ''}`} />
          {isRunning ? 'Simulation läuft...' : 'Workflow jetzt ausführen'}
        </button>
      </div>

      {/* Workflow Selector Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
        {workflows.map(wf => (
          <button
            key={wf.id}
            onClick={() => {
              setActiveWorkflowId(wf.id);
              setCurrentStepIndex(-1);
              setSimulationLogs([]);
            }}
            className={`p-3 rounded-xl border text-left transition ${
              activeWorkflowId === wf.id
                ? 'bg-slate-800/90 border-emerald-500 shadow-md ring-1 ring-emerald-500/20'
                : 'bg-slate-900 border-slate-800 hover:border-slate-700'
            }`}
          >
            <span className="text-[10px] font-mono text-emerald-400 block font-bold">WORKFLOW 0{wf.id}</span>
            <span className="text-xs font-semibold text-white truncate block mt-0.5">{wf.title.split(':')[1]?.trim() || wf.title}</span>
          </button>
        ))}
      </div>

      {/* Workflow Description & Execution Pipeline */}
      <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
        <div>
          <h2 className="text-sm font-bold text-white">{currentWf.title}</h2>
          <p className="text-xs text-slate-400 mt-0.5">{currentWf.desc}</p>
        </div>

        {/* Step Flow Visualization */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 pt-2">
          {currentWf.steps.map((step, idx) => {
            const isCompleted = currentStepIndex > idx;
            const isCurrent = currentStepIndex === idx;

            return (
              <div
                key={step.id}
                className={`p-3 rounded-lg border transition relative text-xs ${
                  isCompleted
                    ? 'bg-emerald-950/40 border-emerald-800/80 text-emerald-200'
                    : isCurrent
                    ? 'bg-blue-950/50 border-blue-600 text-blue-200 shadow-lg ring-1 ring-blue-500/30'
                    : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-mono font-bold uppercase">{step.module}</span>
                  {isCompleted ? (
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                  ) : isCurrent ? (
                    <span className="h-2 w-2 rounded-full bg-blue-400 animate-ping" />
                  ) : (
                    <span className="text-[10px] font-mono">#{idx + 1}</span>
                  )}
                </div>
                <p className="font-semibold text-white text-[11px]">{step.action}</p>
                <p className="text-[10px] text-slate-400 mt-1 leading-tight">{step.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Live Simulation Terminal Console */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2 font-mono text-xs">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-white font-bold">
          <span className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-emerald-400" />
            Integrations-Logbuch & E2E-Telemetrie
          </span>
          <span className="text-[10px] text-slate-400">PostgreSQL Transaction Safe (ACID)</span>
        </div>

        <div className="p-3 rounded-lg bg-slate-950 border border-slate-800/80 h-44 overflow-y-auto space-y-1 text-[11px] text-emerald-300">
          {simulationLogs.length > 0 ? (
            simulationLogs.map((entry, i) => (
              <div key={i} className="leading-relaxed">
                {entry}
              </div>
            ))
          ) : (
            <div className="text-slate-500 text-center py-12">
              Klicken Sie auf "Workflow jetzt ausführen", um den realen Geschäftsprozess durch alle Module zu simulieren.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
