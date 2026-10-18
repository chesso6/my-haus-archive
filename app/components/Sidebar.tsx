'use client';

import { PhotographersFilter } from './PhotographersFilter';
import { ErasFilter } from './ErasFilter';
import { SidebarSkeleton } from './skeletons/SidebarSkeleton';

interface SidebarProps {
  photographers: string[];
  selectedPhotog: string;
  onSelectPhotog: (photog: string) => void;
  eras: { id: string; title: string }[];
  loading?: boolean;
}

export function Sidebar({
  photographers,
  selectedPhotog,
  onSelectPhotog,
  eras,
  loading = false,
}: SidebarProps) {
  return (
    <aside className="w-64 bg-black border-r border-neutral-800 p-6 flex flex-col gap-6 shrink-0 min-h-screen font-mono">
      {loading ? (
        <SidebarSkeleton />
      ) : (
        <>
          <PhotographersFilter
            photographers={photographers}
            selectedPhotog={selectedPhotog}
            onSelectPhotog={onSelectPhotog}
          />

          <hr className="border-neutral-900" />

          <ErasFilter eras={eras} />
        </>
      )}
    </aside>
  );
}