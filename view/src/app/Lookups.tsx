import {
  Bookmark,
  Search,
  Trash2,
  PlusSquareIcon,
  Copy,
  X,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { IQuickLookup } from '../../../back/src/models/quicklookup.model';
import APIService from '../service/api.service';

export default function QuickLookup() {
  const [lookups, setLookups] = useState<IQuickLookup[]>([]);
  const [search, setSearch] = useState('');
  const [selectedLookup, setSelectedLookup] = useState<IQuickLookup | null>(
    null
  );
  const [copiedMessage, setCopiedMessage] = useState<string | null>(null);

  async function getLookups() {
    try {
      const lookupsRes = await APIService.get('quicklookups');
      setLookups(lookupsRes);
      console.log(lookupsRes);
    } catch (e) {
      console.error('Error fetching quick lookups', e);
    }
  }

  useEffect(() => {
    getLookups();
  }, []);

  useEffect(() => {
    if (search && lookups.length > 0) {
      const exactMatch = lookups.find(
        (lookup) => lookup.title.toLowerCase() === search.toLowerCase()
      );
      if (exactMatch) {
        setSelectedLookup(exactMatch);
      } else {
        const filtered = lookups.filter((lookup) =>
          lookup.title.toLowerCase().includes(search.toLowerCase())
        );
        if (filtered.length > 0) {
          setSelectedLookup(filtered[0]);
        } else {
          setSelectedLookup(null);
        }
      }
    } else {
      setSelectedLookup(null);
    }
  }, [search, lookups]);

  async function handleCopyAnswer(answer: string) {
    try {
      await navigator.clipboard.writeText(answer);
      setCopiedMessage('Copied to clipboard!');
      setTimeout(() => setCopiedMessage(null), 3000);
    } catch (err) {
      console.error('Error copying to clipboard');
    }
  }

  const commonOperators = lookups
    .slice(-25)
    .reverse()
    .map((lookup) => ({
      symbol: lookup.title,
      name: lookup.title,
    }));
  function handleOperatorClick(operator: string) {
    setSearch(operator);
  }

  function clearSearch() {
    setSearch('');
    setSelectedLookup(null);
  }

  return (
    <div className="min-h-screen bg-custom-base">
      <main className="mx-5 min-h-screen p-4 md:p-6 my-2  flex flex-col items-center justify-start md:my-10">
        <div className="max-w-4xl mx-auto w-full">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Quick Lookup</h1>
            <p className="text-zinc-400">
              Enter a term or operator to learn more about it:
            </p>
          </div>

          <div className="relative mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#404040]" />
              <input
                type="text"
                placeholder="Search for operators, methods, or concepts..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-12 py-4 bg-blue-400/5 border-2 border-[#242424] rounded-lg text-white text-lg placeholder-[#404040] focus:outline-none focus:border-zinc-500/40 transition-colors"
              />
              {search && (
                <button
                  onClick={clearSearch}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-[#404040] hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>

          {selectedLookup && (
            <div className="mb-8 bg-gradient-to-r from-blue-500/5 to-gray-500/5  border border-[#2a2a2a] rounded-xl p-8">
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-2xl font-bold text-white">
                      <span className="text-lime-200/70">
                        {selectedLookup.title}
                      </span>{' '}
                    </h2>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopyAnswer(selectedLookup.answer)}
                    className="p-2 rounded-lg transition-all duration-200 text-custom-text hover:text-lime-400 hover:bg-lime-400/20 border border-transparent hover:border-lime-400/20"
                    title="Copy answer"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="prose prose-invert max-w-none">
                <div className="text-zinc-300 leading-relaxed whitespace-pre-wrap">
                  {selectedLookup.answer}
                </div>
              </div>

              {selectedLookup.tags && selectedLookup.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-6">
                  {selectedLookup.tags.map((tag) => (
                    <span
                      key={tag._id}
                      className="px-3 py-1 bg-custom-surface/70 border border-custom-hover rounded-full text-xs text-zinc-400 hover:text-lime-200 hover:border-custom-hover transition-colors cursor-pointer"
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="mb-8">
            <p className="text-zinc-400 mb-4 text-center">Or, pick one:</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {commonOperators.map((op, index) => (
                <button
                  key={`${op.symbol}-${index}`}
                  onClick={() => handleOperatorClick(op.symbol)}
                  className="px-3 py-2 bg-gradient-to-r from-blue-500/5 to-gray-500/5  border border-[#2a2a2a] rounded text-zinc-300 hover:bg-[#242424] hover:border-lime-200/30 hover:text-lime-200 transition-all text-sm font-mono min-w-[3rem] text-center"
                  title={op.name}
                >
                  {op.symbol}
                </button>
              ))}
            </div>
          </div>

          {search && !selectedLookup && (
            <div className="text-center border border-custom-border bg-custom-surface rounded-lg p-12">
              <div className="text-zinc-500">
                <Search className="w-12 h-12 mx-auto mb-3" />
                <h3 className="text-lg font-medium text-zinc-400 mb-2">
                  No results found for "{search}"
                </h3>
                <p className="text-sm">
                  Try searching for a different term or check the spelling
                </p>
              </div>
            </div>
          )}

          {copiedMessage && (
            <div className="fixed bottom-4 right-4 bg-lime-400/20 border border-lime-400/30 text-lime-200 px-4 py-2 rounded-lg text-sm">
              {copiedMessage}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
