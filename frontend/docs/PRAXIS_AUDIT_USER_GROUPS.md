# SECURITYOPS - Praxis- und Anforderungsanalyse der Benutzergruppen (Phase 5)

**Prüfstandard:** DIN 77200-1 (Sicherungsdienstleistungen), BDSW-Tarifpraxis, ArbZG, BewachV & DGUV Vorschrift 23  
**Stand:** 12. Mai 2025  
**Version:** v2.8.0-ENTERPRISE-PRAXIS

---

## 1. Matrix der Benutzergruppen & Praxisanforderungen

| Benutzergruppe | Primäre Kernaufgaben | Größte Praxisrisiken / Engpässe | Implementierte Praxisoptimierung in SecurityOps |
| :--- | :--- | :--- | :--- |
| **01. Geschäftsführung** | Wirtschaftlichkeit, KRITIS-Haftung nach § 34a GewO, Einhaltung ArbZG, Umsatzentwicklung | Bußgelder bei unqualifiziertem Personal, Schadensersatz bei unbesetzten KRITIS-Objekten, unbemerkte Margenverluste | **Vorstands-Lagebericht:** Echtzeit-Einsatzbereitschaft (98.4%), automatisches Rechnungsjournal, lückenlose Audit-Trails. |
| **02. Einsatzleitung** | 24/7 Leitstellenüberwachung, Alarmintervention, behördliche Meldungen (Polizei/Feuerwehr) | Verzögerte Alarmreaktion, unvollständige Vorkommnismeldungen, Schichtübergabe-Lücken | **Dispatching-Funkkanal & Ad-hoc Eskalation:** Direkte Kopplung von OWKS-Alarmen mit Prio-Einsatzaufgaben und Vorfallsiegelung. |
| **03. Objektleitung** | Kundenbetreuung vor Ort, Dienstanweisungen (DA), Schlüsselkontrolle, BMA/EMA-Wartung | Veraltete Dienstanweisungen ohne Kenntnisnahme, verlorene Generalschlüssel | **Digitale Objektakte & DMS:** Zählappell im OWKS, versionierte Dienstanweisungen mit digitaler Quittierung der Wachkräfte. |
| **04. Disposition** | Kurzfristige Personaländerungen, Springer-Einteilung, Krankmeldungs-Vertretung | Springer ohne § 34a Sachkunde, Doppelbelegungen, Verletzung der 11h ArbZG-Ruhezeit | **Springer- & Vertretungs-Notfallassistent:** 1-Klick Krankmeldung mit automatischer Filterung geeigneter Springer und ArbZG-Validierung. |
| **05. Personalverwaltung** | Stammdaten, IHK § 34a Prüfungsnachweise, Ersthelfer-Fristen, Urlaub/AU, Soll-Arbeitszeit | Ablaufende DGUV-Ersthelferzertifikate, Überstundenüberschreitung, fehlerhafte Zuschläge | **Automatische Fristenwarnung:** Vorwarnung 60 Tage vor Verfall, Lohnvorbereitung mit steuerfreien Zuschlägen (§ 3b EStG). |
| **06. Sicherheitsmitarbeiter** | Tordienst, Ausweiskontrolle, Streifenfahrten, Deister-Kontrollgänge, Vorkommnisse | Komplizierte Software auf Smartphones, fehlendes Netz in Tiefgaragen/Serverräumen | **Wachlokal Schnell-Terminal & Offline-Cache:** Große Touch-Elemente, 1-Klick-Stempeluhr, Deister-Scan und automatische Nachsynchronisation. |
| **07. Verwaltung & Abrechnung**| Monatsabschlüsse, Leistungsnachweise, Kundenrechnungen nach § 14 UStG, DATEV-Export | Manuelles Abtippen von Papierstundenzetteln, Streitigkeiten mit Kunden über Nachtstunden | **1-Klick Fakturierungslauf:** Erstellung prüffähiger Rechnungen direkt aus genehmigten Zeiterfassungsdaten und hinterlegten Verträgen. |

---

## 2. Detaillierte Workflow-Verbesserungen in Phase 5

### A. Ad-hoc Krankmeldung & Springer-Disposition (P1)
- **Problem in der Praxis:** Ein Sicherheitsmitarbeiter meldet sich um 05:15 Uhr für die Frühschicht krank. Der Disponent muss unter Zeitdruck innerhalb von 45 Minuten Ersatz finden, ohne gegen das Arbeitszeitgesetz (11h Ruhezeit) oder § 34a GewO (IHK-Nachweis für Pfortendienst) zu verstoßen.
- **Lösung:** Der **Springer-Notfallassistent** filtert mit einem Klick alle Mitarbeiter, prüft automatisiert ArbZG-Ruhezeiten, Vakanzen und Qualifikationen und besetzt die Schicht per Knopfdruck nach.

### B. Manipulationssicheres Wachlokal-Terminal (P2)
- **Problem in der Praxis:** Wachleute am Werkstor haben nasse Hände, tragen Einsatzhandschuhe oder müssen binnen Sekunden Besucher erfassen.
- **Lösung:** Vereinfachtes, kontrastreiches Schnell-Terminal mit großen Schaltflächen für Kommen/Gehen, Schichtübernahme und Schnell-Ereignisprotokoll.

### C. Intelligente Automations- und Fristenüberwachung (P2)
- **Regel 1:** Automatische Erkennung unbesetzter Schichten innerhalb der nächsten 24 Stunden -> Prio-Einsatzaufgabe für die Disposition.
- **Regel 2:** Qualifikations-Gültigkeitsgrenze (< 60 Tage) -> Automatische Erinnerung an Personalabteilung zur Nachschulungsbuchung.
- **Regel 3:** Nicht gezeichnete Schichtübergabe nach Schichtende -> Warnmeldung an Objektleitung.
