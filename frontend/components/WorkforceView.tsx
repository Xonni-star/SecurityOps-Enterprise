import React, { useState } from 'react';
import {
  Users2,
  Plus,
  ShieldCheck,
  AlertTriangle,
  FileCheck2,
  Phone,
  Mail,
  Award,
  Calendar
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { UserRole } from '../types';

export const WorkforceView: React.FC = () => {
  const { employees, addEmployee } = useAppStore();
  const [showAddModal, setShowAddModal] = useState(false);

  // Form state
  const [formFirst, setFormFirst] = useState('');
  const [formLast, setFormLast] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formRole, setFormRole] = useState<UserRole>(UserRole.MITARBEITER);
  const [formHas34a, setFormHas34a] = useState(true);
  const [formCertDate, setFormCertDate] = useState('2024-05-01');

  const handleCreateEmp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formFirst || !formLast) return;

    addEmployee({
      firstName: formFirst,
      lastName: formLast,
      email: formEmail || `${formFirst.toLowerCase()}.${formLast.toLowerCase()}@securityops.de`,
      phone: formPhone || '+49 170 0000000',
      status: 'Aktiv',
      role: formRole,
      entryDate: new Date().toISOString().split('T')[0],
      has34aCertificate: formHas34a,
      cert34aDate: formHas34a ? formCertDate : undefined,
      firstAidValidUntil: '2027-01-15',
      fireSafetyValidUntil: '2027-01-15',
      objectTrainingDone: true,
      targetHoursPerMonth: 160,
      actualHoursThisMonth: 0,
      overtimeHours: 0
    });

    setShowAddModal(false);
    setFormFirst('');
    setFormLast('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Users2 className="h-5 w-5 text-emerald-400" />
            Personalverwaltung & § 34a GewO Qualifikationen
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Rechtskonforme Erfassung von Sachkundenachweisen, Ersthelfern, Brandschutzhelfern und Sollstundenkonten.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md shadow-emerald-950 transition"
        >
          <Plus className="h-4 w-4" />
          Mitarbeiter anlegen
        </button>
      </div>

      {/* Staff Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {employees.map((emp) => (
          <div
            key={emp.id}
            className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition space-y-3"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="font-bold text-white text-sm">{emp.firstName} {emp.lastName}</span>
                <p className="text-xs text-slate-400 font-mono">{emp.employeeNumber} • {emp.role}</p>
              </div>
              <span
                className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                  emp.status === 'Aktiv'
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                    : emp.status === 'In Urlaub'
                    ? 'bg-blue-950 text-blue-300 border border-blue-800'
                    : 'bg-amber-950 text-amber-300 border border-amber-800'
                }`}
              >
                {emp.status}
              </span>
            </div>

            {/* §34a GewO & Qualifications Status */}
            <div className="space-y-1.5 p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Sachkunde § 34a GewO:</span>
                {emp.has34aCertificate ? (
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                    <ShieldCheck className="h-3.5 w-3.5" /> Nachgewiesen ({emp.cert34aDate?.split('-')[0]})
                  </span>
                ) : (
                  <span className="text-amber-400 font-bold flex items-center gap-1">
                    <AlertTriangle className="h-3.5 w-3.5" /> In Vorbereitung
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-400">Ersthelfer (DGUV):</span>
                <span className={emp.firstAidValidUntil.startsWith('2025-04') ? 'text-red-400 font-bold' : 'text-slate-300 font-mono'}>
                  bis {emp.firstAidValidUntil}
                </span>
              </div>

              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-400">Brandschutzhelfer:</span>
                <span className="text-slate-300 font-mono">bis {emp.fireSafetyValidUntil}</span>
              </div>
            </div>

            {/* Hours stats */}
            <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
              <span>Soll: {emp.targetHoursPerMonth}h / Monat</span>
              <span className="text-white font-semibold">Ist: {emp.actualHoursThisMonth}h</span>
              <span className={emp.overtimeHours >= 0 ? 'text-emerald-400' : 'text-red-400'}>
                {emp.overtimeHours >= 0 ? `+${emp.overtimeHours}h` : `${emp.overtimeHours}h`}
              </span>
            </div>

            {/* Contact quick links */}
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1 text-[11px]">
                <Phone className="h-3 w-3 text-slate-500" /> {emp.phone}
              </span>
              <span className="flex items-center gap-1 text-[11px] truncate max-w-[130px]">
                <Mail className="h-3 w-3 text-slate-500" /> {emp.email}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal: New Employee */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h2 className="text-base font-bold text-white">Neue Sicherheitskraft erfassen</h2>
            <form onSubmit={handleCreateEmp} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-300 mb-1">Vorname *</label>
                  <input
                    type="text"
                    required
                    value={formFirst}
                    onChange={(e) => setFormFirst(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Nachname *</label>
                  <input
                    type="text"
                    required
                    value={formLast}
                    onChange={(e) => setFormLast(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Dienstliche Rolle</label>
                <select
                  value={formRole}
                  onChange={(e) => setFormRole(e.target.value as UserRole)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white focus:outline-none"
                >
                  <option value={UserRole.MITARBEITER}>Mitarbeiter (Sicherheitskraft)</option>
                  <option value={UserRole.OBJEKTLEITUNG}>Objektleitung</option>
                  <option value={UserRole.EINSATZLEITUNG}>Einsatzleitung</option>
                  <option value={UserRole.DISPOSITION}>Disposition</option>
                </select>
              </div>

              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-2">
                <span className="font-semibold text-slate-300 uppercase text-[10px]">§ 34a GewO Qualifikation</span>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="chk34a"
                    checked={formHas34a}
                    onChange={(e) => setFormHas34a(e.target.checked)}
                    className="h-4 w-4 rounded bg-slate-900 border-slate-700 text-emerald-600 focus:ring-0"
                  />
                  <label htmlFor="chk34a" className="text-slate-200">
                    Sachkundeprüfung nach § 34a GewO IHK vorhanden
                  </label>
                </div>
                {formHas34a && (
                  <div>
                    <label className="block text-slate-400 text-[11px] mb-1">Prüfungsdatum</label>
                    <input
                      type="date"
                      value={formCertDate}
                      onChange={(e) => setFormCertDate(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-white"
                    />
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium"
                >
                  Abbrechen
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold"
                >
                  Mitarbeiter anlegen
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
