import { NextResponse } from 'next/server';
import { ref, get } from 'firebase/database';
import { database } from '@/app/lib/firebase';
import { getSessionKey, generatePhotoId } from '@/app/lib/utils';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ eraId: string }> }
) {
  const { eraId } = await params;
  const { searchParams } = new URL(request.url);

  const containerPage = parseInt(searchParams.get('page') || '1', 10);
  const containersPerPage = 5;
  const photogFilter = searchParams.get('photog') || 'all';

  if (!database) {
    return NextResponse.json({ error: 'Database connection failed' }, { status: 500 });
  }

  try {
    const dbRef = ref(database, 'gagaArchive');
    const snapshot = await get(dbRef);
    const data = snapshot.val();

    if (!data) {
      return NextResponse.json({ sessionGroups: {}, totalContainerPages: 1, photographers: [], allPhotos: [] });
    }

    const normalizedKey = eraId.toLowerCase().replace(/\s+/g, '-');
    let matchedPhotos: any[] = [];

    Object.keys(data).forEach((key) => {
      const currentKeyClean = key.toLowerCase().replace(/\s+/g, '-');
      if (
        currentKeyClean === normalizedKey ||
        key.toLowerCase() === eraId.toLowerCase() ||
        (normalizedKey === 'btw' && currentKeyClean.includes('born-this-way')) ||
        (normalizedKey === 'thefame' && currentKeyClean.includes('the-fame'))
      ) {
        const rawPhotos = data[key]?.photos || {};
        const list = Array.isArray(rawPhotos) ? rawPhotos : Object.values(rawPhotos);
        matchedPhotos = [...matchedPhotos, ...list];
      }
    });

    let formattedPhotos = matchedPhotos.map((photo, index) => {
      const pPhotog = photo.photogKey || photo.photog || 'unknown';
      const pDate = photo.date || 'no-date';
      const photoId = photo.id || generatePhotoId(eraId, pPhotog, pDate, index + 1);

      return {
        ...photo,
        id: photoId,
      };
    });

    if (photogFilter !== 'all') {
      formattedPhotos = formattedPhotos.filter(
        (p) => (p.photogKey || p.photog) === photogFilter
      );
    }

    const photographers = Array.from(
      new Set(
        formattedPhotos
          .map((p) => p.photogKey || p.photog)
          .filter((p): p is string => Boolean(p) && p !== 'NONE')
      )
    );

    const fullSessionGroups: Record<string, any[]> = {};
    formattedPhotos.forEach((photo) => {
      const sKey = getSessionKey(photo);
      if (!fullSessionGroups[sKey]) fullSessionGroups[sKey] = [];
      fullSessionGroups[sKey].push(photo);
    });

    const parseDateForSort = (dateStr: string) => {
      const parsed = Date.parse(dateStr);
      if (!isNaN(parsed)) return parsed;
      const currentYear = new Date().getFullYear();
      const fallbackParsed = Date.parse(`${dateStr} ${currentYear}`);
      return isNaN(fallbackParsed) ? 0 : fallbackParsed;
    };

    const allContainerKeys = Object.keys(fullSessionGroups).sort((a, b) => {
      return parseDateForSort(b) - parseDateForSort(a);
    });

    const totalContainerPages = Math.ceil(allContainerKeys.length / containersPerPage) || 1;

    const startIdx = (containerPage - 1) * containersPerPage;
    const paginatedContainerKeys = allContainerKeys.slice(startIdx, startIdx + containersPerPage);

    const paginatedSessions: Record<string, any[]> = {};
    paginatedContainerKeys.forEach((key) => {
      paginatedSessions[key] = fullSessionGroups[key];
    });

    return NextResponse.json({
      sessionGroups: paginatedSessions,
      totalContainerPages,
      photographers,
      allPhotos: formattedPhotos,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}