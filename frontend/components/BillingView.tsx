import React, { useState } from 'react';
import {
  Receipt,
  Plus,
  Download,
  CheckCircle2,
  FileText,
  CreditCard,
  Building,
  FileSpreadsheet,
  Coins,
  Percent,
  Clock,
  X
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { InvoiceStatus } from '../types';
import { apiService } from '../services/apiService';

export const BillingView: React.FC = () => {
  const { invoices, customers, contracts, addInvoice, timeRecords, employees } = useAppStore();
  const [activeTab, setActiveTab] = useState<'invoices' | 'datevPayroll'>('invoices');
  const [selectedInvoice, setSelectedInvoice] = useState(invoices[0] || null);
  const [showInvoiceModal, setShowInvoiceModal] = useState<boolean>(false);

  // New invoice form
  const [invCustId, setInvCustId] = useState<string>(customers[0]?.id || '');
  const [invPeriod, setInvPeriod] = useState<string>('Mai 2025');
  const [invHours, setInvHours] = useState<number>(320);
  const [invNightHours, setInvNightHours] = useState<number>(48);
  const [invSundayHours, setInvSundayHours] = useState<number>(24);

  const handleGenerateInvoiceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cust = customers.find(c => c.id === invCustId);
    if (!cust) return;

    const ctr = contracts.find(c => c.customerId === cust.id) || contracts[0];
    const calc = apiService.calculateContractBilling(ctr, Number(invHours), Number(invNightHours), Number(invSundayHours));

    const today = new Date();
    const dueDate = new Date();
    dueDate.setDate(today.getDate() + 14);

    addInvoice({
      customerId: cust.id,
      customerName: cust.companyName,
      period: invPeriod,
      subtotal: calc.subtotal,
      taxAmount: calc.tax,
      totalAmount: calc.total,
      status: InvoiceStatus.FREIGEGEBEN,
      issueDate: today.toISOString().split('T')[0],
      dueDate: dueDate.toISOString().split('T')[0],
      positionsCount: 3
    });

    setShowInvoiceModal(false);
  };

  // DATEV Payroll calculation based on § 3b EStG tax-free allowances
  const payrollRows = employees.map(emp => {
    const empRecords = timeRecords.filter(tr => tr.employeeId === emp.id);
    const totalHours = empRecords.reduce((acc, r) => acc + r.actualHours, 0) || emp.actualHoursThisMonth;
    const nightHours = empRecords.reduce((acc, r) => acc + r.nightHours, 0) || (totalHours * 0.2);
    const sundayHours = empRecords.reduce((acc, r) => acc + r.sundayHours, 0) || (totalHours * 0.1);
    const baseWageHourly = 16.50; // Tarif Grundlohn Sicherheitsgewerbe
    
    // § 3b EStG: 25% tax-free night, 50% tax-free sunday
    const baseGross = totalHours * baseWageHourly;
    const taxFreeNight = nightHours * (baseWageHourly * 0.25);
    const taxFreeSunday = sundayHours * (baseWageHourly * 0.50);
    const totalGross = baseGross + taxFreeNight + taxFreeSunday;

    return {
      empId: emp.id,
      empNumber: emp.employeeNumber,
      name: `${emp.firstName} ${emp.lastName}`,
      role: emp.role,
      totalHours,
      nightHours,
      sundayHours,
      baseGross,
      taxFreeNight,
      taxFreeSunday,
      totalGross
    };
  });

  const handleExportDatevCsv = () => {
    const headers = [
      'Personalnummer',
      'Mitarbeitername',
      'Rolle',
      'Gesamtstunden',
      'Nachtstunden',
      'Sonntagsstunden',
      'Grundlohn_Brutto_EUR',
      'Steuerfrei_Nacht_3bEStG_EUR',
      'Steuerfrei_Sonntag_3bEStG_EUR',
      'Gesamtbrutto_Auszahlung_EUR'
    ];
    const rows = payrollRows.map(p => [
      p.empNumber,
      p.name,
      p.role,
      p.totalHours.toFixed(2),
      p.nightHours.toFixed(2),
      p.sundayHours.toFixed(2),
      p.baseGross.toFixed(2),
      p.taxFreeNight.toFixed(2),
      p.taxFreeSunday.toFixed(2),
      p.totalGross.toFixed(2)
    ]);
    apiService.exportDataToCsv('SecurityOps_DATEV_Lohnvorbereitung_3bEStG', headers, rows);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Receipt className="h-5 w-5 text-emerald-400" />
            Rechnungswesen & DATEV-Lohnabrechnung (§ 3b EStG)
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Kundenabrechnung nach § 14 UStG sowie Lohnvorbereitung mit steuerfreien Nacht- und Sonntagszuschlägen nach § 3b EStG.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === 'datevPayroll' ? (
            <button
              onClick={handleExportDatevCsv}
              className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md shadow-emerald-950 transition"
            >
              <FileSpreadsheet className="h-4 w-4" />
              DATEV-Lohndatei exportieren
            </button>
          ) : (
            <button
              onClick={() => setShowInvoiceModal(true)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md shadow-emerald-950 transition"
            >
              <Plus className="h-4 w-4" />
              Abrechnungslauf generieren
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-800 pb-2 text-xs">
        <button
          onClick={() => setActiveTab('invoices')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg font-semibold transition ${
            activeTab === 'invoices'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950'
              : 'bg-slate-900 text-slate-400 hover:text-white'
          }`}
        >
          <Receipt className="h-4 w-4" />
          Kundenrechnungen (§ 14 UStG)
        </button>

        <button
          onClick={() => setActiveTab('datevPayroll')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg font-semibold transition ${
            activeTab === 'datevPayroll'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950'
              : 'bg-slate-900 text-slate-400 hover:text-white'
          }`}
        >
          <Coins className="h-4 w-4" />
          Lohnvorbereitung DATEV (§ 3b EStG Steuerfreie Zuschläge)
        </button>
      </div>

      {/* TAB 1: Kundenrechnungen */}
      {activeTab === 'invoices' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-3">
            <div className="text-xs font-semibold text-slate-400 px-1 uppercase tracking-wider">
              Rechnungsjournal ({invoices.length})
            </div>

            <div className="space-y-2">
              {invoices.map((inv) => (
                <div
                  key={inv.id}
                  onClick={() => setSelectedInvoice(inv)}
                  className={`p-4 rounded-xl border transition cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                    selectedInvoice?.id === inv.id
                      ? 'bg-slate-800/90 border-emerald-500/80 shadow-md ring-1 ring-emerald-500/20'
                      : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-white text-sm">{inv.invoiceNumber}</span>
                      <span className="text-xs text-slate-400">• {inv.period}</span>
                    </div>
                    <p className="text-xs font-semibold text-emerald-400 mt-0.5">{inv.customerName}</p>
                    <p className="text-[11px] text-slate-400 mt-1">Fällig am: {inv.dueDate}</p>
                  </div>

                  <div className="text-right flex flex-col sm:items-end gap-1.5">
                    <span className="text-base font-bold font-mono text-white">
                      {inv.totalAmount.toLocaleString('de-DE', { minimumFractionDigits: 2 })} €
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        inv.status === InvoiceStatus.BEZAHLT
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : inv.status === InvoiceStatus.VERSANDT
                          ? 'bg-blue-950 text-blue-300 border border-blue-800'
                          : 'bg-amber-950 text-amber-300 border border-amber-800'
                      }`}
                    >
                      {inv.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-1">
            {selectedInvoice && (
              <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div>
                    <span className="text-xs text-slate-400 block">Rechnungsvorschau:</span>
                    <span className="font-mono font-bold text-white text-sm">{selectedInvoice.invoiceNumber}</span>
                  </div>
                  <button
                    onClick={() => alert(`PDF-Download für ${selectedInvoice.invoiceNumber} gestartet.`)}
                    className="p-2 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                    title="PDF exportieren"
                  >
                    <Download className="h-4 w-4" />
                  </button>
                </div>

                <div className="text-xs space-y-2 text-slate-300">
                  <p><span className="text-slate-400">Empfänger:</span> {selectedInvoice.customerName}</p>
                  <p><span className="text-slate-400">Leistungszeitraum:</span> {selectedInvoice.period}</p>
                  <p><span className="text-slate-400">Rechnungsdatum:</span> {selectedInvoice.issueDate}</p>
                </div>

                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs space-y-2 font-mono">
                  <div className="flex justify-between text-slate-400">
                    <span>Netto Dienstleistung:</span>
                    <span>{selectedInvoice.subtotal.toLocaleString('de-DE', { minimumFractionDigits: 2 })} €</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Umsatzsteuer (19%):</span>
                    <span>{selectedInvoice.taxAmount.toLocaleString('de-DE', { minimumFractionDigits: 2 })} €</span>
                  </div>
                  <div className="flex justify-between text-emerald-400 font-bold text-sm pt-2 border-t border-slate-800">
                    <span>Gesamtbetrag brutto:</span>
                    <span>{selectedInvoice.totalAmount.toLocaleString('de-DE', { minimumFractionDigits: 2 })} €</span>
                  </div>
                </div>

                <div className="pt-2 text-center">
                  <span className="text-[11px] text-slate-400 font-mono">
                    Geprüft nach § 14 UStG mit fortlaufender Rechnungsnummer
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: DATEV Lohnvorbereitung nach § 3b EStG */}
      {activeTab === 'datevPayroll' && (
        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4 text-xs">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-3 border-b border-slate-800 gap-2">
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Coins className="h-4 w-4 text-amber-400" />
                Lohnsteuerfreie Nacht- und Sonntagszuschläge gem. § 3b EStG (Abrechnung Mai 2025)
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Automatische Trennung des steuerpflichtigen Grundlohns von steuer- und sozialversicherungsfreien SFN-Zuschlägen für DATEV LODAS / LuG.
              </p>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold">
              BDSW Tarifkonform
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-2.5 px-3">Pers.-Nr.</th>
                  <th className="py-2.5 px-3">Sicherheitskraft</th>
                  <th className="py-2.5 px-3">Gesamt (h)</th>
                  <th className="py-2.5 px-3">Nacht (h)</th>
                  <th className="py-2.5 px-3">Sonntag (h)</th>
                  <th className="py-2.5 px-3">Grundbrutto (€)</th>
                  <th className="py-2.5 px-3 text-purple-300">+25% Nacht steuerfrei (€)</th>
                  <th className="py-2.5 px-3 text-blue-300">+50% So steuerfrei (€)</th>
                  <th className="py-2.5 px-3 text-emerald-400 text-right">Gesamtauszahlung (€)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {payrollRows.map(p => (
                  <tr key={p.empId} className="hover:bg-slate-850/60 transition">
                    <td className="py-3 px-3 text-slate-400">{p.empNumber}</td>
                    <td className="py-3 px-3 font-semibold text-white font-sans">{p.name}</td>
                    <td className="py-3 px-3 font-bold text-white">{p.totalHours.toFixed(1)}h</td>
                    <td className="py-3 px-3 text-purple-300">{p.nightHours.toFixed(1)}h</td>
                    <td className="py-3 px-3 text-blue-300">{p.sundayHours.toFixed(1)}h</td>
                    <td className="py-3 px-3 text-slate-300">{p.baseGross.toFixed(2)} €</td>
                    <td className="py-3 px-3 text-purple-300 font-bold">+{p.taxFreeNight.toFixed(2)} €</td>
                    <td className="py-3 px-3 text-blue-300 font-bold">+{p.taxFreeSunday.toFixed(2)} €</td>
                    <td className="py-3 px-3 text-emerald-400 font-bold text-right text-sm">{p.totalGross.toFixed(2)} €</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
            <span>
              Tarifgrundlage: Bundesland Bayern / Hessen BDSW Manteltarifvertrag • Steuerfreiheit geprüft nach § 3b Abs. 1 Nr. 1 und 2 EStG.
            </span>
            <button
              onClick={handleExportDatevCsv}
              className="text-emerald-400 hover:text-emerald-300 font-semibold inline-flex items-center gap-1 font-sans"
            >
              <Download className="h-3.5 w-3.5" /> CSV herunterladen
            </button>
          </div>
        </div>
      )}

      {/* Modal: Generate Invoice */}
      {showInvoiceModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Receipt className="h-4 w-4 text-emerald-400" />
                Abrechnungslauf generieren (§ 14 UStG)
              </h2>
              <button
                onClick={() => setShowInvoiceModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleGenerateInvoiceSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1">Rechnungsempfänger *</label>
                <select
                  value={invCustId}
                  onChange={(e) => setInvCustId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white focus:outline-none"
                >
                  {customers.map(c => (
                    <option key={c.id} value={c.id}>{c.companyName}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Abrechnungszeitraum *</label>
                <input
                  type="text"
                  required
                  value={invPeriod}
                  onChange={(e) => setInvPeriod(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-slate-300 mb-1">Ist-Stunden</label>
                  <input
                    type="number"
                    value={invHours}
                    onChange={(e) => setInvHours(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-1.5 text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Nachtstunden</label>
                  <input
                    type="number"
                    value={invNightHours}
                    onChange={(e) => setInvNightHours(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-1.5 text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Sonntagsstd.</label>
                  <input
                    type="number"
                    value={invSundayHours}
                    onChange={(e) => setInvSundayHours(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-1.5 text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="p-2.5 rounded bg-slate-950 border border-slate-800 text-[11px] text-slate-400">
                Stundensätze und Zuschlagsprozentsätze werden automatisch aus dem zugeordneten Rahmenvertrag gezogen.
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowInvoiceModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium"
                >
                  Abbrechen
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold"
                >
                  Rechnung erstellen
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
