import React, { useState } from 'react';
import {
  Building2,
  Plus,
  Phone,
  Mail,
  MapPin,
  Shield,
  FileText,
  Search,
  CheckCircle,
  ExternalLink
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { Customer } from '../types';

export const CrmView: React.FC = () => {
  const { customers, addCustomer, searchQuery } = useAppStore();
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(customers[0] || null);
  const [showAddModal, setShowAddModal] = useState(false);

  // New customer form state
  const [formCompany, setFormCompany] = useState('');
  const [formLegal, setFormLegal] = useState('GmbH');
  const [formAddress, setFormAddress] = useState('');
  const [formCity, setFormCity] = useState('');
  const [formPlz, setFormPlz] = useState('');
  const [formContactName, setFormContactName] = useState('');
  const [formContactPhone, setFormContactPhone] = useState('');
  const [formContactEmail, setFormContactEmail] = useState('');
  const [formCategory, setFormCategory] = useState<Customer['category']>('A-Kunde');
  const [formNotes, setFormNotes] = useState('');

  const filteredCustomers = customers.filter(c => {
    const q = searchQuery.toLowerCase();
    return (
      c.companyName.toLowerCase().includes(q) ||
      c.customerNumber.toLowerCase().includes(q) ||
      c.city.toLowerCase().includes(q)
    );
  });

  const handleCreateCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formCompany || !formCity) return;

    addCustomer({
      companyName: formCompany,
      legalForm: formLegal,
      address: formAddress,
      postalCode: formPlz,
      city: formCity,
      contactPersons: [
        {
          id: `cp-${Date.now()}`,
          name: formContactName || 'Ansprechpartner Zentrale',
          role: 'Sicherheitsverantwortlicher',
          phone: formContactPhone || '+49 000 0000',
          email: formContactEmail || 'kontakt@kunde.de',
          isPrimary: true
        }
      ],
      billingEmail: formContactEmail || 'rechnung@kunde.de',
      category: formCategory,
      status: 'Aktiv',
      assignedObjectCount: 0,
      activeContractsCount: 1,
      notes: formNotes || 'Neuer Kunde über Leitsystem angelegt.'
    });

    setShowAddModal(false);
    // reset
    setFormCompany('');
    setFormAddress('');
    setFormCity('');
    setFormPlz('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Building2 className="h-5 w-5 text-emerald-400" />
            Kundenverwaltung / CRM (Digitale Kundenakte)
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Automatisierte Kundennummern, Rechnungsanschriften, KRITIS-Klassifizierung und Vertragszuordnung.
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md shadow-emerald-950 transition"
        >
          <Plus className="h-4 w-4" />
          Neuen Kunden anlegen
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Customer List */}
        <div className="lg:col-span-1 space-y-3">
          <div className="text-xs font-semibold text-slate-400 px-1 uppercase tracking-wider">
            Kundenverzeichnis ({filteredCustomers.length})
          </div>

          <div className="space-y-2 overflow-y-auto max-h-[640px] pr-1">
            {filteredCustomers.map((cust) => {
              const isSelected = selectedCustomer?.id === cust.id;
              return (
                <div
                  key={cust.id}
                  onClick={() => setSelectedCustomer(cust)}
                  className={`p-3.5 rounded-xl border transition cursor-pointer ${
                    isSelected
                      ? 'bg-slate-800/90 border-emerald-500/80 shadow-md ring-1 ring-emerald-500/20'
                      : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="font-semibold text-white text-sm">{cust.companyName}</span>
                      <span className="text-xs text-slate-400 ml-1">({cust.legalForm})</span>
                    </div>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                        cust.category === 'KRITIS'
                          ? 'bg-purple-950 text-purple-300 border border-purple-800'
                          : 'bg-slate-800 text-slate-300 border border-slate-700'
                      }`}
                    >
                      {cust.category}
                    </span>
                  </div>

                  <div className="mt-2 text-xs text-slate-400 flex items-center gap-2">
                    <MapPin className="h-3 w-3 text-slate-400 shrink-0" />
                    <span className="truncate">{cust.postalCode} {cust.city}</span>
                  </div>

                  <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                    <span className="font-mono">{cust.customerNumber}</span>
                    <span className="text-emerald-400">{cust.assignedObjectCount} Objekt(e) aktiv</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Customer Dossier */}
        <div className="lg:col-span-2">
          {selectedCustomer ? (
            <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 space-y-6">
              {/* Dossier Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-5 border-b border-slate-800 gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-white">
                      {selectedCustomer.companyName} {selectedCustomer.legalForm}
                    </h2>
                    <span className="px-2 py-0.5 text-xs rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                      {selectedCustomer.status}
                    </span>
                  </div>
                  <p className="text-xs font-mono text-slate-400 mt-1">
                    Kundennummer: <span className="text-slate-200">{selectedCustomer.customerNumber}</span> • Erstellt: {selectedCustomer.createdDate}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded bg-slate-800 text-slate-300 text-xs font-mono border border-slate-700">
                    Kategorie: {selectedCustomer.category}
                  </span>
                </div>
              </div>

              {/* Grid with Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {/* Address block */}
                <div className="p-4 rounded-lg bg-slate-950/70 border border-slate-800 space-y-2">
                  <span className="font-semibold text-slate-300 uppercase text-[10px] tracking-wider">Unternehmensanschrift</span>
                  <p className="text-slate-200">{selectedCustomer.address}</p>
                  <p className="text-slate-200">{selectedCustomer.postalCode} {selectedCustomer.city}</p>
                  <p className="text-slate-400 pt-1 text-[11px]">Rechnungs-E-Mail: <span className="text-emerald-400">{selectedCustomer.billingEmail}</span></p>
                </div>

                {/* Operations Info */}
                <div className="p-4 rounded-lg bg-slate-950/70 border border-slate-800 space-y-2">
                  <span className="font-semibold text-slate-300 uppercase text-[10px] tracking-wider">Sicherheitsstatus</span>
                  <div className="flex items-center justify-between text-slate-300">
                    <span>Geregelte Objekte:</span>
                    <span className="font-bold text-white">{selectedCustomer.assignedObjectCount} Standort(e)</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-300">
                    <span>Laufende Rahmenverträge:</span>
                    <span className="font-bold text-white">{selectedCustomer.activeContractsCount} Vertrag</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-300">
                    <span>Wachdienst:</span>
                    <span className="text-emerald-400 font-medium">24/7 Schichtsystem</span>
                  </div>
                </div>
              </div>

              {/* Ansprechpartner */}
              <div>
                <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Verantwortliche Ansprechpartner
                </h3>
                <div className="space-y-2">
                  {selectedCustomer.contactPersons.map((cp) => (
                    <div
                      key={cp.id}
                      className="p-3 rounded-lg bg-slate-950 border border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs gap-2"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-white">{cp.name}</span>
                          {cp.isPrimary && (
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                              Hauptkontakt
                            </span>
                          )}
                        </div>
                        <p className="text-slate-400 text-[11px]">{cp.role}</p>
                      </div>

                      <div className="flex items-center gap-4 text-slate-300 text-xs">
                        <span className="flex items-center gap-1 hover:text-emerald-400 cursor-pointer">
                          <Phone className="h-3 w-3 text-slate-400" /> {cp.phone}
                        </span>
                        <span className="flex items-center gap-1 hover:text-emerald-400 cursor-pointer">
                          <Mail className="h-3 w-3 text-slate-400" /> {cp.email}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Internal Notes */}
              <div>
                <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Sicherheitsrelevante Notizen & Dienstanweisungs-Auszug
                </h3>
                <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300 leading-relaxed font-mono">
                  {selectedCustomer.notes}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 rounded-xl bg-slate-900 border border-slate-800 text-center text-slate-400 text-xs">
              Wählen Sie einen Kunden aus der linken Liste aus.
            </div>
          )}
        </div>
      </div>

      {/* Modal: New Customer */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <h2 className="text-base font-bold text-white">Neuen Kunden in CRM aufnehmen</h2>
            <form onSubmit={handleCreateCustomer} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1">Firmenname *</label>
                <input
                  type="text"
                  required
                  placeholder="z.B. Siemens Logistics Hub"
                  value={formCompany}
                  onChange={(e) => setFormCompany(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1">Rechtsform</label>
                  <select
                    value={formLegal}
                    onChange={(e) => setFormLegal(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white focus:outline-none"
                  >
                    <option value="GmbH">GmbH</option>
                    <option value="AG">AG</option>
                    <option value="SE">SE</option>
                    <option value="GmbH & Co. KG">GmbH & Co. KG</option>
                    <option value="e.V. / Körperschaft">e.V. / Körperschaft</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Kategorie</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as Customer['category'])}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white focus:outline-none"
                  >
                    <option value="A-Kunde">A-Kunde (Premium)</option>
                    <option value="B-Kunde">B-Kunde</option>
                    <option value="C-Kunde">C-Kunde</option>
                    <option value="KRITIS">KRITIS (Kritische Infrastruktur)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2">
                  <label className="block text-slate-300 mb-1">Straße & Hausnr.</label>
                  <input
                    type="text"
                    placeholder="Industriestr. 12"
                    value={formAddress}
                    onChange={(e) => setFormAddress(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">PLZ / Ort *</label>
                  <input
                    type="text"
                    required
                    placeholder="80331 München"
                    value={formCity}
                    onChange={(e) => setFormCity(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="border-t border-slate-800 pt-3 space-y-2">
                <span className="font-semibold text-slate-400 uppercase text-[10px]">Hauptansprechpartner</span>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Name des Kontakts"
                    value={formContactName}
                    onChange={(e) => setFormContactName(e.target.value)}
                    className="bg-slate-950 border border-slate-700 rounded-lg p-2 text-white focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Telefonnummer"
                    value={formContactPhone}
                    onChange={(e) => setFormContactPhone(e.target.value)}
                    className="bg-slate-950 border border-slate-700 rounded-lg p-2 text-white focus:outline-none"
                  />
                </div>
                <input
                  type="email"
                  placeholder="E-Mail für Rechnungen / Kontakt"
                  value={formContactEmail}
                  onChange={(e) => setFormContactEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Sicherheitsanweisungen & Notizen</label>
                <textarea
                  rows={2}
                  placeholder="Besondere Gefährdungsmerkmale, Pfortenregelung..."
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white focus:outline-none"
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
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold"
                >
                  In Datenbank speichern
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
