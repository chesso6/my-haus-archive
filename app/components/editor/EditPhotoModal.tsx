'use client';

import { useState } from 'react';
import { ref, get, set, push } from 'firebase/database';
import { database } from '@/app/lib/firebase';
import { ArchivePhoto } from '@/app/types';

interface EditPhotoModalProps {
  eraId: string;
  photo: ArchivePhoto;
  onClose: () => void;
  onSuccess?: () => void;
}

export function EditPhotoModal({
  eraId,
  photo,
  onClose,
  onSuccess,
}: EditPhotoModalProps) {
  const [url, setUrl] = useState(photo.url || '');
  const [event, setEvent] = useState(photo.event || photo.desc || '');
  const [photog, setPhotog] = useState(photo.photogKey || photo.photog || '');
  const [rawDate, setRawDate] = useState(''); 
  const [isSaving, setIsSaving] = useState(false);

  const formatCalendarDate = (dateStr: string) => {
    if (!dateStr) return photo.date || '';
    const dateObj = new Date(dateStr);
    if (isNaN(dateObj.getTime())) return photo.date || '';

    const monthAbbr = dateObj
      .toLocaleString('en-US', { month: 'short' })
      .toUpperCase();
    const day = dateObj.getDate();

    return `${monthAbbr} ${day}`;
  };

  const handleSave = async () => {
    if (!url.trim() || !database) return;
    setIsSaving(true);

    const formattedDate = formatCalendarDate(rawDate);

    try {
      const normalizedEraKey = eraId.toLowerCase().replace(/\s+/g, '-');
      const snap = await get(ref(database, 'gagaArchive'));
      const data = snap.val();
      const currentUser = sessionStorage.getItem('haus_editor_name') || 'OWNER';

      if (data) {
        Object.keys(data).forEach(async (eraKey) => {
          const cleanKey = eraKey.toLowerCase().replace(/\s+/g, '-');
          if (
            cleanKey === normalizedEraKey ||
            eraKey.toLowerCase() === eraId.toLowerCase()
          ) {
            const photos = data[eraKey]?.photos;
            if (typeof photos === 'object' && photos !== null) {
              Object.entries(photos).forEach(
                async ([photoId, photoObj]: [string, any]) => {
                  if (photoObj.url === photo.url) {
                    await set(
                      ref(database, `gagaArchive/${eraKey}/photos/${photoId}`),
                      {
                        ...photoObj,
                        url: url.trim(),
                        event: event.trim(),
                        desc: event.trim(),
                        photog: photog.trim(),
                        photogKey: photog.trim(),
                        date: formattedDate,
                      }
                    );
                  }
                }
              );
            }
          }
        });
      }

      await push(ref(database, 'hausActivityLog'), {
        user: currentUser,
        action: `Edited photo details in Era: ${eraId}`,
        timestamp: Date.now(),
      });

      alert('Photo updated successfully!');
      if (onSuccess) onSuccess();
      onClose();
    } catch (err: any) {
      alert('Failed: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9500] bg-black/90 flex items-center justify-center p-4 font-mono text-xs">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-md w-full p-6 space-y-4">
        <div className="flex justify-between items-center border-b border-neutral-800 pb-3">
          <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded font-bold uppercase">
            EDIT PHOTO
          </span>
          <h2 className="text-sm font-bold text-white uppercase tracking-widest">
            Edit Photo Details
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-neutral-400 hover:text-white cursor-pointer"
          >
            ×
          </button>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-neutral-400 mb-1">Image URL</label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full bg-black border border-neutral-800 rounded p-2 text-white"
            />
          </div>

          <div>
            <label className="block text-neutral-400 mb-1">Event / Title</label>
            <input
              type="text"
              value={event}
              onChange={(e) => setEvent(e.target.value)}
              className="w-full bg-black border border-neutral-800 rounded p-2 text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-neutral-400 mb-1">
                Photographer
              </label>
              <input
                type="text"
                value={photog}
                onChange={(e) => setPhotog(e.target.value)}
                className="w-full bg-black border border-neutral-800 rounded p-2 text-white"
              />
            </div>

            <div>
              <label className="block text-neutral-400 mb-1">
                Date (Calendar)
              </label>
              <input
                type="date"
                value={rawDate}
                onChange={(e) => setRawDate(e.target.value)}
                className="w-full bg-black border border-neutral-800 rounded p-2 text-white cursor-pointer scheme-dark"
              />
              {photo.date && !rawDate && (
                <p className="text-[10px] text-neutral-500 mt-1">
                  Current: {photo.date}
                </p>
              )}
            </div>
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
            disabled={isSaving}
            onClick={handleSave}
            className="px-4 py-2 bg-white text-black font-bold rounded text-xs hover:bg-neutral-200 cursor-pointer disabled:opacity-50"
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}