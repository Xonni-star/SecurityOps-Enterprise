import { create } from 'zustand';
import {
  Customer,
  SecurityObject,
  Employee,
  Shift,
  OwksEntry,
  Checkpoint,
  TimeRecord,
  Contract,
  Invoice,
  DocumentItem,
  AuditLog,
  SecurityTask,
  DispatchMessage,
  ShiftChangeRecord,
  QmAudit,
  AlarmIntervention,
  AlarmTriggerType,
  InterventionStatus,
  SecurityEquipmentItem,
  EquipmentCategory,
  UserRole,
  IncidentSeverity,
  ShiftType,
  SecurityLevel,
  InvoiceStatus,
  TaskPriority,
  TaskStatus
} from '../types';
import {
  INITIAL_CUSTOMERS,
  INITIAL_OBJECTS,
  INITIAL_EMPLOYEES,
  INITIAL_SHIFTS,
  INITIAL_OWKS_ENTRIES,
  INITIAL_CHECKPOINTS,
  INITIAL_CONTRACTS,
  INITIAL_INVOICES,
  INITIAL_DOCUMENTS,
  INITIAL_AUDIT_LOGS,
  INITIAL_TASKS,
  INITIAL_DISPATCH_MESSAGES
} from '../constants';
import { apiService } from '../services/apiService';

export interface KeyLogEntry {
  id: string;
  objectId: string;
  keyNumber: string;
  keyLabel: string;
  borrowerName: string;
  borrowerCompany: string;
  issuedAt: string;
  returnedAt?: string;
  issuedBy: string;
  status: 'Ausgegeben' | 'Zurückgegeben' | 'Überfällig';
}

const INITIAL_EQUIPMENT: SecurityEquipmentItem[] = [
  {
    id: 'eq-101',
    serialNumber: 'DA-2025-0412',
    inventoryNumber: 'INV-AUSW-01',
    category: EquipmentCategory.DIENSTAUSWEIS,
    modelName: 'Offizieller Dienstausweis mit Lichtbild (§ 18 BewachV)',
    assignedEmployeeId: 'emp-301',
    assignedEmployeeName: 'Thomas Kranz',
    assignedAt: '2024-01-10',
    inspectionDue: '2026-01-10',
    status: 'Ausgegeben',
    ceCertified: true,
    notes: 'Sichtbar zu tragen bei jedem Wachdienst. Registriert im Bewacherregister.'
  },
  {
    id: 'eq-102',
    serialNumber: 'SN-WESTE-8812',
    inventoryNumber: 'INV-PSA-04',
    category: EquipmentCategory.STICHSCHUTZWESTE,
    modelName: 'Mehler Vario System Unterzieh-Stichschutzweste KDIW 2004',
    assignedEmployeeId: 'emp-301',
    assignedEmployeeName: 'Thomas Kranz',
    assignedAt: '2024-02-15',
    inspectionDue: '2025-08-15',
    status: 'Ausgegeben',
    ceCertified: true,
    notes: 'VPAM K2/D2 zertifiziert. Pflicht bei Doorman- und Tordiensten.'
  },
  {
    id: 'eq-103',
    serialNumber: 'DMR-MOT-9921',
    inventoryNumber: 'INV-FUNK-02',
    category: EquipmentCategory.FUNKGERAET_DMR,
    modelName: 'Motorola DP4801e DMR mit PNA-Totmanneinrichtung',
    assignedEmployeeId: 'emp-303',
    assignedEmployeeName: 'Igor Petrov',
    assignedAt: '2025-05-12',
    inspectionDue: '2025-11-20',
    status: 'Ausgegeben',
    ceCertified: true,
    notes: 'Integrierter Lagesensor (Totmann) nach DGUV Regel 112-139 für Alleinarbeit.'
  },
  {
    id: 'eq-104',
    serialNumber: 'IFAK-MED-05',
    inventoryNumber: 'INV-SAN-05',
    category: EquipmentCategory.FIRST_AID_KIT,
    modelName: 'Taktisches Trauma-IFAK Ersthelferkit (Tourniquet/Chest Seal)',
    inspectionDue: '2025-06-01',
    status: 'Prüfung fällig',
    ceCertified: true,
    notes: 'Sterilgutablauf im Juni 2025 – Nachbestellung über Betriebsärztlichen Dienst.'
  }
];

const INITIAL_KEY_LOGS: KeyLogEntry[] = [
  {
    id: 'kl-1',
    objectId: 'obj-201',
    keyNumber: 'SCHL-042',
    keyLabel: 'Trafohaus 4 Hauptschlüssel',
    borrowerName: 'Sven Lindemann',
    borrowerCompany: 'Stadtwerke Regensburg Netz GmbH',
    issuedAt: '2025-05-12 07:30',
    issuedBy: 'Thomas Kranz',
    status: 'Ausgegeben'
  },
  {
    id: 'kl-2',
    objectId: 'obj-201',
    keyNumber: 'SCHL-018',
    keyLabel: 'Serverraum Tor 1 USV-Zentrale',
    borrowerName: 'Markus Vogel',
    borrowerCompany: 'Siemens Energy Service',
    issuedAt: '2025-05-12 08:15',
    returnedAt: '2025-05-12 09:45',
    issuedBy: 'Thomas Kranz',
    status: 'Zurückgegeben'
  }
];

const INITIAL_TIME_RECORDS: TimeRecord[] = [
  { id: 'tr-1', employeeId: 'emp-301', employeeName: 'Thomas Kranz', date: '2025-05-12', clockIn: '06:00', clockOut: '14:00', breakMinutes: 45, actualHours: 7.25, nightHours: 0, sundayHours: 0, holidayHours: 0, status: 'Erfasst' },
  { id: 'tr-2', employeeId: 'emp-302', employeeName: 'Eleni Vassiliou', date: '2025-05-11', clockIn: '22:00', clockOut: '06:00', breakMinutes: 45, actualHours: 7.25, nightHours: 7.0, sundayHours: 7.25, holidayHours: 0, status: 'Freigegeben' },
  { id: 'tr-3', employeeId: 'emp-303', employeeName: 'Igor Petrov', date: '2025-05-11', clockIn: '14:00', clockOut: '22:00', breakMinutes: 45, actualHours: 7.25, nightHours: 1.0, sundayHours: 7.25, holidayHours: 0, status: 'Freigegeben' },
  { id: 'tr-4', employeeId: 'emp-301', employeeName: 'Thomas Kranz', date: '2025-05-10', clockIn: '06:00', clockOut: '14:30', breakMinutes: 45, actualHours: 7.75, nightHours: 0, sundayHours: 0, holidayHours: 0, status: 'Gesperrt' }
];

const INITIAL_QM_AUDITS: QmAudit[] = [
  {
    id: 'qm-1',
    auditNumber: 'QM-AUDIT-2025-01',
    objectId: 'obj-201',
    objectName: 'BMW Werk Regensburg - Tor 1 & Pforte Nord',
    auditorName: 'Klaus Lindemann (QM-Beauftragter DIN 77200)',
    auditDate: '2025-05-02',
    scorePercent: 96,
    defectsCount: 0,
    status: 'In Ordnung',
    measuresSummary: 'Dienstanweisung vollumfänglich eingehalten. Schutzkleidung & Dienstausweise nach Vorschrift getragen.'
  },
  {
    id: 'qm-2',
    auditNumber: 'QM-AUDIT-2025-02',
    objectId: 'obj-203',
    objectName: 'Einkaufszentrum Galerie Am Dom',
    auditorName: 'Klaus Lindemann (QM-Beauftragter DIN 77200)',
    auditDate: '2025-04-28',
    scorePercent: 84,
    defectsCount: 2,
    status: 'Nachbesserung gefordert',
    measuresSummary: 'Schlüsselkasten-Plombe wurde nicht tagesaktuell gezeichnet; Nachschulung für Schichtführer terminiert.'
  }
];

const INITIAL_ALARM_INTERVENTIONS: AlarmIntervention[] = [
  {
    id: 'alm-901',
    alarmNumber: 'ALM-2025-0811',
    objectId: 'obj-201',
    objectName: 'BMW Werk Regensburg - Tor 1 & Pforte Nord',
    customerName: 'BMW Group Werk Regensburg',
    triggerType: AlarmTriggerType.SABOTAGE_PERIMETER,
    detectorZone: 'Linie 04 / Sektor Zaunlinie Ost (Infrarot-Schranke)',
    receivedAt: '2025-05-12 08:42:15',
    slaMinutes: 15,
    slaStartedAt: '2025-05-12 08:44:00',
    slaTargetTimestamp: Date.now() + 11 * 60 * 1000,
    status: InterventionStatus.ANFAHRT,
    dispatchedUnit: 'Streifenfahrzeug Revier 2 (Funk: Adler 2)',
    dispatchedAt: '2025-05-12 08:44:00',
    cctvVerified: true,
    clientContacted: true,
    policeFeuerwehrInvolved: false,
    findings: 'Optische Vorprüfung via PTZ-Kamera 14: Astbruch auf Zaunfeld festgestellt. Streife zur Bestätigung angefordert.',
    measuresTaken: 'SLA-Intervention VdS 2172 eingeleitet. Anfahrt via Tor 2.',
    vdsCompliant: true
  },
  {
    id: 'alm-902',
    alarmNumber: 'ALM-2025-0812',
    objectId: 'obj-202',
    objectName: 'Data Center Alpha Frankfurt',
    customerName: 'Mainova Energie Rechenzentrum Frankfurt',
    triggerType: AlarmTriggerType.EMA_EINBRUCH,
    detectorZone: 'Schleuse 2 / Vereinzelungsanlage Serverraum B',
    receivedAt: '2025-05-12 09:30:44',
    slaMinutes: 15,
    slaTargetTimestamp: Date.now() + 14 * 60 * 1000,
    status: InterventionStatus.EINGEGANGEN,
    cctvVerified: false,
    clientContacted: false,
    policeFeuerwehrInvolved: false,
    findings: 'EMA-Alarmkontakt ausgelöst. Vorprüfung durch NSL-Disponenten ausstehend.',
    measuresTaken: 'Alarmeingang in NSL quittiert. Vorprüfung eingeleitet.',
    vdsCompliant: true
  },
  {
    id: 'alm-900',
    alarmNumber: 'ALM-2025-0809',
    objectId: 'obj-203',
    objectName: 'Einkaufszentrum Galerie Am Dom',
    customerName: 'Shopping Galerie Am Dom',
    triggerType: AlarmTriggerType.BMA_BRAND,
    detectorZone: 'UG Tiefgarage / Sektor Sprinklerzentrale Melder 12',
    receivedAt: '2025-05-11 23:14:02',
    slaMinutes: 15,
    slaStartedAt: '2025-05-11 23:15:10',
    slaTargetTimestamp: Date.now() - 3600 * 1000,
    status: InterventionStatus.ABGESCHLOSSEN_FEHL,
    dispatchedUnit: 'Revierstreife City Erfurt (Funk: Dom 1)',
    dispatchedAt: '2025-05-11 23:15:10',
    arrivedAt: '2025-05-11 23:23:45',
    completedAt: '2025-05-11 23:45:00',
    cctvVerified: true,
    clientContacted: true,
    policeFeuerwehrInvolved: true,
    policeFileNumber: 'FW-ERF-2025-4421',
    findings: 'Fehlalarm durch Abgase eines Rangierfahrzeugs in Ladezone UG. Keine Rauchentwicklung oder Brandeinwirkung.',
    measuresTaken: 'BMZ durch Feuerwehr Erfurt zurückgestellt. Hausmeister informiert. VdS-Protokoll gezeichnet.',
    tamperHash: 'vds2172_9a8f4c12_e823b1',
    vdsCompliant: true
  }
];

interface AppState {
  currentRole: UserRole;
  isOffline: boolean;
  offlineQueueCount: number;
  customers: Customer[];
  objects: SecurityObject[];
  employees: Employee[];
  shifts: Shift[];
  shiftChangeRecords: ShiftChangeRecord[];
  owksEntries: OwksEntry[];
  checkpoints: Checkpoint[];
  contracts: Contract[];
  invoices: Invoice[];
  documents: DocumentItem[];
  auditLogs: AuditLog[];
  tasks: SecurityTask[];
  dispatchMessages: DispatchMessage[];
  keyLogs: KeyLogEntry[];
  timeRecords: TimeRecord[];
  qmAudits: QmAudit[];
  interventions: AlarmIntervention[];
  equipmentItems: SecurityEquipmentItem[];
  searchQuery: string;

  // Actions
  setCurrentRole: (role: UserRole) => void;
  toggleOffline: () => void;
  setSearchQuery: (query: string) => void;
  addOwksEntry: (entry: Omit<OwksEntry, 'id' | 'sequenceNumber' | 'isTamperSealed' | 'hash' | 'syncStatus'>) => void;
  addCustomer: (cust: Omit<Customer, 'id' | 'customerNumber' | 'createdDate'>) => void;
  addObject: (obj: Omit<SecurityObject, 'id' | 'objectNumber' | 'createdDate'>) => void;
  addEmployee: (emp: Omit<Employee, 'id' | 'employeeNumber'>) => void;
  assignShift: (shiftId: string, employeeId: string, employeeName: string, reason?: string) => { success: boolean; error?: string };
  reportSickLeaveAndReplace: (shiftId: string, sickEmployeeId: string, replacementEmployeeId: string) => { success: boolean; message: string };
  scanCheckpoint: (checkpointId: string) => void;
  addTask: (task: Omit<SecurityTask, 'id' | 'createdAt'>) => void;
  updateTaskStatus: (taskId: string, status: TaskStatus) => void;
  sendDispatchMessage: (channel: DispatchMessage['channel'], message: string, isUrgent?: boolean) => void;
  logAudit: (action: string, category: AuditLog['category'], details: string) => void;

  addContract: (contract: Omit<Contract, 'id' | 'contractNumber'>) => void;
  addInvoice: (invoice: Omit<Invoice, 'id' | 'invoiceNumber'>) => void;
  addDocument: (doc: Omit<DocumentItem, 'id' | 'uploadedAt' | 'acknowledgedCount'>) => void;
  acknowledgeDocument: (docId: string) => void;
  addQmAudit: (audit: Omit<QmAudit, 'id' | 'auditNumber'>) => void;
  issueKey: (keyNumber: string, keyLabel: string, borrowerName: string, borrowerCompany: string, objectId: string) => void;
  returnKey: (keyLogId: string) => void;
  addTimeRecordCorrection: (recordId: string, actualHours: number, reason: string) => void;

  // VdS 2172 Alarm Intervention Actions
  triggerAlarm: (objectId: string, triggerType: AlarmTriggerType, detectorZone: string, slaMinutes: number) => void;
  verifyAlarmKamera: (interventionId: string, notes: string) => void;
  verifyAlarmClientCall: (interventionId: string) => void;
  dispatchPatrolUnit: (interventionId: string, unitName: string) => void;
  confirmAlarmArrival: (interventionId: string) => void;
  completeInterventionProtocol: (interventionId: string, outcome: 'ECHT' | 'FEHL', findings: string, measures: string, policeNotified: boolean, policeFileNo?: string) => void;

  // Equipment & PPE Actions (§ 18 BewachV & DGUV V23)
  addEquipmentItem: (item: Omit<SecurityEquipmentItem, 'id'>) => void;
  assignEquipmentToEmployee: (equipmentId: string, employeeId: string) => void;
  returnEquipment: (equipmentId: string) => void;
  markEquipmentInspected: (equipmentId: string, nextInspectionDate: string) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  currentRole: UserRole.EINSATZLEITUNG,
  isOffline: false,
  offlineQueueCount: 0,
  customers: INITIAL_CUSTOMERS,
  objects: INITIAL_OBJECTS,
  employees: INITIAL_EMPLOYEES,
  shifts: INITIAL_SHIFTS,
  shiftChangeRecords: [
    {
      id: 'scr-1',
      shiftId: 'sh-1',
      timestamp: '2025-05-12 05:40:12',
      modifiedBy: 'Disposition',
      reason: 'Reguläre Monatsdienstplan-Freigabe KW 20',
      previousEmployeeName: 'Vakanz',
      newEmployeeName: 'Thomas Kranz',
      arbzgChecked: true,
      qualificationChecked: true
    }
  ],
  owksEntries: INITIAL_OWKS_ENTRIES,
  checkpoints: INITIAL_CHECKPOINTS,
  contracts: INITIAL_CONTRACTS,
  invoices: INITIAL_INVOICES,
  documents: INITIAL_DOCUMENTS,
  auditLogs: INITIAL_AUDIT_LOGS,
  tasks: INITIAL_TASKS,
  dispatchMessages: INITIAL_DISPATCH_MESSAGES,
  keyLogs: INITIAL_KEY_LOGS,
  timeRecords: INITIAL_TIME_RECORDS,
  qmAudits: INITIAL_QM_AUDITS,
  interventions: INITIAL_ALARM_INTERVENTIONS,
  equipmentItems: INITIAL_EQUIPMENT,
  searchQuery: '',

  setCurrentRole: (role: UserRole) => {
    set({ currentRole: role });
    get().logAudit('IAM_ROLE_SWITCH', 'IAM', `Aktive Rolle gewechselt auf: ${role}`);
  },

  toggleOffline: () => {
    const next = !get().isOffline;
    set({ isOffline: next });
    if (!next && get().offlineQueueCount > 0) {
      const syncedEntries = get().owksEntries.map(e => ({ ...e, syncStatus: 'Synchronisiert' as const }));
      set({ owksEntries: syncedEntries, offlineQueueCount: 0 });
      get().logAudit('OWKS_OFFLINE_SYNC', 'OWKS', 'Wiederverbindung hergestellt: Alle Offline-Wachbucheinträge nachsynchronisiert.');
    }
  },

  setSearchQuery: (searchQuery: string) => set({ searchQuery }),

  addOwksEntry: (entryData) => {
    const isOff = get().isOffline;
    const nextSeq = get().owksEntries.length + 1042;
    const tamperHash = apiService.generateTamperProofHash(
      nextSeq,
      entryData.timestamp,
      entryData.objectId,
      entryData.authorName,
      entryData.description
    );

    const newEntry: OwksEntry = {
      ...entryData,
      id: `owks-${Date.now()}`,
      sequenceNumber: nextSeq,
      isTamperSealed: true,
      hash: tamperHash,
      syncStatus: isOff ? 'Offline Gespeichert' : 'Synchronisiert'
    };

    set(state => ({
      owksEntries: [newEntry, ...state.owksEntries],
      offlineQueueCount: isOff ? state.offlineQueueCount + 1 : state.offlineQueueCount
    }));

    get().logAudit(
      'OWKS_CREATE_ENTRY',
      'OWKS',
      `Eintrag #${nextSeq} (${newEntry.entryType}) angelegt durch ${newEntry.authorName} [${isOff ? 'OFFLINE' : 'ONLINE'}]`
    );
  },

  addCustomer: (custData) => {
    const num = `KD-2025-${String(get().customers.length + 1).padStart(3, '0')}`;
    const newCust: Customer = {
      ...custData,
      id: `c-${Date.now()}`,
      customerNumber: num,
      createdDate: new Date().toISOString().split('T')[0]
    };
    set(state => ({ customers: [newCust, ...state.customers] }));
    get().logAudit('CRM_CREATE_CUSTOMER', 'CRM', `Neukunde ${newCust.companyName} (${num}) angelegt.`);
  },

  addObject: (objData) => {
    const num = `OBJ-${String(get().objects.length + 1).padStart(3, '0')}`;
    const newObj: SecurityObject = {
      ...objData,
      id: `obj-${Date.now()}`,
      objectNumber: num,
      createdDate: new Date().toISOString().split('T')[0]
    };
    set(state => ({ objects: [newObj, ...state.objects] }));
    get().logAudit('OPS_CREATE_OBJECT', 'OPS', `Sicherheitsobjekt ${newObj.name} angelegt.`);
  },

  addEmployee: (empData) => {
    const num = `MA-${String(get().employees.length + 420).padStart(4, '0')}`;
    const badgeNum = `DA-2025-${String(get().employees.length + 101).padStart(3, '0')}`;
    const newEmp: Employee = {
      ...empData,
      id: `emp-${Date.now()}`,
      employeeNumber: num,
      serviceBadgeNumber: badgeNum
    };
    set(state => ({ employees: [newEmp, ...state.employees] }));
    get().logAudit('WORKFORCE_CREATE_EMPLOYEE', 'WORKFORCE', `Mitarbeiter ${newEmp.firstName} ${newEmp.lastName} (${num}) mit Dienstausweis ${badgeNum} angelegt.`);
  },

  assignShift: (shiftId: string, employeeId: string, employeeName: string, reason?: string) => {
    const shift = get().shifts.find(s => s.id === shiftId);
    const emp = get().employees.find(e => e.id === employeeId);
    if (!shift || !emp) {
      return { success: false, error: 'Schicht oder Mitarbeiter nicht auffindbar.' };
    }

    const compliance = apiService.verifyShiftCompliance(shift, emp, get().shifts);
    if (!compliance.valid) {
      return { success: false, error: compliance.violations.join('\n') };
    }

    const changeReason = reason || 'Dienstplan-Anpassung Disposition';
    const changeRecord: ShiftChangeRecord = {
      id: `scr-${Date.now()}`,
      shiftId: shift.id,
      timestamp: new Date().toLocaleString('de-DE'),
      modifiedBy: get().currentRole,
      reason: changeReason,
      previousEmployeeName: shift.employeeName || 'UNBESETZT',
      newEmployeeName: employeeName,
      arbzgChecked: true,
      qualificationChecked: true
    };

    set(state => ({
      shiftChangeRecords: [changeRecord, ...state.shiftChangeRecords],
      shifts: state.shifts.map(s => {
        if (s.id === shiftId) {
          return {
            ...s,
            employeeId,
            employeeName,
            status: 'Besetzt' as const,
            warnings: undefined,
            lastChangeReason: changeReason
          };
        }
        return s;
      })
    }));

    get().logAudit('OPS_ASSIGN_SHIFT', 'OPS', `Schicht ${shiftId} besetzt mit ${employeeName}. Begründung: ${changeReason}`);
    return { success: true };
  },

  reportSickLeaveAndReplace: (shiftId: string, sickEmployeeId: string, replacementEmployeeId: string) => {
    const shift = get().shifts.find(s => s.id === shiftId);
    const sickEmp = get().employees.find(e => e.id === sickEmployeeId);
    const replEmp = get().employees.find(e => e.id === replacementEmployeeId);

    if (!shift || !sickEmp || !replEmp) {
      return { success: false, message: 'Datensatz unvollständig für Notfall-Vertretung.' };
    }

    const compliance = apiService.verifyShiftCompliance(shift, replEmp, get().shifts);
    if (!compliance.valid) {
      return { success: false, message: `Vertretung abgewiesen:\n${compliance.violations.join('\n')}` };
    }

    const reason = `Akute Krankmeldung von ${sickEmp.firstName} ${sickEmp.lastName}`;
    const changeRecord: ShiftChangeRecord = {
      id: `scr-${Date.now()}`,
      shiftId: shift.id,
      timestamp: new Date().toLocaleString('de-DE'),
      modifiedBy: get().currentRole,
      reason,
      previousEmployeeName: `${sickEmp.firstName} ${sickEmp.lastName}`,
      newEmployeeName: `${replEmp.firstName} ${replEmp.lastName}`,
      arbzgChecked: true,
      qualificationChecked: true
    };

    set(state => ({
      shiftChangeRecords: [changeRecord, ...state.shiftChangeRecords],
      employees: state.employees.map(e => (e.id === sickEmployeeId ? { ...e, status: 'Krank' } : e)),
      shifts: state.shifts.map(s => {
        if (s.id === shiftId) {
          return {
            ...s,
            employeeId: replEmp.id,
            employeeName: `${replEmp.firstName} ${replEmp.lastName}`,
            status: 'Besetzt' as const,
            warnings: [`Notfall-Nachbesetzung wegen Krankmeldung von ${sickEmp.firstName} ${sickEmp.lastName}`],
            lastChangeReason: reason
          };
        }
        return s;
      })
    }));

    get().addOwksEntry({
      timestamp: new Date().toLocaleString('de-DE', { dateStyle: 'short', timeStyle: 'short' }),
      objectId: shift.objectId,
      objectName: shift.objectName,
      authorId: 'dispo-01',
      authorName: get().currentRole,
      entryType: 'Vorkommnis',
      severity: IncidentSeverity.WARNUNG,
      title: `Ad-hoc Krankheitsvertretung Schicht ${shift.shiftType}`,
      description: `Mitarbeiter ${sickEmp.firstName} ${sickEmp.lastName} hat sich krankgemeldet. Schicht wurde mit Springer ${replEmp.firstName} ${replEmp.lastName} (§ 34a IHK geprüft, ArbZG-konform) nachbesetzt.`,
      attachmentsCount: 0,
      policeInvolved: false
    });

    get().logAudit(
      'DISPO_SICK_REPLACEMENT',
      'OPS',
      `Krankmeldung für ${sickEmp.firstName} ${sickEmp.lastName}. Schicht ${shift.id} nachbesetzt mit Springer ${replEmp.firstName} ${replEmp.lastName}.`
    );

    return {
      success: true,
      message: `Springer ${replEmp.firstName} ${replEmp.lastName} erfolgreich eingeteilt. Begründungsnachweis, Wachbuch und Audit-Log wurden automatisch dokumentiert.`
    };
  },

  scanCheckpoint: (checkpointId: string) => {
    const nowTime = new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
    set(state => ({
      checkpoints: state.checkpoints.map(cp => {
        if (cp.id === checkpointId) {
          return { ...cp, lastScanned: nowTime, status: 'OK' as const };
        }
        return cp;
      })
    }));
    get().logAudit('OPS_CHECKPOINT_SCAN', 'OPS', `Kontrollpunkt ${checkpointId} erfolgreich gescannt.`);
  },

  addTask: (taskData) => {
    const newTask: SecurityTask = {
      ...taskData,
      id: `tsk-${Date.now()}`,
      createdAt: new Date().toLocaleString('de-DE', { dateStyle: 'short', timeStyle: 'short' })
    };
    set(state => ({ tasks: [newTask, ...state.tasks] }));
    get().logAudit('OPS_CREATE_TASK', 'OPS', `Aufgabe "${newTask.title}" [${newTask.priority}] angelegt.`);
  },

  updateTaskStatus: (taskId: string, status: TaskStatus) => {
    set(state => ({
      tasks: state.tasks.map(t => (t.id === taskId ? { ...t, status } : t))
    }));
    get().logAudit('OPS_UPDATE_TASK', 'OPS', `Aufgabe ${taskId} auf Status ${status} gesetzt.`);
  },

  sendDispatchMessage: (channel, message, isUrgent = false) => {
    const newMsg: DispatchMessage = {
      id: `msg-${Date.now()}`,
      sender: get().currentRole,
      channel,
      message,
      timestamp: new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }),
      isUrgent
    };
    set(state => ({ dispatchMessages: [newMsg, ...state.dispatchMessages].slice(0, 100) }));
    get().logAudit('COMM_DISPATCH', 'OPS', `Funk-/Leitstellenmeldung gesendet an Kanal: ${channel}`);
  },

  addContract: (contractData) => {
    const count = get().contracts.length + 1;
    const num = `VTR-2025-${String(count).padStart(3, '0')}`;
    const newCtr: Contract = {
      ...contractData,
      id: `ctr-${Date.now()}`,
      contractNumber: num
    };
    set(state => ({ contracts: [newCtr, ...state.contracts] }));
    get().logAudit('BILLING_CREATE_CONTRACT', 'BILLING', `Neuer Bewachungsvertrag ${num} für ${newCtr.customerName} angelegt.`);
  },

  addInvoice: (invoiceData) => {
    const count = get().invoices.length + 1;
    const num = `RE-2025-${String(count + 412).padStart(4, '0')}`;
    const newInv: Invoice = {
      ...invoiceData,
      id: `inv-${Date.now()}`,
      invoiceNumber: num
    };
    set(state => ({ invoices: [newInv, ...state.invoices] }));
    get().logAudit('BILLING_CREATE_INVOICE', 'BILLING', `Rechnung ${num} über ${newInv.totalAmount.toFixed(2)} € für ${newInv.customerName} fakturiert.`);
  },

  addDocument: (docData) => {
    const newDoc: DocumentItem = {
      ...docData,
      id: `doc-${Date.now()}`,
      uploadedAt: new Date().toISOString().split('T')[0],
      acknowledgedCount: 0
    };
    set(state => ({ documents: [newDoc, ...state.documents] }));
    get().logAudit('DOCS_UPLOAD', 'OPS', `Neues Dokument "${newDoc.title}" (${newDoc.category}) im DMS archiviert.`);
  },

  acknowledgeDocument: (docId: string) => {
    set(state => ({
      documents: state.documents.map(d => (d.id === docId ? { ...d, acknowledgedCount: d.acknowledgedCount + 1 } : d))
    }));
    get().logAudit('DOCS_ACKNOWLEDGE', 'OPS', `Verbindliche Kenntnisnahme für Dokument ${docId} unterzeichnet.`);
  },

  addQmAudit: (auditData) => {
    const count = get().qmAudits.length + 1;
    const num = `QM-AUDIT-2025-${String(count).padStart(2, '0')}`;
    const newAudit: QmAudit = {
      ...auditData,
      id: `qm-${Date.now()}`,
      auditNumber: num
    };
    set(state => ({ qmAudits: [newAudit, ...state.qmAudits] }));
    get().logAudit('QM_CREATE_AUDIT', 'OPS', `QM-Prüfbericht ${num} für ${newAudit.objectName} mit Score ${newAudit.scorePercent}% registriert.`);
  },

  issueKey: (keyNumber, keyLabel, borrowerName, borrowerCompany, objectId) => {
    const newEntry: KeyLogEntry = {
      id: `kl-${Date.now()}`,
      objectId,
      keyNumber,
      keyLabel,
      borrowerName,
      borrowerCompany,
      issuedAt: new Date().toLocaleString('de-DE', { dateStyle: 'short', timeStyle: 'short' }),
      issuedBy: get().currentRole,
      status: 'Ausgegeben'
    };
    set(state => ({ keyLogs: [newEntry, ...state.keyLogs] }));
    get().logAudit('OPS_KEY_ISSUE', 'OPS', `Schlüssel ${keyNumber} (${keyLabel}) an ${borrowerName} (${borrowerCompany}) ausgegeben.`);
  },

  returnKey: (keyLogId: string) => {
    const returnTime = new Date().toLocaleString('de-DE', { dateStyle: 'short', timeStyle: 'short' });
    set(state => ({
      keyLogs: state.keyLogs.map(k => (k.id === keyLogId ? { ...k, returnedAt: returnTime, status: 'Zurückgegeben' as const } : k))
    }));
    get().logAudit('OPS_KEY_RETURN', 'OPS', `Schlüssel-Rückgabe für Vorgang ${keyLogId} quittiert.`);
  },

  addTimeRecordCorrection: (recordId: string, actualHours: number, reason: string) => {
    set(state => ({
      timeRecords: state.timeRecords.map(tr => (tr.id === recordId ? { ...tr, actualHours, status: 'Freigegeben' as const } : tr))
    }));
    get().logAudit('ARBEITSZEIT_KORREKTUR', 'WORKFORCE', `Zeiterfassung ${recordId} auf ${actualHours}h korrigiert. Begründung: ${reason}`);
  },

  // VdS 2172 Alarm Intervention Implementations
  triggerAlarm: (objectId, triggerType, detectorZone, slaMinutes) => {
    const obj = get().objects.find(o => o.id === objectId);
    const count = get().interventions.length + 813;
    const now = new Date();
    const alarmNum = `ALM-2025-${String(count).padStart(4, '0')}`;
    const targetTimestamp = Date.now() + slaMinutes * 60 * 1000;

    const newAlarm: AlarmIntervention = {
      id: `alm-${Date.now()}`,
      alarmNumber: alarmNum,
      objectId,
      objectName: obj?.name || 'Schutzobjekt',
      customerName: obj?.customerName || 'Kunde',
      triggerType,
      detectorZone,
      receivedAt: now.toLocaleString('de-DE'),
      slaMinutes,
      slaTargetTimestamp: targetTimestamp,
      status: InterventionStatus.EINGEGANGEN,
      cctvVerified: false,
      clientContacted: false,
      policeFeuerwehrInvolved: triggerType === AlarmTriggerType.BMA_BRAND,
      findings: 'Alarmeingang in NSL-Zentrale detektiert. Vorprüfung erforderlich.',
      measuresTaken: 'Akustischer VdS-Alarm ausgelöst. Disponent benachrichtigt.',
      vdsCompliant: true
    };

    set(state => ({ interventions: [newAlarm, ...state.interventions] }));

    get().sendDispatchMessage('Alarmmeldung', `KRITISCHER ALARM: ${triggerType} an ${obj?.name} (${detectorZone}). SLA: ${slaMinutes} Min!`, true);
    get().logAudit('ALARM_TRIGGERED', 'ALARM', `Alarmeingang ${alarmNum} (${triggerType}) von ${obj?.name}.`);
  },

  verifyAlarmKamera: (interventionId, notes) => {
    set(state => ({
      interventions: state.interventions.map(i => {
        if (i.id === interventionId) {
          return {
            ...i,
            cctvVerified: true,
            status: InterventionStatus.VORPRUEFUNG,
            findings: `${i.findings} [CCTV Vorprüfung: ${notes}]`
          };
        }
        return i;
      })
    }));
    get().logAudit('ALARM_CCTV_VERIFIED', 'ALARM', `Optische CCTV-Kameravorprüfung für Alarm ${interventionId} durchgeführt.`);
  },

  verifyAlarmClientCall: (interventionId) => {
    set(state => ({
      interventions: state.interventions.map(i => (i.id === interventionId ? { ...i, clientContacted: true } : i))
    }));
    get().logAudit('ALARM_CLIENT_CONTACTED', 'ALARM', `Telefonische Rückfrage beim Objektverantwortlichen für ${interventionId} erfolgt.`);
  },

  dispatchPatrolUnit: (interventionId, unitName) => {
    const nowTime = new Date().toLocaleString('de-DE');
    set(state => ({
      interventions: state.interventions.map(i => {
        if (i.id === interventionId) {
          return {
            ...i,
            dispatchedUnit: unitName,
            dispatchedAt: nowTime,
            slaStartedAt: nowTime,
            status: InterventionStatus.ANFAHRT,
            measuresTaken: `${i.measuresTaken} | Interventionskraft ${unitName} alarmiert (SLA gestartet).`
          };
        }
        return i;
      })
    }));
    get().sendDispatchMessage('Streife Funk Kanal 2', `EINSATZAUFTRAG ALARM: ${unitName} zur Intervention abkommandiert. Höchste Eile!`, true);
    get().logAudit('ALARM_PATROL_DISPATCHED', 'ALARM', `Interventionskraft ${unitName} für Alarm ${interventionId} disponiert.`);
  },

  confirmAlarmArrival: (interventionId) => {
    const nowTime = new Date().toLocaleString('de-DE');
    set(state => ({
      interventions: state.interventions.map(i => {
        if (i.id === interventionId) {
          return {
            ...i,
            arrivedAt: nowTime,
            status: InterventionStatus.VOR_ORT,
            measuresTaken: `${i.measuresTaken} | Einheit vor Ort eingetroffen um ${nowTime}. Außensicherung läuft.`
          };
        }
        return i;
      })
    }));
    get().logAudit('ALARM_ARRIVAL_CONFIRMED', 'ALARM', `Interventionseinheit vor Ort eingetroffen bei Alarm ${interventionId}.`);
  },

  completeInterventionProtocol: (interventionId, outcome, findings, measures, policeNotified, policeFileNo) => {
    const item = get().interventions.find(i => i.id === interventionId);
    if (!item) return;

    const completedTime = new Date().toLocaleString('de-DE');
    const finalHash = apiService.generateTamperProofHash(
      Math.floor(Math.random() * 9000) + 1000,
      completedTime,
      item.objectId,
      get().currentRole,
      `${findings} | ${measures}`
    );

    const finalStatus = outcome === 'ECHT' ? InterventionStatus.ABGESCHLOSSEN_ECHT : InterventionStatus.ABGESCHLOSSEN_FEHL;

    set(state => ({
      interventions: state.interventions.map(i => {
        if (i.id === interventionId) {
          return {
            ...i,
            status: finalStatus,
            completedAt: completedTime,
            findings,
            measuresTaken: `${measures} ${policeFileNo ? `(Behörden-Az: ${policeFileNo})` : ''}`,
            policeFeuerwehrInvolved: policeNotified,
            policeFileNumber: policeFileNo,
            tamperHash: finalHash,
            vdsCompliant: true
          };
        }
        return i;
      })
    }));

    get().addOwksEntry({
      timestamp: completedTime,
      objectId: item.objectId,
      objectName: item.objectName,
      authorId: 'nsl-01',
      authorName: get().currentRole,
      entryType: 'Alarmmeldung',
      severity: outcome === 'ECHT' ? IncidentSeverity.KRITISCH : IncidentSeverity.NORMAL,
      title: `VdS 2172 Interventionsbericht ${item.alarmNumber} (${item.triggerType})`,
      description: `Befund: ${findings} | Maßnahmen: ${measures} | Status: ${finalStatus}. Signatur: ${finalHash}`,
      attachmentsCount: 1,
      policeInvolved: policeNotified
    });

    get().logAudit('ALARM_INTERVENTION_COMPLETED', 'ALARM', `VdS 2172 Interventionsprotokoll für ${item.alarmNumber} mit Hash ${finalHash} versiegelt.`);
  },

  // Equipment & PPE Implementations (§ 18 BewachV & DGUV V23)
  addEquipmentItem: (itemData) => {
    const newItem: SecurityEquipmentItem = {
      ...itemData,
      id: `eq-${Date.now()}`
    };
    set(state => ({ equipmentItems: [newItem, ...state.equipmentItems] }));
    get().logAudit('EQUIPMENT_CREATE', 'WORKFORCE', `Ausrüstung ${newItem.inventoryNumber} (${newItem.category}) ins PSA-Inventar aufgenommen.`);
  },

  assignEquipmentToEmployee: (equipmentId, employeeId) => {
    const emp = get().employees.find(e => e.id === employeeId);
    if (!emp) return;

    set(state => ({
      equipmentItems: state.equipmentItems.map(eq => {
        if (eq.id === equipmentId) {
          return {
            ...eq,
            assignedEmployeeId: emp.id,
            assignedEmployeeName: `${emp.firstName} ${emp.lastName}`,
            assignedAt: new Date().toISOString().split('T')[0],
            status: 'Ausgegeben' as const
          };
        }
        return eq;
      })
    }));
    get().logAudit('EQUIPMENT_ASSIGN', 'WORKFORCE', `Ausrüstung ${equipmentId} an ${emp.firstName} ${emp.lastName} ausgegeben.`);
  },

  returnEquipment: (equipmentId) => {
    set(state => ({
      equipmentItems: state.equipmentItems.map(eq => {
        if (eq.id === equipmentId) {
          return {
            ...eq,
            assignedEmployeeId: undefined,
            assignedEmployeeName: undefined,
            assignedAt: undefined,
            status: 'Einsatzbereit' as const
          };
        }
        return eq;
      })
    }));
    get().logAudit('EQUIPMENT_RETURN', 'WORKFORCE', `Ausrüstung ${equipmentId} zurück ins Lager gebucht.`);
  },

  markEquipmentInspected: (equipmentId, nextInspectionDate) => {
    set(state => ({
      equipmentItems: state.equipmentItems.map(eq => {
        if (eq.id === equipmentId) {
          return {
            ...eq,
            inspectionDue: nextInspectionDate,
            status: eq.assignedEmployeeId ? 'Ausgegeben' as const : 'Einsatzbereit' as const
          };
        }
        return eq;
      })
    }));
    get().logAudit('EQUIPMENT_INSPECTED', 'WORKFORCE', `DGUV/TÜV Prüfung für ${equipmentId} quittiert. Nächste Prüfung: ${nextInspectionDate}.`);
  },

  logAudit: (action, category, details) => {
    const log: AuditLog = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toLocaleString('de-DE'),
      userId: 'current-user',
      userName: get().currentRole,
      action,
      category,
      details,
      ipAddress: '10.14.0.22 (Internes VPN)'
    };
    set(state => ({ auditLogs: [log, ...state.auditLogs].slice(0, 150) }));
  }
}));
