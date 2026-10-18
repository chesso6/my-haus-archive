'use client';

interface ContainerPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (newPage: number) => void;
}

export function ContainerPagination({
  currentPage,
  totalPages,
  onPageChange,
}: ContainerPaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 pt-8 border-t border-neutral-900 text-xs font-bold font-mono">
      <button
        type="button"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="px-3 py-2 bg-neutral-900 border border-neutral-800 rounded disabled:opacity-30 disabled:cursor-not-allowed hover:bg-neutral-800 transition-all cursor-pointer"
      >
        ‹ PREV CONTAINERS
      </button>

      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <button
          type="button"
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-3.5 py-2 rounded border font-bold transition-all cursor-pointer ${
            currentPage === page
              ? 'bg-white text-black border-white'
              : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:text-white'
          }`}
        >
          {page}
        </button>
      ))}

      <button
        type="button"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="px-3 py-2 bg-neutral-900 border border-neutral-800 rounded disabled:opacity-30 disabled:cursor-not-allowed hover:bg-neutral-800 transition-all cursor-pointer"
      >
        NEXT CONTAINERS ›
      </button>
    </div>
  );
}