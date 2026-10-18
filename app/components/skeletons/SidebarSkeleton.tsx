'use client';

export function SidebarSkeleton() {
  return (
    <div className="space-y-6 font-mono animate-pulse">
      <div className="space-y-3">
        <div className="h-3 w-28 bg-neutral-800 rounded"></div>
        <div className="h-8 w-full bg-neutral-900 rounded border border-neutral-800/60"></div>
        <div className="space-y-1.5 pt-1">
          <div className="h-6 w-full bg-neutral-900/90 rounded"></div>
          <div className="h-6 w-full bg-neutral-900/60 rounded"></div>
          <div className="h-6 w-full bg-neutral-900/60 rounded"></div>
          <div className="h-6 w-full bg-neutral-900/40 rounded"></div>
        </div>
      </div>

      <hr className="border-neutral-900" />

      <div className="space-y-3">
        <div className="h-3 w-16 bg-neutral-800 rounded"></div>
        <div className="space-y-1.5">
          <div className="h-6 w-full bg-neutral-900/90 rounded"></div>
          <div className="h-6 w-full bg-neutral-900/60 rounded"></div>
          <div className="h-6 w-full bg-neutral-900/60 rounded"></div>
        </div>
      </div>
    </div>
  );
}