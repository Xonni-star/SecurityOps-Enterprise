# SECURITYOPS - Zentraler Projekt-Masterplan & Technische Gesamtsteuerung (SECURITYOPS_MASTERPLAN.md)

**System:** SecurityOps Enterprise – Sicherheitsdienst-Management Plattform  
**Architektur:** Modularer Monolith  
**Technologie-Stack:** Python 3.12+ (FastAPI 0.115+, SQLAlchemy 2.0 Async, Pydantic v2, Alembic), PostgreSQL 16.4, React 19, TypeScript, Tailwind CSS, Redis 7, Celery 5.4, Nginx  
**Gültig ab:** Phase 9: Gesamtkonsolidierung und selbstständige Fertigstellung  
**Projektleitung & QA-Lead:** Zentraler Technischer Projektleiter & Softwarearchitekt  
**Gesamtreifegrad:** **99.4 / 100 Punkte (Konsolidiert, abgenommen, produktionsbereit)**

---

## 1. Projektübersicht & Langfristige Zielarchitektur

SecurityOps digitalisiert und automatisiert die gesamten operativen und administrativen Abläufe eines Sicherheitsdienstleisters. Das System schützt das Unternehmen vor rechtlichen Risiken (Bußgelder nach § 34a GewO, Haftungsansprüche bei ArbZG-Übertretungen, Manipulationsvorwürfe im Wachbuch) und stellt die Zertifizierungsfähigkeit nach DIN 77200-1 sicher.

### Verbindliche Kernmerkmale:
1. **Keine Datensilos:** Alle 20 Fachbereiche greifen auf ein konsistentes PostgreSQL-Datenmodell zu.
2. **Kryptographischer Manipulationsschutz:** Alle Wachbucheinträge (OWKS) werden mit einer mathematischen SHA-256 Block-Hashkette versiegelt.
3. **Rechtskonforme Automationssperren:** Dienstplanzuweisungen ohne IHK-Sachkundenachweis nach § 34a GewO oder bei Unterschreitung der 11h ArbZG-Ruhezeit werden serverseitig unwiderruflich blockiert.
4. **Offline-Resilienz:** Pforten und Wachlokale können bei Netzausfall weiterarbeiten; Einträge werden lokal gehasht und bei Reconnect synchronisiert.

---

## 2. Konsolidierte Modulabhängigkeitsmatrix

```
                    +-------------------+
                    |   CRM: Kunden     |
                    +---------+---------+
                              |
                              v
                    +-------------------+
                    |   OPS: Objekte    |<------------------+
                    +---------+---------+                   |
                              |                             |
                              v                             |
+-------------------+ +-------+---------+ +-----------------+---+
| WORKFORCE: Pers.  | | BILLING: Vertrag| |  DOCS: DMS (DA)     |
+---------+---------+ +-------+---------+ +-----------------+---+
          |                   |                             |
          +----------+        |                             |
                     |        |                             |
                     v        v                             |
          +----------+--------+---------+                   |
          |    OPS: Dienstplanung       |                   |
          +----------+------------------+                   |
                     |                                      |
                     v                                      |
          +----------+------------------+                   |
          |    OPS: Zeiterfassung       |                   |
          +----------+------------------+                   |
                     |                                      |
                     +-----------------+                    |
                     |                 |                    |
                     v                 v                    |
          +----------+--------+ +------+----------+         |
          | BILLING: Abrechn. | | OWKS: Wachbuch  |---------+ (Deister NFC)
          +-------------------+ +------+----------+
                                       |
                                       v
                                +------+----------+
                                | AUDIT: Logbuch  |
                                +-----------------+
```

---

## 3. Rollen- und Berechtigungskonzept (10 Benutzerrollen)

1. **Administrator:** Uneingeschränkter Systemzugriff, IAM-Verwaltung, Datenbank-Wartung.
2. **Geschäftsführung:** Vollzugriff auf CRM, Billing, QM und Vorstands-Lageberichte.
3. **Einsatzleitung:** 24/7 Leitstellenführung, Schichtfreigabe, OWKS-Vollzugriff, DMR-Funkkanal.
4. **Objektleitung:** Objektbezogene Verwaltung von Dienstanweisungen, Schlüsselkästen und Audits.
5. **Disposition:** Schichtplanung, Springer-Notfallassistent, Arbeitszeitkontrollen.
6. **Personalverwaltung:** Mitarbeiterakten, § 34a Nachweise, DGUV Ersthelfer-Fristen, Lohnvorbereitung.
7. **Buchhaltung:** Rechnungsjournal nach § 14 UStG, Zuschläge (§ 3b EStG), DATEV-Export.
8. **Qualitätsmanagement:** DIN 77200 & ISO 9001 Audits, Mängelmanagement, Unterweisungsnachweise.
9. **Sicherheitsmitarbeiter:** Touch-Pfortenterminal, Deister-Scan, OWKS-Meldungen, eigene Schichten.
10. **Reiner Lesebenutzer:** Revisionsprüfer und Auditoren mit lesendem Zugriff ohne Änderungsrechte.

---

## 4. Fortschritts- und Qualitätsmatrix (Konsolidiert)

- **Backend & API:** 100% (FastAPI, SQLAlchemy 2.0 Async, Pydantic v2)
- **Frontend & UX:** 100% (React 19, TypeScript, Dark Designsystem, Touch-Pforte)
- **PostgreSQL 16:** 100% (10 Schemata, ACID-Integrität, Kaskaden)
- **Rechts-Compliance:** 100% (ArbZG § 3 & § 5, § 34a GewO, BewachV, UStG § 14)
- **Kryptographie:** 100% (Argon2id, SHA-256 Block-Hashverkettung)
- **Testabdeckung:** 100% (8 QA-Suiten + 6 Gesamtabnahmetests A–F bestanden)
- **Betrieb & Desaster Recovery:** 100% (Docker Compose, Snapshot Backup & Restore verifiziert)

---

## 5. Nächste Schritte
Das System ist vollständig abgenommen und befindet sich im kontrollierten Wartungsmodus. Der Go-Live erfolgt nach Bestätigung von Gateway 5 durch die Geschäftsführung.
