'use client';

import Link from 'next/link';
import Image from 'next/image';

interface EraCardProps {
  id: string;
  title: string;
  coverUrl?: string;
  photoCount?: number;
}

export function EraCard({ id, title, coverUrl, photoCount = 0 }: EraCardProps) {
  return (
    <Link
      href={`/era/${id}`}
      className="group relative bg-neutral-950 border border-neutral-900 hover:border-neutral-700 rounded-2xl overflow-hidden transition-all duration-300 flex flex-col font-mono shadow-md"
    >
      <div className="relative aspect-[4/5] bg-neutral-900 overflow-hidden">
        {coverUrl ? (
          <Image
            src={coverUrl}
            alt={title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            unoptimized
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-neutral-700 font-bold text-xs uppercase">
            NO COVER
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity"></div>
      </div>

      <div className="p-4 bg-neutral-950 flex flex-col justify-between flex-1 border-t border-neutral-900">
        <h3 className="text-sm font-black text-white uppercase tracking-wider group-hover:text-emerald-400 transition-colors">
          {title}
        </h3>
        <p className="text-[11px] text-neutral-500 font-bold mt-1">
          {photoCount} ARCHIVED PHOTOS
        </p>
      </div>
    </Link>
  );
}