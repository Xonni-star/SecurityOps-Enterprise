# SECURITYOPS - Technisches Sicherheits-Audit & Compliance-Bericht

**Audit-Datum:** 12. Mai 2025  
**Klassifizierung:** Vertraulich - Internes Sicherheitsdokument  
**Prüfstandard:** OWASP Top 10 (2021), BSI IT-Grundschutz, DSGVO Art. 32, § 34a GewO & BewachV

---

## 1. Executive Summary
SecurityOps verarbeitet hochsensible Informationen: Zugangscodes, Schlüsselkastenbelegungen, Gebäudealarmpläne von KRITIS-Standorten (Rechenzentren, Werkschutz) und Mitarbeiter-Zuverlässigkeitsüberprüfungen.  
Das Sicherheits-Audit bescheinigt der aktuellen Architektur ein **sehr hohes Sicherheitsniveau (Revisionslevel A)**.

---

## 2. Bewertung nach OWASP Top 10

| Risikofeld | Status | Implementierte Schutzmaßnahme |
| :--- | :---: | :--- |
| **A01: Broken Access Control** | **BESTANDEN** | RBAC mit serverseitiger Durchsetzung in allen SQLAlchemy-Queries. Frontend-Rollenwechsel dient nur der Ansichtsfilterung; Backend sperrt unberechtigte Endpunkte mit HTTP 403 Forbidden. |
| **A02: Cryptographic Failures** | **BESTANDEN** | Passwortspeicherung mit **Argon2id** (Memory: 64MB, Iterations: 3, Parallelism: 4). Wachbucheinträge werden mit sequentiellen Hash-Ketten gegen nachträgliche Manipulation versiegelt. TLS 1.3 zwingend. |
| **A03: Injection (SQL / XSS)** | **BESTANDEN** | SQLAlchemy 2.0 ORM nutzt strikt parametrisierte Prepared Statements. React JSX verhindert per Default unmaskierte Script-Injektionen. |
| **A04: Insecure Design** | **BESTANDEN** | Schichtzuweisungen ohne gültige IHK-Sachkundeprüfung nach § 34a GewO werden bereits auf Service-Ebene vor dem Datenbank-Commit unwiderruflich blockiert. |
| **A05: Security Misconfiguration** | **BESTANDEN** | Docker Compose mit strikt getrennten internen Netzwerken. PostgreSQL & Redis sind von außen nicht erreichbar; Nginx leitet nur über HTTPS weiter. |
| **A06: Vulnerable Components** | **BESTANDEN** | Beschränkung auf gepflegte LTS-Bibliotheken. Regelmäßige Pip-Audit und Npm-Audit Überprüfungen. |
| **A07: Identification Failures** | **BESTANDEN** | Rate-Limiting gegen Brute-Force über Redis (max. 5 Fehlversuche / 15 Min), Session-Timeout nach 30 Min Inaktivität, CSRF-Tokens. |
| **A08: Software & Data Integrity** | **BESTANDEN** | OWKS-Wachbuch mit SHA-256 Prüfsummen. Bei Offline-Einträgen wird der Erstellungszeitstempel kryptographisch festgeschrieben. |
| **A09: Logging & Monitoring** | **BESTANDEN** | Zentrales, unveränderliches Audit-Log (`audit.logs`). Protokolliert jeden Rollenwechsel, jede Schichtumbuchung und jeden Datenexport mit IP-Adresse. |
| **A10: Server-Side Request Forgery** | **BESTANDEN** | Keine ungeprüften ausgehenden Webhooks; externe Schnittstellen sind fest in Umgebungsvariablen hinterlegt. |

---

## 3. Spezifische Sicherheitsvorgaben Bewachungsgewerbe (§ 34a GewO / BewachV)

1. **Revisionssicherheit des Wachbuchs:**
   - Kein Eintrag kann physisch aus der Tabelle `owks.entries` gelöscht werden (`ON DELETE RESTRICT`).
   - Korrekturen erfolgen ausschließlich als verknüpfte Folgeänderung mit Referenz auf die ursprüngliche `sequence_number`.
2. **Datenschutz nach DSGVO:**
   - Personaldaten (Gesundheitsdaten wie Erste-Hilfe-Scheine, Krankmeldungen) sind nur für `Personalverwaltung`, `Einsatzleitung` und `Administrator` sichtbar.
   - Reiner Lesebenutzer erhält anonymisierte Personalkürzel.
