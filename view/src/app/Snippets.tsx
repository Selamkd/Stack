import {
  Bookmark,
  Copy,
  Search,
  Trash2,
  PlusSquareIcon,
  FolderHeart,
  HeartPulse,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import {
  atomDark,
  coldarkDark,
  darcula,
  duotoneDark,
  materialDark,
  nightOwl,
  nord,
  tomorrow,
  vscDarkPlus,
} from 'react-syntax-highlighter/dist/esm/styles/prism';
import { ISnippet } from '../../../back/src/models/snippet.model';
import APIService from '../service/api.service';

export default function Snippets() {
  const [snippets, setSnippets] = useState<ISnippet[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [copiedMessage, setCopiedMessage] = useState<string | null>(null);
  const [deleteMessage, setDeleteMessage] = useState<string | null>(null);

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
      setTimeout(() => setCopiedMessage(null), 3000);
    } catch (err) {
      console.error('Error copying to clipboard');
    }
  }

  async function handleDeleteSnippet(snippetId: string) {
    try {
      await APIService.delete(`snippets/${snippetId}`);
      setDeleteMessage('Snippet deleted successfully!');
      setTimeout(() => setDeleteMessage(null), 3000);
      getSnippets();
    } catch (err) {
      console.error('Error deleting snippet', err);
      setDeleteMessage('Error deleting snippet');
      setTimeout(() => setDeleteMessage(null), 3000);
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
    <main className="mx-5 min-h-screen p-4 md:p-6 my-2 md:my-6 rounded-lg">
      <div className="flex flex-col mb-4">
        <h1 className="text-3xl">Code Snippets</h1>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-4">
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
          <option value="all">All</option>
          {Array.from(new Set(categories)).map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      <div className="flex w-full justify-end py-2">
        <button className="flex items-center gap-2 px-4 py-2 bg-custom-surface hover:bg-lime-200 hover:text-gray-800 text-custom-text-400 rounded-lg transition-colors">
          <PlusSquareIcon className="w-4 h-4" />
        </button>
      </div>

      {(copiedMessage || deleteMessage) && (
        <div className="flex items-center gap-6 mb-5 ml-2">
          {copiedMessage && (
            <span
              onClick={() => setCopiedMessage(null)}
              className="text-xs text-lime-200/80 cursor-pointer"
            >
              {copiedMessage}
            </span>
          )}
          {deleteMessage && (
            <span
              onClick={() => setDeleteMessage(null)}
              className="text-xs text-red-200/80 cursor-pointer"
            >
              {deleteMessage}
            </span>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filtered.map((snippet) => (
          <SnippetCard
            key={snippet._id}
            snippet={snippet}
            handleCopySnippet={handleCopySnippet}
            handleDeleteSnippet={handleDeleteSnippet}
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
  handleDeleteSnippet: (snippetId: string) => void;
  refresh: () => void;
}

export function SnippetCard(props: ISnippetCard) {
  const { snippet, handleCopySnippet, handleDeleteSnippet, refresh } = props;
  const customMinimalStyle = {
    'pre[class*="language-"]': {
      background: 'transparent',
      padding: 0,
      margin: 0,
      overflow: 'visible',
      textShadow: 'none',
      fontSize: 'inherit',
      lineHeight: 'inherit',
      fontFamily: 'inherit',
    },
    'code[class*="language-"]': {
      background: 'transparent',
      color: '#d4d4d8', // zinc-300
      textShadow: 'none',
      fontSize: 'inherit',
      lineHeight: 'inherit',
      fontFamily: 'inherit',
    },
    '.token.comment': { color: '#71717a' }, // zinc-500
    '.token.prolog': { color: '#71717a' },
    '.token.doctype': { color: '#71717a' },
    '.token.cdata': { color: '#71717a' },
    '.token.string': { color: '#a1a1aa' }, // zinc-400
    '.token.attr-value': { color: '#a1a1aa' },
    '.token.keyword': { color: '#d4d4d8' }, // zinc-300
    '.token.control': { color: '#d4d4d8' },
    '.token.directive': { color: '#d4d4d8' },
    '.token.unit': { color: '#d4d4d8' },
    '.token.statement': { color: '#d4d4d8' },
    '.token.regex': { color: '#d4d4d8' },
    '.token.atrule': { color: '#d4d4d8' },
    '.token.number': { color: '#a1a1aa' }, // zinc-400
    '.token.boolean': { color: '#a1a1aa' },
    '.token.function': { color: '#d4d4d8' }, // zinc-300
    '.token.class-name': { color: '#d4d4d8' },
    '.token.constant': { color: '#d4d4d8' },
    '.token.symbol': { color: '#d4d4d8' },
    '.token.property': { color: '#a1a1aa' }, // zinc-400
    '.token.tag': { color: '#d4d4d8' },
    '.token.operator': { color: '#71717a' }, // zinc-500
    '.token.punctuation': { color: '#71717a' },
    '.token.attr-name': { color: '#a1a1aa' },
    '.token.variable': { color: '#d4d4d8' },
    '.token.deleted': { color: '#ef4444' }, // red-500
    '.token.inserted': { color: '#22c55e' }, // green-500
    '.token.selector': { color: '#d4d4d8' },
    '.token.important': { color: '#d4d4d8', fontWeight: 'bold' },
    '.token.bold': { fontWeight: 'bold' },
    '.token.italic': { fontStyle: 'italic' },
  };
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

  const getLanguageForHighlighter = (language: string): string => {
    const languageMap: { [key: string]: string } = {
      'javascript': 'javascript',
      'js': 'javascript',
      'typescript': 'typescript',
      'ts': 'typescript',
      'python': 'python',
      'py': 'python',
      'java': 'java',
      'c++': 'cpp',
      'cpp': 'cpp',
      'c#': 'csharp',
      'csharp': 'csharp',
      'html': 'html',
      'css': 'css',
      'scss': 'scss',
      'sass': 'sass',
      'json': 'json',
      'xml': 'xml',
      'sql': 'sql',
      'bash': 'bash',
      'shell': 'bash',
      'php': 'php',
      'ruby': 'ruby',
      'go': 'go',
      'rust': 'rust',
      'kotlin': 'kotlin',
      'swift': 'swift',
      'dart': 'dart',
      'r': 'r',
      'matlab': 'matlab',
      'yaml': 'yaml',
      'yml': 'yaml',
      'markdown': 'markdown',
      'md': 'markdown',
    };

    return languageMap[language.toLowerCase()] || 'text';
  };

  return (
    <section className="border border-[#242424] bg-custom-surface rounded-md overflow-hidden hover:border-custom-hover transition-all">
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-medium text-white mb-1 break-words">
              {snippet.title}
            </h3>
            <p className="text-sm text-zinc-400 break-words">
              {snippet.description}
            </p>
          </div>
          <div className="flex items-center gap-2 ml-4 flex-shrink-0">
            <button
              onClick={() => bookmarkSnippet()}
              className={`p-2 rounded-lg transition-all duration-200 ${
                snippet.isStarred
                  ? 'text-lime-200/40 hover:text-lime-200 hover:bg-lime-400/20'
                  : 'text-custom-text hover:text-white hover:bg-[#242424]border border-transparent'
              }`}
            >
              <HeartPulse
                className={`w-4 h-4 transition-all duration-200 ${
                  snippet.isStarred ? 'fill-current drop-shadow-sm' : ''
                }`}
              />
            </button>
            <button
              onClick={() => handleDeleteSnippet(snippet._id)}
              className="p-2 rounded-lg transition-all duration-200 text-custom-text hover:text-red-400 hover:bg-red-400/20 border border-transparent hover:border-red-400/20"
              title="Delete snippet"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="relative mb-3">
          <div className="bg-[#141414] rounded-lg overflow-hidden border border-custom-border">
            <SyntaxHighlighter
              language={getLanguageForHighlighter(
                snippet.language || 'TypeScript'
              )}
              style={tomorrow}
              customStyle={{
                margin: 0,
                padding: '1rem',
                background: 'transparent',
                fontSize: '0.875rem',
                lineHeight: '1.5',
                fontFamily:
                  'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
              }}
              editable={true}
              wrapLines={true}
              wrapLongLines={true}
              showLineNumbers={false}
            >
              {snippet.code}
            </SyntaxHighlighter>
          </div>
          <button
            onClick={() => handleCopySnippet(snippet?.code)}
            className="absolute top-3 right-3 p-1.5 bg-[#1a1a1a] hover:bg-[#242424] border border-custom-border rounded-lg text-custom-text hover:text-white transition-all"
            title="Copy code"
          >
            <Copy className="w-4 h-4" />
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2 mb-3">
          {snippet.tags &&
            snippet.tags.map((tag) => {
              return (
                <span
                  key={tag._id}
                  className="px-2.5 py-1 bg-custom-surface/70 border border-custom-hover rounded-lg text-xs text-zinc-400 hover:text-lime-200 hover:border-custom-hover transition-colors cursor-pointer flex-shrink-0"
                >
                  {tag.name}
                </span>
              );
            })}
        </div>

        <div className="flex items-center justify-end">
          <span className="text-xs text-zinc-500 bg-custom-surface/50 px-2 py-1 rounded">
            {snippet.language}
          </span>
        </div>
      </div>
    </section>
  );
}
