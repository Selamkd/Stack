import { Bookmark, Code, Eye, EyeOff, Save, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { ISnippet } from '../../../../back/src/models/snippet.model';
import { useNavigate, useParams } from 'react-router-dom';
import APIService from '../../service/api.service';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import ReactMarkdown from 'react-markdown';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { IQuickLookup } from '../../../../back/src/models/quicklookup.model';
import { ICategory } from '../../../../back/src/models/category.model';
export default function ManageQuickLookup(props: { id?: string }) {
  const [showPreview, setShowPreview] = useState<boolean>(false);

  const [category, setCategory] = useState<Partial<ICategory>>({});
  const [error, setError] = useState<string>('');
  const params = useParams();
  const navigate = useNavigate();
  const id = props?.id ?? params?.id ?? null;

  useEffect(() => {
    if (id) {
      const getCategory = async () => {
        try {
          const categoryRes: Partial<ICategory> = await APIService.get(
            `categories/${id}`
          );

          setCategory(categoryRes);
        } catch (err) {
          console.error('Error loading categories', error);
        }
      };

      getCategory();
    }
  }, []);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    try {
      await APIService.post('categories', category);
    } catch (err) {
      console.error('Error submitting form:', error);
    }
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 p-4">
      <div className="bg-custom-sidebar/70 backdrop-blur-sm border border-custom-border rounded-xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">
            {props?.id ? 'Edit' : 'Create'} Category
          </h2>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div>
          <label className="block text-zinc-300 mb-2">Name</label>
          <input
            type="text"
            value={category?.name}
            onChange={(e) => {
              setCategory((prev) => {
                if (!prev) return { name: e.target.value };
                return { ...prev, name: e.target.value };
              });
            }}
            className={`w-full px-4 py-2 rounded-lg bg-custom-base border ${
              error ? 'border-red-500' : 'border-custom-border'
            } text-white focus:outline-none focus:ring-1 focus:ring-lime-100/20 focus:border-custom-border`}
            placeholder="Enter topic name..."
          />
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
