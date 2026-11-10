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
  QmAudit,
  DocumentItem,
  AuditLog,
  SecurityTask,
  DispatchMessage,
  UserRole,
  SecurityLevel,
  ShiftType,
  IncidentSeverity,
  InvoiceStatus,
  TaskPriority,
  TaskStatus
} from './types';

export const INITIAL_TASKS: SecurityTask[] = [
  {
    id: 'tsk-01',
    title: 'Spätdienst-Nachbesetzung Galerie Am Dom',
    description: 'Offene Schicht ab 13:00 Uhr dringend mit § 34a geprüfter Fachkraft besetzen.',
    priority: TaskPriority.KRITISCH,
    status: TaskStatus.IN_BEARBEITUNG,
    assignedTo: 'Disposition (Thomas Kranz)',
    dueDate: '2025-05-12 12:00',
    objectId: 'obj-203',
    objectName: 'Einkaufszentrum Galerie Am Dom',
    createdBy: 'Einsatzleitung',
    createdAt: '2025-05-12 06:30'
  },
  {
    id: 'tsk-02',
    title: 'DGUV Erste-Hilfe-Schulung Petrov Igor buchen',
    description: 'Erste-Hilfe-Auffrischung ist im April fällig geworden. Termin beim DRK vereinbaren.',
    priority: TaskPriority.HOCH,
    status: TaskStatus.OFFEN,
    assignedTo: 'Personalverwaltung',
    dueDate: '2025-05-16',
    createdBy: 'Qualitätsmanagement',
    createdAt: '2025-05-11 14:15'
  },
  {
    id: 'tsk-03',
    title: 'Schlüsselkasten-Prüfung und Plombierung RZ Frankfurt',
    description: 'Vierteljährlicher Zählappell und Revisionsprüfung der 28 Schließberechtigungen.',
    priority: TaskPriority.NORMAL,
    status: TaskStatus.ERLEDIGT,
    assignedTo: 'Eleni Vassiliou',
    dueDate: '2025-05-12',
    objectId: 'obj-202',
    objectName: 'Data Center Alpha Frankfurt',
    createdBy: 'Objektleitung',
    createdAt: '2025-05-10 09:00'
  }
];

export const INITIAL_DISPATCH_MESSAGES: DispatchMessage[] = [
  {
    id: 'msg-01',
    sender: 'Wachführer Tor 1',
    channel: 'Wachlokal Tor 1',
    message: 'Schrankenanlage Tor Nord nach kurzer Techniker-Wartung wieder im Vollautomatik-Betrieb.',
    timestamp: '08:45',
    isUrgent: false
  },
  {
    id: 'msg-02',
    sender: 'Leitzentrale Frankfurt',
    channel: 'Leitzentrale',
    message: 'Achtung: Gewitterwarnung Stufe Rot für Rhein-Main ab 16:00 Uhr. Dachrundgänge einstellen.',
    timestamp: '09:12',
    isUrgent: true
  },
  {
    id: 'msg-03',
    sender: 'Revierstreife Süd',
    channel: 'Streife Funk Kanal 2',
    message: 'Objekt Domgalerie Außenkontrolle abgeschlossen. Notausgänge frei und unverschlossen.',
    timestamp: '09:30',
    isUrgent: false
  }
];

export const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 'c-101',
    customerNumber: 'KD-2025-001',
    companyName: 'BMW Group Werk Regensburg',
    legalForm: 'AG',
    address: 'Herbert-Quandt-Allee 1',
    postalCode: '93055',
    city: 'Regensburg',
    contactPersons: [
      { id: 'cp-1', name: 'Dr. Michael Schaller', role: 'Leiter Werkschutz', phone: '+49 941 555-120', email: 'werkschutz@bmw-r.de', isPrimary: true },
      { id: 'cp-2', name: 'Claudia Weber', role: 'Einkauf Sicherheit', phone: '+49 941 555-124', email: 'c.weber@bmw-r.de', isPrimary: false }
    ],
    billingEmail: 'rechnungswesen@bmw-r.de',
    category: 'KRITIS',
    status: 'Aktiv',
    assignedObjectCount: 2,
    activeContractsCount: 1,
    notes: 'Strengste Zutrittskontrollen, §34a zwingend für alle Mitarbeiter, Werksausweis-Druckstation am Tor 1.',
    createdDate: '2024-01-15'
  },
  {
    id: 'c-102',
    customerNumber: 'KD-2025-002',
    companyName: 'Mainova Energie Rechenzentrum Frankfurt',
    legalForm: 'SE & Co. KGaA',
    address: 'Solmsstraße 38',
    postalCode: '60486',
    city: 'Frankfurt am Main',
    contactPersons: [
      { id: 'cp-3', name: 'Stefan Brückner', role: 'Head of Data Center Security', phone: '+49 69 213-8811', email: 's.brueckner@mainova-dc.de', isPrimary: true }
    ],
    billingEmail: 'invoicing@mainova-dc.de',
    category: 'KRITIS',
    status: 'Aktiv',
    assignedObjectCount: 1,
    activeContractsCount: 1,
    notes: '24/7 bewachte Schleusen, biometrischer Zugang, BMA/EMA Direktschaltung Feuerwehr Frankfurt.',
    createdDate: '2024-03-10'
  },
  {
    id: 'c-103',
    customerNumber: 'KD-2025-003',
    companyName: 'Shopping Galerie Am Dom',
    legalForm: 'GmbH',
    address: 'Domplatz 4',
    postalCode: '99084',
    city: 'Erfurt',
    contactPersons: [
      { id: 'cp-4', name: 'Sabine Lindner', role: 'Center Management', phone: '+49 361 742-90', email: 'lindner@domgalerie.de', isPrimary: true }
    ],
    billingEmail: 'buchhaltung@domgalerie.de',
    category: 'A-Kunde',
    status: 'Aktiv',
    assignedObjectCount: 1,
    activeContractsCount: 1,
    notes: 'Doorman & Schließdienst abends, deeskalierendes Auftreten, hohe Besucherfrequenz.',
    createdDate: '2024-06-01'
  }
];

export const INITIAL_OBJECTS: SecurityObject[] = [
  {
    id: 'obj-201',
    objectNumber: 'OBJ-MUC-01',
    name: 'BMW Werk Regensburg - Tor 1 & Pforte Nord',
    customerId: 'c-101',
    customerName: 'BMW Group Werk Regensburg',
    locationAddress: 'Herbert-Quandt-Allee 1 Tor 1',
    city: 'Regensburg',
    securityLevel: SecurityLevel.STUFE_3,
    status: 'Aktiv',
    objectLeadName: 'Hauptfeldwebel a.D. Jürgen Bauer',
    emergencyPhone: '+49 941 555-110 (Wachzentrale)',
    alarmSystems: {
      emaConnected: true,
      bmaConnected: true,
      cctvMonitoring: true,
      nsheConnected: true
    },
    keysCount: 142,
    transpondersCount: 380,
    checkpointsCount: 18,
    standingOrdersSnippet: 'DA-2025-BMW: Torkontrolle von LKW und Besuchern. Keine LKW-Einfahrt ohne gültige Frachtpapiere und Werksausweis-Registrierung.',
    createdDate: '2024-01-20'
  },
  {
    id: 'obj-202',
    objectNumber: 'OBJ-FRA-02',
    name: 'Data Center Alpha Frankfurt',
    customerId: 'c-102',
    customerName: 'Mainova Energie Rechenzentrum Frankfurt',
    locationAddress: 'Solmsstraße 38 Gebäude B',
    city: 'Frankfurt am Main',
    securityLevel: SecurityLevel.STUFE_4,
    status: 'Aktiv',
    objectLeadName: 'Tariq Mansoor',
    emergencyPhone: '+49 69 213-9999',
    alarmSystems: {
      emaConnected: true,
      bmaConnected: true,
      cctvMonitoring: true,
      nsheConnected: true
    },
    keysCount: 28,
    transpondersCount: 65,
    checkpointsCount: 24,
    standingOrdersSnippet: 'DA-2025-DC: 2-Personen-Integritätsprüfung für Serverräume. Kameraschwenk vor Schließung der Vereinzelungsschleuse.',
    createdDate: '2024-03-15'
  },
  {
    id: 'obj-203',
    objectNumber: 'OBJ-ERF-03',
    name: 'Einkaufszentrum Galerie Am Dom',
    customerId: 'c-103',
    customerName: 'Shopping Galerie Am Dom',
    locationAddress: 'Domplatz 4',
    city: 'Erfurt',
    securityLevel: SecurityLevel.STUFE_1,
    status: 'Aktiv',
    objectLeadName: 'Marco Zimmermann',
    emergencyPhone: '+49 361 742-112',
    alarmSystems: {
      emaConnected: true,
      bmaConnected: true,
      cctvMonitoring: true,
      nsheConnected: false
    },
    keysCount: 45,
    transpondersCount: 20,
    checkpointsCount: 12,
    standingOrdersSnippet: 'DA-2025-DOM: Präsenz im Foyer, Taschenkontrollen nur bei berechtigtem Verdacht und im 4-Augen-Prinzip, Schließung 20:15 Uhr.',
    createdDate: '2024-06-05'
  }
];

export const INITIAL_EMPLOYEES: Employee[] = [
  {
    id: 'emp-301',
    employeeNumber: 'MA-0412',
    firstName: 'Thomas',
    lastName: 'Kranz',
    email: 't.kranz@securityops-system.de',
    phone: '+49 171 4455881',
    status: 'Aktiv',
    role: UserRole.EINSATZLEITUNG,
    entryDate: '2021-02-01',
    has34aCertificate: true,
    cert34aDate: '2019-04-12',
    firstAidValidUntil: '2025-11-20',
    fireSafetyValidUntil: '2026-05-15',
    objectTrainingDone: true,
    assignedObjectId: 'obj-201',
    targetHoursPerMonth: 173,
    actualHoursThisMonth: 148,
    overtimeHours: 12
  },
  {
    id: 'emp-302',
    employeeNumber: 'MA-0419',
    firstName: 'Eleni',
    lastName: 'Vassiliou',
    email: 'e.vassiliou@securityops-system.de',
    phone: '+49 172 9901234',
    status: 'Aktiv',
    role: UserRole.OBJEKTLEITUNG,
    entryDate: '2022-08-15',
    has34aCertificate: true,
    cert34aDate: '2021-01-18',
    firstAidValidUntil: '2026-03-10',
    fireSafetyValidUntil: '2025-08-12',
    objectTrainingDone: true,
    assignedObjectId: 'obj-202',
    targetHoursPerMonth: 173,
    actualHoursThisMonth: 160,
    overtimeHours: 4.5
  },
  {
    id: 'emp-303',
    employeeNumber: 'MA-0504',
    firstName: 'Igor',
    lastName: 'Petrov',
    email: 'i.petrov@securityops-system.de',
    phone: '+49 160 3344112',
    status: 'Aktiv',
    role: UserRole.MITARBEITER,
    entryDate: '2023-01-10',
    has34aCertificate: true,
    cert34aDate: '2022-09-01',
    firstAidValidUntil: '2025-04-18', // Expiring soon warning!
    fireSafetyValidUntil: '2025-10-30',
    objectTrainingDone: true,
    assignedObjectId: 'obj-201',
    targetHoursPerMonth: 160,
    actualHoursThisMonth: 120,
    overtimeHours: 0
  },
  {
    id: 'emp-304',
    employeeNumber: 'MA-0520',
    firstName: 'Sergej',
    lastName: 'Novak',
    email: 's.novak@securityops-system.de',
    phone: '+49 151 7788990',
    status: 'In Urlaub',
    role: UserRole.MITARBEITER,
    entryDate: '2023-07-01',
    has34aCertificate: true,
    cert34aDate: '2023-02-15',
    firstAidValidUntil: '2026-09-01',
    fireSafetyValidUntil: '2026-11-01',
    objectTrainingDone: true,
    assignedObjectId: 'obj-203',
    targetHoursPerMonth: 160,
    actualHoursThisMonth: 80,
    overtimeHours: -8
  },
  {
    id: 'emp-305',
    employeeNumber: 'MA-0588',
    firstName: 'Marc',
    lastName: 'Engler',
    email: 'm.engler@securityops-system.de',
    phone: '+49 176 1122334',
    status: 'Aktiv',
    role: UserRole.MITARBEITER,
    entryDate: '2024-02-01',
    has34aCertificate: false, // In training - will flag in planning!
    firstAidValidUntil: '2026-01-15',
    fireSafetyValidUntil: '2026-01-15',
    objectTrainingDone: false,
    assignedObjectId: 'obj-203',
    targetHoursPerMonth: 160,
    actualHoursThisMonth: 110,
    overtimeHours: 2
  }
];

export const INITIAL_SHIFTS: Shift[] = [
  {
    id: 'sh-1',
    date: '2025-05-12',
    shiftType: ShiftType.FRUEH,
    objectId: 'obj-201',
    objectName: 'BMW Werk Regensburg - Tor 1 & Pforte Nord',
    employeeId: 'emp-301',
    employeeName: 'Thomas Kranz',
    startTime: '06:00',
    endTime: '14:00',
    plannedHours: 8,
    status: 'Laufend',
    is34aRequired: true
  },
  {
    id: 'sh-2',
    date: '2025-05-12',
    shiftType: ShiftType.SPAET,
    objectId: 'obj-201',
    objectName: 'BMW Werk Regensburg - Tor 1 & Pforte Nord',
    employeeId: 'emp-303',
    employeeName: 'Igor Petrov',
    startTime: '14:00',
    endTime: '22:00',
    plannedHours: 8,
    status: 'Besetzt',
    is34aRequired: true,
    warnings: ['Achtung: Erste-Hilfe-Schein läuft in Kürze ab']
  },
  {
    id: 'sh-3',
    date: '2025-05-12',
    shiftType: ShiftType.NACHT,
    objectId: 'obj-202',
    objectName: 'Data Center Alpha Frankfurt',
    employeeId: 'emp-302',
    employeeName: 'Eleni Vassiliou',
    startTime: '22:00',
    endTime: '06:00',
    plannedHours: 8,
    status: 'Besetzt',
    is34aRequired: true
  },
  {
    id: 'sh-4',
    date: '2025-05-12',
    shiftType: ShiftType.SPAET,
    objectId: 'obj-203',
    objectName: 'Einkaufszentrum Galerie Am Dom',
    startTime: '13:00',
    endTime: '21:00',
    plannedHours: 8,
    status: 'Unbesetzt',
    is34aRequired: true,
    warnings: ['KRITISCH: Schicht unbesetzt - Nachbesetzung erforderlich!']
  },
  {
    id: 'sh-5',
    date: '2025-05-13',
    shiftType: ShiftType.FRUEH,
    objectId: 'obj-202',
    objectName: 'Data Center Alpha Frankfurt',
    employeeId: 'emp-302',
    employeeName: 'Eleni Vassiliou',
    startTime: '06:00',
    endTime: '14:00',
    plannedHours: 8,
    status: 'Besetzt',
    is34aRequired: true
  }
];

export const INITIAL_OWKS_ENTRIES: OwksEntry[] = [
  {
    id: 'owks-1001',
    sequenceNumber: 1042,
    timestamp: '2025-05-12 06:15',
    objectId: 'obj-201',
    objectName: 'BMW Werk Regensburg - Tor 1 & Pforte Nord',
    authorId: 'emp-301',
    authorName: 'Thomas Kranz',
    entryType: 'Schichtübergabe',
    severity: IncidentSeverity.NORMAL,
    title: 'Wachübernahme Frühdienst Tor 1',
    description: 'Dienstübernahme von Nachtschicht ohne Vorkommnisse. Schlüsselkasten vollzählig (142/142). Schrankenanlage Tor 1 & Tor 2 funktionsgeprüft. Funkgeräte Kanal 4 einsatzbereit.',
    isTamperSealed: true,
    hash: 'a9f24e9812bc8f421e4a9082',
    syncStatus: 'Synchronisiert',
    attachmentsCount: 1,
    policeInvolved: false
  },
  {
    id: 'owks-1002',
    sequenceNumber: 1043,
    timestamp: '2025-05-12 08:42',
    objectId: 'obj-201',
    objectName: 'BMW Werk Regensburg - Tor 1 & Pforte Nord',
    authorId: 'emp-301',
    authorName: 'Thomas Kranz',
    entryType: 'Alarmmeldung',
    severity: IncidentSeverity.WARNUNG,
    title: 'Sabotagekontakt Zaunlinie Sektor B3 ausgelöst',
    description: 'Optische Vorprüfung via PTZ-Kamera 14: Astbruch durch Windböe auf Zaundraht. Keine Personenspuren festgestellt. Alarm quittiert und Technischen Dienst informiert.',
    isTamperSealed: true,
    hash: '7c81d22e09abcf3452179831',
    syncStatus: 'Synchronisiert',
    attachmentsCount: 2,
    policeInvolved: false
  },
  {
    id: 'owks-1003',
    sequenceNumber: 1044,
    timestamp: '2025-05-12 09:10',
    objectId: 'obj-202',
    objectName: 'Data Center Alpha Frankfurt',
    authorId: 'emp-302',
    authorName: 'Eleni Vassiliou',
    entryType: 'Besucher',
    severity: IncidentSeverity.NORMAL,
    title: 'Fremdfirmenzutritt Cisco Systems Wartung',
    description: '2x Techniker Cisco (Herr Maier, Herr Özdemir) nach Voranmeldung und Ausweisprüfung angemeldet. Begleitet zur Serverreihe 4B, Schleuse 2.',
    isTamperSealed: true,
    hash: '44b1c781033fae9912038421',
    syncStatus: 'Synchronisiert',
    attachmentsCount: 0,
    policeInvolved: false
  }
];

export const INITIAL_CHECKPOINTS: Checkpoint[] = [
  { id: 'cp-01', objectId: 'obj-201', name: 'CP 01 - Schrankenanlage Nord', code: 'NFC-REG-01', orderIndex: 1, lastScanned: '07:15', status: 'OK' },
  { id: 'cp-02', objectId: 'obj-201', name: 'CP 02 - Trafohaus 4', code: 'QR-REG-02', orderIndex: 2, lastScanned: '07:28', status: 'OK' },
  { id: 'cp-03', objectId: 'obj-201', name: 'CP 03 - Lackiererei Notausgang B', code: 'NFC-REG-03', orderIndex: 3, lastScanned: '07:44', status: 'OK' },
  { id: 'cp-04', objectId: 'obj-201', name: 'CP 04 - Logistikhalle Tor 8', code: 'NFC-REG-04', orderIndex: 4, lastScanned: '08:02', status: 'OK' },
  { id: 'cp-05', objectId: 'obj-201', name: 'CP 05 - Brandmeldezentrale BMZ', code: 'NFC-REG-05', orderIndex: 5, lastScanned: undefined, status: 'Ueberfaellig' }
];

export const INITIAL_CONTRACTS: Contract[] = [
  {
    id: 'ctr-01',
    contractNumber: 'VTR-2024-BMW-01',
    customerId: 'c-101',
    customerName: 'BMW Group Werk Regensburg',
    objectId: 'obj-201',
    objectName: 'BMW Werk Regensburg - Tor 1 & Pforte Nord',
    startDate: '2024-01-01',
    endDate: '2026-12-31',
    autoRenew: true,
    baseHourlyRate: 34.50,
    nightSurchargePercent: 25,
    sundaySurchargePercent: 50,
    holidaySurchargePercent: 100,
    status: 'Aktiv'
  },
  {
    id: 'ctr-02',
    contractNumber: 'VTR-2024-MAI-02',
    customerId: 'c-102',
    customerName: 'Mainova Energie Rechenzentrum Frankfurt',
    objectId: 'obj-202',
    objectName: 'Data Center Alpha Frankfurt',
    startDate: '2024-04-01',
    endDate: '2025-03-31',
    autoRenew: true,
    baseHourlyRate: 39.80,
    nightSurchargePercent: 30,
    sundaySurchargePercent: 50,
    holidaySurchargePercent: 125,
    status: 'Aktiv'
  }
];

export const INITIAL_INVOICES: Invoice[] = [
  {
    id: 'inv-901',
    invoiceNumber: 'RE-2025-0411',
    customerId: 'c-101',
    customerName: 'BMW Group Werk Regensburg',
    period: 'April 2025',
    subtotal: 24840.00,
    taxAmount: 4719.60,
    totalAmount: 29559.60,
    status: InvoiceStatus.VERSANDT,
    issueDate: '2025-05-02',
    dueDate: '2025-05-16',
    positionsCount: 4
  },
  {
    id: 'inv-902',
    invoiceNumber: 'RE-2025-0412',
    customerId: 'c-102',
    customerName: 'Mainova Energie Rechenzentrum Frankfurt',
    period: 'April 2025',
    subtotal: 19104.00,
    taxAmount: 3629.76,
    totalAmount: 22733.76,
    status: InvoiceStatus.BEZAHLT,
    issueDate: '2025-05-02',
    dueDate: '2025-05-16',
    positionsCount: 3
  }
];

export const INITIAL_DOCUMENTS: DocumentItem[] = [
  {
    id: 'doc-1',
    title: 'Dienstanweisung DA-2025-01 Werkschutz Tor 1',
    category: 'Dienstanweisung',
    referenceType: 'Objekt',
    referenceName: 'BMW Werk Regensburg',
    version: '2.4',
    uploadedAt: '2025-01-10',
    validUntil: '2026-01-10',
    fileSize: '1.4 MB (PDF/A)',
    requiresAcknowledgment: true,
    acknowledgedCount: 14
  },
  {
    id: 'doc-2',
    title: 'Evakuierungs- und Alarmierungsplan KRITIS RZ Frankfurt',
    category: 'Alarmplan',
    referenceType: 'Objekt',
    referenceName: 'Data Center Alpha Frankfurt',
    version: '3.1',
    uploadedAt: '2024-11-20',
    validUntil: '2025-11-20',
    fileSize: '4.8 MB (PDF/A)',
    requiresAcknowledgment: true,
    acknowledgedCount: 8
  },
  {
    id: 'doc-3',
    title: 'Sachkundenachweis § 34a GewO - Kranz Thomas',
    category: 'Sachkunde §34a',
    referenceType: 'Mitarbeiter',
    referenceName: 'Thomas Kranz',
    version: '1.0',
    uploadedAt: '2021-02-05',
    fileSize: '620 KB (PDF)',
    requiresAcknowledgment: false,
    acknowledgedCount: 0
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'aud-8801',
    timestamp: '2025-05-12 06:15:32',
    userId: 'emp-301',
    userName: 'Thomas Kranz',
    action: 'OWKS_CREATE_ENTRY',
    category: 'OWKS',
    details: 'Erstellung Schichtübergabe #1042 (Hash: a9f24e...)',
    ipAddress: '10.24.1.8'
  },
  {
    id: 'aud-8802',
    timestamp: '2025-05-12 07:02:11',
    userId: 'admin-01',
    userName: 'System Administrator',
    action: 'IAM_PERMISSION_VERIFIED',
    category: 'IAM',
    details: 'Rollenberechtigungen für Einsatzleitung verifiziert. Argon2id Session geprüft.',
    ipAddress: '192.168.10.42'
  },
  {
    id: 'aud-8803',
    timestamp: '2025-05-12 08:30:00',
    userId: 'emp-301',
    userName: 'Thomas Kranz',
    action: 'CHECKPOINT_SCAN',
    category: 'OPS',
    details: 'Kontrollpunkt CP-01 Schranke Nord gescannt via NFC.',
    ipAddress: '10.24.1.8'
  }
];
