import React from 'react';
import {
  X,
  BellRing,
  AlertTriangle,
  CalendarCheck,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({ isOpen, onClose }) => {
  const { shifts, employees, owksEntries } = useAppStore();

  if (!isOpen) return null;

  const unstaffedShifts = shifts.filter(s => s.status === 'Unbesetzt');
  const criticalOwks = owksEntries.filter(e => e.severity === 'Kritischer Notfall' || e.severity === 'Warnung');

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end">
      <div className="w-full max-w-md bg-slate-900 border-l border-slate-800 h-full p-6 flex flex-col justify-between shadow-2xl">
        <div className="space-y-4 overflow-y-auto">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <BellRing className="h-4 w-4 text-emerald-400" />
              <h2 className="text-sm font-bold text-white">Systemmeldungen & Warnungen</h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Urgent Shifts */}
          {unstaffedShifts.length > 0 && (
            <div className="p-3 rounded-lg bg-red-950/60 border border-red-800 space-y-1.5 text-xs">
              <div className="flex items-center gap-2 text-red-300 font-bold">
                <AlertTriangle className="h-4 w-4 text-red-400" />
                Unbesetzte Schichten entdeckt ({unstaffedShifts.length})
              </div>
              {unstaffedShifts.map(s => (
                <p key={s.id} className="text-slate-300 text-[11px]">
                  • {s.objectName} ({s.shiftType}, {s.date})
                </p>
              ))}
            </div>
          )}

          {/* Critical OWKS alerts */}
          {criticalOwks.length > 0 && (
            <div className="p-3 rounded-lg bg-amber-950/60 border border-amber-800 space-y-1.5 text-xs">
              <div className="flex items-center gap-2 text-amber-300 font-bold">
                <AlertTriangle className="h-4 w-4 text-amber-400" />
                Wachbuch-Vorfälle mit Warnung
              </div>
              {criticalOwks.map(o => (
                <div key={o.id} className="text-[11px] text-slate-300 border-t border-amber-900/40 pt-1 mt-1">
                  <span className="font-semibold text-white">{o.title}</span>
                  <p className="text-slate-400 font-mono text-[10px]">{o.objectName} • {o.timestamp}</p>
                </div>
              ))}
            </div>
          )}

          {/* First aid expiry */}
          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1 text-xs">
            <span className="font-semibold text-slate-200">Igor Petrov (MA-0504)</span>
            <p className="text-[11px] text-amber-400">Erste-Hilfe-Auffrischung fällig im April 2025.</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition mt-4"
        >
          Schließen
        </button>
      </div>
    </div>
  );
};
