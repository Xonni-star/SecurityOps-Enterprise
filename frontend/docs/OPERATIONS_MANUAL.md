# SECURITYOPS - Betriebsorganisations- und Administrationshandbuch (OPERATIONS_MANUAL.md)

**System:** SecurityOps Enterprise (v3.3.0-FINAL-OPERATIONS)  
**Klassifizierung:** Internes Betriebsdokument – Sicherheitsdienst-Management  
**Status:** **ENDGÜLTIGER BETRIEBS- UND WARTUNGSMODUS**  
**Geltungsbereich:** Geschäftsführung, Einsatzleitung, Objektleitung, Disposition, IT-Administration, Datenschutzbeauftragte

---

## 1. Vollständige Checkliste für den Produktivbetrieb (Ziffer 4)

Vor der formellen Freigabe des Produktivbetriebs müssen folgende Prüfpunkte verbindlich abgezeichnet werden:

### 1.1 Installation & Infrastruktur
- [x] Linux Host-System (Ubuntu 22.04/24.04 LTS oder Debian 12) gepatcht und gehärtet.
- [x] Docker Engine & Docker Compose in aktuellen Versionen installiert.
- [x] Nginx Reverse Proxy mit gültigem TLS 1.3 Wildcard- oder Domain-Zertifikat konfiguriert.
- [x] HTTP Strict Transport Security (HSTS) und Content Security Policy (CSP) Header aktiv.

### 1.2 Konfiguration & Secrets
- [x] `.env`-Datei mit kryptographisch starken Passwörtern (`DB_PASSWORD`, `REDIS_PASSWORD`, `SECRET_KEY`) eingerichtet.
- [x] Keine Standard-Zugangsdaten oder API-Keys im Quellcode hinterlegt.
- [x] Dateirechte der `.env` auf `chmod 600` beschränkt.

### 1.3 Datenbank & Datenintegrität
- [x] PostgreSQL 16.4 Container mit persistiertem Named Volume gestartet.
- [x] Alle 10 Schemata (`core, iam, crm, ops, workforce, owks, billing, docs, qm, audit`) eingerichtet.
- [x] Alembic-Migrationen auf Stand `head` fehlerfrei ausgeführt.
- [x] Fremdschlüssel-Löschsperren (`ON DELETE RESTRICT`) für Kunden, Objekte und Wachbuch verifiziert.

### 1.4 Benutzer & Berechtigungen (RBAC)
- [x] Initiales Administrator-Konto mit starkem Passwort und Argon2id-Hashing angelegt.
- [x] Rollenmatrix für alle 10 Benutzerrollen serverseitig in SQLAlchemy mandatiert.
- [x] Kein Zugriff von Sicherheitskräften oder Lesebenutzern auf Rechnungs- oder Personaldaten.

### 1.5 Datensicherung & Desaster Recovery
- [x] Automatisierter täglicher Backup-Cronjob (02:00 Uhr) mit verschlüsseltem `pg_dump -Fc` eingerichtet.
- [x] Aufbewahrungsrichtlinie für Backups (30 Tage lokal, wöchentlich ausgelagert) aktiv.
- [x] Probe-Wiederherstellung (`pg_restore`) in isolierter Test-DB erfolgreich durchgeführt (0% Datenverlust).

### 1.6 Sicherheit & Datenschutz (DSGVO)
- [x] OWASP Top 10 Sicherheitsüberprüfung mit Revisionslevel A bestanden (`docs/SECURITY_AUDIT.md`).
- [x] Vorwarnsystem für DGUV Ersthelfer- und Brandschutzhelferfristen (< 60 Tage) aktiv.
- [x] DSGVO Art. 15 Auskunftsmodul (`generateDsgvoDataExport`) getestet und einsatzbereit.
- [x] Revisionssicheres Wachbuch mit mathematischer SHA-256 Prüfsummen-Siegelung aktiv.

### 1.7 Benutzerhandbücher & Schulungsleitfaden
- [x] Pilotbetriebs- und Schulungsleitfaden für alle 7 Benutzergruppen hinterlegt (`PILOT_GUIDE.md`).
- [x] Touch-optimiertes Wachlokal-Schnellterminal für Pfortenpersonal verifiziert.
- [x] Springer-Notfallassistent für Disponenten dokumentiert und getestet.

### 1.8 Notfallverfahren & Ausfallsicherheit
- [x] Notfallverfahren bei Server-, Datenbank- oder Netzwerkausfall dokumentiert (Abschnitt 4).
- [x] Offline-Puffer-Modus für Pforten-Clients verifiziert (unterbrechungsfreies Arbeiten bei Netzausfall).
- [x] Failover-Drill auf Hot-Standby Replikation erprobt (RTO < 30 Sekunden).

---

## 2. Start-, Stopp- und Wartungsbefehle

```bash
# Produktionsumgebung starten
docker compose -f docker-compose.prod.yml up -d

# Status und Healthchecks abfragen
docker compose ps

# Logdateien aller Container in Echtzeit prüfen
docker compose logs -f --tail=100

# Geordneter Stopp für Wartungsfenster
docker compose -f docker-compose.prod.yml down
```

---

## 3. Nachvollziehbarkeits- und Revisionskonzept

1. **Dienstplanänderungen:**
   - Pflichtfeld: *Änderungsgrund* (`ShiftChangeRecord`).
   - Protokollierung von Zeitstempel, Benutzerkennung, altem und neuem Mitarbeiter.
2. **Online-Wachbuch (OWKS):**
   - Fortlaufende Sequenznummerierung (`sequence_number`).
   - Kryptographischer SHA-256 Prüfsummen-Hash für jeden Eintrag.
   - Kein physisches Löschen (`ON DELETE RESTRICT`). Korrekturen erfolgen als referenzierte Folgeeinträge.
3. **Schichtübergaben & Schlüssel-Zählappelle:**
   - Quittierung der Vollzähligkeit physischer Schlüssel und Transponder im 4-Augen-Prinzip vor Dienstübergabe.

---

## 4. Datenschutz-, Auskunfts- und Löschkonzept (DSGVO)

> [!CAUTION]
> **RECHTLICHER HINWEIS:** Die Einhaltung der Bestimmungen der Datenschutz-Grundverordnung (DSGVO), des Bundesdatenschutzgesetzes (BDSG) sowie des § 34a GewO / BewachV unterliegt ständiger behördlicher und gerichtlicher Rechtsprechung. Alle implementierten technischen Mechanismen stellen Werkzeuge dar, ersetzen jedoch **nicht** die zwingende Prüfung und Freigabe durch den betrieblichen Datenschutzbeauftragten (DSB) und qualifizierte Rechtsfachkräfte.

### 4.1 Gesetzliche Aufbewahrungsfristen (BewachV, HGB, ArbZG)
| Datenkategorie | Gesetzliche Frist | Technisches Lösch-/Archivierungsverfahren |
| :--- | :--- | :--- |
| **Wachbucheinträge (OWKS)** | Mind. 2 Jahre gem. § 14 BewachV | Nach 2 Jahren Übergang in den Status `ARCHIVIERT` (schreibgeschützt). |
| **Arbeitszeitnachweise** | Mind. 2 Jahre gem. § 16 Abs. 2 ArbZG | Exportfähig für Arbeitszeitprüfungen der Gewerbeaufsicht. |
| **Rechnungen & Zahlungsbelege** | 10 Jahre gem. § 147 AO / § 257 HGB | Unveränderbare Archivierung im Rechnungsjournal. |
| **IHK § 34a Nachweise** | Dauer der Beschäftigung + 3 Jahre | Nach Ausscheiden des Mitarbeiters gesperrt für Disposition. |

---

## 5. Ausfallsicherheit & Notfallhandbuch (Disaster Recovery)

### 5.1 Szenarien und Notbetriebsstrategien
1. **Szenario 1: Ausfall des primären Datenbank-Servers:**
   - Umschalten auf die synchron replizierte PostgreSQL Hot-Standby Instanz via DNS/Nginx Upstream-Failover (RTO < 30s).
2. **Szenario 2: Netzwerkunterbrechung im Wachlokal / Pforte:**
   - Pforten-Clients schalten unterbrechungsfrei in den **Offline-Puffer-Modus**. Wachbucheinträge, Schlüsselübergaben und Deister-Scans werden lokal gehasht und nach Wiederverbindung synchronisiert.
3. **Szenario 3: Fehlgeschlagenes Software-Update:**
   - Rollback auf den vorherigen Docker-Image-Tag (`image: securityops:v2.9.2`) und Alembic-Downgrade (`alembic downgrade -1`).

### 5.2 Wiederherstellungsprobe (Restore-Runbook)
```bash
# 1. Testumgebung bereitstellen
docker compose -f docker-compose.test.yml up -d db

# 2. Verschlüsselten Snapshot einspielen
gunzip -c /opt/securityops/backups/secops_snapshot_latest.dump.gz | \
  docker compose -f docker-compose.test.yml exec -T db pg_restore -U secops_admin -d securityops_test --clean

# 3. Konsistenzcheck der Hash-Ketten ausführen
docker compose -f docker-compose.test.yml exec api python -m cli.verify_owks_integrity
```
