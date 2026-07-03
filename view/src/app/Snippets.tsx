import {
  Check,
  Copy,
  Heart,
  Pencil,
  Plus,
  Search,
  SquareChevronRight,
  Trash2,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { ISnippet } from '../../../back/src/models/snippet.model';
import SnippetModal from '../components/SnippetModal';
import APIService from '../service/api.service';

const LANGUAGE_ALIASES: Record<string, string> = {
  js: 'javascript',
  ts: 'typescript',
  'c++': 'cpp',
  'c#': 'csharp',
  shell: 'bash',
  yml: 'yaml',
  md: 'markdown',
};

function highlighterLanguage(language?: string): string {
  const lang = (language || 'typescript').toLowerCase();
  return LANGUAGE_ALIASES[lang] || lang;
}

export default function Snippets() {
  const [snippets, setSnippets] = useState<ISnippet[]>([]);
  const [selected, setSelected] = useState<ISnippet | null>(null);
  const [search, setSearch] = useState('');
  const [languageFilter, setLanguageFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<ISnippet | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();

  async function fetchSnippets(): Promise<ISnippet[]> {
    try {
      setIsLoading(true);
      const res = await APIService.get('snippets');
      const list: ISnippet[] = res || [];
      setSnippets(list);
      return list;
    } catch (error) {
      console.error('Error fetching snippets:', error);
      return [];
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchSnippets().then((list) => {
      const requested = searchParams.get('id');
      const target =
        (requested && list.find((s) => s._id === requested)) || list[0];
      if (target) setSelected(target);
    });
  }, []);

  function select(snippet: ISnippet) {
    setSelected(snippet);
    setConfirmingDelete(false);
    setSearchParams({ id: snippet._id }, { replace: true });
  }

  async function copyCode() {
    if (!selected) return;
    try {
      await navigator.clipboard.writeText(selected.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch (error) {
      console.error('Error copying code:', error);
    }
  }

  async function toggleStar() {
    if (!selected) return;
    try {
      const updated = await APIService.patch(
        `snippets/${selected._id}/star`,
        {}
      );
      setSelected({ ...selected, isStarred: updated.isStarred });
      setSnippets((prev) =>
        prev.map((s) =>
          s._id === selected._id ? { ...s, isStarred: updated.isStarred } : s
        )
      );
    } catch (error) {
      console.error('Error toggling star:', error);
    }
  }

  async function deleteSnippet() {
    if (!selected) return;
    if (!confirmingDelete) {
      setConfirmingDelete(true);
      setTimeout(() => setConfirmingDelete(false), 2500);
      return;
    }
    try {
      await APIService.delete(`snippets/${selected._id}`);
      const remaining = snippets.filter((s) => s._id !== selected._id);
      setSnippets(remaining);
      setSelected(remaining[0] || null);
      setConfirmingDelete(false);
    } catch (error) {
      console.error('Error deleting snippet:', error);
    }
  }

  function handleSaved(saved: ISnippet) {
    fetchSnippets().then((list) => {
      const match = list.find((s) => s._id === saved._id);
      if (match) select(match);
    });
  }

  const languages = Array.from(
    new Set(
      snippets
        .map((s) => (s.language || '').toLowerCase())
        .filter(Boolean)
    )
  ).sort();

  const filtered = snippets
    .filter((snippet) => {
      const q = search.toLowerCase();
      const matchesSearch =
        snippet.title.toLowerCase().includes(q) ||
        snippet.description?.toLowerCase().includes(q) ||
        snippet.code.toLowerCase().includes(q) ||
        snippet.tags?.some((tag) => tag.name.toLowerCase().includes(q));
      const matchesLanguage =
        languageFilter === 'all' ||
        (snippet.language || '').toLowerCase() === languageFilter;
      return matchesSearch && matchesLanguage;
    })
    .sort((a, b) => Number(b.isStarred || false) - Number(a.isStarred || false));

  return (
    <div className="flex h-[calc(100vh-57px)]">
      <div className="flex w-80 shrink-0 flex-col border-r border-custom-border">
        <div className="space-y-2.5 p-3">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-custom-text" />
              <input
                type="text"
                placeholder="Search snippets…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input-base w-full py-2 pl-9 pr-3 text-sm"
              />
            </div>
            <button
              onClick={() => {
                setEditing(null);
                setModalOpen(true);
              }}
              title="New snippet"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-clay/10 text-clay transition-colors hover:bg-clay/20"
            >
              <Plus size={16} />
            </button>
          </div>

          {languages.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {['all', ...languages].map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLanguageFilter(lang)}
                  className={`rounded-full px-2.5 py-1 font-mono text-[11px] transition-colors ${
                    languageFilter === lang
                      ? 'bg-sand/15 text-sand'
                      : 'border border-custom-border text-custom-text hover:text-zinc-300'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex-1 space-y-1 overflow-y-auto scrollbar-thin px-3 pb-4">
          {isLoading ? (
            [...Array(4)].map((_, i) => (
              <div key={i} className="panel animate-pulse p-3">
                <div className="mb-2 h-4 w-3/4 rounded bg-custom-hover" />
                <div className="h-3 w-1/2 rounded bg-custom-hover" />
              </div>
            ))
          ) : filtered.length > 0 ? (
            filtered.map((snippet) => (
              <div
                key={snippet._id}
                onClick={() => select(snippet)}
                className={`cursor-pointer rounded-lg border p-3 transition-all ${
                  selected?._id === snippet._id
                    ? 'border-custom-active bg-custom-raised'
                    : 'border-transparent hover:border-custom-border hover:bg-custom-surface'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <h3 className="min-w-0 flex-1 truncate text-sm font-medium text-zinc-100">
                    {snippet.isStarred && (
                      <Heart
                        size={11}
                        className="mb-0.5 mr-1.5 inline fill-dusk/70 text-dusk/70"
                      />
                    )}
                    {snippet.title}
                  </h3>
                  {snippet.language && (
                    <span className="shrink-0 rounded bg-custom-hover/50 px-1.5 py-0.5 font-mono text-[10px] text-sand/80">
                      {snippet.language}
                    </span>
                  )}
                </div>
                {snippet.description && (
                  <p className="mt-1 truncate text-xs text-custom-text">
                    {snippet.description}
                  </p>
                )}
              </div>
            ))
          ) : (
            <div className="panel p-8 text-center text-custom-text">
              <SquareChevronRight className="mx-auto mb-3 h-10 w-10" />
              <p className="text-sm">
                {search || languageFilter !== 'all'
                  ? 'No snippets match'
                  : 'No snippets yet'}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="flex min-w-0 flex-1 flex-col overflow-y-auto scrollbar-thin">
        {selected ? (
          <div className="mx-auto w-full max-w-4xl p-6">
            <div className="mb-4 flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h2 className="text-xl font-bold text-white">
                  {selected.title}
                </h2>
                {selected.description && (
                  <p className="mt-1 text-sm text-zinc-400">
                    {selected.description}
                  </p>
                )}
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  {selected.language && (
                    <span className="rounded bg-custom-hover/50 px-2 py-0.5 font-mono text-[11px] text-sand/80">
                      {selected.language}
                    </span>
                  )}
                  {selected.category && (
                    <span className="text-xs text-haze/80">
                      {selected.category.name}
                    </span>
                  )}
                  {selected.tags?.map((tag) => (
                    <span
                      key={tag._id}
                      className="rounded-full border border-custom-border px-2 py-0.5 text-[11px] text-custom-text"
                    >
                      #{tag.name}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-1">
                <button
                  onClick={toggleStar}
                  title={selected.isStarred ? 'Unstar' : 'Star'}
                  className={`rounded-lg p-2 transition-colors ${
                    selected.isStarred
                      ? 'text-dusk'
                      : 'text-custom-text hover:bg-custom-hover/60 hover:text-dusk'
                  }`}
                >
                  <Heart
                    size={15}
                    className={selected.isStarred ? 'fill-current' : ''}
                  />
                </button>
                <button
                  onClick={() => {
                    setEditing(selected);
                    setModalOpen(true);
                  }}
                  title="Edit snippet"
                  className="rounded-lg p-2 text-custom-text transition-colors hover:bg-custom-hover/60 hover:text-zinc-100"
                >
                  <Pencil size={15} />
                </button>
                <button
                  onClick={deleteSnippet}
                  title={
                    confirmingDelete ? 'Click again to delete' : 'Delete snippet'
                  }
                  className={`rounded-lg p-2 transition-colors ${
                    confirmingDelete
                      ? 'bg-red-400/20 text-red-400'
                      : 'text-custom-text hover:bg-custom-hover/60 hover:text-red-400'
                  }`}
                >
                  {confirmingDelete ? <Check size={15} /> : <Trash2 size={15} />}
                </button>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-xl border border-custom-border bg-custom-base">
              <div className="flex items-center justify-between border-b border-custom-border px-4 py-2">
                <span className="font-mono text-xs text-custom-text">
                  {highlighterLanguage(selected.language)}
                </span>
                <button
                  onClick={copyCode}
                  className={`flex items-center gap-1.5 rounded-md px-2 py-1 text-xs transition-colors ${
                    copied
                      ? 'text-clay'
                      : 'text-custom-text hover:bg-custom-hover/60 hover:text-zinc-200'
                  }`}
                >
                  {copied ? <Check size={12} /> : <Copy size={12} />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>
              <SyntaxHighlighter
                language={highlighterLanguage(selected.language)}
                style={oneDark}
                customStyle={{
                  margin: 0,
                  padding: '1.25rem',
                  background: 'transparent',
                  fontSize: '0.85rem',
                  lineHeight: '1.6',
                }}
                wrapLongLines
                showLineNumbers
              >
                {selected.code}
              </SyntaxHighlighter>
            </div>
          </div>
        ) : (
          !isLoading && (
            <div className="flex flex-1 items-center justify-center">
              <div className="panel p-12 text-center text-custom-text">
                <SquareChevronRight className="mx-auto mb-4 h-12 w-12" />
                <h3 className="mb-1 text-base font-medium text-zinc-300">
                  No snippet selected
                </h3>
                <p className="text-sm">
                  Save code you keep re-Googling — future you says thanks
                </p>
              </div>
            </div>
          )
        )}
      </div>

      <SnippetModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        initial={editing || undefined}
        onSaved={handleSaved}
      />
    </div>
  );
}
