import React, { useState } from 'react';
import {
  ShieldAlert,
  Search,
  Wifi,
  WifiOff,
  UserCheck,
  BellRing,
  Activity,
  Layers,
  Github
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { UserRole } from '../types';
import { GitHubSyncModal } from './GitHubSyncModal';

interface NavbarProps {
  onOpenNotifications: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenNotifications }) => {
  const { currentRole, setCurrentRole, isOffline, toggleOffline, offlineQueueCount, searchQuery, setSearchQuery, shifts, owksEntries } = useAppStore();
  const [gitHubModalOpen, setGitHubModalOpen] = useState<boolean>(false);

  const unstaffedShiftsCount = shifts.filter(s => s.status === 'Unbesetzt').length;
  const recentCriticalCount = owksEntries.filter(e => e.severity === 'Kritischer Notfall' || e.severity === 'Warnung').length;

  return (
    <>
      <header className="h-16 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 md:px-6 flex items-center justify-between sticky top-0 z-30">
        {/* Brand & Ticker */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-lg bg-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-900/40 text-white font-bold ring-1 ring-emerald-400/30">
              <Layers className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base tracking-wider text-white">SECURITY<span className="text-emerald-400">OPS</span></span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">v3.5.2-PROD</span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">Sicherheitsdienst-Leitzentrale</p>
            </div>
          </div>

          {/* Live Status indicator */}
          <div className="hidden lg:flex items-center ml-6 px-3 py-1 rounded-full bg-slate-950 border border-slate-800 text-xs">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse mr-2"></span>
            <span className="text-slate-300 font-mono text-[11px]">Echtzeit-Telemetrie aktiv | TLS 1.3 | KRITIS-Konform</span>
          </div>
        </div>

        {/* Global Quick Search */}
        <div className="hidden md:flex items-center flex-1 max-w-md mx-6">
          <div className="relative w-full">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Schnellsuche: Kunde, Objekt, MA, Wachbuch, §34a..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950/80 border border-slate-700/80 rounded-lg pl-9 pr-4 py-1.5 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2 text-xs text-slate-400 hover:text-white"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Actions, GitHub Sync & Role Switcher */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* GitHub Sync Button */}
          <button
            onClick={() => setGitHubModalOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-800/90 hover:bg-slate-750 text-slate-200 border border-slate-700 hover:border-slate-600 transition"
            title="Projekt in persönlichem GitHub-Konto sichern"
          >
            <Github className="h-3.5 w-3.5 text-slate-300" />
            <span className="hidden sm:inline">GitHub Sync</span>
          </button>

          {/* Offline / Online Toggle */}
          <button
            onClick={toggleOffline}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
              isOffline
                ? 'bg-amber-950/80 text-amber-300 border-amber-800 hover:bg-amber-900'
                : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
            title={isOffline ? 'Offline-Puffer aktiv (Einträge werden lokal gehasht)' : 'Online verbunden mit PostgreSQL Server'}
          >
            {isOffline ? (
              <>
                <WifiOff className="h-3.5 w-3.5 text-amber-400 animate-bounce" />
                <span className="hidden sm:inline">Offline-Modus</span>
                <span className="bg-amber-800 text-amber-200 text-[10px] px-1 rounded-full">{offlineQueueCount}</span>
              </>
            ) : (
              <>
                <Wifi className="h-3.5 w-3.5 text-emerald-400" />
                <span className="hidden sm:inline">Online (Synchronisiert)</span>
              </>
            )}
          </button>

          {/* Unstaffed shift alert indicator */}
          {unstaffedShiftsCount > 0 && (
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-red-950/70 border border-red-800 text-red-300 text-xs font-semibold animate-pulse">
              <ShieldAlert className="h-3.5 w-3.5 text-red-400" />
              <span className="hidden sm:inline">{unstaffedShiftsCount} Schicht(en) offen</span>
            </div>
          )}

          {/* Notifications Button */}
          <button
            onClick={onOpenNotifications}
            className="relative p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
            aria-label="Benachrichtigungen"
          >
            <BellRing className="h-4 w-4" />
            {recentCriticalCount > 0 && (
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-amber-500 text-slate-950 font-bold text-[10px] rounded-full flex items-center justify-center">
                {recentCriticalCount}
              </span>
            )}
          </button>

          {/* Role Switcher */}
          <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-700/80 rounded-lg px-2 py-1">
            <UserCheck className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
            <select
              value={currentRole}
              onChange={(e) => setCurrentRole(e.target.value as UserRole)}
              className="bg-transparent text-xs text-slate-200 font-medium focus:outline-none cursor-pointer pr-1"
            >
              {Object.values(UserRole).map((r) => (
                <option key={r} value={r} className="bg-slate-900 text-slate-200">
                  {r}
                </option>
              ))}
            </select>
          </div>
        </div>
      </header>

      {/* GitHub Sync Modal */}
      <GitHubSyncModal
        isOpen={gitHubModalOpen}
        onClose={() => setGitHubModalOpen(false)}
      />
    </>
  );
};
