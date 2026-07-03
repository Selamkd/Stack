import { Search, Settings } from 'lucide-react';

interface IHeader {
  activePage: string;
  onOpenPalette: () => void;
  onOpenSettings: () => void;
}

export default function Header({
  activePage,
  onOpenPalette,
  onOpenSettings,
}: IHeader) {
  const isMac = navigator.platform.toUpperCase().includes('MAC');

  return (
    <header className="sticky top-0 z-40 w-full border-b border-custom-border bg-custom-base/80 backdrop-blur-md">
      <div className="flex items-center justify-between px-6 py-2.5">
        <h1 className="text-sm font-medium text-zinc-400">{activePage}</h1>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenPalette}
            className="flex items-center gap-2.5 rounded-lg border border-custom-border bg-custom-surface px-3 py-1.5 text-sm text-custom-text transition-colors hover:border-custom-active hover:text-zinc-300"
          >
            <Search size={13} />
            <span className="hidden sm:inline">Search everything…</span>
            <kbd className="rounded border border-custom-border bg-custom-base px-1.5 py-0.5 text-[10px]">
              {isMac ? '⌘' : 'Ctrl'} K
            </kbd>
          </button>
          <button
            onClick={onOpenSettings}
            title="Categories & tags"
            className="rounded-lg p-2 text-zinc-500 transition-colors hover:bg-custom-hover/50 hover:text-clay"
          >
            <Settings size={17} />
          </button>
        </div>
      </div>
    </header>
  );
}
