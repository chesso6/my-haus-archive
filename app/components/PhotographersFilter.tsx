'use client';

import { useState } from 'react';

interface PhotographersFilterProps {
  photographers: string[];
  selectedPhotog: string;
  onSelectPhotog: (photog: string) => void;
}

export function PhotographersFilter({
  photographers,
  selectedPhotog,
  onSelectPhotog,
}: PhotographersFilterProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPhotographers = photographers.filter((p) =>
    p.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-3 font-mono text-xs">
      <h5 className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest px-1">
        Photographers
      </h5>

      <input
        type="text"
        placeholder="SEARCH PHOTOGRAPHERS..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full bg-neutral-900 border border-neutral-800 rounded p-2 text-white text-[11px] placeholder:text-neutral-600 focus:outline-none focus:border-neutral-600"
      />

      <div className="space-y-1 max-h-56 overflow-y-auto pr-1 custom-scrollbar">
        <button
          type="button"
          onClick={() => onSelectPhotog('all')}
          className={`w-full text-left px-2 py-1.5 rounded transition-all cursor-pointer font-black uppercase ${
            selectedPhotog === 'all'
              ? 'bg-orange-500 text-black'
              : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
          }`}
        >
          ALL WORK
        </button>

        {filteredPhotographers.map((p) => (
          <button
            type="button"
            key={p}
            onClick={() => onSelectPhotog(p)}
            className={`w-full text-left px-2 py-1.5 rounded transition-all cursor-pointer font-black uppercase truncate ${
              selectedPhotog === p
                ? 'bg-orange-500 text-black'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
            }`}
            title={p}
          >
            {p}
          </button>
        ))}
      </div>
    </div>
  );
}