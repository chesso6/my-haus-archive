'use client';

interface OwnerControlsProps {
  onOpenLog: () => void;
  onOpenStats: () => void;
  onOpenEditors: () => void;
  onOpenAddPhoto: () => void;
  onLogout: () => void;
}

export function OwnerControls({
  onOpenLog,
  onOpenStats,
  onOpenEditors,
  onOpenAddPhoto,
  onLogout,
}: OwnerControlsProps) {
  return (
    <div className="flex items-center gap-2 font-mono">
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
        onClick={onOpenAddPhoto}
        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg transition-all cursor-pointer"
      >
        + ADD PHOTO
      </button>

      <button
        type="button"
        onClick={onLogout}
        className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-rose-400 font-bold text-xs rounded-lg transition-all cursor-pointer"
      >
        LOGOUT
      </button>
    </div>
  );
}