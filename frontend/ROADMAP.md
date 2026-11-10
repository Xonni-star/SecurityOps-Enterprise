# SECURITYOPS - Strategische Roadmap & Weiterentwicklungsplan (2025 - 2026)

**Projektphase:** DAUERHAFTER BETRIEB & WARTUNGSMODUS (Phase 9 konsolidiert)  
**Architektur:** Modularer Monolith (FastAPI / PostgreSQL 16 / React 19 / Redis 7 / Celery 5.4)

---

## 1. Quartalsübersicht & Meilensteine

```mermaid
gantt
    title SecurityOps Enterprise Roadmap (2025 - 2026)
    dateFormat  YYYY-MM-DD
    section Produktivversion v3.1
    Gesamtkonsolidierung & Praxistest   :done, 2025-05-01, 2025-05-15
    Pilotbetrieb & Gateways             :done, 2025-05-10, 2025-05-31
    section Q3/2025 KRITIS & VdS
    KRITIS-Dachgesetz Konformitätsprüfer:active, 2025-07-01, 2025-08-31
    VdS 2172 Checklisten & Interventionsmodul :2025-08-15, 2025-09-30
    section Q4/2025 Mobile PWA & Hardware
    PWA Offline-First ServiceWorker     :2025-10-01, 2025-11-30
    Physische Web-NFC Deister-Kopplung  :2025-11-15, 2025-12-31
    section Q1-Q2/2026 Skalierung & Lohn
    DATEV LODAS / LuG Schnittstelle     :2026-01-15, 2026-03-31
    PostgreSQL Table Partitioning       :2026-04-01, 2026-06-30
```

---

## 2. Geplante Erweiterungsstufen (ohne Breaking Changes)

1. **KRITIS-Dachgesetz & VdS 2172 (Q3 2025):**
   - Automatische Revisionsberichte für Aufsichtsbehörden bei Vorfällen in kritischen Infrastrukturen.
   - VdS-zertifizierte Interventionsprotokolle mit GPS- und Zeitstempel-Abgleich.
2. **Offline-First PWA (Q4 2025):**
   - Vollständige ServiceWorker IndexedDB-Kopplung für unterirdische Schutzobjekte ohne WLAN/LTE.
3. **DATEV Lohnschnittstelle (Q1 2026):**
   - Direkter Export von genehmigten Arbeitszeitkonten und steuerfreien Zuschlägen (§ 3b EStG) in DATEV LODAS.
