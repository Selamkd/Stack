import { useEffect, useState } from 'react';
import { ISnippet } from '../../../back/src/models/snippet.model';
import APIService from '../service/api.service';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import { Bookmark, Copy, Search, SearchCodeIcon } from 'lucide-react';

export default function Snippets() {
  const [snippets, setSnippets] = useState<ISnippet[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [copiedMessage, setCopiedMessage] = useState<string | null>(null);
  async function getSnippets() {
    try {
      const snippetsRes = await APIService.get('snippets');
      setSnippets(snippetsRes);
    } catch (e) {
      console.error('Error fetching snippets', e);
    }
  }
  useEffect(() => {
    getSnippets();
  }, []);

  async function handleCopySnippet(code: string) {
    try {
      await navigator.clipboard.writeText(code);
      console.log('Copied to clipboard');
      setCopiedMessage('Copied to clipboard!');
    } catch (err) {
      console.error('Error copying to clipboard');
    }
  }

  const categories = snippets.map((snippet) => snippet.category?.name);

  const filtered = snippets.filter((snippet) => {
    const matchesSearch =
      snippet.title.toLowerCase().includes(search.toLowerCase()) ||
      snippet.description?.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      selectedCategory === 'all' || snippet.category?.name === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <main className="max-w-7xl mx-auto min-h-screen p-4 md:p-6 my-2 md:my-6 rounded-lg">
      <div className="flex flex-col mb-4">
        <h1 className="text-3xl">Code Snippets</h1>
        <p className="text-custom-text py-2">
          Resusable code blocks organized by categories and languages
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#404040]" />
          <input
            type="text"
            placeholder="Search snippets..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-[#141414] border border-[#242424] rounded-lg text-white placeholder-[#404040] focus:outline-none focus:border-[#303030]"
          />
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-3 bg-[#141414] border border-[#242424] rounded-lg flex items-center justify-between min-w-[140px] hover:border-[#303030] transition-colors group"
        >
          <option value="all">All Categories</option>
          {Array.from(new Set(categories)).map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>
      {copiedMessage !== null && (
        <div className="flex items-center gap-6 mb-5 ml-2">
          <span
            onClick={() => setCopiedMessage(null)}
            className="text-xs text-lime-200/80 cursor-pointer"
          >
            {copiedMessage}
          </span>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((snippet) => (
          <SnippetCard
            snippet={snippet}
            handleCopySnippet={handleCopySnippet}
            refresh={getSnippets}
          />
        ))}
      </div>
    </main>
  );
}

interface ISnippetCard {
  snippet: ISnippet;
  handleCopySnippet: (code: string) => void;

  refresh: () => void;
}

export function SnippetCard(props: ISnippetCard) {
  const { snippet, handleCopySnippet, refresh } = props;

  function bookmarkSnippet() {
    try {
      APIService.post(`snippets`, {
        ...snippet,
        isStarred: !snippet.isStarred,
      }).then(() => {
        refresh();
      });
    } catch (err) {
      console.error('Bookmark toggle error', err);
    }
  }

  return (
    <section className="group border border-custom-border bg-[#161616] rounded-lg overflow-hidden hover:border-custom-hover transition-all">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-medium text-white mb-1">
              {snippet.title}
            </h3>
            <p className="text-sm text-zinc-400">{snippet.description}</p>
          </div>
          <button
            onClick={() => bookmarkSnippet()}
            className={`p-2 rounded-lg transition-all duration-200 ${
              snippet.isStarred
                ? 'text-lime-300/40 hover:text-lime-200  hover:bg-lime-400/20 border border-lime-400/20  '
                : 'text-custom-text hover:text-white hover:bg-custom-hover border border-transparent'
            }`}
          >
            <Bookmark
              className={`w-4 h-4 transition-all duration-200 ${
                snippet.isStarred ? 'fill-current drop-shadow-sm' : ''
              }`}
            />
          </button>
        </div>
        <div className="relative">
          <div className="bg-custom-base rounded-lg overflow-hidden">
            <pre className="p-4 overflow-x-auto">
              <code className="text-sm text-zinc-300 font-mono leading-relaxed">
                {snippet.code}
              </code>
            </pre>
          </div>
          <button
            onClick={() => handleCopySnippet(snippet?.code)}
            className="absolute top-3 right-3 p-2 bg-custom-surface hover:bg-custom-hover border border-custom-border rounded-lg text-custom-text hover:text-white"
          >
            <Copy className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div className="border mx-5 border-custom-border h-0"></div>
      <div className="px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {snippet.tags &&
            snippet?.tags.map((tag) => {
              return (
                <span
                  key={tag._id}
                  className="px-2.5 py-1 bg-custom-surface/70 border border-custom-hover rounded-lg text-xs text-zinc-400 hover:text-lime-200 hover:border-custom-hover transition-colors cursor-pointer"
                >
                  {tag.name}
                </span>
              );
            })}
        </div>
        <div className="flex items-center gap-6">
          <span className="text-xs text-zinc-500">{snippet.language}</span>
        </div>
      </div>
    </section>
  );
}
