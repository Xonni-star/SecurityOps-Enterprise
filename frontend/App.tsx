import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar, NavTab } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { MasterplanView } from './components/MasterplanView';
import { OperationsComplianceView } from './components/OperationsComplianceView';
import { AlarmInterventionView } from './components/AlarmInterventionView';
import { EquipmentPsaView } from './components/EquipmentPsaView';
import { CrmView } from './components/CrmView';
import { ObjectsView } from './components/ObjectsView';
import { DienstplanView } from './components/DienstplanView';
import { ZeiterfassungView } from './components/ZeiterfassungView';
import { OwksView } from './components/OwksView';
import { WorkforceView } from './components/WorkforceView';
import { VertraegeView } from './components/VertraegeView';
import { BillingView } from './components/BillingView';
import { QmView } from './components/QmView';
import { DocsView } from './components/DocsView';
import { TasksCommunicationView } from './components/TasksCommunicationView';
import { ReportsView } from './components/ReportsView';
import { AuditSecurityView } from './components/AuditSecurityView';
import { ArchitectureDbView } from './components/ArchitectureDbView';
import { QaMaintenanceView } from './components/QaMaintenanceView';
import { WorkflowSimulationView } from './components/WorkflowSimulationView';
import { PraxisHubView } from './components/PraxisHubView';
import { AcceptanceAuditView } from './components/AcceptanceAuditView';
import { NotificationDrawer } from './components/NotificationDrawer';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [notificationsOpen, setNotificationsOpen] = useState<boolean>(false);

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500 selection:text-white">
      {/* Top Application Bar */}
      <Navbar onOpenNotifications={() => setNotificationsOpen(true)} />

      <div className="flex-1 flex overflow-hidden">
        {/* Modular Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          collapsed={sidebarCollapsed}
          setCollapsed={setSidebarCollapsed}
        />

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 bg-slate-950">
          <div className="max-w-7xl mx-auto">
            {activeTab === 'dashboard' && <DashboardView />}
            {activeTab === 'alarms' && <AlarmInterventionView />}
            {activeTab === 'equipment' && <EquipmentPsaView />}
            {activeTab === 'compliance' && <OperationsComplianceView />}
            {activeTab === 'masterplan' && <MasterplanView />}
            {activeTab === 'acceptance' && <AcceptanceAuditView />}
            {activeTab === 'praxishub' && <PraxisHubView />}
            {activeTab === 'crm' && <CrmView />}
            {activeTab === 'objects' && <ObjectsView />}
            {activeTab === 'dienstplan' && <DienstplanView />}
            {activeTab === 'zeiterfassung' && <ZeiterfassungView />}
            {activeTab === 'owks' && <OwksView />}
            {activeTab === 'workforce' && <WorkforceView />}
            {activeTab === 'vertraege' && <VertraegeView />}
            {activeTab === 'billing' && <BillingView />}
            {activeTab === 'qm' && <QmView />}
            {activeTab === 'docs' && <DocsView />}
            {activeTab === 'tasks' && <TasksCommunicationView />}
            {activeTab === 'reports' && <ReportsView />}
            {activeTab === 'workflows' && <WorkflowSimulationView />}
            {activeTab === 'iam' && <AuditSecurityView />}
            {activeTab === 'architecture' && <ArchitectureDbView />}
            {activeTab === 'qa' && <QaMaintenanceView />}
          </div>
        </main>
      </div>

      {/* Notifications Drawer */}
      <NotificationDrawer
        isOpen={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
      />
    </div>
  );
}
