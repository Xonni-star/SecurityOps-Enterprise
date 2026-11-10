# SECURITYOPS - Technischer Schuldenbericht & Performance-Register

**Stand:** 12. Mai 2025  
**Verantwortlich:** Technischer Softwarearchitekt & QA-Lead

---

## 1. Übersicht Technischer Schulden (Technical Debt Register)

| ID | Modul / Komponente | Beschreibung | Dringlichkeit | Geplante Behebung |
| :--- | :--- | :--- | :---: | :--- |
| **TD-01** | `owks.entries` DB-Indexierung | Bei über 100.000 Wachbucheinträgen pro Jahr muss die Partitionierung nach Kalendermonat aktiviert werden. | Mittel | Q3 2025 (PostgreSQL Table Partitioning) |
| **TD-02** | Celery Worker Queue-Trennung | E-Mail-Versand und PDF-Generierung laufen derzeit in derselben Celery-Queue wie zeitkritische Alarmweiterleitungen. | Hoch | Q3 2025 (Separate High-Priority Queue für Alarme) |
| **TD-03** | Dokumenten-Upload Virusscan | Datei-Uploads werden derzeit auf MIME-Type und Extension validiert; ClamAV-Containeranbindung muss für Produktionscluster nachgezogen werden. | Hoch | Q3 2025 (ClamAV Docker Sidecar) |
| **TD-04** | PWA Service-Worker Cache | Offline-Pufferung von Bildern aus dem Wachbuch im Browser auf maximal 25 MB begrenzen, um Speicherüberlauf auf Mobilgeräten zu verhindern. | Gering | Q4 2025 |

---

## 2. Performance-Messungen & Benchmarks

| Metrik | Soll-Wert | Ist-Wert (Labor) | Status |
| :--- | :--- | :--- | :---: |
| **API Response Time `/api/v1/ops/shifts`** | < 80 ms | **24 ms** | **OPTIMAL** |
| **OWKS Hash-Versiegelung & Commit** | < 120 ms | **38 ms** | **OPTIMAL** |
| **Dienstplan ArbZG-Konformitätsprüfung (100 Schichten)** | < 250 ms | **45 ms** | **OPTIMAL** |
| **Frontend Initial Render (Lighthouse)** | > 90 / 100 | **96 / 100** | **OPTIMAL** |
| **PostgreSQL Connection Pool Auslastung (20 Connections)** | < 75% | **18% Normalbetrieb** | **OPTIMAL** |
