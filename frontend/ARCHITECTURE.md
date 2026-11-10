# SECURITYOPS - Technische Systemarchitektur (ARCHITECTURE.md)

**Systemtyp:** Modularer Monolith  
**Backend:** Python 3.12+, FastAPI 0.115+, SQLAlchemy 2.0 Async, Pydantic v2, Alembic  
**Frontend:** React 19, TypeScript, Tailwind CSS, Recharts, Lucide Icons, Zustand  
**Datenbank:** PostgreSQL 16.4 (10 fachliche Schemata, UUIDv4 Primary Keys)  
**In-Memory & Background:** Redis 7 (Token Blacklisting, Rate Limiting), Celery 5.4 (Worker & Beat Scheduler)  
**Infrastruktur:** Docker Compose, Linux, Nginx (Reverse Proxy, TLS 1.3, CSP)

---

## 1. Modulare Monolithen-Architektur

SecurityOps vermeidet unnötige Microservice-Latenzen und setzt auf einen hochgradig entkoppelten, modularen Monolithen mit klar definierten Schichten:

```
                    +------------------------------------+
                    |        Client (Browser / PWA)      |
                    | React 19 + TypeScript + Zustand    |
                    +-----------------+------------------+
                                      |
                                HTTPS / WSS
                                      v
                    +-----------------+------------------+
                    |    Nginx Reverse Proxy & TLS 1.3   |
                    | Rate Limiting, CSP & CSRF Enforcing|
                    +-----------------+------------------+
                                      |
                         /api/v1/ (REST & SSE)
                                      v
+-------------------------------------+-------------------------------------+
|                  FastAPI Backend Application Core                         |
|                                                                           |
|  [IAM / RBAC]    [CRM Service]   [OPS Service]     [OWKS Service]         |
|  Argon2id Auth   Kundenakten     Objekte & Schicht Wachbuch mit SHA-256   |
|                                                                           |
|  [Workforce]     [Billing]       [QM Service]      [Docs DMS]             |
|  §34a & DGUV     UStG Rechnungen DIN 77200 Audits  Alarmpläne & DA         |
|                                                                           |
|  [ArbZG Engine]  [Audit Logger]  [Reporting]       [Dispatch Hub]         |
|  Ruhezeit/10h    Append-Only Log CSV/PDF Exporte   DMR Funk / Tickets     |
+-------------------+-----------------------------------+-------------------+
                    |                                   |
         Async SQLAlchemy 2.0                     Celery Task Broker
                    v                                   v
+-------------------+-------------------+   +-----------+-----------+
|      PostgreSQL 16 Enterprise         |   |     Redis 7 Cache     |
|                                       |   |                       |
|  Schemata:                            |   | - Session Tokens      |
|  - core       - workforce             |   | - Rate Limiting       |
|  - iam        - owks                  |   | - Celery Broker       |
|  - crm        - billing               |   +-----------+-----------+
|  - ops        - docs                  |               |
|  - audit      - qm                    |   +-----------v-----------+
+---------------------------------------+   | Celery Worker & Beat  |
                                            | - Zertifikats-Scanner |
                                            | - Rechnungs-Lauf      |
                                            | - Alarm-Push          |
                                            +-----------------------+
```

---

## 2. PostgreSQL 16 Schematrennung

1. **`core`**: Benutzerstammdaten, Mandantenbasis (Single-Tenant Unternehmenssystem), Systemeinstellungen.
2. **`iam`**: Rollen, Berechtigungen (RBAC), API-Tokens, Password-Hashes (Argon2id).
3. **`crm`**: Kundenakten, Rechnungsadressen, Notfall-Ansprechpartner, KRITIS-Klassifizierung.
4. **`ops`**: Schutzobjekte, Schichtmodelle, Deister-Kontrollpunkte (NFC/QR), Schichtpläne.
5. **`workforce`**: Mitarbeiter, IHK § 34a GewO Sachkundenachweise, DGUV Ersthelfer, Arbeitszeitkonten.
6. **`owks`**: Online-Wachbuch, Ereignisse, Alarme, Schichtübergaben, SHA-256 Prüfsummen.
7. **`billing`**: Bewachungsverträge, Stundensätze, Nacht/Sonntagszuschläge, Rechnungen nach § 14 UStG.
8. **`docs`**: Dokumentenarchiv (Dienstanweisungen, Alarmpläne, Unterweisungsnachweise).
9. **`qm`**: DIN 77200 & ISO 9001 Auditberichte, Mängelkatalog, Abstellmaßnahmen.
10. **`audit`**: Unveränderliches Revisionslogbuch (Append-Only) mit IP-Adresse und Benutzerbezug.

---

## 3. Sicherheitsarchitektur & Rechtskonformität
- **§ 34a GewO / BewachV:** Serverseitige Sperre von Schichtzuteilungen, wenn kein gültiger IHK-Nachweis vorliegt.
- **Arbeitszeitgesetz (ArbZG):** Max. 10h Schichtdauer, min. 11h gesetzliche Ruhezeit zwischen zwei Schichten.
- **Wachbuch-Integrität:** Jeder Eintrag wird mit Hash-Verkettung versiegelt; kein physischer `DELETE`-Vorgang gestattet.
