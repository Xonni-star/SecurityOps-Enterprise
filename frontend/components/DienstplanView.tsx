import React, { useState } from 'react';
import {
  CalendarDays,
  Clock,
  AlertTriangle,
  UserCheck,
  Building,
  CheckCircle2,
  Calendar,
  AlertCircle,
  Filter,
  ShieldCheck,
  X
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { Shift, ShiftType } from '../types';

export const DienstplanView: React.FC = () => {
  const { shifts, employees, objects, assignShift } = useAppStore();
  const [selectedShiftForAssign, setSelectedShiftForAssign] = useState<Shift | null>(null);
  const [selectedEmpId, setSelectedEmpId] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'Alle' | 'Unbesetzt' | 'Besetzt' | 'Laufend'>('Alle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const filteredShifts = shifts.filter(s => {
    if (statusFilter === 'Alle') return true;
    return s.status === statusFilter;
  });

  const handleAssignConfirm = () => {
    if (!selectedShiftForAssign || !selectedEmpId) return;
    const emp = employees.find(e => e.id === selectedEmpId);
    if (!emp) return;

    setErrorMessage(null);
    const result = assignShift(selectedShiftForAssign.id, emp.id, `${emp.firstName} ${emp.lastName}`);

    if (!result.success) {
      setErrorMessage(result.error || 'Schichtzuweisung aufgrund von Richtlinienverstößen abgewiesen.');
      return;
    }

    setSelectedShiftForAssign(null);
    setSelectedEmpId('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-emerald-400" />
            Dienstplanung & Schichtdisposition
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Arbeitszeitgesetz-Prüfung (ArbZG), automatische § 34a GewO Qualifikationskontrolle und Besetzungssicherheit.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs flex-wrap">
          {/* Status Filter */}
          <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-lg p-1 text-xs">
            <Filter className="h-3.5 w-3.5 text-slate-400 ml-1.5" />
            {(['Alle', 'Unbesetzt', 'Besetzt', 'Laufend'] as const).map(filter => (
              <button
                key={filter}
                onClick={() => setStatusFilter(filter)}
                className={`px-2.5 py-1 rounded text-[11px] font-medium transition ${
                  statusFilter === filter
                    ? 'bg-emerald-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          <span className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 font-mono">
            KW 20 (Mai 2025)
          </span>
        </div>
      </div>

      {/* Shifts Table */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-white">Geplante Schichten & Vakanzen ({filteredShifts.length})</h2>
          <span className="text-xs text-slate-400 font-mono">
            {shifts.filter(s => s.status === 'Besetzt' || s.status === 'Laufend').length} / {shifts.length} Schichten besetzt
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-3">Datum</th>
                <th className="py-2.5 px-3">Schichtmodell</th>
                <th className="py-2.5 px-3">Objekt / Standort</th>
                <th className="py-2.5 px-3">Zeiten</th>
                <th className="py-2.5 px-3">Eingeteilte Sicherheitskraft</th>
                <th className="py-2.5 px-3">§ 34a Status</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Aktion</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredShifts.map((shift) => (
                <tr key={shift.id} className="hover:bg-slate-850/60 transition">
                  <td className="py-3 px-3 font-mono text-slate-300">{shift.date}</td>
                  <td className="py-3 px-3 font-medium text-white">{shift.shiftType}</td>
                  <td className="py-3 px-3 text-slate-300">{shift.objectName}</td>
                  <td className="py-3 px-3 font-mono text-slate-400">{shift.startTime} - {shift.endTime} ({shift.plannedHours}h)</td>
                  <td className="py-3 px-3">
                    {shift.employeeName ? (
                      <span className="font-semibold text-emerald-400">{shift.employeeName}</span>
                    ) : (
                      <span className="text-red-400 font-bold flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" /> UNBESETZT
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-3">
                    {shift.is34aRequired ? (
                      <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-mono">
                        §34a Zwingend
                      </span>
                    ) : (
                      <span className="text-slate-500 text-[10px]">Unterweisung</span>
                    )}
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        shift.status === 'Laufend'
                          ? 'bg-blue-950 text-blue-300 border border-blue-800'
                          : shift.status === 'Besetzt'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : 'bg-red-950 text-red-300 border border-red-800 animate-pulse'
                      }`}
                    >
                      {shift.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => {
                        setErrorMessage(null);
                        setSelectedShiftForAssign(shift);
                        setSelectedEmpId(shift.employeeId || '');
                      }}
                      className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs transition"
                    >
                      {shift.employeeId ? 'Ändern' : 'Besetzen'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ArbZG Compliance Rules Notice */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-start gap-3">
        <AlertTriangle className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="text-xs text-slate-300 space-y-1">
          <p className="font-semibold text-white">Automatisierte Arbeitszeitprüfungen (ArbZG & Bewachungsverordnung):</p>
          <p className="text-slate-400">
            • Ruhezeit von mindestens 11 Stunden zwischen zwei Schichten wird strikt validiert.
            <br />• Höchstarbeitszeit von maximal 10 Std./Tag bzw. 48 Std./Woche wird bei Zuweisung geprüft.
            <br />• Keine Zuweisung von Sicherheitskräften ohne gültigen § 34a GewO Sachkundenachweis auf Schutzobjekten der Stufe 2-4.
          </p>
        </div>
      </div>

      {/* Modal: Assign Shift */}
      {selectedShiftForAssign && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h2 className="text-base font-bold text-white">Schichtzuweisung / Nachbesetzung</h2>
              <button
                onClick={() => setSelectedShiftForAssign(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {errorMessage && (
              <div className="p-3 rounded-lg bg-red-950/80 border border-red-800 text-red-200 text-xs flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <span className="font-bold block">Gesetzliche Zuweisungssperre aktiv:</span>
                  <p className="text-[11px] whitespace-pre-line">{errorMessage}</p>
                </div>
              </div>
            )}

            <div className="text-xs text-slate-300 space-y-1.5 p-3 rounded-lg bg-slate-950 border border-slate-800">
              <p><span className="text-slate-400">Schicht:</span> {selectedShiftForAssign.shiftType}</p>
              <p><span className="text-slate-400">Objekt:</span> {selectedShiftForAssign.objectName}</p>
              <p><span className="text-slate-400">Zeit:</span> {selectedShiftForAssign.startTime} - {selectedShiftForAssign.endTime} Uhr ({selectedShiftForAssign.plannedHours} Std.)</p>
              <p><span className="text-slate-400">Voraussetzung:</span> § 34a GewO Sachkundeprüfung zwingend</p>
            </div>

            <div>
              <label className="block text-xs text-slate-300 mb-1.5 font-medium">
                Verfügbare Sicherheitskraft auswählen:
              </label>
              <select
                value={selectedEmpId}
                onChange={(e) => {
                  setSelectedEmpId(e.target.value);
                  setErrorMessage(null);
                }}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none"
              >
                <option value="">-- Mitarbeiter wählen --</option>
                {employees.map(emp => (
                  <option key={emp.id} value={emp.id}>
                    {emp.firstName} {emp.lastName} ({emp.employeeNumber}) {emp.has34aCertificate ? '• §34a OK' : '• KEIN §34a!'}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setSelectedShiftForAssign(null)}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
              >
                Abbrechen
              </button>
              <button
                type="button"
                onClick={handleAssignConfirm}
                className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold"
              >
                Einteilung prüfen & bestätigen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
