'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ref, get, set, push } from 'firebase/database';
import { database } from '@/app/lib/firebase';
import { ArchivePhoto } from '@/app/types';
import { EditPhotoModal } from './editor/EditPhotoModal';

interface LightboxProps {
  photos: ArchivePhoto[];
  initialIndex: number;
  eraId?: string;
  onClose: () => void;
  canEdit?: boolean;
  canDelete?: boolean;
  onSuccess?: () => void;
}

export function Lightbox({
  photos,
  initialIndex,
  eraId = '',
  onClose,
  canEdit = false,
  canDelete = false,
  onSuccess,
}: LightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [showEditModal, setShowEditModal] = useState(false);

  const currentPhoto = photos[currentIndex];

  useEffect(() => {
    if (currentPhoto && currentPhoto.id) {
      window.history.replaceState(null, '', `/${currentPhoto.id}`);
    }

    return () => {
      if (eraId) {
        window.history.replaceState(null, '', `/era/${eraId}`);
      }
    };
  }, [currentIndex, currentPhoto, eraId]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, photos]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : photos.length - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < photos.length - 1 ? prev + 1 : 0));
  };

  const handleDeletePhoto = async () => {
    if (!currentPhoto) return;
    if (!confirm('Are you sure you want to delete this photo permanently?')) return;
    if (!database) return;

    try {
      const normalizedEraKey = eraId.toLowerCase().replace(/\s+/g, '-');
      const dbRef = ref(database, 'gagaArchive');
      const snapshot = await get(dbRef);
      const data = snapshot.val();

      if (data) {
        Object.keys(data).forEach(async (eraKey) => {
          const cleanKey = eraKey.toLowerCase().replace(/\s+/g, '-');
          if (cleanKey === normalizedEraKey || eraKey.toLowerCase() === eraId.toLowerCase()) {
            const eraPhotos = data[eraKey]?.photos;
            if (typeof eraPhotos === 'object' && eraPhotos !== null) {
              Object.entries(eraPhotos).forEach(async ([pKey, pVal]: [string, any]) => {
                if (pVal.url === currentPhoto.url) {
                  await set(ref(database, `gagaArchive/${eraKey}/photos/${pKey}`), null);
                }
              });
            }
          }
        });
      }

      await push(ref(database, 'hausActivityLog'), {
        user: sessionStorage.getItem('haus_editor_name') || 'OWNER',
        action: `Deleted photo from Era: ${eraId}`,
        timestamp: Date.now(),
      });

      alert('Photo deleted successfully!');
      if (onSuccess) onSuccess();
      onClose();
    } catch (err: any) {
      alert('Failed to delete photo: ' + err.message);
    }
  };

  if (!currentPhoto) return null;

  return (
    <div className="fixed inset-0 z-[9900] bg-black/95 flex flex-col justify-between p-4 md:p-8 font-mono text-white">
      <div className="flex justify-between items-center border-b border-neutral-800 pb-4">
        <div className="flex items-center gap-3">
          <span className="text-xs bg-neutral-900 px-3 py-1 rounded border border-neutral-800 font-bold uppercase">
            {currentIndex + 1} / {photos.length}
          </span>
          <span className="text-xs text-neutral-400 font-bold truncate max-w-xs md:max-w-md">
            {currentPhoto.event || currentPhoto.desc || 'ARCHIVE PHOTO'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {canEdit && (
            <button
              type="button"
              onClick={() => setShowEditModal(true)}
              className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-emerald-400 font-bold text-xs rounded border border-neutral-700 transition-all cursor-pointer"
            >
              ✎ EDIT
            </button>
          )}

          {canDelete && (
            <button
              type="button"
              onClick={handleDeletePhoto}
              className="px-3 py-1.5 bg-rose-600/20 hover:bg-rose-600 text-rose-400 hover:text-white font-bold text-xs rounded border border-rose-600/40 transition-all cursor-pointer"
            >
              🗑 DELETE
            </button>
          )}

          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-bold text-xs rounded border border-neutral-700 transition-all cursor-pointer"
          >
            ✕ CLOSE
          </button>
        </div>
      </div>

      <div className="relative flex-1 flex items-center justify-center my-4 overflow-hidden">
        <button
          type="button"
          onClick={handlePrev}
          className="absolute left-2 md:left-6 z-10 p-3 bg-black/70 hover:bg-black text-white border border-neutral-800 rounded-full text-lg font-bold transition-all cursor-pointer"
        >
          ‹
        </button>

        <div className="relative w-full h-full max-w-5xl max-h-[75vh]">
          <Image
            src={currentPhoto.url}
            alt={currentPhoto.event || currentPhoto.desc || 'Full View'}
            fill
            className="object-contain"
            unoptimized
          />
        </div>

        <button
          type="button"
          onClick={handleNext}
          className="absolute right-2 md:right-6 z-10 p-3 bg-black/70 hover:bg-black text-white border border-neutral-800 rounded-full text-lg font-bold transition-all cursor-pointer"
        >
          ›
        </button>
      </div>

      <div className="border-t border-neutral-800 pt-3 text-center text-xs text-neutral-400 flex flex-col md:flex-row justify-between items-center px-4 gap-2 font-mono">
        <div className="flex items-center gap-2">
          {currentPhoto.eraTitle && (
            <span className="bg-orange-500 text-black font-black text-[10px] px-2 py-0.5 rounded uppercase">
              ERA: {currentPhoto.eraTitle}
            </span>
          )}
          <span className="text-orange-400 font-bold text-[11px] bg-orange-950/40 px-2 py-0.5 border border-orange-500/50 rounded">
            ID: {currentPhoto.id || 'N/A'}
          </span>
        </div>

        <div className="flex items-center gap-4 text-[11px]">
          <span>PHOTOGRAPHER: {currentPhoto.photog || currentPhoto.photogKey || 'UNKNOWN'}</span>
          <span className="text-white font-black bg-neutral-900 border border-neutral-800 px-2 py-0.5 rounded">
            DATE: {currentPhoto.date || 'UNKNOWN DATE'}
          </span>
        </div>
      </div>

      {showEditModal && (
        <EditPhotoModal
          eraId={eraId}
          photo={currentPhoto}
          onClose={() => setShowEditModal(false)}
          onSuccess={onSuccess}
        />
      )}
    </div>
  );
}