export enum UserRole {
  ADMIN = 'Administrator',
  GESCHAEFTSFUEHRUNG = 'Geschäftsführung',
  EINSATZLEITUNG = 'Einsatzleitung',
  OBJEKTLEITUNG = 'Objektleitung',
  DISPOSITION = 'Disposition',
  PERSONAL = 'Personalverwaltung',
  BUCHHALTUNG = 'Buchhaltung',
  QM = 'Qualitätsmanagement',
  MITARBEITER = 'Mitarbeiter',
  LESEBENUTZER = 'Reiner Lesebenutzer'
}

export enum SecurityLevel {
  STUFE_1 = 'Stufe 1 (Standard-Objektschutz)',
  STUFE_2 = 'Stufe 2 (Erhöhte Gefährdung / BMA)',
  STUFE_3 = 'Stufe 3 (Kritische Infrastruktur / KRITIS)',
  STUFE_4 = 'Stufe 4 (Höchste Geheimhaltungsstufe)'
}

export enum IncidentSeverity {
  INFO = 'Information',
  NORMAL = 'Regulär',
  WARNUNG = 'Warnung',
  KRITISCH = 'Kritischer Notfall',
  POLIZEI_FEUERWEHR = 'Behörden-Einsatz'
}

export enum ShiftType {
  FRUEH = 'Frühdienst (06:00 - 14:00)',
  SPAET = 'Spätdienst (14:00 - 22:00)',
  NACHT = 'Nachtdienst (22:00 - 06:00)',
  REVIER = 'Revierstreife (18:00 - 06:00)',
  SONDER = 'Sonderbewachung / Event'
}

export enum InvoiceStatus {
  ENTWURF = 'Entwurf',
  FREIGEGEBEN = 'Freigegeben',
  VERSANDT = 'Versandt',
  BEZAHLT = 'Bezahlt',
  UEBERFAELLIG = 'Überfällig',
  STORNIERT = 'Storniert'
}

export enum TaskPriority {
  NIEDRIG = 'Niedrig',
  NORMAL = 'Normal',
  HOCH = 'Hoch',
  KRITISCH = 'Kritisch'
}

export enum TaskStatus {
  OFFEN = 'Offen',
  IN_BEARBEITUNG = 'In Bearbeitung',
  ERLEDIGT = 'Erledigt',
  ABGELEHNT = 'Abgelehnt'
}

export enum AlarmTriggerType {
  EMA_EINBRUCH = 'EMA Einbruchmeldeanlage (VdS-C)',
  BMA_BRAND = 'BMA Brandmeldeanlage (DIN 14675)',
  SABOTAGE_PERIMETER = 'Perimeter-Sabotagekontakt Zaunlinie',
  UEBERFALL_STILL = 'Stiller Überfallalarm (§ 34a BewachV)',
  NSHE_RAUCHABZUG = 'Rauch- und Wärmeabzug (RWA/NSHE)',
  AUFZUG_PERSONENNOTRUF = 'Personennotruf Aufzug (EN 81-28)'
}

export enum InterventionStatus {
  EINGEGANGEN = 'Alarmeingang (Unverifiziert)',
  VORPRUEFUNG = 'Optische Vorprüfung (CCTV / Rückfrage)',
  DISPONIERT = 'Intervention disponiert',
  ANFAHRT = 'Anfahrt Streife (SLA-Timer aktiv)',
  VOR_ORT = 'Vor Ort eingetroffen (Befundung)',
  ABGESCHLOSSEN_ECHT = 'Abgeschlossen (Echteinsatz)',
  ABGESCHLOSSEN_FEHL = 'Abgeschlossen (Falschalarm VdS)'
}

export enum EquipmentCategory {
  DIENSTAUSWEIS = 'Dienstausweis gem. § 18 BewachV',
  STICHSCHUTZWESTE = 'Stichschutzweste (VPAM KDIW)',
  FUNKGERAET_DMR = 'DMR-Digitalfunkgerät / PNA-Totmann',
  SCHUTZHANDSCHUHE = 'Quarzsand- / Schnittschutzhandschuhe Level 5',
  TASCHENLAMPE_LED = 'Einsatz-Taschenlampe (ATEX-Ex)',
  FIRST_AID_KIT = 'Trauma-Kit / IFAK Ersthelfertasche'
}

export interface SecurityEquipmentItem {
  id: string;
  serialNumber: string;
  inventoryNumber: string;
  category: EquipmentCategory;
  modelName: string;
  assignedEmployeeId?: string;
  assignedEmployeeName?: string;
  assignedAt?: string;
  inspectionDue: string; // Nächste DGUV/TÜV Prüfung
  status: 'Einsatzbereit' | 'Ausgegeben' | 'Prüfung fällig' | 'In Reparatur';
  ceCertified: boolean;
  notes: string;
}

export interface AlarmIntervention {
  id: string;
  alarmNumber: string;
  objectId: string;
  objectName: string;
  customerName: string;
  triggerType: AlarmTriggerType;
  detectorZone: string;
  receivedAt: string;
  slaMinutes: number;
  slaStartedAt?: string;
  slaTargetTimestamp?: number;
  status: InterventionStatus;
  dispatchedUnit?: string;
  dispatchedAt?: string;
  arrivedAt?: string;
  completedAt?: string;
  cctvVerified: boolean;
  clientContacted: boolean;
  policeFeuerwehrInvolved: boolean;
  policeFileNumber?: string;
  findings: string;
  measuresTaken: string;
  tamperHash?: string;
  vdsCompliant: boolean;
}

export interface SecurityTask {
  id: string;
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  assignedTo: string;
  dueDate: string;
  objectId?: string;
  objectName?: string;
  createdBy: string;
  createdAt: string;
}

export interface DispatchMessage {
  id: string;
  sender: string;
  channel: 'Leitzentrale' | 'Wachlokal Tor 1' | 'Streife Funk Kanal 2' | 'Alarmmeldung';
  message: string;
  timestamp: string;
  isUrgent: boolean;
}

export interface ShiftChangeRecord {
  id: string;
  shiftId: string;
  timestamp: string;
  modifiedBy: string;
  reason: string;
  previousEmployeeName: string;
  newEmployeeName: string;
  arbzgChecked: boolean;
  qualificationChecked: boolean;
}

export interface DsgvoExportReport {
  generatedAt: string;
  personName: string;
  employeeNumber: string;
  role: string;
  storedCertificates: { name: string; validUntil: string }[];
  shiftsRecordedCount: number;
  timeRecordsCount: number;
  auditTrailEntriesCount: number;
  purposeNote: string;
}

export interface Customer {
  id: string;
  customerNumber: string;
  companyName: string;
  legalForm: string;
  address: string;
  postalCode: string;
  city: string;
  contactPersons: {
    id: string;
    name: string;
    role: string;
    phone: string;
    email: string;
    isPrimary: boolean;
  }[];
  billingEmail: string;
  category: 'A-Kunde' | 'B-Kunde' | 'C-Kunde' | 'KRITIS';
  status: 'Aktiv' | 'Inaktiv' | 'Gesperrt' | 'In Anbahnung';
  assignedObjectCount: number;
  activeContractsCount: number;
  notes: string;
  createdDate: string;
}

export interface SecurityObject {
  id: string;
  objectNumber: string;
  name: string;
  customerId: string;
  customerName: string;
  locationAddress: string;
  city: string;
  securityLevel: SecurityLevel;
  status: 'Aktiv' | 'Inaktiv' | 'Wartung';
  objectLeadName: string;
  emergencyPhone: string;
  alarmSystems: {
    emaConnected: boolean;
    bmaConnected: boolean;
    cctvMonitoring: boolean;
    nsheConnected: boolean;
  };
  keysCount: number;
  transpondersCount: number;
  checkpointsCount: number;
  standingOrdersSnippet: string;
  createdDate: string;
}

export interface Employee {
  id: string;
  employeeNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  status: 'Aktiv' | 'In Urlaub' | 'Krank' | 'Freigestellt';
  role: UserRole;
  entryDate: string;
  has34aCertificate: boolean;
  cert34aDate?: string;
  firstAidValidUntil: string;
  fireSafetyValidUntil: string;
  objectTrainingDone: boolean;
  assignedObjectId?: string;
  targetHoursPerMonth: number;
  actualHoursThisMonth: number;
  overtimeHours: number;
  serviceBadgeNumber?: string; // § 18 BewachV Ausweisnummer
}

export interface Shift {
  id: string;
  date: string;
  shiftType: ShiftType;
  objectId: string;
  objectName: string;
  employeeId?: string;
  employeeName?: string;
  startTime: string;
  endTime: string;
  plannedHours: number;
  status: 'Besetzt' | 'Unbesetzt' | 'Laufend' | 'Abgeschlossen' | 'Krankheitsausfall';
  is34aRequired: boolean;
  warnings?: string[];
  lastChangeReason?: string;
}

export interface OwksEntry {
  id: string;
  sequenceNumber: number;
  timestamp: string;
  objectId: string;
  objectName: string;
  authorId: string;
  authorName: string;
  entryType: 'Schichtübergabe' | 'Vorkommnis' | 'Kontrollgang' | 'Alarmmeldung' | 'Besucher' | 'Schaden';
  severity: IncidentSeverity;
  title: string;
  description: string;
  isTamperSealed: boolean;
  hash: string;
  syncStatus: 'Synchronisiert' | 'Offline Gespeichert';
  attachmentsCount: number;
  policeInvolved: boolean;
}

export interface Checkpoint {
  id: string;
  objectId: string;
  name: string;
  code: string;
  orderIndex: number;
  lastScanned?: string;
  status: 'OK' | 'Ueberfaellig' | 'Ausstehend';
}

export interface TimeRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string;
  clockIn: string;
  clockOut: string;
  breakMinutes: number;
  actualHours: number;
  nightHours: number;
  sundayHours: number;
  holidayHours: number;
  status: 'Erfasst' | 'Freigegeben' | 'Gesperrt';
}

export interface Contract {
  id: string;
  contractNumber: string;
  customerId: string;
  customerName: string;
  objectId: string;
  objectName: string;
  startDate: string;
  endDate: string;
  autoRenew: boolean;
  baseHourlyRate: number;
  nightSurchargePercent: number;
  sundaySurchargePercent: number;
  holidaySurchargePercent: number;
  flatFeeMonthly?: number;
  status: 'Aktiv' | 'Kündigung vorgemerkt' | 'Ausgelaufen';
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  customerId: string;
  customerName: string;
  period: string;
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
  status: InvoiceStatus;
  issueDate: string;
  dueDate: string;
  positionsCount: number;
}

export interface QmAudit {
  id: string;
  auditNumber: string;
  objectId: string;
  objectName: string;
  auditorName: string;
  auditDate: string;
  scorePercent: number;
  defectsCount: number;
  status: 'In Ordnung' | 'Nachbesserung gefordert' | 'Kritische Mängel';
  measuresSummary: string;
}

export interface DocumentItem {
  id: string;
  title: string;
  category: 'Dienstanweisung' | 'Alarmplan' | 'Arbeitsvertrag' | 'Sachkunde §34a' | 'Objektplan' | 'QM-Protokoll';
  referenceType: 'Objekt' | 'Mitarbeiter' | 'Kunde' | 'Allgemein';
  referenceName: string;
  version: string;
  uploadedAt: string;
  validUntil?: string;
  fileSize: string;
  requiresAcknowledgment: boolean;
  acknowledgedCount: number;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  action: string;
  category: 'IAM' | 'CRM' | 'OPS' | 'OWKS' | 'WORKFORCE' | 'BILLING' | 'ALARM';
  details: string;
  ipAddress: string;
}
