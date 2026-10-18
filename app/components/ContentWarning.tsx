'use client';

import { useState, useEffect } from 'react';

export function ContentWarning() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!sessionStorage.getItem('haus_cw_accepted')) {
      setShow(true);
    }
  }, []);

  const handleDismiss = () => {
    sessionStorage.setItem('haus_cw_accepted', 'true');
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-neutral-900 border border-neutral-800 p-8 rounded-2xl text-center space-y-6">
        <h1 className="text-3xl font-black tracking-widest text-white">MY HAUS</h1>

        <div className="flex flex-wrap justify-center gap-2">
          <span className="px-2.5 py-1 bg-neutral-800 text-neutral-300 text-[10px] font-bold tracking-wider rounded uppercase">
            POLITICAL CONTENT
          </span>
          <span className="px-2.5 py-1 bg-neutral-800 text-neutral-300 text-[10px] font-bold tracking-wider rounded uppercase">
            MATURE THEMES
          </span>
          <span className="px-2.5 py-1 bg-neutral-800 text-neutral-300 text-[10px] font-bold tracking-wider rounded uppercase">
            R-18
          </span>
        </div>

        <p className="text-xs text-neutral-400 leading-relaxed font-mono">
          This archive contains photography that may include mature, provocative, or politically charged content. By continuing, you confirm you are 18 or older and are not easily offended.
        </p>

        <div className="space-y-3 pt-2">
          <button
            type="button"
            onClick={handleDismiss}
            className="w-full py-3 bg-white text-black font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-neutral-200 transition-all cursor-pointer"
          >
            I UNDERSTAND — ENTER
          </button>
          <button
            type="button"
            onClick={() => window.history.back()}
            className="w-full py-2 bg-transparent text-neutral-500 font-bold text-xs uppercase tracking-widest hover:text-white transition-all cursor-pointer"
          >
            LEAVE
          </button>
        </div>
      </div>
    </div>
  );
}