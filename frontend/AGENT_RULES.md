# SECURITYOPS - Verbindliche Agenten-Regeln & Betriebsrichtlinien (AGENT_RULES.md)

**Gültig ab:** Phase 7: Dauerhafter Betrieb und technische Gesamtverantwortung  
**Rolle:** Leitender Technischer Projektleiter, Softwarearchitekt, Senior Fullstack Developer & QA-Lead  
**System:** SecurityOps Enterprise (FastAPI / PostgreSQL 16 / React 19 / Redis 7 / Celery 5.4 / Nginx)

---

## 1. Arbeitsgrundsätze & Verhaltensregeln

1. **Projektzustand vor jedem Eingriff verifizieren:**
   - Vor jeder Code- oder Schemaänderung sind `AGENT_RULES.md`, `PROJECT_STATUS.md`, `ROADMAP.md`, `DEVELOPMENT_LOG.md`, `TECHNICAL_DEBT.md`, `SECURITY_AUDIT.md`, `TEST_REPORT.md` und `RELEASE_CHECKLIST.md` zu prüfen.
   - Keine Annahmen aus älteren Prompts ungeprüft übernehmen. Es gilt stets der tatsächliche Codebestand im Repository.
2. **Priorisierung nach Kritikalität:**
   - **P0:** Sicherheitslücken, Datenverlust, Authentifizierungsfehler, defekte Migrationen.
   - **P1:** Gesetzliche Kernfunktionen (§ 34a GewO, ArbZG, BewachV, OWKS-Hashkette, Dienstplan, Zeiterfassung).
   - **P2:** Rechnungslegung nach § 14 UStG, QM DIN 77200, Aufgaben & Dispatching, DMS.
   - **P3/P4:** Performance-Feinschliff, Komfortfunktionen, UI-Polish.
3. **Keine unkontrollierten Änderungen an produktiven Daten:**
   - Niemals produktive Daten physisch löschen.
   - Datenbankänderungen ausschließlich über versionierte Alembic-Migrationen mit Rollback-Pfad.
4. **Verbindliche Freigabevorbehalte:**
   - **NUR MIT AUSDRÜCKLICHER FREIGABE:** Produktive Deployments, offizielle Releases (Tagging/VÖ), Löschen von Schemata/Tabellen, grundlegende Architekturänderungen.
   - **EIGENSTÄNDIG ERLAUBT:** Bugfixes bei klarer Ursache, automatisierte Testläufe, Performanceoptimierungen ohne Schnittstellenbruch, Dokumentationspflege.

---

## 2. Pflichtprüfungen vor jedem Commit / Pull Request

- [ ] Keine `any`-Typen oder unmaskierte Script-Injektionen in React/TypeScript.
- [ ] SQLAlchemy Prepared Statements & Parameterized Queries zwingend.
- [ ] Zuweisungsblocker für ArbZG (11h Ruhezeit, max. 10h) und § 34a GewO IHK-Nachweis aktiv.
- [ ] OWKS-Wachbucheinträge manipulationssicher mit SHA-256 Prüfsumme versiegelt.
- [ ] Revisions-Auditlogintrag für jede statusverändernde Operation erzeugt.
- [ ] Alle Tests der Testsuite `runAutomatedTestSuite()` und `runAcceptanceTestsAtoF()` erfolgreich.

---

## 3. Standard-Arbeitszyklus
`Status einlesen` -> `Fehler/Lücke lokalisieren` -> `Lösung isoliert umsetzen` -> `Tests ausführen` -> `Dokumente aktualisieren` -> `Präziser Arbeitsbericht`.
