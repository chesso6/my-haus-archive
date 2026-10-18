'use client';

interface EditorControlsProps {
  onOpenAddPhoto: () => void;
  onLogout: () => void;
}

export function EditorControls({ onOpenAddPhoto, onLogout }: EditorControlsProps) {
  return (
    <div className="flex items-center gap-2 font-mono">
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