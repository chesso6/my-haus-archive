'use client';

import { useState } from 'react';
import { ref, push, set } from 'firebase/database';
import { database } from '@/app/lib/firebase';

interface AddEraModalProps {
  onClose: () => void;
  onSuccess?: () => void;
}

export function AddEraModal({ onClose, onSuccess }: AddEraModalProps) {
  const [eraId, setEraId] = useState('');
  const [eraTitle, setEraTitle] = useState('');

  const handleAddEra = async () => {
    if (!eraId.trim() || !eraTitle.trim()) {
      alert('Please enter both Era ID (slug) and Era Title.');
      return;
    }

    if (!database) return;

    try {
      const cleanId = eraId.toLowerCase().replace(/\s+/g, '-');
      await set(ref(database, `gagaArchive/${cleanId}`), {
        title: eraTitle.trim(),
        photos: [],
      });

      await push(ref(database, 'hausActivityLog'), {
        user: 'OWNER',
        action: `Created new Era: "${eraTitle}" (${cleanId})`,
        timestamp: Date.now(),
      });

      alert(`New Era "${eraTitle}" added successfully!`);
      if (onSuccess) onSuccess();
      onClose();
    } catch (err: any) {
      alert('Failed to add Era: ' + err.message);
    }
  };

  return (
    <div className="fixed inset-0 z-[9500] bg-black/90 flex items-center justify-center p-4 font-mono text-xs">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-sm w-full p-6 space-y-4">
        <div className="flex justify-between items-center border-b border-neutral-800 pb-3">
          <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded font-bold uppercase">
            ADMIN
          </span>
          <h2 className="text-sm font-bold text-white uppercase tracking-widest">
            Add New Era
          </h2>
          <button type="button" onClick={onClose} className="text-neutral-400 hover:text-white cursor-pointer">
            ×
          </button>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-neutral-400 mb-1">Era Slug (e.g. "lg7")</label>
            <input
              type="text"
              placeholder="lg7"
              value={eraId}
              onChange={(e) => setEraId(e.target.value)}
              className="w-full bg-black border border-neutral-800 rounded p-2 text-white"
            />
          </div>

          <div>
            <label className="block text-neutral-400 mb-1">Era Display Title</label>
            <input
              type="text"
              placeholder="LG7 Era"
              value={eraTitle}
              onChange={(e) => setEraTitle(e.target.value)}
              className="w-full bg-black border border-neutral-800 rounded p-2 text-white"
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-3 border-t border-neutral-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-neutral-800 text-neutral-300 rounded text-xs font-bold cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleAddEra}
            className="px-4 py-2 bg-white text-black font-bold rounded text-xs hover:bg-neutral-200 cursor-pointer"
          >
            Create Era
          </button>
        </div>
      </div>
    </div>
  );
}