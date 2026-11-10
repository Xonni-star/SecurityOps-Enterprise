import React from 'react';
import {
  LockKeyhole,
  ShieldCheck,
  UserCheck,
  Clock,
  KeyRound,
  FileCheck2,
  Database
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { UserRole } from '../types';

export const AuditSecurityView: React.FC = () => {
  const { auditLogs, currentRole } = useAppStore();

  const roleMatrix = [
    { role: UserRole.ADMIN, crm: 'Voll', ops: 'Voll', owks: 'Voll + Revisionslog', billing: 'Voll', iam: 'Voll' },
    { role: UserRole.GESCHAEFTSFUEHRUNG, crm: 'Voll', ops: 'Lesen + QM', owks: 'Lesen', billing: 'Voll', iam: 'Lesen' },
    { role: UserRole.EINSATZLEITUNG, crm: 'Lesen', ops: 'Voll (Dispo)', owks: 'Voll', billing: 'Freigabe', iam: 'Eigene' },
    { role: UserRole.OBJEKTLEITUNG, crm: 'Objektbezogen', ops: 'Objektbezogen', owks: 'Objektbezogen', billing: 'Einsicht', iam: 'Keine' },
    { role: UserRole.MITARBEITER, crm: 'Keine', ops: 'Eigene Schichten', owks: 'Eintrag erstellen', billing: 'Keine', iam: 'Keine' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <LockKeyhole className="h-5 w-5 text-emerald-400" />
            IAM, Rollen-Berechtigungen & Revisions-Auditlog
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Argon2id Passwort-Hashing, rollenbasierte Zugriffskontrolle (RBAC), CSRF-Schutz und unveränderliches Protokoll.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="px-3 py-1 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-mono">
            Argon2id m=65536, t=3, p=4
          </span>
          <span className="px-3 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700 font-mono">
            DSGVO Revisionslevel 3
          </span>
        </div>
      </div>

      {/* RBAC Matrix */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
        <h2 className="text-sm font-semibold text-white">Rollen- und Rechtematrix (Serverseitige Enforcing)</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-3">Rolle</th>
                <th className="py-2.5 px-3">Kunden (CRM)</th>
                <th className="py-2.5 px-3">Objekte & Schichten</th>
                <th className="py-2.5 px-3">Online-Wachbuch (OWKS)</th>
                <th className="py-2.5 px-3">Rechnungswesen</th>
                <th className="py-2.5 px-3">IAM & Benutzer</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {roleMatrix.map((rm) => (
                <tr key={rm.role} className="hover:bg-slate-850/60 transition">
                  <td className="py-3 px-3 font-semibold text-white">{rm.role}</td>
                  <td className="py-3 px-3 text-slate-300">{rm.crm}</td>
                  <td className="py-3 px-3 text-slate-300">{rm.ops}</td>
                  <td className="py-3 px-3 text-emerald-400">{rm.owks}</td>
                  <td className="py-3 px-3 text-slate-300">{rm.billing}</td>
                  <td className="py-3 px-3 text-slate-400">{rm.iam}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Immutable Audit Log */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-white">Unveränderliches Audit-Log (Systemereignisse)</h2>
          <span className="text-xs text-slate-400 font-mono">Letzte 150 Einträge (PostgreSQL Append-Only)</span>
        </div>

        <div className="overflow-x-auto max-h-[420px]">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider sticky top-0 border-b border-slate-800">
              <tr>
                <th className="py-2 px-3">Zeitstempel</th>
                <th className="py-2 px-3">Aktion</th>
                <th className="py-2 px-3">Modul</th>
                <th className="py-2 px-3">Benutzer / Rolle</th>
                <th className="py-2 px-3">IP-Adresse</th>
                <th className="py-2 px-3">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {auditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-850/60 transition">
                  <td className="py-2 px-3 text-slate-400">{log.timestamp}</td>
                  <td className="py-2 px-3 font-bold text-emerald-400">{log.action}</td>
                  <td className="py-2 px-3 text-slate-300">{log.category}</td>
                  <td className="py-2 px-3 text-white">{log.userName}</td>
                  <td className="py-2 px-3 text-slate-400">{log.ipAddress}</td>
                  <td className="py-2 px-3 text-slate-300">{log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
