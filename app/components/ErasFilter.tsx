'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface EraItem {
  id: string;
  title: string;
}

interface ErasFilterProps {
  eras: EraItem[];
}

export function ErasFilter({ eras }: ErasFilterProps) {
  const pathname = usePathname();

  return (
    <div className="space-y-3 font-mono text-xs">
      <h5 className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest px-1">
        Eras
      </h5>

      <div className="space-y-1">
        {eras.map((era) => {
          const isActive = pathname === `/era/${era.id}`;

          return (
            <Link
              key={era.id}
              href={`/era/${era.id}`}
              className={`block px-2 py-1.5 rounded transition-all font-black uppercase ${
                isActive
                  ? 'bg-orange-500 text-black'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
              }`}
            >
              {era.title}
            </Link>
          );
        })}
      </div>
    </div>
  );
}