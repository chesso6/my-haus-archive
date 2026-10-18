'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ref, onValue } from 'firebase/database';
import { database } from '@/app/lib/firebase';
import { ContentWarning } from '@/app/components/ContentWarning';
import { LobbySkeleton } from '@/app/components/skeletons/LobbySkeleton';
import { AddEraModal } from '@/app/components/owner/AddEraModal';

const ERAS = [
  { id: 'thefame', title: 'The Fame', type: 'studio', art: '/assets/images/thefame.png' },
  { id: 'monster', title: 'The Fame Monster', type: 'studio', art: '/assets/images/monster.png' },
  { id: 'btw', title: 'Born This Way', type: 'studio', art: '/assets/images/btw.png' },
  { id: 'artpop', title: 'ARTPOP', type: 'studio', art: '/assets/images/artpop.png' },
  { id: 'cheek', title: 'Cheek to Cheek', type: 'collab', art: '/assets/images/cheek.jpg' },
  { id: 'joanne', title: 'Joanne', type: 'studio', art: '/assets/images/joanne.png' },
  { id: 'chromatica', title: 'Chromatica', type: 'studio', art: '/assets/images/chromatica.png' },
  { id: 'love', title: 'Love for Sale', type: 'collab', art: '/assets/images/love.png' },
  { id: 'harlequin', title: 'Harlequin', type: 'studio', art: '/assets/images/harlequin.png' },
  { id: 'mayhem', title: 'Mayhem', type: 'studio', art: '/assets/images/mayhem.png' },
];

function normalizeEraId(id: string) {
  const clean = id.toLowerCase().replace(/[\s-]+/g, '');
  if (clean === 'btw' || clean.includes('bornthisway')) return 'btw';
  if (clean.includes('thefame') && !clean.includes('monster')) return 'thefame';
  return clean;
}

interface EraCardData {
  id: string;
  title: string;
  type: string;
  art: string;
  photoCount: number;
}

export default function LobbyPage() {
  const [filter, setFilter] = useState<'all' | 'studio' | 'collab'>('all');
  const [eras, setEras] = useState<EraCardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddEraModal, setShowAddEraModal] = useState(false);
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    const ownerMode = sessionStorage.getItem('haus_owner_mode') === 'true';
    setIsOwner(ownerMode);
  }, []);

  useEffect(() => {
    if (!database) {
      setEras(ERAS.map((e) => ({ ...e, photoCount: 0 })));
      setLoading(false);
      return;
    }

    const archiveRef = ref(database, 'gagaArchive');
    const unsubscribe = onValue(archiveRef, (snapshot) => {
      const data = snapshot.val() || {};

      const mergedList: EraCardData[] = ERAS.map((baseEra) => {
        const normBase = normalizeEraId(baseEra.id);
        const matchedKey = Object.keys(data).find(
          (k) => normalizeEraId(k) === normBase
        );

        if (matchedKey && data[matchedKey]) {
          const rawPhotos = data[matchedKey]?.photos || {};
          const photoArray = Array.isArray(rawPhotos)
            ? rawPhotos
            : Object.values(rawPhotos);

          return {
            ...baseEra,
            photoCount: photoArray.length,
          };
        }

        return {
          ...baseEra,
          photoCount: 0,
        };
      });

      Object.keys(data).forEach((key) => {
        const normK = normalizeEraId(key);
        const exists = ERAS.some((b) => normalizeEraId(b.id) === normK);

        if (!exists) {
          const rawPhotos = data[key]?.photos || {};
          const photoArray = Array.isArray(rawPhotos)
            ? rawPhotos
            : Object.values(rawPhotos);

          mergedList.push({
            id: key,
            title: data[key]?.title || key.toUpperCase(),
            type: 'studio',
            art: '/assets/images/mayhem.png',
            photoCount: photoArray.length,
          });
        }
      });

      setEras(mergedList);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const filteredEras = eras.filter((era) => {
    if (filter === 'all') return true;
    return era.type === filter;
  });

  return (
    <main className="min-h-screen bg-black text-white p-6 md:p-12">
      <ContentWarning />

      <header className="text-center space-y-4 mb-12">
        <h1 className="text-4xl md:text-6xl font-black tracking-widest uppercase">
          MY HAUS
        </h1>
        <p className="text-xs uppercase tracking-widest text-neutral-400 font-mono">
          PHOTOGRAPHY ANTHOLOGY
        </p>

        <nav className="flex justify-center gap-6 pt-4 text-xs font-mono uppercase tracking-wider">
          <button
            type="button"
            onClick={() => setFilter('studio')}
            className={`cursor-pointer transition-colors ${
              filter === 'studio'
                ? 'text-white font-bold underline underline-offset-8'
                : 'text-neutral-500 hover:text-neutral-300'
            }`}
          >
            Studio Albums
          </button>
          <button
            type="button"
            onClick={() => setFilter('collab')}
            className={`cursor-pointer transition-colors ${
              filter === 'collab'
                ? 'text-white font-bold underline underline-offset-8'
                : 'text-neutral-500 hover:text-neutral-300'
            }`}
          >
            Collaborative
          </button>
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`cursor-pointer transition-colors ${
              filter === 'all'
                ? 'text-white font-bold underline underline-offset-8'
                : 'text-neutral-500 hover:text-neutral-300'
            }`}
          >
            All
          </button>
        </nav>

        {isOwner && (
          <div className="pt-2">
            <button
              type="button"
              onClick={() => setShowAddEraModal(true)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition-all cursor-pointer font-mono"
            >
              + ADD NEW ERA
            </button>
          </div>
        )}
      </header>

      {loading ? (
        <div className="max-w-7xl mx-auto">
          <LobbySkeleton />
        </div>
      ) : (
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {filteredEras.map((era) => (
            <Link
              key={era.id}
              href={`/era/${era.id}`}
              className="group relative aspect-square bg-neutral-900 rounded-2xl overflow-hidden border border-neutral-800 hover:border-neutral-500 transition-all shadow-lg"
            >
              <Image
                src={era.art}
                alt={era.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100"
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-6">
                <h2 className="text-lg font-black uppercase tracking-wider text-white">
                  {era.title}
                </h2>
                {era.photoCount > 0 && (
                  <p className="text-[10px] text-neutral-400 font-mono font-bold mt-1 tracking-widest uppercase">
                    {era.photoCount} PHOTOS
                  </p>
                )}
              </div>
            </Link>
          ))}
        </section>
      )}

      {showAddEraModal && (
        <AddEraModal
          onClose={() => setShowAddEraModal(false)}
          onSuccess={() => window.location.reload()}
        />
      )}
    </main>
  );
}