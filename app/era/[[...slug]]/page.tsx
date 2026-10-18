'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect, use, Suspense } from 'react';
import Link from 'next/link';
import { ref, get } from 'firebase/database';
import { database } from '@/app/lib/firebase';
import { Lightbox } from '@/app/components/Lightbox';
import { Sidebar } from '@/app/components/Sidebar';

import { OwnerControls } from '@/app/components/owner/OwnerControls';
import { ActivityLogModal, StatsModal, EditorsModal } from '@/app/components/owner/OwnerModals';
import { AddEraModal } from '@/app/components/owner/AddEraModal';

import { EditorControls } from '@/app/components/editor/EditorControls';
import { AddPhotoModal } from '@/app/components/editor/AddPhotoModal';

import { ViewerControls } from '@/app/components/roles/ViewerControls';
import { PhotoContainer } from '@/app/components/PhotoContainer';
import { ContainerPagination } from '@/app/components/ContainerPagination';
import { ContainerListSkeleton } from '@/app/components/skeletons/PhotoContainerSkeleton';
import { ArchivePhoto } from '@/app/types';

interface PageProps {
  params: Promise<{ slug?: string[] }>;
}

const OWNER_PASSWORD = process.env.NEXT_PUBLIC_OWNER_PASSWORD || 'HAUSOFGAGA';

const ERAS_LIST = [
  { id: 'thefame', title: 'The Fame' },
  { id: 'monster', title: 'The Fame Monster' },
  { id: 'btw', title: 'Born This Way' },
  { id: 'artpop', title: 'ARTPOP' },
  { id: 'cheek', title: 'Cheek to Cheek' },
  { id: 'joanne', title: 'Joanne' },
  { id: 'chromatica', title: 'Chromatica' },
  { id: 'love', title: 'Love for Sale' },
  { id: 'harlequin', title: 'Harlequin' },
  { id: 'mayhem', title: 'Mayhem' },
];

function EraExhibitionContent({ slug = [] }: { slug: string[] }) {
  const eraId = slug[0] || 'artpop';
  const targetPhotoIndex = slug[3] ? parseInt(slug[3], 10) - 1 : null;

  const [sessionGroups, setSessionGroups] = useState<Record<string, ArchivePhoto[]>>({});
  const [allPhotos, setAllPhotos] = useState<ArchivePhoto[]>([]);
  const [photographers, setPhotographers] = useState<string[]>([]);
  const [totalContainerPages, setTotalContainerPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const [mainPage, setMainPage] = useState(1);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);
  const [selectedPhotog, setSelectedPhotog] = useState('all');

  const [showAddModal, setShowAddModal] = useState(false);
  const [showAddEraModal, setShowAddEraModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showLogModal, setShowLogModal] = useState(false);
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [showEditorsModal, setShowEditorsModal] = useState(false);

  const [loginName, setLoginName] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [loginError, setLoginError] = useState('');

  const [isOwner, setIsOwner] = useState(false);
  const [isEditor, setIsEditor] = useState(false);

  useEffect(() => {
    const ownerMode = sessionStorage.getItem('haus_owner_mode') === 'true';
    const editorName = sessionStorage.getItem('haus_editor_name');
    setIsOwner(ownerMode);
    setIsEditor(!ownerMode && Boolean(editorName));
  }, []);

  useEffect(() => {
    if (!eraId) return;

    setLoading(true);
    fetch(`/api/era/${eraId}?page=${mainPage}&photog=${selectedPhotog}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.sessionGroups) {
          setSessionGroups(data.sessionGroups);
          setTotalContainerPages(data.totalContainerPages || 1);
          setPhotographers(data.photographers || []);
          setAllPhotos(data.allPhotos || []);

          if (
            targetPhotoIndex !== null &&
            !isNaN(targetPhotoIndex) &&
            data.allPhotos &&
            data.allPhotos[targetPhotoIndex]
          ) {
            setSelectedPhotoIndex(targetPhotoIndex);
          }
        } else {
          setSessionGroups({});
          setTotalContainerPages(1);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [eraId, mainPage, selectedPhotog, targetPhotoIndex]);

  useEffect(() => {
    setMainPage(1);
  }, [selectedPhotog, eraId]);

  const handleContainerPageChange = (newPage: number) => {
    setLoading(true);
    setMainPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogin = async () => {
    setLoginError('');
    const nameVal = loginName.trim();
    const passVal = loginPass.trim();

    if (passVal.toUpperCase() === OWNER_PASSWORD.toUpperCase()) {
      sessionStorage.setItem('haus_owner_mode', 'true');
      sessionStorage.removeItem('haus_editor_name');
      setIsOwner(true);
      setIsEditor(false);
      setShowLoginModal(false);
      return;
    }

    if (!database) {
      setLoginError('NO CONNECTION');
      return;
    }

    try {
      const snap = await get(ref(database, 'hausEditors'));
      const editors = snap.val() || {};
      const match = Object.values(editors).find(
        (e: any) =>
          e.password === passVal &&
          e.name.toLowerCase() === nameVal.toLowerCase()
      );

      if (match) {
        sessionStorage.setItem('haus_editor_name', (match as any).name);
        sessionStorage.removeItem('haus_owner_mode');
        setIsOwner(false);
        setIsEditor(true);
        setShowLoginModal(false);
      } else {
        setLoginError('UNAUTHORIZED');
      }
    } catch {
      setLoginError('LOGIN FAILED');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('haus_owner_mode');
    sessionStorage.removeItem('haus_editor_name');
    setIsOwner(false);
    setIsEditor(false);
  };

  const currentContainerKeys = Object.keys(sessionGroups);

  return (
    <div className="flex min-h-screen bg-black/60 text-white font-mono">
      <Sidebar
        photographers={photographers}
        selectedPhotog={selectedPhotog}
        onSelectPhotog={(p) => setSelectedPhotog(p)}
        eras={ERAS_LIST}
        loading={loading}
      />

      <main className="flex-1 p-6 md:p-12 overflow-y-auto">
        <header className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-4 border-b border-neutral-800">
          <Link
            href="/"
            className="text-xs font-bold tracking-widest text-neutral-400 hover:text-white transition-colors"
          >
            ← BACK TO LOBBY
          </Link>

          <h1 className="text-xl md:text-2xl font-black uppercase tracking-widest">
            {eraId}
          </h1>

          <div className="flex items-center gap-2">
            {!isOwner && !isEditor && (
              <ViewerControls onOpenLogin={() => setShowLoginModal(true)} />
            )}

            {isEditor && (
              <EditorControls
                onOpenAddPhoto={() => setShowAddModal(true)}
                onLogout={handleLogout}
              />
            )}

            {isOwner && (
              <OwnerControls
                eraId={eraId}
                onOpenLog={() => setShowLogModal(true)}
                onOpenStats={() => setShowStatsModal(true)}
                onOpenEditors={() => setShowEditorsModal(true)}
                onOpenAddEra={() => setShowAddEraModal(true)}
                onOpenAddPhoto={() => setShowAddModal(true)}
                onLogout={handleLogout}
              />
            )}
          </div>
        </header>

        {loading ? (
          <ContainerListSkeleton />
        ) : currentContainerKeys.length === 0 ? (
          <div className="py-20 text-center text-xs text-neutral-500 uppercase tracking-widest">
            No photos found for this page.
          </div>
        ) : (
          <div className="space-y-12 max-w-7xl mx-auto">
            {currentContainerKeys.map((sessionKey) => (
              <PhotoContainer
                key={sessionKey}
                eraId={eraId}
                sessionKey={sessionKey}
                photos={sessionGroups[sessionKey] || []}
                allPhotos={allPhotos}
                isOwner={isOwner}
                onSelectPhoto={(idx) => setSelectedPhotoIndex(idx)}
              />
            ))}

            <ContainerPagination
              currentPage={mainPage}
              totalPages={totalContainerPages}
              onPageChange={handleContainerPageChange}
            />
          </div>
        )}

        {selectedPhotoIndex !== null && (
          <Lightbox
            photos={allPhotos}
            initialIndex={selectedPhotoIndex}
            eraId={eraId}
            onClose={() => setSelectedPhotoIndex(null)}
            canEdit={isOwner || isEditor}
            canDelete={isOwner}
            onSuccess={() => window.location.reload()}
          />
        )}

        {showAddModal && (
          <AddPhotoModal
            onClose={() => setShowAddModal(false)}
            eras={ERAS_LIST}
          />
        )}

        {showAddEraModal && (
          <AddEraModal
            onClose={() => setShowAddEraModal(false)}
            onSuccess={() => window.location.reload()}
          />
        )}

        {showLogModal && <ActivityLogModal onClose={() => setShowLogModal(false)} />}
        {showStatsModal && <StatsModal onClose={() => setShowStatsModal(false)} />}
        {showEditorsModal && <EditorsModal onClose={() => setShowEditorsModal(false)} />}

        {showLoginModal && (
          <div className="fixed inset-0 z-[9000] bg-black/90 flex items-center justify-center p-4">
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-sm w-full p-6 space-y-4">
              <div className="flex justify-between items-center border-b border-neutral-800 pb-3">
                <span className="text-xs bg-neutral-800 text-neutral-400 px-2 py-0.5 rounded font-bold tracking-widest">
                  ACCESS
                </span>
                <h2 className="text-sm font-bold text-white uppercase tracking-widest">
                  Login
                </h2>
                <button
                  type="button"
                  onClick={() => setShowLoginModal(false)}
                  className="text-neutral-400 hover:text-white"
                >
                  ×
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-neutral-400 mb-1">Name</label>
                  <input
                    type="text"
                    value={loginName}
                    onChange={(e) => setLoginName(e.target.value)}
                    className="w-full bg-black border border-neutral-800 rounded p-2 text-white"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label className="block text-neutral-400 mb-1">Password</label>
                  <input
                    type="password"
                    value={loginPass}
                    onChange={(e) => setLoginPass(e.target.value)}
                    className="w-full bg-black border border-neutral-800 rounded p-2 text-white"
                    placeholder="••••••••"
                  />
                </div>

                {loginError && (
                  <p className="text-rose-500 text-[11px] font-bold tracking-widest">
                    {loginError}
                  </p>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setShowLoginModal(false)}
                  className="px-4 py-2 bg-neutral-800 text-neutral-300 rounded text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleLogin}
                  className="px-4 py-2 bg-white text-black font-bold rounded text-xs hover:bg-neutral-200"
                >
                  Enter
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default function EraExhibitionPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const slug = resolvedParams?.slug || [];

  return (
    <Suspense fallback={<ContainerListSkeleton />}>
      <EraExhibitionContent slug={slug} />
    </Suspense>
  );
}