'use client';

import { useState, useEffect } from 'react';
import { ref, onValue, push, remove } from 'firebase/database';
import { database } from '@/app/lib/firebase';

export function ActivityLogModal({ onClose }: { onClose: () => void }) {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!database) return;
    const logRef = ref(database, 'hausActivityLog');
    const unsub = onValue(logRef, (snap) => {
      const data = snap.val();
      setLogs(data ? Object.values(data).reverse() : []);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  return (
    <div className="fixed inset-0 z-[9000] bg-black/90 flex items-center justify-center p-4 font-mono text-xs">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-lg w-full p-6 space-y-4">
        <div className="flex justify-between items-center border-b border-neutral-800 pb-3">
          <span className="text-[10px] bg-neutral-800 text-neutral-300 px-2 py-0.5 rounded font-bold uppercase">
            SYSTEM LOG
          </span>
          <h2 className="text-sm font-bold text-white uppercase tracking-widest">
            Activity History
          </h2>
          <button type="button" onClick={onClose} className="text-neutral-400 hover:text-white cursor-pointer">
            ×
          </button>
        </div>

        <div className="max-h-80 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
          {loading ? (
            <p className="text-neutral-500 text-center py-4">Loading logs...</p>
          ) : logs.length === 0 ? (
            <p className="text-neutral-500 text-center py-6">No recent logs recorded.</p>
          ) : (
            logs.map((log, i) => (
              <div key={i} className="bg-black/50 border border-neutral-800 p-3 rounded-lg text-[11px] space-y-1">
                <div className="flex justify-between text-neutral-400 font-bold">
                  <span className="text-white uppercase">{log.user || 'OWNER'}</span>
                  <span className="text-[10px]">{log.timestamp ? new Date(log.timestamp).toLocaleString() : ''}</span>
                </div>
                <p className="text-neutral-300">{log.action}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export function StatsModal({ onClose }: { onClose: () => void }) {
  const [stats, setStats] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!database) return;
    const logRef = ref(database, 'hausActivityLog');
    const unsub = onValue(logRef, (snap) => {
      const data = snap.val();
      if (data) {
        const counts: Record<string, number> = {};
        Object.values(data).forEach((item: any) => {
          const user = item.user || 'OWNER';
          counts[user] = (counts[user] || 0) + 1;
        });
        setStats(counts);
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  return (
    <div className="fixed inset-0 z-[9000] bg-black/90 flex items-center justify-center p-4 font-mono text-xs">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-sm w-full p-6 space-y-4">
        <div className="flex justify-between items-center border-b border-neutral-800 pb-3">
          <span className="text-[10px] bg-neutral-800 text-neutral-300 px-2 py-0.5 rounded font-bold uppercase">
            CONTRIBUTIONS
          </span>
          <h2 className="text-sm font-bold text-white uppercase tracking-widest">
            Editor Stats
          </h2>
          <button type="button" onClick={onClose} className="text-neutral-400 hover:text-white cursor-pointer">
            ×
          </button>
        </div>

        <div className="space-y-2">
          {loading ? (
            <p className="text-neutral-500 text-center py-4">Loading stats...</p>
          ) : (
            Object.entries(stats).map(([user, count]) => (
              <div key={user} className="flex justify-between items-center bg-black/50 border border-neutral-800 p-3 rounded-lg">
                <span className="font-bold text-white uppercase">{user}</span>
                <span className="bg-neutral-800 text-neutral-300 px-2.5 py-1 rounded text-[10px] font-bold">
                  {count} ACTIONS
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export function EditorsModal({ onClose }: { onClose: () => void }) {
  const [editors, setEditors] = useState<{ id: string; name: string }[]>([]);
  const [newEditorName, setNewEditorName] = useState('');
  const [newEditorPass, setNewEditorPass] = useState('');

  useEffect(() => {
    if (!database) return;
    const unsub = onValue(ref(database, 'hausEditors'), (snap) => {
      const data = snap.val();
      setEditors(data ? Object.entries(data).map(([id, val]: [string, any]) => ({ id, ...val })) : []);
    });
    return () => unsub();
  }, []);

  const handleAddEditor = async () => {
    if (!newEditorName.trim() || !newEditorPass.trim()) return;
    await push(ref(database, 'hausEditors'), {
      name: newEditorName.trim(),
      password: newEditorPass.trim(),
    });
    setNewEditorName('');
    setNewEditorPass('');
  };

  const handleDeleteEditor = async (id: string) => {
    if (confirm('Remove editor?')) await remove(ref(database, `hausEditors/${id}`));
  };

  return (
    <div className="fixed inset-0 z-[9000] bg-black/90 flex items-center justify-center p-4 font-mono text-xs">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-md w-full p-6 space-y-4">
        <div className="flex justify-between items-center border-b border-neutral-800 pb-3">
          <span className="text-[10px] bg-neutral-800 text-neutral-300 px-2 py-0.5 rounded font-bold uppercase">
            ADMIN
          </span>
          <h2 className="text-sm font-bold text-white uppercase tracking-widest">
            Manage Editors
          </h2>
          <button type="button" onClick={onClose} className="text-neutral-400 hover:text-white cursor-pointer">
            ×
          </button>
        </div>

        <div className="bg-black/50 border border-neutral-800 p-3 rounded-lg space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              placeholder="Name"
              value={newEditorName}
              onChange={(e) => setNewEditorName(e.target.value)}
              className="bg-neutral-900 border border-neutral-800 p-2 rounded text-white"
            />
            <input
              type="password"
              placeholder="Password"
              value={newEditorPass}
              onChange={(e) => setNewEditorPass(e.target.value)}
              className="bg-neutral-900 border border-neutral-800 p-2 rounded text-white"
            />
          </div>
          <button
            type="button"
            onClick={handleAddEditor}
            className="w-full py-1.5 bg-white text-black font-bold rounded text-[11px] cursor-pointer"
          >
            + ADD EDITOR
          </button>
        </div>

        <div className="max-h-52 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
          {editors.map((ed) => (
            <div key={ed.id} className="flex justify-between items-center bg-black/30 border border-neutral-800 p-2.5 rounded-lg">
              <span className="font-bold text-white uppercase">{ed.name}</span>
              <button
                type="button"
                onClick={() => handleDeleteEditor(ed.id)}
                className="text-rose-500 font-bold text-[10px] px-2 py-1 bg-rose-500/10 rounded cursor-pointer"
              >
                REMOVE
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}