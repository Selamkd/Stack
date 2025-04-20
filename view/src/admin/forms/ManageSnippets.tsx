import { Code, Eye, EyeOff, Save, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { ISnippet } from '../../../../back/src/models/snippet.model';
import { useNavigate, useParams } from 'react-router-dom';
import APIService from '../../service/api.service';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
export default function ManageSnippets(props: { id?: string }) {
  const [showPreview, setShowPreview] = useState<boolean>(false);
  const [snippet, setSnippet] = useState<Partial<ISnippet>>({});
  const [error, setError] = useState<string>('');
  const params = useParams();
  const navigate = useNavigate();
  const id = props?.id ?? params?.id ?? null;

  useEffect(() => {
    if (id) {
      const getSnippet = async () => {
        try {
          const snippetRes: Partial<ISnippet> = await APIService.get(
            `snippets/${id}`
          );

          setSnippet(snippetRes);
        } catch (err) {
          console.error('Error loading snippet:', error);
          navigate('/admin');
        }
      };

      getSnippet();
    }
  }, []);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    try {
      await APIService.post('snippets', snippet);
    } catch (err) {
      console.error('Error submitting form:', error);
    }
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 p-4">
      <div className="bg-custom-sidebar/70 backdrop-blur-sm border border-custom-border rounded-xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">
            {props?.id ? 'Edit' : 'Create'} Snippet
          </h2>

          <div className="flex space-x-2">
            <button
              type="button"
              onClick={() => setShowPreview(!showPreview)}
              className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-custom-surface transition-colors"
              title={showPreview ? 'Edit' : 'Preview'}
            >
              {showPreview ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div>
          <label className="block text-zinc-300 mb-2">Title</label>
          <input
            type="text"
            value={snippet?.title}
            onChange={(e) => {
              setSnippet((prev) => {
                if (!prev) return { title: e.target.value };
                return { ...prev, title: e.target.value };
              });
            }}
            className={`w-full px-4 py-2 rounded-lg bg-custom-base border ${
              error ? 'border-red-500' : 'border-custom-border'
            } text-white focus:outline-none focus:ring-1 focus:ring-lime-100/20 focus:border-custom-border`}
            placeholder="Enter snippet title..."
          />
          {error && <p className="mt-2 text-red-400 text-sm">{error}</p>}
        </div>

        <div className="mt-6">
          <label className="block text-zinc-300 mb-2">Description</label>
          <textarea
            value={snippet?.description}
            onChange={(e) => {
              setSnippet((prev) => {
                if (!prev) return { description: e.target.value };
                return { ...prev, description: e.target.value };
              });
            }}
            rows={3}
            className={`w-full px-4 py-2 rounded-lg bg-custom-base border ${
              error ? 'border-red-500' : 'border-custom-border'
            } text-white focus:outline-none focus:ring-1 focus:ring-lime-100/20 focus:border-custom-border`}
            placeholder="A short description of this code snippet..."
          />
          {error && <p className="mt-2 text-red-400 text-sm">{error}</p>}
        </div>

        <div className="mt-4">
          <label className="block text-zinc-300 mb-2">Language</label>
          <select
            value={snippet.language}
            onChange={(e) => {
              setSnippet((prev) => {
                if (!prev) return { language: e.target.value };
                return { ...prev, langauge: e.target.value };
              });
            }}
            className="w-full px-4 py-2 rounded-lg bg-custom-base border border-custom-border text-white focus:outline-none focus:ring-1 focus:ring-lime-20 focus:border-custom-border"
          >
            {languages.map((lang) => (
              <option key={lang.value} value={lang.value}>
                {lang.label}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-6">
          <label className="text-zinc-300 mb-2 flex items-center">
            <Code size={16} className="mr-2" />
            Code
          </label>
          {showPreview ? (
            <div className="p-4 bg-custom-base border border-custom-border rounded-lg">
              <SyntaxHighlighter
                style={atomDark}
                language={snippet?.language}
                showLineNumbers
              >
                {typeof snippet.code === 'string' ? snippet.code : ''}
              </SyntaxHighlighter>
            </div>
          ) : (
            <textarea
              value={snippet.code}
              onChange={(e) => {
                setSnippet((prev) => {
                  if (!prev) return { code: e.target.value };
                  return { ...prev, code: e.target.value };
                });
              }}
              rows={10}
              className={`w-full px-4 py-2 rounded-lg bg-custom-base border ${
                error ? 'border-red-500' : 'border-custom-border'
              } text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-lime-100/20 focus:border-custom-dark`}
              placeholder="// Your code here..."
            />
          )}
          {error && <p className="mt-2 text-red-400 text-sm">{error}</p>}
        </div>

        <div className="mt-8 flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => navigate('/admin')}
            className="px-4 py-2 rounded-lg text-zinc-400 hover:text-white flex items-center"
          >
            <X size={18} className="mr-2" />
            Cancel
          </button>

          <button
            type="submit"
            className="px-5 py-2 rounded-lg bg-lime-200 hover:bg-lime-300 text-zinc-900 font-medium flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save size={18} className="mr-2" />
            {id ? 'Update' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  );
}

const languages = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'go', label: 'Go' },
  { value: 'html', label: 'HTML' },
  { value: 'css', label: 'CSS' },
  { value: 'bash', label: 'Bash' },
  { value: 'json', label: 'JSON' },
];
