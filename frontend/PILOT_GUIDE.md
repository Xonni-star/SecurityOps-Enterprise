# SECURITYOPS - Pilotbetriebs- & Schulungsleitfaden (PILOT_GUIDE.md)

Dieser Leitfaden dient als verbindliche Anleitung für den Pilotbetrieb von SecurityOps bei Sicherheitsdienstleistern. Er erklärt die Standardabläufe für alle 7 Benutzergruppen.

---

## 1. Testdaten und Rollen im Pilotbetrieb

Im Testsystem sind folgende isolierte Beispieldaten vorinstalliert:
- **Kunden:** BMW Werk Regensburg (KRITIS), Mainova Rechenzentrum Frankfurt (KRITIS), Galerie Am Dom (A-Kunde).
- **Objekte:** Werkspforte Tor 1, Servergebäude Alpha, Einkaufszentrum Domgalerie.
- **Mitarbeiter:** Thomas Kranz (Einsatzleitung), Eleni Vassiliou (Objektleitung), Igor Petrov (Fachkraft §34a), Marc Engler (In Ausbildung).

---

## 2. Prüfschritte nach Benutzergruppen

### A. Für die Einsatzleitung & Leitzentrale
1. **Lagezentrum öffnen:** Prüfen der aktiven Objekte, Besetzungsquote und Warnungen.
2. **DMR-Funkkanal:** Über das Modul `Aufgaben & Dispatch` eine Meldung an `Streife Funk Kanal 2` senden.
3. **Schichtübergaben einsehen:** Im Modul `Wachbuch (OWKS)` die lückenlose Siegelung der Übergabe #1042 prüfen.

### B. Für Disponenten
1. **Dienstplan prüfen:** Auf unbesetzte Schichten (rot markiert) filtern.
2. **Springer-Assistent:** Im `Praxis-Hub & Springer` eine Krankmeldung simulieren. Das System schlägt automatisch nur Mitarbeiter vor, die nicht kollidieren und über die erforderliche § 34a IHK-Qualifikation verfügen.
3. **ArbZG-Schutz prüfen:** Versuchen, einen Mitarbeiter ohne Pause einzuteilen. Das System muss mit einem roten Blockade-Banner abweisen.

### C. Für Sicherheitskräfte im Wachlokal
1. **Terminal-Modus:** Das `Wachlokal Schnell-Terminal` im `Praxis-Hub` auf dem Tablet öffnen.
2. **Deister-Scan:** Schaltfläche "NFC Deister-Scan" betätigen. Status wechselt auf `GEPRÜFT`.
3. **Vorkommnis eintragen:** Kurzmeldung eingeben und "Sofort Versiegeln" klicken. Der Eintrag erscheint manipulationsfest im OWKS.

### D. Für die Abrechnung & Lohnbuchhaltung
1. **Zeiterfassung sperren:** Im Modul `Zeiterfassung` den Monatsabschluss prüfen.
2. **Abrechnungslauf:** Im Modul `Rechnungswesen` den Rechnungsentwurf für den Kunden BMW prüfen.
3. **CSV-Export:** Revisions-CSV exportieren und Lohnzuschläge kontrollieren.
