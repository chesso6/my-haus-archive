'use client';

import { useState } from 'react';
import { ref, push } from 'firebase/database';
import { database } from '@/app/lib/firebase';

interface AddPhotoModalProps {
  onClose: () => void;
  eras: { id: string; title: string }[];
}

export function AddPhotoModal({ onClose, eras }: AddPhotoModalProps) {
  const [selectedEra, setSelectedEra] = useState(eras[0]?.id || 'thefame');
  const [url, setUrl] = useState('');
  const [event, setEvent] = useState('');
  const [photog, setPhotog] = useState('');
  const [date, setDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) {
      alert('Photo URL is required.');
      return;
    }

    if (!database) return;
    setIsSubmitting(true);

    try {
      const cleanEraKey = selectedEra.toLowerCase().replace(/\s+/g, '-');
      const photosRef = ref(database, `gagaArchive/${cleanEraKey}/photos`);

      await push(photosRef, {
        url: url.trim(),
        event: event.trim(),
        desc: event.trim(),
        photog: photog.trim(),
        photogKey: photog.trim(),
        date: date.trim(),
        timestamp: Date.now(),
      });

      const uName = sessionStorage.getItem('haus_editor_name') || 'OWNER';
      await push(ref(database, 'hausActivityLog'), {
        user: uName,
        action: `Added photo to Era: ${selectedEra}`,
        timestamp: Date.now(),
      });

      alert('Photo added successfully!');
      onClose();
      window.location.reload();
    } catch (err: any) {
      alert('Failed to add photo: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9500] bg-black/90 flex items-center justify-center p-4 font-mono text-xs">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-md w-full p-6 space-y-4">
        <div className="flex justify-between items-center border-b border-neutral-800 pb-3">
          <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded font-bold uppercase">
            NEW PHOTO
          </span>
          <h2 className="text-sm font-bold text-white uppercase tracking-widest">
            Add Photo to Archive
          </h2>
          <button type="button" onClick={onClose} className="text-neutral-400 hover:text-white cursor-pointer">
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-neutral-400 mb-1">Select Era</label>
            <select
              value={selectedEra}
              onChange={(e) => setSelectedEra(e.target.value)}
              className="w-full bg-black border border-neutral-800 rounded p-2 text-white capitalize"
            >
              {eras.map((era) => (
                <option key={era.id} value={era.id}>
                  {era.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-neutral-400 mb-1">Photo URL *</label>
            <input
              type="text"
              placeholder="https://..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full bg-black border border-neutral-800 rounded p-2 text-white"
              required
            />
          </div>

          <div>
            <label className="block text-neutral-400 mb-1">Event Title / Session</label>
            <input
              type="text"
              placeholder="V MAGAZINE PHOTOSHOOT"
              value={event}
              onChange={(e) => setEvent(e.target.value)}
              className="w-full bg-black border border-neutral-800 rounded p-2 text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-neutral-400 mb-1">Photographer</label>
              <input
                type="text"
                placeholder="Inez and Vinoodh"
                value={photog}
                onChange={(e) => setPhotog(e.target.value)}
                className="w-full bg-black border border-neutral-800 rounded p-2 text-white"
              />
            </div>
            <div>
              <label className="block text-neutral-400 mb-1">Date (e.g. JUL 1)</label>
              <input
                type="text"
                placeholder="JUL 1"
                value={date}
                onChange={(e) => setDate(e.target.value)}
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
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-white text-black font-bold rounded text-xs hover:bg-neutral-200 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? 'Uploading...' : 'Submit Photo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}