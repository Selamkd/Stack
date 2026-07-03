import {
  BotMessageSquare,
  Check,
  Copy,
  FileText,
  Home,
  LucideIcon,
  Search,
  SearchCode,
  SquareChevronRight,
  SquareTerminal,
  SwatchBook,
  Trello,
} from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { shortcutGroups } from '../data/shortcuts';
import APIService from '../service/api.service';

interface PaletteEntry {
  id: string;
  group: string;
  title: string;
  subtitle?: string;
  icon: LucideIcon;
  iconColor: string;
  keywords: string;
  copyText?: string;
  action?: () => void;
}

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
}

const NAV_ITEMS = [
  { title: 'Dashboard', path: '/', icon: Home },
  { title: 'Chat', path: '/chat', icon: BotMessageSquare },
  { title: 'Notes', path: '/notes', icon: FileText },
  { title: 'Snippets', path: '/snippets', icon: SquareChevronRight },
  { title: 'Quick Lookups', path: '/lookups', icon: SearchCode },
  { title: 'Shortcuts', path: '/shortcuts', icon: SquareTerminal },
  { title: 'Project Board', path: '/project-board', icon: Trello },
  { title: 'Tools', path: '/tools', icon: SwatchBook },
];

export default function CommandPalette({ open, onClose }: CommandPaletteProps) {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [notes, setNotes] = useState<{ _id: string; title: string }[]>([]);
  const [snippets, setSnippets] = useState<
    { _id: string; title: string; language?: string }[]
  >([]);
  const [lookups, setLookups] = useState<{ _id: string; title: string }[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    setQuery('');
    setSelectedIndex(0);
    setTimeout(() => inputRef.current?.focus(), 0);

    Promise.all([
      APIService.get('notes', { page: '1', limit: '50' }),
      APIService.get('snippets'),
      APIService.get('quicklookups'),
    ])
      .then(([notesRes, snippetsRes, lookupsRes]) => {
        setNotes(Array.isArray(notesRes) ? notesRes : notesRes?.data || []);
        setSnippets(Array.isArray(snippetsRes) ? snippetsRes : []);
        setLookups(Array.isArray(lookupsRes) ? lookupsRes : []);
      })
      .catch((error) => console.error('Palette fetch error:', error));
  }, [open]);

  const go = (path: string) => {
    navigate(path);
    onClose();
  };

  const entries = useMemo<PaletteEntry[]>(() => {
    const q = query.trim().toLowerCase();
    const matches = (text: string) => !q || text.toLowerCase().includes(q);

    const nav: PaletteEntry[] = NAV_ITEMS.filter((item) =>
      matches(item.title)
    ).map((item) => ({
      id: `nav-${item.path}`,
      group: 'Go to',
      title: item.title,
      icon: item.icon,
      iconColor: 'text-haze/80',
      keywords: item.title,
      action: () => go(item.path),
    }));

    const noteEntries: PaletteEntry[] = notes
      .filter((n) => matches(n.title))
      .slice(0, q ? 6 : 4)
      .map((n) => ({
        id: `note-${n._id}`,
        group: 'Notes',
        title: n.title || 'Untitled',
        icon: FileText,
        iconColor: 'text-clay/70',
        keywords: n.title,
        action: () => go(`/notes?id=${n._id}`),
      }));

    const snippetEntries: PaletteEntry[] = q
      ? snippets
          .filter((s) => matches(`${s.title} ${s.language || ''}`))
          .slice(0, 6)
          .map((s) => ({
            id: `snippet-${s._id}`,
            group: 'Snippets',
            title: s.title,
            subtitle: s.language,
            icon: SquareChevronRight,
            iconColor: 'text-sand/70',
            keywords: s.title,
            action: () => go(`/snippets?id=${s._id}`),
          }))
      : [];

    const lookupEntries: PaletteEntry[] = q
      ? lookups
          .filter((l) => matches(l.title))
          .slice(0, 6)
          .map((l) => ({
            id: `lookup-${l._id}`,
            group: 'Quick Lookups',
            title: l.title,
            icon: SearchCode,
            iconColor: 'text-haze/70',
            keywords: l.title,
            action: () => go(`/lookups?q=${encodeURIComponent(l.title)}`),
          }))
      : [];

    const shortcutEntries: PaletteEntry[] = q
      ? shortcutGroups
          .flatMap((group) =>
            group.items.map((item) => ({ group, item }))
          )
          .filter(({ group, item }) =>
            matches(`${group.label} ${item.keys} ${item.description}`)
          )
          .slice(0, 6)
          .map(({ group, item }) => ({
            id: `shortcut-${group.key}-${item.keys}`,
            group: 'Shortcuts (enter to copy)',
            title: item.keys,
            subtitle: `${group.label} — ${item.description}`,
            icon: group.icon,
            iconColor: group.iconColor,
            keywords: item.keys,
            copyText: item.keys,
          }))
      : [];

    const askAi: PaletteEntry[] = q
      ? [
          {
            id: 'ask-ai',
            group: 'AI',
            title: `Ask: “${query.trim()}”`,
            subtitle: 'Open in chat',
            icon: BotMessageSquare,
            iconColor: 'text-clay/80',
            keywords: query,
            action: () => go(`/chat?q=${encodeURIComponent(query.trim())}`),
          },
        ]
      : [];

    return [
      ...nav,
      ...noteEntries,
      ...snippetEntries,
      ...lookupEntries,
      ...shortcutEntries,
      ...askAi,
    ];
  }, [query, notes, snippets, lookups]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    const el = listRef.current?.querySelector('[data-selected="true"]');
    el?.scrollIntoView({ block: 'nearest' });
  }, [selectedIndex]);

  if (!open) return null;

  function runEntry(entry: PaletteEntry) {
    if (entry.copyText) {
      navigator.clipboard.writeText(entry.copyText).catch(() => undefined);
      setCopiedId(entry.id);
      setTimeout(() => {
        setCopiedId(null);
        onClose();
      }, 600);
      return;
    }
    entry.action?.();
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((i) => (i + 1) % Math.max(entries.length, 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(
        (i) => (i + entries.length - 1) % Math.max(entries.length, 1)
      );
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const entry = entries[selectedIndex];
      if (entry) runEntry(entry);
    } else if (e.key === 'Escape') {
      onClose();
    }
  }

  let lastGroup = '';

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center bg-black/60 p-4 pt-[12vh] backdrop-blur-sm"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="panel-raised w-full max-w-xl overflow-hidden shadow-2xl">
        <div className="flex items-center gap-3 border-b border-custom-border px-4 py-3">
          <Search size={16} className="shrink-0 text-custom-text" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search notes, snippets, lookups, shortcuts…"
            className="w-full bg-transparent text-sm text-zinc-100 placeholder-custom-text focus:outline-none"
          />
          <kbd className="shrink-0 rounded border border-custom-border px-1.5 py-0.5 text-[10px] text-custom-text">
            esc
          </kbd>
        </div>

        <div
          ref={listRef}
          className="max-h-[50vh] overflow-y-auto scrollbar-thin p-1.5"
        >
          {entries.length === 0 ? (
            <div className="p-6 text-center text-sm text-custom-text">
              Nothing found for “{query}”
            </div>
          ) : (
            entries.map((entry, index) => {
              const Icon = entry.icon;
              const showGroup = entry.group !== lastGroup;
              lastGroup = entry.group;
              return (
                <div key={entry.id}>
                  {showGroup && (
                    <div className="px-3 pb-1 pt-2.5 text-[10px] font-semibold uppercase tracking-wider text-custom-text">
                      {entry.group}
                    </div>
                  )}
                  <button
                    data-selected={index === selectedIndex}
                    onClick={() => runEntry(entry)}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors ${
                      index === selectedIndex
                        ? 'bg-custom-hover/60'
                        : ''
                    }`}
                  >
                    <Icon size={15} className={`shrink-0 ${entry.iconColor}`} />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm text-zinc-100">
                        {entry.title}
                      </span>
                      {entry.subtitle && (
                        <span className="block truncate text-xs text-custom-text">
                          {entry.subtitle}
                        </span>
                      )}
                    </span>
                    {entry.copyText &&
                      (copiedId === entry.id ? (
                        <Check size={14} className="shrink-0 text-clay" />
                      ) : (
                        <Copy
                          size={13}
                          className="shrink-0 text-custom-text"
                        />
                      ))}
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
