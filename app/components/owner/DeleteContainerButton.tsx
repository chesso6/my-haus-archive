'use client';

import { ref, get, set, push } from 'firebase/database';
import { database } from '@/app/lib/firebase';
import { getSessionKey } from '@/app/lib/utils';

interface DeleteContainerButtonProps {
  eraId: string;
  sessionKey: string;
  onSuccess?: () => void;
}

export function DeleteContainerButton({
  eraId,
  sessionKey,
  onSuccess,
}: DeleteContainerButtonProps) {
  const handleDeleteContainer = async () => {
    if (
      !confirm(
        `ARE YOU SURE YOU WANT TO DELETE THE CONTAINER: "${sessionKey}"?\nThis will remove ONLY photos inside this specific session.`
      )
    ) {
      return;
    }

    if (!database) {
      alert('Database connection not available.');
      return;
    }

    try {
      const normalizedEraKey = eraId.toLowerCase().replace(/\s+/g, '-');
      const dbRef = ref(database, 'gagaArchive');
      const snapshot = await get(dbRef);
      const data = snapshot.val();

      if (!data) return;

      const editorName = sessionStorage.getItem('haus_editor_name') || 'OWNER';

      for (const eraKey of Object.keys(data)) {
        const cleanKey = eraKey.toLowerCase().replace(/\s+/g, '-');
        if (cleanKey === normalizedEraKey || eraKey.toLowerCase() === eraId.toLowerCase()) {
          const photosData = data[eraKey]?.photos;

          if (Array.isArray(photosData)) {
            const remainingPhotos = photosData.filter(
              (p: any) => getSessionKey(p) !== sessionKey
            );
            await set(ref(database, `gagaArchive/${eraKey}/photos`), remainingPhotos);
          } else if (typeof photosData === 'object' && photosData !== null) {
            const updatedPhotosObj: Record<string, any> = {};
            Object.entries(photosData).forEach(([photoId, photoObj]: [string, any]) => {
              if (getSessionKey(photoObj) !== sessionKey) {
                updatedPhotosObj[photoId] = photoObj;
              }
            });
            await set(ref(database, `gagaArchive/${eraKey}/photos`), updatedPhotosObj);
          }
        }
      }

      await push(ref(database, 'hausActivityLog'), {
        user: editorName,
        action: `Deleted container "${sessionKey}" from Era: ${eraId}`,
        timestamp: Date.now(),
      });

      alert(`Container "${sessionKey}" has been deleted.`);
      if (onSuccess) onSuccess();
    } catch (err: any) {
      alert('Failed to delete container: ' + err.message);
    }
  };

  return (
    <button
      type="button"
      onClick={handleDeleteContainer}
      className="px-2 py-1 bg-rose-600/20 hover:bg-rose-600 text-rose-400 hover:text-white border border-rose-600/30 rounded text-[10px] font-bold uppercase transition-all cursor-pointer font-mono"
      title="Delete Entire Container"
    >
      🗑 DELETE CONTAINER
    </button>
  );
}