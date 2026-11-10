import React, { useState } from 'react';
import {
  FileSignature,
  Plus,
  Calendar,
  Percent,
  Euro,
  Building,
  CheckCircle2,
  X
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

export const VertraegeView: React.FC = () => {
  const { contracts, customers, objects, addContract } = useAppStore();
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  // New contract form
  const [formCustId, setFormCustId] = useState<string>(customers[0]?.id || '');
  const [formObjId, setFormObjId] = useState<string>(objects[0]?.id || '');
  const [formStartDate, setFormStartDate] = useState<string>('2025-06-01');
  const [formEndDate, setFormEndDate] = useState<string>('2027-05-31');
  const [formBaseRate, setFormBaseRate] = useState<number>(36.50);
  const [formNightSur, setFormNightSur] = useState<number>(25);
  const [formSunSur, setFormSunSur] = useState<number>(50);
  const [formHolSur, setFormHolSur] = useState<number>(100);
  const [formAutoRenew, setFormAutoRenew] = useState<boolean>(true);

  const handleCreateContractSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cust = customers.find(c => c.id === formCustId);
    const obj = objects.find(o => o.id === formObjId);
    if (!cust || !obj) return;

    addContract({
      customerId: cust.id,
      customerName: cust.companyName,
      objectId: obj.id,
      objectName: obj.name,
      startDate: formStartDate,
      endDate: formEndDate,
      autoRenew: formAutoRenew,
      baseHourlyRate: Number(formBaseRate),
      nightSurchargePercent: Number(formNightSur),
      sundaySurchargePercent: Number(formSunSur),
      holidaySurchargePercent: Number(formHolSur),
      status: 'Aktiv'
    });

    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <FileSignature className="h-5 w-5 text-emerald-400" />
            Vertragsverwaltung & Tarifstrukturen
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Laufzeiten, Kündigungsfristen, Grundstundensätze und BGV/BDSW tarifkonforme Zuschlagsregelungen.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md shadow-emerald-950 transition"
        >
          <Plus className="h-4 w-4" />
          Neuen Bewachungsvertrag anlegen
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {contracts.map((ctr) => (
          <div
            key={ctr.id}
            className="p-5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition space-y-3"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="font-mono text-xs text-emerald-400 font-bold">{ctr.contractNumber}</span>
                <h3 className="font-bold text-white text-sm mt-0.5">{ctr.customerName}</h3>
                <p className="text-xs text-slate-400">{ctr.objectName}</p>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold">
                {ctr.status}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs text-center">
              <div>
                <span className="text-[10px] text-slate-400 block">Grundpreis</span>
                <span className="font-mono font-bold text-white text-sm">{ctr.baseHourlyRate.toFixed(2)} €/h</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Nachtzuschlag</span>
                <span className="font-mono font-bold text-purple-300 text-sm">+{ctr.nightSurchargePercent}%</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Sonntag</span>
                <span className="font-mono font-bold text-blue-300 text-sm">+{ctr.sundaySurchargePercent}%</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Feiertag</span>
                <span className="font-mono font-bold text-amber-300 text-sm">+{ctr.holidaySurchargePercent}%</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/80">
              <span className="font-mono">Laufzeit: {ctr.startDate} bis {ctr.endDate}</span>
              <span className="text-emerald-400 font-medium">Automatische Verlängerung: {ctr.autoRenew ? 'Ja' : 'Nein'}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal: New Contract */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <FileSignature className="h-4 w-4 text-emerald-400" />
                Neuen Bewachungsvertrag anlegen
              </h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreateContractSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1">Kunde *</label>
                <select
                  value={formCustId}
                  onChange={(e) => setFormCustId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white focus:outline-none"
                >
                  {customers.map(c => (
                    <option key={c.id} value={c.id}>{c.companyName}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Schutzobjekt *</label>
                <select
                  value={formObjId}
                  onChange={(e) => setFormObjId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white focus:outline-none"
                >
                  {objects.map(o => (
                    <option key={o.id} value={o.id}>{o.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-300 mb-1">Startdatum</label>
                  <input
                    type="date"
                    value={formStartDate}
                    onChange={(e) => setFormStartDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-1.5 text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Enddatum</label>
                  <input
                    type="date"
                    value={formEndDate}
                    onChange={(e) => setFormEndDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-1.5 text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-300 mb-1">Grundstundensatz (€/h) *</label>
                  <input
                    type="number"
                    step="0.10"
                    required
                    value={formBaseRate}
                    onChange={(e) => setFormBaseRate(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Nachtzuschlag (%)</label>
                  <input
                    type="number"
                    value={formNightSur}
                    onChange={(e) => setFormNightSur(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-300 mb-1">Sonntagszuschlag (%)</label>
                  <input
                    type="number"
                    value={formSunSur}
                    onChange={(e) => setFormSunSur(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Feiertagszuschlag (%)</label>
                  <input
                    type="number"
                    value={formHolSur}
                    onChange={(e) => setFormHolSur(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="chkRenew"
                  checked={formAutoRenew}
                  onChange={(e) => setFormAutoRenew(e.target.checked)}
                  className="rounded bg-slate-950 border-slate-700 text-emerald-600 focus:ring-0"
                />
                <label htmlFor="chkRenew" className="text-slate-300">
                  Automatische Verlängerung um 12 Monate bei Nichtkündigung
                </label>
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
                  Vertrag anlegen
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
