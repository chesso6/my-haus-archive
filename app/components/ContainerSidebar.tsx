'use client';

interface ContainerSidebarProps {
  titles: string[];
  selectedTitle: string;
  onSelectTitle: (title: string) => void;
}

export function ContainerSidebar({
  titles,
  selectedTitle,
  onSelectTitle,
}: ContainerSidebarProps) {
  return (
    <aside className="w-48 bg-black/60 border-r border-neutral-800 p-3 flex flex-col gap-2 font-mono text-[11px] shrink-0">
      <h4 className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest px-2">
        Titles
      </h4>

      <div className="space-y-1 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
        <button
          type="button"
          onClick={() => onSelectTitle('all')}
          className={`w-full text-left px-2 py-1 rounded transition-all cursor-pointer font-black ${
            selectedTitle === 'all'
              ? 'bg-orange-500 text-black'
              : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
          }`}
        >
          ALL TITLES
        </button>

        {titles.map((title) => (
          <button
            type="button"
            key={title}
            onClick={() => onSelectTitle(title)}
            className={`w-full text-left px-2 py-1 rounded transition-all truncate cursor-pointer font-black uppercase ${
              selectedTitle === title
                ? 'bg-orange-500 text-black'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
            }`}
            title={title}
          >
            {title}
          </button>
        ))}
      </div>
    </aside>
  );
}