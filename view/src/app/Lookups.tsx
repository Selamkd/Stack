import {
  ArrowLeft,
  Check,
  Copy,
  Pencil,
  Plus,
  Search,
  SearchCode,
  Trash2,
  X,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { IQuickLookup } from '../../../back/src/models/quicklookup.model';
import LookupModal from '../components/LookupModal';
import APIService from '../service/api.service';

export default function QuickLookup() {
  const [lookups, setLookups] = useState<IQuickLookup[]>([]);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<IQuickLookup | null>(null);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [copied, setCopied] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<IQuickLookup | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();

  async function fetchLookups(): Promise<IQuickLookup[]> {
    try {
      setIsLoading(true);
      const res = await APIService.get('quicklookups');
      setLookups(res || []);
      return res || [];
    } catch (error) {
      console.error('Error fetching lookups:', error);
      return [];
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchLookups().then((list) => {
      const q = searchParams.get('q');
      if (q) {
        const match = list.find(
          (l) => l.title.toLowerCase() === q.toLowerCase()
        );
        if (match) setSelected(match);
        else setSearch(q);
      }
    });
  }, []);

  const categories = useMemo(
    () => [
      'all',
      ...Array.from(
        new Set(lookups.map((l) => l.category?.name || '').filter(Boolean))
      ),
    ],
    [lookups]
  );

  const filtered = lookups.filter((lookup) => {
    const matchesCategory =
      categoryFilter === 'all' || lookup.category?.name === categoryFilter;
    const q = search.toLowerCase();
    const matchesSearch =
      !q ||
      lookup.title.toLowerCase().includes(q) ||
      lookup.answer.toLowerCase().includes(q);
    return matchesCategory && matchesSearch;
  });

  function openLookup(lookup: IQuickLookup) {
    setSelected(lookup);
    setConfirmingDelete(false);
    setSearchParams({ q: lookup.title }, { replace: true });
  }

  function backToAll() {
    setSelected(null);
    setSearch('');
    setSearchParams({}, { replace: true });
  }

  async function copyAnswer() {
    if (!selected) return;
    try {
      await navigator.clipboard.writeText(selected.answer);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch (error) {
      console.error('Error copying answer:', error);
    }
  }

  async function deleteLookup() {
    if (!selected) return;
    if (!confirmingDelete) {
      setConfirmingDelete(true);
      setTimeout(() => setConfirmingDelete(false), 2500);
      return;
    }
    try {
      await APIService.delete(`quicklookups/${selected._id}`);
      setLookups((prev) => prev.filter((l) => l._id !== selected._id));
      backToAll();
    } catch (error) {
      console.error('Error deleting lookup:', error);
    }
  }

  return (
    <main className="mx-auto min-h-screen w-full max-w-4xl p-4 md:p-6">
      <div className="mb-8 mt-6 text-center">
        <h1 className="mb-1 text-2xl font-bold text-white">Quick Lookup</h1>
        <p className="text-sm text-custom-text">
          Terms, operators, and concepts you keep forgetting — one search away
        </p>
      </div>

      <div className="mb-5 flex flex-wrap justify-center gap-2">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setCategoryFilter(category)}
            className={`rounded-full px-3 py-1.5 text-xs transition-all ${
              categoryFilter === category
                ? 'bg-haze/15 text-haze'
                : 'border border-custom-border text-custom-text hover:text-zinc-300'
            }`}
          >
            {category === 'all' ? 'All' : category}
          </button>
        ))}
        <button
          onClick={() => {
            setEditing(null);
            setModalOpen(true);
          }}
          className="flex items-center gap-1.5 rounded-full bg-clay/10 px-3 py-1.5 text-xs text-clay transition-colors hover:bg-clay/20"
        >
          <Plus size={12} />
          Add lookup
        </button>
      </div>

      <div className="relative mb-8">
        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-custom-text" />
        <input
          type="text"
          placeholder="Search for operators, methods, or concepts…"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            if (selected) {
              setSelected(null);
              setSearchParams({}, { replace: true });
            }
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && filtered.length > 0) {
              openLookup(filtered[0]);
            }
          }}
          className="input-base w-full py-3.5 pl-12 pr-12 text-base"
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-custom-text transition-colors hover:text-white"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {selected ? (
        <div className="panel p-6 md:p-8">
          <div className="mb-4 flex items-start justify-between gap-4">
            <button
              onClick={backToAll}
              className="flex items-center gap-1.5 text-xs text-custom-text transition-colors hover:text-zinc-200"
            >
              <ArrowLeft size={13} />
              All lookups
            </button>
            <div className="flex items-center gap-1">
              <button
                onClick={copyAnswer}
                title="Copy answer"
                className={`rounded-lg p-2 transition-colors ${
                  copied
                    ? 'text-clay'
                    : 'text-custom-text hover:bg-custom-hover/60 hover:text-clay'
                }`}
              >
                {copied ? <Check size={15} /> : <Copy size={15} />}
              </button>
              <button
                onClick={() => {
                  setEditing(selected);
                  setModalOpen(true);
                }}
                title="Edit lookup"
                className="rounded-lg p-2 text-custom-text transition-colors hover:bg-custom-hover/60 hover:text-zinc-100"
              >
                <Pencil size={15} />
              </button>
              <button
                onClick={deleteLookup}
                title={confirmingDelete ? 'Click again to delete' : 'Delete'}
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

          <h2 className="mb-4 text-2xl font-bold text-haze/90">
            {selected.title}
          </h2>

          <div className="whitespace-pre-wrap rounded-lg border border-custom-border bg-custom-base p-5 font-mono text-sm leading-relaxed text-zinc-300">
            {selected.answer}
          </div>

          {selected.tags && selected.tags.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-2">
              {selected.tags.map((tag) => (
                <span
                  key={tag._id}
                  className="rounded-full border border-custom-border px-2.5 py-1 text-xs text-custom-text"
                >
                  #{tag.name}
                </span>
              ))}
            </div>
          )}
        </div>
      ) : isLoading ? (
        <div className="flex flex-wrap justify-center gap-2">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="h-9 w-24 animate-pulse rounded-lg bg-custom-hover/30"
            />
          ))}
        </div>
      ) : filtered.length > 0 ? (
        <div className="flex flex-wrap justify-center gap-2">
          {filtered.map((lookup) => (
            <button
              key={lookup._id}
              onClick={() => openLookup(lookup)}
              className="bg-custom-surface rounded-lg border border-custom-border px-3.5 py-2 font-mono text-sm text-zinc-300 transition-all hover:border-haze/40 hover:text-haze"
            >
              {lookup.title}
            </button>
          ))}
        </div>
      ) : (
        <div className="panel p-10 text-center text-custom-text">
          <SearchCode className="mx-auto mb-3 h-10 w-10" />
          <h3 className="mb-1 text-sm font-medium text-zinc-300">
            {search ? `Nothing found for “${search}”` : 'No lookups yet'}
          </h3>
          <p className="text-xs">
            {search
              ? 'Try a different term — or add it so future you finds it'
              : 'Add the things you keep re-Googling'}
          </p>
        </div>
      )}

      <LookupModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        initial={editing || undefined}
        onSaved={(saved) => {
          fetchLookups().then(() => setSelected(saved));
        }}
      />
    </main>
  );
}
