'use client';

export function PhotoContainerSkeleton() {
  return (
    <div className="space-y-4 bg-neutral-950 rounded-2xl border border-neutral-900 overflow-hidden font-mono animate-pulse">
      <div className="flex items-center justify-between border-b border-neutral-800 p-4 bg-neutral-900/50">
        <div className="flex items-center gap-3">
          <div className="h-7 w-32 bg-neutral-800 rounded-md"></div>
          <div className="h-4 w-24 bg-neutral-900 rounded"></div>
        </div>

        <div className="flex items-center gap-2">
          <div className="h-6 w-6 bg-neutral-900 rounded"></div>
          <div className="h-4 w-20 bg-neutral-900 rounded"></div>
          <div className="h-6 w-6 bg-neutral-900 rounded"></div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row min-h-[220px]">
        <div className="w-48 bg-black/60 border-r border-neutral-800 p-3 space-y-3 shrink-0 hidden md:block">
          <div className="h-3 w-20 bg-neutral-800 rounded"></div>
          <div className="space-y-2">
            <div className="h-6 w-full bg-neutral-900 rounded"></div>
            <div className="h-6 w-full bg-neutral-900/60 rounded"></div>
            <div className="h-6 w-full bg-neutral-900/60 rounded"></div>
          </div>
        </div>

        <div className="flex-1 p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {Array.from({ length: 10 }).map((_, index) => (
            <div
              key={index}
              className="aspect-square bg-neutral-900/80 rounded-xl border border-neutral-800/50"
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function ContainerListSkeleton() {
  return (
    <div className="space-y-12 max-w-7xl mx-auto">
      <PhotoContainerSkeleton />
      <PhotoContainerSkeleton />
    </div>
  );
}