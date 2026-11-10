import React, { useEffect, useRef } from 'react';
import {
  DatabaseZap,
  Layers,
  Server,
  Terminal,
  Code2,
  Workflow,
  CheckCircle2
} from 'lucide-react';
import mermaid from 'mermaid';

export const ArchitectureDbView: React.FC = () => {
  const mermaidRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: 'dark',
      fontFamily: 'Inter',
      themeVariables: {
        darkMode: true,
        background: '#0f172a',
        primaryColor: '#10b981',
        primaryTextColor: '#f8fafc',
        primaryBorderColor: '#059669',
        lineColor: '#64748b'
      }
    });

    const graphDefinition = `
erDiagram
    CORE_USERS ||--o{ IAM_ROLES : has
    CORE_USERS ||--o{ AUDIT_LOGS : generates
    CRM_CUSTOMERS ||--o{ OPS_OBJECTS : owns
    CRM_CUSTOMERS ||--o{ BILLING_CONTRACTS : signs
    OPS_OBJECTS ||--o{ OPS_SHIFTS : schedules
    OPS_OBJECTS ||--o{ OWKS_ENTRIES : contains
    OPS_OBJECTS ||--o{ OPS_CHECKPOINTS : monitors
    WORKFORCE_EMPLOYEES ||--o{ OPS_SHIFTS : assigned_to
    WORKFORCE_EMPLOYEES ||--o{ WORKFORCE_CERTIFICATES : holds
    WORKFORCE_EMPLOYEES ||--o{ OPS_TIMECARDS : punches
    OPS_SHIFTS ||--o{ BILLING_INVOICE_ITEMS : billed_as
    BILLING_CONTRACTS ||--o{ BILLING_INVOICES : yields
    DOCS_ARCHIVE ||--o{ OPS_OBJECTS : references
    `;

    if (mermaidRef.current) {
      mermaidRef.current.innerHTML = '';
      mermaid.render('erGraphSvg', graphDefinition).then((result) => {
        if (mermaidRef.current) {
          mermaidRef.current.innerHTML = result.svg;
        }
      }).catch(err => {
        console.error('Mermaid render error:', err);
      });
    }
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <DatabaseZap className="h-5 w-5 text-emerald-400" />
            Systemarchitektur, PostgreSQL-Schema & ER-Diagramm
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Modularer Monolith: FastAPI 0.115+, SQLAlchemy 2.0 Async, Alembic Migrationen, Redis & Celery Worker.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="px-3 py-1 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-mono">
            PostgreSQL 16.4
          </span>
          <span className="px-3 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700 font-mono">
            FastAPI /api/v1
          </span>
        </div>
      </div>

      {/* Architecture Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-white font-bold text-xs">
            <Server className="h-4 w-4 text-emerald-400" />
            Backend & API
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            FastAPI mit Pydantic v2 Validatoren, Dependency Injection für DB-Sessions und asynchrone SQLAlchemy 2.0 Repositories.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-white font-bold text-xs">
            <Layers className="h-4 w-4 text-blue-400" />
            PostgreSQL Schemas
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Strikte Trennung in 10 fachliche Schemas: <code className="text-slate-300">core, iam, crm, ops, workforce, owks, docs, billing, audit</code>.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-white font-bold text-xs">
            <Workflow className="h-4 w-4 text-purple-400" />
            Hintergrund & Cache
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Redis 7 für Token-Blacklisting & Rate-Limiting. Celery Worker für automatische Zertifikats-Warnungen & Rechnungsgenerierung.
          </p>
        </div>
      </div>

      {/* Mermaid ER Diagram */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-white">Relationales Entity-Relationship-Diagramm (ER)</h2>
          <span className="text-xs text-slate-400 font-mono">UUID v4 Primary Keys • Revisionssicher</span>
        </div>
        <div
          ref={mermaidRef}
          className="p-4 rounded-lg bg-slate-950 border border-slate-800/80 overflow-x-auto flex justify-center text-xs"
        />
      </div>

      {/* SQL DDL & Migration Preview */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
        <h2 className="text-sm font-semibold text-white flex items-center gap-2">
          <Code2 className="h-4 w-4 text-emerald-400" />
          Alembic Migration & Schema Auszug (PostgreSQL DDL)
        </h2>
        <pre className="p-4 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-emerald-300 font-mono overflow-x-auto leading-relaxed">
{`-- Revision: 20250512_001_securityops_core_init.py
CREATE SCHEMA IF NOT EXISTS core;
CREATE SCHEMA IF NOT EXISTS iam;
CREATE SCHEMA IF NOT EXISTS crm;
CREATE SCHEMA IF NOT EXISTS ops;
CREATE SCHEMA IF NOT EXISTS workforce;
CREATE SCHEMA IF NOT EXISTS owks;
CREATE SCHEMA IF NOT EXISTS billing;
CREATE SCHEMA IF NOT EXISTS audit;

-- OWKS Revisionssicheres Wachbuch mit Hash-Verkettung
CREATE TABLE owks.entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sequence_number BIGINT GENERATED ALWAYS AS IDENTITY,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    object_id UUID NOT NULL REFERENCES ops.objects(id) ON DELETE RESTRICT,
    author_id UUID NOT NULL REFERENCES core.users(id),
    entry_type VARCHAR(64) NOT NULL,
    severity VARCHAR(32) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    tamper_hash CHAR(64) NOT NULL,
    previous_hash CHAR(64),
    is_sealed BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE INDEX idx_owks_object_seq ON owks.entries(object_id, sequence_number DESC);`}
        </pre>
      </div>
    </div>
  );
};
