import React from 'react';
// Added missing ShieldCheck icon import
import {
  ShieldAlert,
  ShieldCheck,
  Users,
  Building,
  CalendarCheck,
  AlertTriangle,
  Receipt,
  FileCheck2,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  TrendingUp,
  MapPin
} from 'lucide-react';
import {
  AreaChart,
  Area,
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

const SHIFT_HOURS_DATA = [
  { name: 'Mo', solI: 120, ist: 118 },
  { name: 'Di', solI: 130, ist: 132 },
  { name: 'Mi', solI: 125, ist: 125 },
  { name: 'Do', solI: 140, ist: 138 },
  { name: 'Fr', solI: 160, ist: 164 },
  { name: 'Sa', solI: 180, ist: 176 },
  { name: 'So', solI: 150, ist: 152 },
];

const INCIDENT_DISTRIBUTION = [
  { name: 'Schichtübergabe', value: 45, color: '#10b981' },
  { name: 'Besucher/LKW', value: 30, color: '#3b82f6' },
  { name: 'Technische Störung', value: 15, color: '#f59e0b' },
  { name: 'Sicherheitsalarm', value: 10, color: '#ef4444' },
];

export const DashboardView: React.FC = () => {
  const { customers, objects, employees, shifts, owksEntries, invoices, checkpoints } = useAppStore();

  const activeCustomers = customers.filter(c => c.status === 'Aktiv').length;
  const activeObjects = objects.filter(o => o.status === 'Aktiv').length;
  const activeEmployees = employees.filter(e => e.status === 'Aktiv').length;
  const openShifts = shifts.filter(s => s.status === 'Unbesetzt').length;

  // Find qualifications expiring in next 60 days
  const expiringQualifications = employees.filter(e => {
    return e.firstAidValidUntil.startsWith('2025-04') || e.firstAidValidUntil.startsWith('2025-05');
  });

  return (
    <div className="space-y-6">
      {/* Top Banner: Operations Status */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <h1 className="text-lg font-bold text-white tracking-wide">OPERATIVE LEITZENTRALE & STATUS</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Echtzeit-Überblick aller Standorte, Dienstpläne, Alarme und § 34a GewO Qualifikationen.
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap text-xs">
          <span className="px-3 py-1 rounded-md bg-emerald-950/80 text-emerald-400 border border-emerald-800 font-mono">
            Einsatzbereitschaft: 98.4%
          </span>
          <span className="px-3 py-1 rounded-md bg-slate-800 text-slate-300 border border-slate-700 font-mono">
            Patrouillen-Takt: 15 Min
          </span>
        </div>
      </div>

      {/* KPI Tiles */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Aktive Kunden / CRM</span>
            <Building className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white">{activeCustomers}</span>
            <span className="text-[11px] text-emerald-400 font-medium flex items-center">
              <ArrowUpRight className="h-3 w-3" /> +2 Q2
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Vollständige digitale Kundenakten</p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Geregelte Schutzobjekte</span>
            <ShieldCheck className="h-4 w-4 text-blue-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white">{activeObjects}</span>
            <span className="text-[11px] text-blue-400 font-mono">2x KRITIS Stufe 3/4</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Alle EMA / BMA gekoppelt</p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Einsatzkräfte im Dienst</span>
            <Users className="h-4 w-4 text-purple-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white">{activeEmployees}</span>
            <span className="text-[11px] text-purple-400 font-medium">100% §34a Nachweis</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">1 in Urlaub, 0 krank</p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Dienstplan-Vakanzen</span>
            <CalendarCheck className={`h-4 w-4 ${openShifts > 0 ? 'text-red-400' : 'text-emerald-400'}`} />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className={`text-2xl font-bold ${openShifts > 0 ? 'text-red-400' : 'text-white'}`}>
              {openShifts}
            </span>
            <span className={`text-[11px] font-medium ${openShifts > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
              {openShifts > 0 ? 'Handlungsbedarf!' : 'Voll besetzt'}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Gal. Am Dom Spätschicht offen</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Hours chart */}
        <div className="lg:col-span-2 p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-semibold text-white">Soll- vs. Ist-Einsatzstunden (Wochenübersicht)</h2>
              <p className="text-xs text-slate-400">Automatische Erfassung via Deister-Patrouille & OWKS</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-slate-400">
                <span className="h-2 w-2 rounded-full bg-slate-600"></span> Soll
              </span>
              <span className="flex items-center gap-1.5 text-emerald-400">
                <span className="h-2 w-2 rounded-full bg-emerald-500"></span> Ist
              </span>
            </div>
          </div>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={SHIFT_HOURS_DATA}>
                <defs>
                  <linearGradient id="istGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }}
                />
                <Area type="monotone" dataKey="solI" stroke="#64748b" strokeWidth={2} fillOpacity={0.1} fill="#64748b" />
                <Area type="monotone" dataKey="ist" stroke="#10b981" strokeWidth={2.5} fill="url(#istGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Incident Breakdown */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-semibold text-white">Ereignisverteilung Wachbuch</h2>
            <p className="text-xs text-slate-400">Letzte 30 Tage nach Kategorien</p>
          </div>

          <div className="h-44 w-full my-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={INCIDENT_DISTRIBUTION}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={65}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {INCIDENT_DISTRIBUTION.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-800">
            {INCIDENT_DISTRIBUTION.map((d) => (
              <div key={d.name} className="flex items-center gap-1.5 text-slate-300">
                <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: d.color }}></span>
                <span className="truncate text-[11px]">{d.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Critical Action Items: Expiring Certs & Urgent Shifts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Expiring Certs */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-400" />
              <h2 className="text-sm font-semibold text-white">Qualifikations- & Nachweis-Warnungen</h2>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800 font-mono">
              § 34a GewO / DGUV
            </span>
          </div>

          <div className="space-y-2.5">
            {expiringQualifications.length > 0 ? (
              expiringQualifications.map(emp => (
                <div key={emp.id} className="p-2.5 rounded-lg bg-slate-950/80 border border-amber-900/40 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-semibold text-white">{emp.firstName} {emp.lastName}</span>
                    <span className="text-slate-400 font-mono ml-2">({emp.employeeNumber})</span>
                    <p className="text-[11px] text-amber-400 mt-0.5">
                      Erste-Hilfe-Auffrischung erforderlich bis: <span className="font-semibold">{emp.firstAidValidUntil}</span>
                    </p>
                  </div>
                  <button className="px-2.5 py-1 rounded bg-amber-600/30 hover:bg-amber-600/50 text-amber-200 border border-amber-700/50 text-[11px]">
                    Schulung buchen
                  </button>
                </div>
              ))
            ) : (
              <div className="p-3 text-center text-xs text-slate-400 bg-slate-950 rounded-lg">
                Alle Mitarbeiter-Qualifikationen sind aktuell gültig.
              </div>
            )}

            {/* In training certificate note */}
            <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800 flex items-center justify-between text-xs">
              <div>
                <span className="font-semibold text-slate-200">Marc Engler</span>
                <span className="text-slate-400 font-mono ml-2">(MA-0588)</span>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Sachkundeprüfung §34a GewO IHK-Termin: 28.05.2025 angemeldet
                </p>
              </div>
              <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-400 text-[10px]">
                In Prüfung
              </span>
            </div>
          </div>
        </div>

        {/* Live Checkpoint Patrol Status */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-emerald-400" />
              <h2 className="text-sm font-semibold text-white">Live-Rundgang & Deister-Kontrollpunkte</h2>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-mono">
              Objekt OBJ-MUC-01
            </span>
          </div>

          <div className="space-y-2">
            {checkpoints.map((cp) => (
              <div
                key={cp.id}
                className="p-2 rounded-lg bg-slate-950/80 border border-slate-800 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <span className={`h-2 w-2 rounded-full ${cp.status === 'OK' ? 'bg-emerald-500' : 'bg-red-500 animate-pulse'}`} />
                  <div>
                    <span className="text-slate-200 font-medium">{cp.name}</span>
                    <span className="text-[10px] font-mono text-slate-400 ml-2">[{cp.code}]</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[11px] text-slate-400">
                    {cp.lastScanned ? `Letzter Scan: ${cp.lastScanned} Uhr` : 'Noch nicht passiert'}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      cp.status === 'OK'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        : 'bg-red-950 text-red-300 border border-red-800'
                    }`}
                  >
                    {cp.status === 'OK' ? 'GEPRÜFT' : 'ÜBERFÄLLIG'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
