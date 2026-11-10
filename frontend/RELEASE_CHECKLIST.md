# SECURITYOPS - Formale Release-Checkliste (RELEASE_CHECKLIST.md)

**Systemversion:** v3.1.0-ENTERPRISE-CONSOLIDATED-FINAL  
**Status:** **RELEASE-CANDIDATE BEREIT FÜR PRODUKTIVSCHALTUNG**  
**Gültig ab:** Phase 9: Gesamtkonsolidierung

---

## 1. Qualitätstore vor Freigabe (Quality Gateways)

### Gateway 1: Code- & Typintegrität
- [x] TypeScript-Kompilierung ohne Fehler (`tsc --noEmit`).
- [x] Keine zirkulären Abhängigkeiten zwischen Modulen.
- [x] Bereinigte Import-Pfade und standardisierte ESM-Module.

### Gateway 2: Rechtliche & Regulatorische Compliance
- [x] **§ 34a GewO / BewachV:** Zwingende serverseitige Zuweisungssperre für Schutzobjekte Stufe 2-4 bei fehlendem IHK-Nachweis.
- [x] **ArbZG § 3:** Schichten > 10 Stunden werden automatisch verweigert.
- [x] **ArbZG § 5:** Mindestruhezeit von 11 Stunden zwischen zwei Diensten wird validiert.
- [x] **OWKS Revisionssicherheit:** Fortlaufende Sequenznummern, kryptographische SHA-256 Block-Hashes, Löschsperre (`ON DELETE RESTRICT`).
- [x] **UStG § 14:** Prüffähige Rechnungen mit Steuernummer, Leistungszeitraum und Aufschlüsselung steuerfreier Zuschläge (§ 3b EStG).

### Gateway 3: Datenbank & Migrationen
- [x] Alle 10 PostgreSQL Schemata intakt (`core, iam, crm, ops, workforce, owks, billing, docs, qm, audit`).
- [x] Alembic Migrationen auf Stand `head`.
- [x] Desaster-Recovery-Wiederherstellungsprobe mit `pg_restore` erfolgreich (0% Datenverlust).

### Gateway 4: Sicherheit & Zugriffsschutz
- [x] Argon2id Passwort-Hashing aktiv (64 MB Memory, 3 Iterationen, 4 Threads).
- [x] Role-Based Access Control (RBAC) für alle 10 Benutzerrollen serverseitig enforcet.
- [x] Append-Only Revisions-Auditlogger protokolliert IP-Adressen und Benutzerbezüge.
- [x] Nginx Reverse Proxy mit TLS 1.3, HSTS und Content-Security-Policy (CSP).

### Gateway 5: Formale Produktivfreigabe
- [ ] **Ausdrückliche Freigabeerteilung durch Geschäftsführung / Auftraggeber** (Wartet reglementskonform auf Genehmigung).
