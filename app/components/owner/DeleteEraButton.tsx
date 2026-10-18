'use client';

import { ref, remove, push } from 'firebase/database';
import { database } from '@/app/lib/firebase';
import { useRouter } from 'next/navigation';

interface DeleteEraButtonProps {
  eraId: string;
}

export function DeleteEraButton({ eraId }: DeleteEraButtonProps) {
  const router = useRouter();

  const handleDeleteEra = async () => {
    if (
      !confirm(
        `WARNING: ARE YOU SURE YOU WANT TO DELETE THE ENTIRE ERA "${eraId.toUpperCase()}"?\nAll photos inside this era will be deleted permanently!`
      )
    ) {
      return;
    }

    if (!database) return;

    try {
      const cleanId = eraId.toLowerCase().replace(/\s+/g, '-');
      await remove(ref(database, `gagaArchive/${cleanId}`));

      await push(ref(database, 'hausActivityLog'), {
        user: 'OWNER',
        action: `Deleted entire Era: ${eraId}`,
        timestamp: Date.now(),
      });

      alert(`Era "${eraId}" has been deleted.`);
      router.push('/');
    } catch (err: any) {
      alert('Failed to delete Era: ' + err.message);
    }
  };

  return (
    <button
      type="button"
      onClick={handleDeleteEra}
      className="px-2.5 py-1.5 bg-rose-600/20 hover:bg-rose-600 text-rose-400 hover:text-white border border-rose-600/40 rounded-lg text-[11px] font-bold uppercase transition-all cursor-pointer font-mono"
    >
      🗑 DELETE ERA
    </button>
  );
}