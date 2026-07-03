import { Check, Copy, Search } from 'lucide-react';
import { useMemo, useRef, useState } from 'react';
import { IShortcut, shortcutGroups } from '../data/shortcuts';

export default function Shortcuts() {
  const [search, setSearch] = useState('');
  const [activeGroup, setActiveGroup] = useState('all');
  const [copiedKey, setCopiedKey] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  async function copyShortcut(shortcut: IShortcut) {
    try {
      await navigator.clipboard.writeText(shortcut.keys);
      setCopiedKey(shortcut.keys);
      setTimeout(() => setCopiedKey(''), 1500);
    } catch (error) {
      console.error('Error copying shortcut:', error);
    }
  }

  const visibleGroups = useMemo(() => {
    const q = search.trim().toLowerCase();
    return shortcutGroups
      .filter((group) => activeGroup === 'all' || group.key === activeGroup)
      .map((group) => ({
        ...group,
        items: group.items.filter(
          (item) =>
            !q ||
            item.keys.toLowerCase().includes(q) ||
            item.description.toLowerCase().includes(q)
        ),
      }))
      .filter((group) => group.items.length > 0);
  }, [search, activeGroup]);

  return (
    <main className="mx-auto min-h-screen w-full max-w-6xl p-4 md:p-6">
      <div className="mb-6 mt-2">
        <h1 className="text-2xl font-bold text-white">Shortcuts</h1>
        <p className="mt-1 text-sm text-custom-text">
          Click any command to copy it
        </p>
      </div>

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-custom-text" />
          <input
            ref={inputRef}
            autoFocus
            type="text"
            placeholder="Search commands — try “stash”, “port”, “rename”…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-base w-full py-3 pl-11 pr-4 text-sm"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setActiveGroup('all')}
            className={`rounded-full px-3 py-1.5 text-xs transition-colors ${
              activeGroup === 'all'
                ? 'bg-dusk/15 text-dusk'
                : 'border border-custom-border text-custom-text hover:text-zinc-300'
            }`}
          >
            All
          </button>
          {shortcutGroups.map((group) => (
            <button
              key={group.key}
              onClick={() =>
                setActiveGroup(activeGroup === group.key ? 'all' : group.key)
              }
              className={`rounded-full px-3 py-1.5 text-xs transition-colors ${
                activeGroup === group.key
                  ? 'bg-dusk/15 text-dusk'
                  : 'border border-custom-border text-custom-text hover:text-zinc-300'
              }`}
            >
              {group.label}
            </button>
          ))}
        </div>
      </div>

      {visibleGroups.length === 0 ? (
        <div className="panel p-10 text-center text-custom-text">
          <Search className="mx-auto mb-3 h-10 w-10" />
          <p className="text-sm">Nothing found for “{search}”</p>
        </div>
      ) : (
        <div className="space-y-8">
          {visibleGroups.map((group) => {
            const Icon = group.icon;
            return (
              <section key={group.key}>
                <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-zinc-200">
                  <Icon size={15} className={group.iconColor} />
                  {group.label}
                  <span className="font-normal text-custom-text">
                    {group.items.length}
                  </span>
                </h2>
                <div className="grid grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-3">
                  {group.items.map((shortcut) => (
                    <button
                      key={`${group.key}-${shortcut.keys}`}
                      onClick={() => copyShortcut(shortcut)}
                      className="group flex items-center justify-between gap-3 rounded-lg border border-custom-border bg-custom-surface px-3.5 py-2.5 text-left transition-colors hover:border-custom-active hover:bg-custom-raised"
                    >
                      <span className="min-w-0">
                        <span className="block truncate font-mono text-[13px] text-haze/90">
                          {shortcut.keys}
                        </span>
                        <span className="mt-0.5 block truncate text-xs text-custom-text">
                          {shortcut.description}
                        </span>
                      </span>
                      {copiedKey === shortcut.keys ? (
                        <Check size={14} className="shrink-0 text-clay" />
                      ) : (
                        <Copy
                          size={13}
                          className="shrink-0 text-custom-text opacity-0 transition-opacity group-hover:opacity-100"
                        />
                      )}
                    </button>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </main>
  );
}
