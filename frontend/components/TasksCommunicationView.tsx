import React, { useState } from 'react';
import {
  ListTodo,
  Plus,
  Send,
  Radio,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Building2,
  UserCheck,
  Flame,
  MessageSquare
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { TaskPriority, TaskStatus } from '../types';

export const TasksCommunicationView: React.FC = () => {
  const { tasks, addTask, updateTaskStatus, dispatchMessages, sendDispatchMessage, objects } = useAppStore();

  // Task form state
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDesc, setTaskDesc] = useState('');
  const [taskPriority, setTaskPriority] = useState<TaskPriority>(TaskPriority.NORMAL);
  const [taskAssigned, setTaskAssigned] = useState('Einsatzleitung');
  const [taskDue, setTaskDue] = useState('2025-05-13');
  const [taskObjId, setTaskObjId] = useState(objects[0]?.id || '');

  // Dispatch message form state
  const [chatChannel, setChatChannel] = useState<'Leitzentrale' | 'Wachlokal Tor 1' | 'Streife Funk Kanal 2' | 'Alarmmeldung'>('Leitzentrale');
  const [chatText, setChatText] = useState('');
  const [chatUrgent, setChatUrgent] = useState(false);

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle) return;

    const obj = objects.find(o => o.id === taskObjId);

    addTask({
      title: taskTitle,
      description: taskDesc,
      priority: taskPriority,
      status: TaskStatus.OFFEN,
      assignedTo: taskAssigned,
      dueDate: taskDue,
      objectId: obj?.id,
      objectName: obj?.name,
      createdBy: 'Einsatzleitung'
    });

    setShowTaskModal(false);
    setTaskTitle('');
    setTaskDesc('');
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatText.trim()) return;

    sendDispatchMessage(chatChannel, chatText.trim(), chatUrgent);
    setChatText('');
    setChatUrgent(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <ListTodo className="h-5 w-5 text-emerald-400" />
            Aufgabenmanagement & Leitstellen-Funk
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Operative Schichtaufgaben, Eskalationstickets und gesicherter Leitstellen-Dispatchingkanal.
          </p>
        </div>

        <button
          onClick={() => setShowTaskModal(true)}
          className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md shadow-emerald-950 transition"
        >
          <Plus className="h-4 w-4" />
          Neue Aufgabe anlegen
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Task List (2 cols) */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400 px-1 uppercase tracking-wider">
            <span>Aufgabenübersicht ({tasks.length})</span>
            <span className="font-mono text-emerald-400">
              {tasks.filter(t => t.status === TaskStatus.ERLEDIGT).length} erledigt
            </span>
          </div>

          <div className="space-y-2">
            {tasks.map(t => (
              <div
                key={t.id}
                className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition space-y-2.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-white text-sm">{t.title}</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          t.priority === TaskPriority.KRITISCH
                            ? 'bg-red-950 text-red-300 border border-red-800 animate-pulse'
                            : t.priority === TaskPriority.HOCH
                            ? 'bg-amber-950 text-amber-300 border border-amber-800'
                            : 'bg-slate-800 text-slate-300 border border-slate-700'
                        }`}
                      >
                        {t.priority}
                      </span>
                    </div>
                    {t.objectName && <p className="text-xs text-emerald-400 mt-0.5">{t.objectName}</p>}
                  </div>

                  <select
                    value={t.status}
                    onChange={e => updateTaskStatus(t.id, e.target.value as TaskStatus)}
                    className="bg-slate-950 border border-slate-700 text-xs text-slate-200 rounded px-2 py-1 focus:outline-none"
                  >
                    <option value={TaskStatus.OFFEN}>Offen</option>
                    <option value={TaskStatus.IN_BEARBEITUNG}>In Bearbeitung</option>
                    <option value={TaskStatus.ERLEDIGT}>Erledigt</option>
                    <option value={TaskStatus.ABGELEHNT}>Abgelehnt</option>
                  </select>
                </div>

                <p className="text-xs text-slate-300 font-mono bg-slate-950/80 p-2.5 rounded-lg border border-slate-800">
                  {t.description}
                </p>

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                  <span>Zugewiesen an: <strong className="text-slate-200">{t.assignedTo}</strong></span>
                  <span className="font-mono">Fällig: {t.dueDate}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Dispatch Chat / Radio Channel */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between h-[640px]">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Radio className="h-4 w-4 text-emerald-400 animate-pulse" />
                <h2 className="text-sm font-bold text-white">Leitstellen-Dispatching</h2>
              </div>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                24/7 DMR Funk
              </span>
            </div>

            {/* Message feed */}
            <div className="space-y-2 mt-3 overflow-y-auto max-h-[440px] pr-1">
              {dispatchMessages.map(msg => (
                <div
                  key={msg.id}
                  className={`p-2.5 rounded-lg text-xs border ${
                    msg.isUrgent
                      ? 'bg-red-950/60 border-red-800/80 text-red-200'
                      : 'bg-slate-950 border-slate-800 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-1">
                    <span className="font-bold text-emerald-400">{msg.sender}</span>
                    <span>{msg.timestamp} Uhr</span>
                  </div>
                  <p className="leading-relaxed">{msg.message}</p>
                  <span className="text-[9px] text-slate-500 block mt-1 font-mono">[{msg.channel}]</span>
                </div>
              ))}
            </div>
          </div>

          {/* Send Box */}
          <form onSubmit={handleSendMessage} className="pt-3 border-t border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <select
                value={chatChannel}
                onChange={e => setChatChannel(e.target.value as any)}
                className="bg-slate-950 text-slate-200 border border-slate-700 rounded px-2 py-1 text-[11px]"
              >
                <option value="Leitzentrale">Kanal: Leitzentrale</option>
                <option value="Wachlokal Tor 1">Kanal: Wachlokal Tor 1</option>
                <option value="Streife Funk Kanal 2">Kanal: Streife Funk Kanal 2</option>
                <option value="Alarmmeldung">Kanal: Alarmmeldung</option>
              </select>

              <label className="flex items-center gap-1.5 text-[11px] text-red-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={chatUrgent}
                  onChange={e => setChatUrgent(e.target.checked)}
                  className="rounded bg-slate-950 border-slate-700 text-red-600 focus:ring-0"
                />
                Dringend (Prio 1)
              </label>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Funkspruch oder Anweisung eingeben..."
                value={chatText}
                onChange={e => setChatText(e.target.value)}
                className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
              <button
                type="submit"
                className="p-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Modal: New Task */}
      {showTaskModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h2 className="text-base font-bold text-white">Neue Einsatzaufgabe erstellen</h2>
            <form onSubmit={handleCreateTask} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1">Aufgabentitel *</label>
                <input
                  type="text"
                  required
                  placeholder="z.B. Schlüsselrückgabe BMW Werk Tor 1 prüfen"
                  value={taskTitle}
                  onChange={e => setTaskTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Objektbezug (Optional)</label>
                <select
                  value={taskObjId}
                  onChange={e => setTaskObjId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white focus:outline-none"
                >
                  <option value="">-- Kein Objektbezug --</option>
                  {objects.map(o => (
                    <option key={o.id} value={o.id}>{o.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-300 mb-1">Priorität</label>
                  <select
                    value={taskPriority}
                    onChange={e => setTaskPriority(e.target.value as TaskPriority)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white focus:outline-none"
                  >
                    {Object.values(TaskPriority).map(p => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 mb-1">Fälligkeit</label>
                  <input
                    type="date"
                    value={taskDue}
                    onChange={e => setTaskDue(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-1.5 text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Zuständigkeit</label>
                <input
                  type="text"
                  placeholder="z.B. Thomas Kranz / Schichtführer"
                  value={taskAssigned}
                  onChange={e => setTaskAssigned(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Beschreibung & Anweisung</label>
                <textarea
                  rows={3}
                  placeholder="Genaue Handlungsanweisung..."
                  value={taskDesc}
                  onChange={e => setTaskDesc(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white focus:outline-none font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowTaskModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium"
                >
                  Abbrechen
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold"
                >
                  Aufgabe erteilen
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
