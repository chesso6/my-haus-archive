'use client';

import { DeleteEraButton } from './DeleteEraButton';

interface OwnerControlsProps {
  eraId: string;
  onOpenLog: () => void;
  onOpenStats: () => void;
  onOpenEditors: () => void;
  onOpenAddEra: () => void;
  onOpenAddPhoto: () => void;
  onLogout: () => void;
}

export function OwnerControls({
  eraId,
  onOpenLog,
  onOpenStats,
  onOpenEditors,
  onOpenAddEra,
  onOpenAddPhoto,
  onLogout,
}: OwnerControlsProps) {
  return (
    <div className="flex items-center gap-2 font-mono flex-wrap">
      <button
        type="button"
        onClick={onOpenLog}
        className="px-2.5 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 font-bold text-[11px] border border-neutral-800 rounded-lg transition-all cursor-pointer"
      >
        LOG
      </button>

      <button
        type="button"
        onClick={onOpenStats}
        className="px-2.5 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 font-bold text-[11px] border border-neutral-800 rounded-lg transition-all cursor-pointer"
      >
        STATS
      </button>

      <button
        type="button"
        onClick={onOpenEditors}
        className="px-2.5 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 font-bold text-[11px] border border-neutral-800 rounded-lg transition-all cursor-pointer"
      >
        EDITORS
      </button>

      <button
        type="button"
        onClick={onOpenAddEra}
        className="px-2.5 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-[11px] border border-neutral-700 rounded-lg transition-all cursor-pointer"
      >
        + NEW ERA
      </button>

      <button
        type="button"
        onClick={onOpenAddPhoto}
        className="px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-black font-black text-xs rounded-lg transition-all cursor-pointer uppercase tracking-wider"
      >
        + ADD PHOTO
      </button>

      <DeleteEraButton eraId={eraId} />

      <button
        type="button"
        onClick={onLogout}
        className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-orange-400 font-bold text-xs rounded-lg transition-all cursor-pointer"
      >
        LOGOUT
      </button>
    </div>
  );
}