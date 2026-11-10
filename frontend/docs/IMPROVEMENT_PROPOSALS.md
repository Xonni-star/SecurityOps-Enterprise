# SECURITYOPS - Praxis-Verbesserungsvorschläge (IMPROVEMENT_PROPOSALS.md)

**System:** SecurityOps Enterprise (v3.7.0)  
**Klassifizierung:** Strategischer Anforderungs- und Optimierungskatalog  
**Geltungsbereich:** Geschäftsführung, Leitstellenleitung, Disposition, Lohnbuchhaltung

---

## 1. Übersicht & Priorisierte Handlungsfelder

| Priorität | Bereich | Konkreter Verbesserungsvorschlag | Praxisnutzen |
| :---: | :--- | :--- | :--- |
| **P1** | **Abrechnung & Lohn** | **DATEV-Lohnvorbereitung (§ 3b EStG)** | Automatische Trennung steuerpflichtiger Grundlöhne von steuerfreien Nacht-, Sonntags- und Feiertagszuschlägen für das Steuerbüro. |
| **P1** | **Wachbuch & Haftung** | **Behördlicher Vorfallsbericht (DIN 77200 / Polizei / VdS)** | Druckfähiges Schadens- und Ereignisprotokoll mit SHA-256 Siegel, Zeugen, Kripokennzeichen und Unterschriftsfeldern für Versicherungen. |
| **P2** | **Objekt & ZKS** | **Täglicher Schlüsselkasten-Zählappell mit Schichtquittung** | Plombierungsprüfung im 4-Augen-Prinzip mit automatischer Dispositions-Sperre bei fehlendem Generalschlüssel. |
| **P2** | **Dienstplan & Dispo** | **Mitarbeiter-Verfügbarkeitskalender & Wunschbuch** | Erfassung von Sperrzeiten, Freiwünschen und Teilzeitmodellen vor Erstellung des Dienstplans. |
| **P3** | **Streife & Telemetrie** | **Geofencing & GPS-Live-Tracking für Revierfahrzeuge** | Erkennung von Streifenfahrzeugen im Umkreis von Alarmobjekten zur automatischen Anfahrtszeit-Verkürzung (SLA). |
| **P3** | **Personal & GewO** | **Automatisches IHK-Wiederholungsschulungs-Audit** | Überwachung der 3-jährigen Regelzuverlässigkeitsprüfung nach § 34a Abs. 1a GewO mit Vorwarnung an die Behördenakte. |
| **P4** | **Kunde & Transparenz** | **Auftraggeber-Portal (Read-Only Live-Cockpit)** | Sicherer Kunden-Webzugang für KRITIS-Kunden zur Einsicht eigener Wachbucheinträge und Deister-Rundgangszeiten. |

---

## 2. Detaillierte Ausarbeitung der Top-Verbesserungen

### Vorschlag 1: DATEV-Lohnvorbereitung nach § 3b EStG (Bereits integriert)
- **Problem:** Sicherheitskräfte arbeiten primär nachts, an Sonn- und Feiertagen. Das Steuerrecht (§ 3b EStG) stellt Zuschläge unter bestimmten Bedingungen steuer- und sozialversicherungsfrei (25% Nachtarbeit 20–06 Uhr, 40% Nachtarbeit 00–04 Uhr, 50% Sonntagsarbeit, 125% Feiertagsarbeit).
- **Lösung:** Automatische Lohnvorbereitungstabelle mit getrennten Spalten für steuerfreie Zuschläge und Export als DATEV-fähige CSV-Datei.

### Vorschlag 2: Behördliches DIN 77200 Schadensprotokoll (Bereits integriert)
- **Problem:** Bei Einbrüchen, Vandalismus oder Bränden verlangen Polizei, Kriminalpolizei und Sachversicherer (VdS) ein lückenloses, unveränderbares Einsatzprotokoll.
- **Lösung:** 1-Klick-Generierung eines amtlichen Ereignisberichts mit kryptographischem SHA-256 Hash, Melderlinie, Alarmzeiten, Feststellungen und Unterschriftenblocks.

### Vorschlag 3: Web-NFC / Bluetooth-Low-Energy (BLE) Deister-Hardwareanbindung
- **Problem:** Physische Rundgangskontrollen werden aktuell über manuelle Buttons simuliert.
- **Lösung:** Nutzung der W3C Web-NFC API auf Android-Diensthandys zum direkten Lesen von NTAG213/215 Kontrollpunkt-Plaketten an Zaunlinien und Türen.
