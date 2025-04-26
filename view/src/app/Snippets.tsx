import { useEffect, useState } from 'react';
import { ISnippet } from '../../../back/src/models/snippet.model';
import APIService from '../service/api.service';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

export default function Snippets() {
  const [snippets, setSnippets] = useState<ISnippet[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    async function getSnippets() {
      try {
        const snippetsRes = await APIService.get('snippets');
        setSnippets(snippetsRes);
      } catch (e) {
        console.error('Error fetching snippets', e);
      }
    }
    getSnippets();
  }, []);

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
    <main className="bg-custom-surface/50 max-w-7xl mx-auto min-h-screen p-4 md:p-6 my-4 md:my-6 rounded-lg">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4"></div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search snippets..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-2 bg-custom-base/50 border border-custom-border rounded text-zinc-300 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:border-transparent"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 bg-custom-base/50 border border-custom-border rounded text-zinc-300 focus:outline-none focus:ring-1 focus:border-transparent"
          >
            <option value="all">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-custom-border">
              <th className="px-4 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                Title
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                Description
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                Category
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                Language
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                Date
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-custom-border">
            {filtered.map((snippet) => (
              <tr key={snippet._id} className="hover:bg-custom-hover">
                <td className="px-4 py-3">
                  <Link
                    to={`/snippet/${snippet._id}`}
                    className="text-zinc-300 hover:text-zinc-200 font-medium"
                  >
                    {snippet.title}
                  </Link>
                </td>
                <td className="px-4 py-3 text-zinc-400 max-w-md truncate">
                  {snippet.description || '-'}
                </td>
                <td className="px-4 py-3">
                  {snippet.category && (
                    <span className="px-2 py-1 bg-lime-base rounded-md text-lime-200 text-xs font-medium">
                      {snippet.category.name}
                    </span>
                  )}
                </td>
                <td className="px-4 py-3">
                  {snippet.category && (
                    <span className="px-2 py-1 bg-lime-base rounded-md text-zinc-400 text-xs font-medium">
                      {snippet.language}
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-zinc-400 text-sm">
                  {snippet.createdAt
                    ? format(new Date(snippet.createdAt), 'PP')
                    : '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
