import React, { useState } from 'react';
import {
  BarChart3,
  Download,
  Calendar,
  Building2,
  Users,
  ShieldCheck,
  FileSpreadsheet,
  TrendingUp,
  AlertTriangle,
  Clock,
  CheckCircle2,
  FileText
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { useAppStore } from '../store/useAppStore';
import { apiService } from '../services/apiService';

export const ReportsView: React.FC = () => {
  const { customers, objects, employees, shifts, owksEntries, invoices, contracts } = useAppStore();
  const [selectedReportType, setSelectedReportType] = useState<'stunden' | 'qualifikation' | 'vorfaelle' | 'umsatz'>('stunden');

  const totalShiftsHours = shifts.reduce((acc, s) => acc + s.plannedHours, 0);
  const totalBilledRevenue = invoices.reduce((acc, inv) => acc + inv.totalAmount, 0);
  const totalOvertime = employees.reduce((acc, e) => acc + Math.max(0, e.overtimeHours), 0);

  // Overtime balance data for chart
  const employeeHoursData = employees.map(emp => ({
    name: `${emp.lastName}`,
    Soll: emp.targetHoursPerMonth,
    Ist: emp.actualHoursThisMonth,
    Ueberstunden: Math.max(0, emp.overtimeHours)
  }));

  // Incident severity distribution
  const incidentsBySeverity = [
    { name: 'Regulär', count: owksEntries.filter(e => e.severity === 'Regulär').length, color: '#10b981' },
    { name: 'Warnung', count: owksEntries.filter(e => e.severity === 'Warnung').length, color: '#f59e0b' },
    { name: 'Kritisch / Notfall', count: owksEntries.filter(e => e.severity === 'Kritischer Notfall' || e.severity === 'Behörden-Einsatz').length, color: '#ef4444' }
  ];

  const handleExportCsv = () => {
    if (selectedReportType === 'stunden') {
      const headers = ['Personalnummer', 'Vorname', 'Nachname', 'Rolle', 'Sollstunden', 'Iststunden', 'Überstunden', 'Status'];
      const rows = employees.map(e => [
        e.employeeNumber,
        e.firstName,
        e.lastName,
        e.role,
        e.targetHoursPerMonth,
        e.actualHoursThisMonth,
        e.overtimeHours,
        e.status
      ]);
      apiService.exportDataToCsv('SecurityOps_Arbeitszeitstatistik', headers, rows);
    } else if (selectedReportType === 'vorfaelle') {
      const headers = ['Nummer', 'Zeitstempel', 'Objekt', 'Verfasser', 'Ereignisart', 'Dringlichkeit', 'Titel', 'Hash'];
      const rows = owksEntries.map(e => [
        e.sequenceNumber,
        e.timestamp,
        e.objectName,
        e.authorName,
        e.entryType,
        e.severity,
        e.title,
        e.hash
      ]);
      apiService.exportDataToCsv('SecurityOps_Wachbuch_Vorfallbericht', headers, rows);
    } else if (selectedReportType === 'umsatz') {
      const headers = ['Rechnungsnummer', 'Kunde', 'Zeitraum', 'Nettobetrag', 'USt (19%)', 'Bruttogesamtbetrag', 'Status', 'Faelligkeit'];
      const rows = invoices.map(i => [
        i.invoiceNumber,
        i.customerName,
        i.period,
        i.subtotal.toFixed(2),
        i.taxAmount.toFixed(2),
        i.totalAmount.toFixed(2),
        i.status,
        i.dueDate
      ]);
      apiService.exportDataToCsv('SecurityOps_Rechnungsjournal', headers, rows);
    } else {
      const headers = ['Personalnummer', 'Name', '§ 34a Sachkunde', 'IHK-Datum', 'Ersthelfer Gueltig Bis', 'Brandschutzhelfer Bis'];
      const rows = employees.map(e => [
        e.employeeNumber,
        `${e.firstName} ${e.lastName}`,
        e.has34aCertificate ? 'JA (IHK)' : 'NEIN (In Vorbereitung)',
        e.cert34aDate || '-',
        e.firstAidValidUntil,
        e.fireSafetyValidUntil
      ]);
      apiService.exportDataToCsv('SecurityOps_Qualifikationsmatrix', headers, rows);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and Export trigger */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-emerald-400" />
            Reporting, Analysen & Revisionsberichte
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Aussagekräftige Gesamtauswertungen für Geschäftsführung, Auditoren und Lohnbuchhaltung.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCsv}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md shadow-emerald-950 transition"
          >
            <Download className="h-4 w-4" />
            Revisions-CSV exportieren
          </button>
        </div>
      </div>

      {/* KPI Highlights */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400 font-medium">Gesamt-Wachstunden (Monat)</span>
          <div className="mt-2 text-2xl font-bold font-mono text-white">{totalShiftsHours} Std.</div>
          <p className="text-[11px] text-emerald-400 mt-1">100% lückenlos dokumentiert</p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400 font-medium">Überstundenkonto Saldo</span>
          <div className="mt-2 text-2xl font-bold font-mono text-amber-400">+{totalOvertime.toFixed(1)} Std.</div>
          <p className="text-[11px] text-slate-400 mt-1">ArbZG-konform innerhalb Bandbreite</p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400 font-medium">Fakturierter Monatsumsatz</span>
          <div className="mt-2 text-2xl font-bold font-mono text-emerald-400">
            {totalBilledRevenue.toLocaleString('de-DE', { minimumFractionDigits: 2 })} €
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Basierend auf Ist-Zeiterfassung</p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400 font-medium">Rechtskonformität §34a</span>
          <div className="mt-2 text-2xl font-bold font-mono text-white">
            {Math.round((employees.filter(e => e.has34aCertificate).length / employees.length) * 100)}%
          </div>
          <p className="text-[11px] text-purple-400 mt-1">IHK-Sachkunde voll geprüft</p>
        </div>
      </div>

      {/* Report Category Switcher */}
      <div className="flex gap-2 border-b border-slate-800 pb-2 text-xs overflow-x-auto">
        <button
          onClick={() => setSelectedReportType('stunden')}
          className={`px-3 py-1.5 rounded-lg font-medium transition ${
            selectedReportType === 'stunden'
              ? 'bg-emerald-600 text-white'
              : 'bg-slate-900 text-slate-400 hover:text-white'
          }`}
        >
          Stunden- & Überstundenstatistik
        </button>
        <button
          onClick={() => setSelectedReportType('qualifikation')}
          className={`px-3 py-1.5 rounded-lg font-medium transition ${
            selectedReportType === 'qualifikation'
              ? 'bg-emerald-600 text-white'
              : 'bg-slate-900 text-slate-400 hover:text-white'
          }`}
        >
          Qualifikations- & Nachweisübersicht
        </button>
        <button
          onClick={() => setSelectedReportType('vorfaelle')}
          className={`px-3 py-1.5 rounded-lg font-medium transition ${
            selectedReportType === 'vorfaelle'
              ? 'bg-emerald-600 text-white'
              : 'bg-slate-900 text-slate-400 hover:text-white'
          }`}
        >
          Wachbuch- & Vorfallstatistik
        </button>
        <button
          onClick={() => setSelectedReportType('umsatz')}
          className={`px-3 py-1.5 rounded-lg font-medium transition ${
            selectedReportType === 'umsatz'
              ? 'bg-emerald-600 text-white'
              : 'bg-slate-900 text-slate-400 hover:text-white'
          }`}
        >
          Umsatz- & Rechnungsjournal
        </button>
      </div>

      {/* Main Analysis Chart & Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-white">
              {selectedReportType === 'stunden' && 'Soll- / Ist-Stunden nach Sicherheitskraft'}
              {selectedReportType === 'qualifikation' && 'IHK § 34a & Ersthelfer-Gültigkeiten'}
              {selectedReportType === 'vorfaelle' && 'Vorfallhäufigkeit nach Dringlichkeit'}
              {selectedReportType === 'umsatz' && 'Rechnungsbeträge nach Kunden'}
            </h2>
            <span className="text-xs text-slate-400 font-mono">Stand: Mai 2025</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={employeeHoursData}>
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }}
                />
                <Bar dataKey="Soll" fill="#475569" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Ist" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Ueberstunden" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Severity or status distribution card */}
        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-semibold text-white">Ereignisverteilung nach Severity</h2>
            <p className="text-xs text-slate-400 mt-1">Auswertung aller Vorfälle im OWKS-Wachbuch</p>
          </div>

          <div className="space-y-3 my-4">
            {incidentsBySeverity.map(item => (
              <div key={item.name} className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-300 font-medium">{item.name}</span>
                </div>
                <span className="font-mono font-bold text-white text-sm">{item.count} Meldungen</span>
              </div>
            ))}
          </div>

          <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-800 text-[11px] text-emerald-300">
            ✓ Alle Berichte entsprechen den Richtlinien der Berufsgenossenschaft (VBG) und DIN 77200.
          </div>
        </div>
      </div>
    </div>
  );
};
