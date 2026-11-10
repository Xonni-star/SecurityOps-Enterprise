import React from 'react';
import {
  LayoutDashboard,
  Building2,
  ShieldCheck,
  CalendarDays,
  Clock,
  BookOpenCheck,
  Users2,
  FileSignature,
  Receipt,
  Award,
  FileText,
  BarChart3,
  LockKeyhole,
  DatabaseZap,
  ListTodo,
  Cpu,
  Workflow,
  Zap,
  FileCheck2,
  Compass,
  FileCheck,
  Siren,
  Shield,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { InterventionStatus } from '../types';

export type NavTab =
  | 'dashboard'
  | 'alarms'
  | 'equipment'
  | 'compliance'
  | 'masterplan'
  | 'acceptance'
  | 'praxishub'
  | 'crm'
  | 'objects'
  | 'dienstplan'
  | 'zeiterfassung'
  | 'owks'
  | 'workforce'
  | 'vertraege'
  | 'billing'
  | 'qm'
  | 'docs'
  | 'tasks'
  | 'reports'
  | 'workflows'
  | 'iam'
  | 'architecture'
  | 'qa';

interface SidebarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  collapsed,
  setCollapsed
}) => {
  const { interventions } = useAppStore();
  const activeAlarmsCount = interventions.filter(
    a => a.status === InterventionStatus.EINGEGANGEN || a.status === InterventionStatus.ANFAHRT || a.status === InterventionStatus.VOR_ORT
  ).length;

  const menuItems = [
    { id: 'dashboard' as NavTab, label: 'Dashboard & Lagezentrum', icon: LayoutDashboard, badge: undefined },
    { id: 'alarms' as NavTab, label: 'Alarm & Intervention', icon: Siren, badge: activeAlarmsCount > 0 ? `${activeAlarmsCount} VdS` : 'VdS' },
    { id: 'equipment' as NavTab, label: 'Ausrüstung & PSA (DGUV)', icon: Shield, badge: '§18' },
    { id: 'compliance' as NavTab, label: 'Betrieb & Compliance', icon: FileCheck, badge: 'P10' },
    { id: 'masterplan' as NavTab, label: 'Projekt-Masterplan', icon: Compass, badge: '99%' },
    { id: 'acceptance' as NavTab, label: 'Gesamtabnahme & Pilot', icon: FileCheck2, badge: 'RC-1' },
    { id: 'praxishub' as NavTab, label: 'Praxis-Hub & Springer', icon: Zap, badge: 'Live' },
    { id: 'crm' as NavTab, label: 'Kunden / CRM', icon: Building2, badge: undefined },
    { id: 'objects' as NavTab, label: 'Objektverwaltung', icon: ShieldCheck, badge: undefined },
    { id: 'dienstplan' as NavTab, label: 'Dienstplanung', icon: CalendarDays, badge: 'Aktiv' },
    { id: 'zeiterfassung' as NavTab, label: 'Zeiterfassung', icon: Clock, badge: undefined },
    { id: 'owks' as NavTab, label: 'Wachbuch (OWKS)', icon: BookOpenCheck, badge: '24/7' },
    { id: 'workforce' as NavTab, label: 'Personal & §34a', icon: Users2, badge: undefined },
    { id: 'vertraege' as NavTab, label: 'Vertragsverwaltung', icon: FileSignature, badge: undefined },
    { id: 'billing' as NavTab, label: 'Rechnungswesen', icon: Receipt, badge: undefined },
    { id: 'qm' as NavTab, label: 'Qualitätsmanagement', icon: Award, badge: undefined },
    { id: 'docs' as NavTab, label: 'Dokumenten-DMS', icon: FileText, badge: undefined },
    { id: 'tasks' as NavTab, label: 'Aufgaben & Dispatch', icon: ListTodo, badge: 'Prio' },
    { id: 'reports' as NavTab, label: 'Reporting & Analyse', icon: BarChart3, badge: 'CSV' },
    { id: 'workflows' as NavTab, label: 'Praxistest & Workflows', icon: Workflow, badge: 'E2E' },
    { id: 'iam' as NavTab, label: 'IAM & Audit-Log', icon: LockKeyhole, badge: undefined },
    { id: 'architecture' as NavTab, label: 'Architektur & DB (ER)', icon: DatabaseZap, badge: 'Postgres' },
    { id: 'qa' as NavTab, label: 'QA & Systemdiagnose', icon: Cpu, badge: 'Tests' },
  ];

  return (
    <aside
      className={`bg-slate-900 border-r border-slate-800 transition-all duration-200 flex flex-col justify-between select-none z-20 ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      <div className="py-3 px-2 flex-1 overflow-y-auto">
        <div className="flex items-center justify-between px-2 mb-3">
          {!collapsed && (
            <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">
              HAUPTMENÜ
            </span>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition ml-auto"
            title={collapsed ? 'Seitenleiste ausklappen' : 'Seitenleiste einklappen'}
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>

        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            const isAlarmTab = item.id === 'alarms';

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/40 shadow-sm font-semibold'
                    : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                } ${collapsed ? 'justify-center px-2' : ''}`}
                title={collapsed ? item.label : undefined}
              >
                <Icon className={`h-4 w-4 shrink-0 ${
                  isActive
                    ? 'text-emerald-400'
                    : isAlarmTab && activeAlarmsCount > 0
                    ? 'text-red-400 animate-pulse'
                    : 'text-slate-400'
                }`} />
                {!collapsed && (
                  <span className="truncate flex-1 text-left">{item.label}</span>
                )}
                {!collapsed && item.badge && (
                  <span className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded border ${
                    isAlarmTab && activeAlarmsCount > 0
                      ? 'bg-red-950 text-red-300 border-red-800 animate-pulse'
                      : 'bg-slate-800 text-slate-300 border-slate-700'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Info Box */}
      {!collapsed && (
        <div className="p-3 m-2 rounded-lg bg-slate-950/70 border border-slate-800 text-[11px]">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span>PostgreSQL Pool:</span>
            <span className="text-emerald-400 font-mono font-medium">18 / 20 OK</span>
          </div>
          <div className="flex items-center justify-between text-slate-400">
            <span>DGUV V23 & BewachV:</span>
            <span className="text-emerald-400 font-mono font-medium">Konform</span>
          </div>
        </div>
      )}
    </aside>
  );
};
