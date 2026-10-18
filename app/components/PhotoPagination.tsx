'use client';

interface PhotoPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (newPage: number) => void;
}

export function PhotoPagination({
  currentPage,
  totalPages,
  onPageChange,
}: PhotoPaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center gap-2 font-mono">
      <button
        type="button"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="px-2 py-1 bg-neutral-900 border border-neutral-800 rounded text-[10px] font-bold disabled:opacity-30 hover:bg-neutral-800 transition-all cursor-pointer"
      >
        ‹
      </button>

      <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">
        PAGE {currentPage} OF {totalPages}
      </span>

      <button
        type="button"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="px-2 py-1 bg-neutral-900 border border-neutral-800 rounded text-[10px] font-bold disabled:opacity-30 hover:bg-neutral-800 transition-all cursor-pointer"
      >
        ›
      </button>
    </div>
  );
}