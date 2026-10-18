'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ArchivePhoto } from '@/app/types';
import { PhotoPagination } from './PhotoPagination';
import { ContainerSidebar } from './ContainerSidebar';
import { DeleteContainerButton } from './owner/DeleteContainerButton';

interface PhotoContainerProps {
  eraId: string;
  sessionKey: string;
  photos: ArchivePhoto[];
  allPhotos: ArchivePhoto[];
  isOwner?: boolean;
  onSelectPhoto: (globalIndex: number) => void;
}

const PHOTOS_PER_PAGE = 10;

export function PhotoContainer({
  eraId,
  sessionKey,
  photos,
  allPhotos,
  isOwner = false,
  onSelectPhoto,
}: PhotoContainerProps) {
  const [localPage, setLocalPage] = useState(1);
  const [selectedTitle, setSelectedTitle] = useState('all');
  const [loadedImages, setLoadedImages] = useState<Record<number, boolean>>({});
  const [isPageChanging, setIsPageChanging] = useState(false);

  const uniqueTitles = Array.from(
    new Set(
      photos
        .map((p) => p.event || p.desc || sessionKey || 'Untitled')
        .filter((t) => Boolean(t) && t !== 'NONE')
    )
  );

  const filteredPhotosByTitle = photos.filter((p) => {
    if (selectedTitle === 'all') return true;
    return (p.event || p.desc) === selectedTitle;
  });

  const totalPhotos = filteredPhotosByTitle.length;
  const totalPages = Math.ceil(totalPhotos / PHOTOS_PER_PAGE) || 1;

  const startIdx = (localPage - 1) * PHOTOS_PER_PAGE;
  const currentPhotos = filteredPhotosByTitle.slice(
    startIdx,
    startIdx + PHOTOS_PER_PAGE
  );

  const handleTitleSelect = (title: string) => {
    setSelectedTitle(title);
    setLocalPage(1);
    setLoadedImages({});
  };

  const handlePageChange = (newPage: number) => {
    setIsPageChanging(true);
    setLoadedImages({});
    setLocalPage(newPage);

    setTimeout(() => {
      setIsPageChanging(false);
    }, 200);
  };

  return (
    <section 
      className="space-y-4 bg-neutral-950/90 rounded-2xl border border-neutral-900 overflow-hidden font-mono shadow-xl transform-gpu"
      style={{
        contentVisibility: 'auto',
        containIntrinsicSize: '300px',
      }}
    >
      <div className="flex items-center justify-between border-b border-neutral-800 p-4 bg-neutral-900/60">
        <div className="flex items-center gap-3">
          <span className="text-sm font-black text-orange-400 tracking-widest uppercase bg-black px-3 py-1 rounded-md border border-orange-500/40">
            {sessionKey}
          </span>
          <span className="text-xs text-neutral-500 font-bold">
            ({totalPhotos} Photos)
          </span>

          {isOwner && (
            <DeleteContainerButton
              eraId={eraId}
              sessionKey={sessionKey}
              onSuccess={() => window.location.reload()}
            />
          )}
        </div>

        <PhotoPagination
          currentPage={localPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>

      <div className="flex flex-col md:flex-row min-h-[200px]">
        <ContainerSidebar
          titles={uniqueTitles}
          selectedTitle={selectedTitle}
          onSelectTitle={handleTitleSelect}
        />

        <div className="flex-1 p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 bg-black/30">
          {isPageChanging ? (
            Array.from({ length: currentPhotos.length || 4 }).map((_, i) => (
              <div
                key={i}
                className="aspect-square bg-neutral-900/80 rounded-xl animate-pulse border border-neutral-800/60 flex items-center justify-center"
              >
                <span className="text-[9px] text-neutral-700 font-bold uppercase">
                  LOADING...
                </span>
              </div>
            ))
          ) : currentPhotos.length === 0 ? (
            <div className="col-span-full py-10 text-center text-xs text-neutral-600 uppercase tracking-widest">
              No photos found for this title filter.
            </div>
          ) : (
            currentPhotos.map((photo, index) => {
              const globalIdx = allPhotos.indexOf(photo);
              const isImageLoaded = loadedImages[index];

              return (
                <div
                  key={photo.url + index}
                  onClick={() => onSelectPhoto(globalIdx !== -1 ? globalIdx : 0)}
                  className="group relative aspect-square bg-neutral-900 rounded-xl overflow-hidden cursor-pointer border border-neutral-800/80 hover:border-orange-500 transition-all duration-150 shadow-md transform-gpu will-change-transform"
                >
                  {!isImageLoaded && (
                    <div className="absolute inset-0 bg-neutral-900 animate-pulse flex items-center justify-center">
                      <span className="text-[9px] text-neutral-700 font-bold uppercase">
                        LOADING...
                      </span>
                    </div>
                  )}

                  <Image
                    src={photo.url}
                    alt={photo.event || photo.desc || 'Archive Image'}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
                    loading="lazy"
                    decoding="async"
                    onLoadingComplete={() =>
                      setLoadedImages((prev) => ({ ...prev, [index]: true }))
                    }
                    className={`object-cover group-hover:scale-105 transition-transform duration-200 ${
                      isImageLoaded ? 'opacity-100' : 'opacity-0'
                    }`}
                    unoptimized
                  />

                  {(photo.event || photo.desc) && isImageLoaded && (
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-150 p-3 flex flex-col justify-end pointer-events-none">
                      <p className="text-[10px] text-neutral-300 font-bold line-clamp-2">
                        {photo.event || photo.desc}
                      </p>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}