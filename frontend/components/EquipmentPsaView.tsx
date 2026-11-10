import React, { useState } from 'react';
import {
  Shield,
  Plus,
  CheckCircle2,
  AlertTriangle,
  UserCheck,
  Radio,
  FileCheck2,
  Download,
  Search,
  Filter,
  ArrowRight,
  RotateCcw,
  Sparkles,
  X
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { EquipmentCategory, SecurityEquipmentItem } from '../types';
import { apiService } from '../services/apiService';

export const EquipmentPsaView: React.FC = () => {
  const { equipmentItems, employees, addEquipmentItem, assignEquipmentToEmployee, returnEquipment, markEquipmentInspected } = useAppStore();

  const [categoryFilter, setCategoryFilter] = useState<string>('Alle');
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [selectedEqForAssign, setSelectedEqForAssign] = useState<SecurityEquipmentItem | null>(null);
  const [assignEmpId, setAssignEmpId] = useState<string>('');

  // Form state
  const [formSerial, setFormSerial] = useState('SN-');
  const [formInv, setFormInv] = useState('INV-PSA-');
  const [formCategory, setFormCategory] = useState<EquipmentCategory>(EquipmentCategory.STICHSCHUTZWESTE);
  const [formModel, setFormModel] = useState('');
  const [formInspectionDue, setFormInspectionDue] = useState('2026-05-12');
  const [formNotes, setFormNotes] = useState('');

  const filteredItems = equipmentItems.filter(eq => {
    if (categoryFilter === 'Alle') return true;
    return eq.category === categoryFilter;
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formSerial || !formModel) return;

    addEquipmentItem({
      serialNumber: formSerial,
      inventoryNumber: formInv,
      category: formCategory,
      modelName: formModel,
      inspectionDue: formInspectionDue,
      status: 'Einsatzbereit',
      ceCertified: true,
      notes: formNotes || 'Geprüft nach DGUV Vorschrift 23'
    });

    setShowAddModal(false);
    setFormModel('');
    setFormNotes('');
  };

  const handleAssignConfirm = () => {
    if (!selectedEqForAssign || !assignEmpId) return;
    assignEquipmentToEmployee(selectedEqForAssign.id, assignEmpId);
    setSelectedEqForAssign(null);
    setAssignEmpId('');
  };

  const handleExportInventoryCsv = () => {
    const headers = ['Inventarnummer', 'Seriennummer', 'Kategorie', 'Modell', 'Inhaber', 'Prüfung Fällig', 'Status', 'CE-Kennzeichnung', 'Notizen'];
    const rows = equipmentItems.map(eq => [
      eq.inventoryNumber,
      eq.serialNumber,
      eq.category,
      eq.modelName,
      eq.assignedEmployeeName || 'Lager',
      eq.inspectionDue,
      eq.status,
      eq.ceCertified ? 'JA' : 'NEIN',
      eq.notes
    ]);
    apiService.exportDataToCsv('SecurityOps_Ausrüstung_PSA_DGUV23', headers, rows);
  };

  const dueSoonCount = equipmentItems.filter(e => e.status === 'Prüfung fällig' || e.inspectionDue.startsWith('2025-05') || e.inspectionDue.startsWith('2025-06')).length;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-md bg-emerald-500/20 text-emerald-400">
              <Shield className="h-5 w-5" />
            </span>
            <h1 className="text-lg font-bold text-white tracking-wide">
              DIENSTAUSWEIS- & PSA-AUSRÜSTUNGSVERWALTUNG (§ 18 BEWACHV & DGUV V23)
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Lückenlose Verwaltung nummerierter Dienstausweise, zertifizierter Stichschutzwesten, PNA-Totmannfunkgeräte und Prüffristen.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleExportInventoryCsv}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition"
          >
            <Download className="h-3.5 w-3.5" />
            PSA-Nachweis exportieren
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-950 transition"
          >
            <Plus className="h-4 w-4" />
            Ausrüstung inventarisieren
          </button>
        </div>
      </div>

      {/* KPI Tiles */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400 font-medium">Gesamt-Ausrüstungsteile</span>
          <div className="mt-2 text-2xl font-bold font-mono text-white">{equipmentItems.length}</div>
          <p className="text-[11px] text-emerald-400 mt-1">100% inventarisiert & CE-geprüft</p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400 font-medium">Ausgegebene Dienstausweise</span>
          <div className="mt-2 text-2xl font-bold font-mono text-emerald-400">
            {equipmentItems.filter(e => e.category === EquipmentCategory.DIENSTAUSWEIS && e.status === 'Ausgegeben').length} / {employees.length}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">§ 18 BewachV Lichtbildausweise</p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400 font-medium">DGUV / TÜV Fristen fällig</span>
          <div className={`mt-2 text-2xl font-bold font-mono ${dueSoonCount > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
            {dueSoonCount}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Trauma-Kit Sterilgutprüfung</p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400 font-medium">PNA-Totmannfunkgeräte</span>
          <div className="mt-2 text-2xl font-bold font-mono text-purple-400">
            {equipmentItems.filter(e => e.category === EquipmentCategory.FUNKGERAET_DMR).length}
          </div>
          <p className="text-[11px] text-purple-400 mt-1">DGUV R 112-139 Alleinarbeit</p>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 border-b border-slate-800 pb-2 text-xs overflow-x-auto">
        {['Alle', EquipmentCategory.DIENSTAUSWEIS, EquipmentCategory.STICHSCHUTZWESTE, EquipmentCategory.FUNKGERAET_DMR, EquipmentCategory.FIRST_AID_KIT].map(cat => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            className={`px-3 py-1.5 rounded-lg font-medium transition whitespace-nowrap ${
              categoryFilter === cat
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            {cat === 'Alle' ? 'Alle Ausrüstungen' : cat.split('(')[0]}
          </button>
        ))}
      </div>

      {/* Inventory Table */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-3">Inventar- / Seriennr.</th>
                <th className="py-2.5 px-3">Kategorie</th>
                <th className="py-2.5 px-3">Modell / Zertifizierung</th>
                <th className="py-2.5 px-3">Eingeteilter Träger</th>
                <th className="py-2.5 px-3">Nächste DGUV-Prüfung</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Aktion</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredItems.map(eq => (
                <tr key={eq.id} className="hover:bg-slate-850/60 transition">
                  <td className="py-3 px-3">
                    <span className="font-mono font-bold text-white block">{eq.inventoryNumber}</span>
                    <span className="text-[10px] font-mono text-slate-400">{eq.serialNumber}</span>
                  </td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] border border-slate-700">
                      {eq.category.split('(')[0]}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-semibold text-white">
                    {eq.modelName}
                    <p className="text-[10px] text-slate-400 font-normal mt-0.5">{eq.notes}</p>
                  </td>
                  <td className="py-3 px-3">
                    {eq.assignedEmployeeName ? (
                      <span className="font-semibold text-emerald-400 flex items-center gap-1">
                        <UserCheck className="h-3.5 w-3.5" /> {eq.assignedEmployeeName}
                      </span>
                    ) : (
                      <span className="text-slate-500 font-mono">Im Lager</span>
                    )}
                  </td>
                  <td className="py-3 px-3 font-mono">
                    <span className={eq.inspectionDue.startsWith('2025-05') || eq.inspectionDue.startsWith('2025-06') ? 'text-amber-400 font-bold' : 'text-slate-300'}>
                      {eq.inspectionDue}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        eq.status === 'Einsatzbereit'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : eq.status === 'Ausgegeben'
                          ? 'bg-blue-950 text-blue-300 border border-blue-800'
                          : 'bg-amber-950 text-amber-300 border border-amber-800 animate-pulse'
                      }`}
                    >
                      {eq.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right space-x-1">
                    {eq.status === 'Prüfung fällig' && (
                      <button
                        onClick={() => markEquipmentInspected(eq.id, '2026-05-12')}
                        className="px-2 py-1 rounded bg-amber-600 hover:bg-amber-500 text-white text-[10px] font-semibold transition"
                      >
                        Prüfung OK
                      </button>
                    )}

                    {eq.assignedEmployeeId ? (
                      <button
                        onClick={() => returnEquipment(eq.id)}
                        className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-medium transition"
                      >
                        Rücknahme
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setSelectedEqForAssign(eq);
                          setAssignEmpId(employees[0]?.id || '');
                        }}
                        className="px-2 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-semibold transition"
                      >
                        Ausgeben
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Add Equipment */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Shield className="h-4 w-4 text-emerald-400" />
                Ausrüstung / PSA erfassen (DGUV V23)
              </h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1">Ausrüstungskategorie *</label>
                <select
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value as EquipmentCategory)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white focus:outline-none"
                >
                  {Object.values(EquipmentCategory).map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-300 mb-1">Inventarnummer *</label>
                  <input
                    type="text"
                    required
                    value={formInv}
                    onChange={(e) => setFormInv(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Seriennummer *</label>
                  <input
                    type="text"
                    required
                    value={formSerial}
                    onChange={(e) => setFormSerial(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Modell / Typbezeichnung *</label>
                <input
                  type="text"
                  required
                  placeholder="z.B. Mehler Vario KDIW 2004 Gr. L"
                  value={formModel}
                  onChange={(e) => setFormModel(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Nächste DGUV / TÜV Prüfung</label>
                <input
                  type="date"
                  value={formInspectionDue}
                  onChange={(e) => setFormInspectionDue(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-1.5 text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Besondere Verwendungsauflagen</label>
                <textarea
                  rows={2}
                  placeholder="Einsatzort, Zulassung, Aufbewahrungsort..."
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white focus:outline-none font-mono"
                />
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
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
                >
                  Ausrüstung anlegen
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Assign Equipment */}
      {selectedEqForAssign && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <UserCheck className="h-4 w-4 text-emerald-400" />
                Ausrüstung an Mitarbeiter ausgeben
              </h2>
              <button
                onClick={() => setSelectedEqForAssign(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-3 rounded bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-1">
              <p><span className="text-slate-400">Gegenstand:</span> {selectedEqForAssign.modelName}</p>
              <p><span className="text-slate-400">Inventarnummer:</span> {selectedEqForAssign.inventoryNumber}</p>
              <p><span className="text-slate-400">Kategorie:</span> {selectedEqForAssign.category}</p>
            </div>

            <div>
              <label className="block text-slate-300 mb-1.5 text-xs font-semibold">
                Sicherheitskraft auswählen:
              </label>
              <select
                value={assignEmpId}
                onChange={(e) => setAssignEmpId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none"
              >
                {employees.map(e => (
                  <option key={e.id} value={e.id}>{e.firstName} {e.lastName} ({e.employeeNumber})</option>
                ))}
              </select>
            </div>

            <div className="p-2.5 rounded bg-slate-950 border border-slate-800 text-[11px] text-slate-400">
              Die Ausgabe wird mit Datum und Benutzerstempel revisionsfest im Audit-Trail dokumentiert.
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setSelectedEqForAssign(null)}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
              >
                Abbrechen
              </button>
              <button
                type="button"
                onClick={handleAssignConfirm}
                className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold"
              >
                Ausgabe quittieren
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
