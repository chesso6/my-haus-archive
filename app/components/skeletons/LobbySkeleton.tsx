'use client';

export function LobbySkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-pulse">
      {Array.from({ length: 8 }).map((_, index) => (
        <div
          key={index}
          className="aspect-square bg-neutral-900 border border-neutral-800/80 rounded-2xl p-6 flex flex-col justify-end space-y-2"
        >
          <div className="h-5 w-3/4 bg-neutral-800 rounded"></div>
          <div className="h-3 w-1/2 bg-neutral-800/60 rounded"></div>
        </div>
      ))}
    </div>
  );
}