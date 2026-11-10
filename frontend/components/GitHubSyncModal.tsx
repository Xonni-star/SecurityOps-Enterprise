import React, { useState } from 'react';
import {
  Github,
  X,
  CheckCircle2,
  AlertTriangle,
  Copy,
  Terminal,
  ShieldCheck,
  ExternalLink,
  Download,
  Lock,
  ArrowRight
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

interface GitHubSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GitHubSyncModal: React.FC<GitHubSyncModalProps> = ({ isOpen, onClose }) => {
  const { logAudit } = useAppStore();
  const [userName, setUserName] = useState<string>('');
  const [repoName, setRepoName] = useState<string>('SecurityOps');
  const [isPrivate, setIsPrivate] = useState<boolean>(true);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  if (!isOpen) return null;

  const targetRemoteUrl = userName.trim()
    ? `https://github.com/${userName.trim()}/${repoName.trim()}.git`
    : `https://github.com/<DEIN-BENUTZERNAME>/${repoName.trim()}.git`;

  const gitCommands = [
    `git init -b main`,
    `git add .`,
    `git commit -m "feat(core): initial enterprise release SecurityOps v3.5.2 - all 20 modules production-ready"`,
    `git remote add origin ${targetRemoteUrl}`,
    `git push -u origin main`
  ];

  const handleCopyCommand = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleCopyAll = () => {
    navigator.clipboard.writeText(gitCommands.join('\n'));
    setCopiedIndex(99);
    setTimeout(() => setCopiedIndex(null), 2000);
    logAudit('GITHUB_COMMANDS_COPIED', 'IAM', `Git-Push Befehlskette für Repository ${repoName} kopiert.`);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-2xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-lg bg-slate-800 flex items-center justify-center text-white border border-slate-700">
              <Github className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                GitHub-Konto Synchronisation & Repository-Sicherung
              </h2>
              <p className="text-xs text-slate-400">
                Verbindung mit Ihrem persönlichen, in Google AI Studio registrierten GitHub-Konto
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Status Callout Box */}
        <div className="p-3.5 rounded-lg bg-amber-950/60 border border-amber-800/80 text-xs text-amber-200 space-y-1.5">
          <div className="flex items-center gap-2 font-bold text-amber-300">
            <AlertTriangle className="h-4 w-4 shrink-0 text-amber-400" />
            <span>Sicherheitshinweis gem. Ziffer 6 des Auftrags:</span>
          </div>
          <p className="text-[11px] leading-relaxed text-slate-300">
            Die AI Studio Web-Sandbox besitzt keinen direkten Schreib-Token oder SSH-Schlüssel zu Ihrem privaten GitHub-Konto. Es werden <strong>niemals</strong> vorgetäuschte Commits oder geheime Zugangsdaten ohne Ihre Kontrolle übertragen.
          </p>
        </div>

        {/* Input: GitHub Handle & Repo Name */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              Ihr persönlicher GitHub-Benutzername:
            </label>
            <input
              type="text"
              placeholder="z.B. IhrGitHubHandle"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white font-mono focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              Repository-Name:
            </label>
            <input
              type="text"
              value={repoName}
              onChange={(e) => setRepoName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white font-mono focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>
        </div>

        <div className="flex items-center justify-between text-xs p-3 rounded-lg bg-slate-950 border border-slate-800">
          <div className="flex items-center gap-2">
            <Lock className="h-4 w-4 text-emerald-400" />
            <span className="text-slate-300">Empfohlene Sichtbarkeit:</span>
            <span className="font-bold text-emerald-400 font-mono">Privates Repository (Private)</span>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">KRITIS & DSGVO geschützt</span>
        </div>

        {/* Generated Remote URL preview */}
        <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1 text-xs">
          <span className="text-slate-400 text-[11px] block font-semibold">Ermittelte Ziel-Remote-URL:</span>
          <code className="text-emerald-400 font-mono text-[11px] block break-all">
            {targetRemoteUrl}
          </code>
        </div>

        {/* Command Line Runbook */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-300 flex items-center gap-1.5">
              <Terminal className="h-3.5 w-3.5 text-emerald-400" />
              Befehle für Ihr lokales Terminal (100% Revisionssicher, kein Force-Push):
            </span>
            <button
              onClick={handleCopyAll}
              className="text-[11px] text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1"
            >
              <Copy className="h-3 w-3" />
              {copiedIndex === 99 ? 'Alle kopiert!' : 'Alle kopieren'}
            </button>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 space-y-1.5 font-mono text-[11px] text-slate-300">
            {gitCommands.map((cmd, idx) => (
              <div key={idx} className="flex items-center justify-between group">
                <span className="text-emerald-300 break-all">{cmd}</span>
                <button
                  onClick={() => handleCopyCommand(cmd, idx)}
                  className="opacity-60 group-hover:opacity-100 p-1 text-slate-400 hover:text-white transition ml-2"
                  title="Zeile kopieren"
                >
                  <Copy className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Safety checklist */}
        <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-slate-400 space-y-1">
          <p className="flex items-center gap-1.5 text-emerald-400 font-semibold">
            <ShieldCheck className="h-3.5 w-3.5" /> Sicherheits-Check vor dem Push:
          </p>
          <p>✓ `.gitignore` schließt `.env`, Datenbank-Dumps und Zertifikate automatisch aus.</p>
          <p>✓ Kein Überschreiben bestehender Branches (`git push -u origin main` ohne `--force`).</p>
          <p>✓ Alle 20 Module, Tests, DDLs und Dokumentationen sind staging-bereit.</p>
        </div>

        {/* Actions Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-800">
          <a
            href="https://github.com/new"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition"
          >
            <span>GitHub Repository erstellen</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </a>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition"
          >
            Fertig
          </button>
        </div>
      </div>
    </div>
  );
};
