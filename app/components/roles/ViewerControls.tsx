'use client';

interface ViewerControlsProps {
  onOpenLogin: () => void;
}

export function ViewerControls({ onOpenLogin }: ViewerControlsProps) {
  return (
    <button
      type="button"
      onClick={onOpenLogin}
      className="px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white border border-neutral-800 font-bold text-xs rounded-lg transition-all cursor-pointer font-mono"
    >
      LOGIN
    </button>
  );
}