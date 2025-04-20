import { Code, Eye, EyeOff, Save, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { ISnippet } from '../../../../back/src/models/snippet.model';
import { useNavigate, useParams } from 'react-router-dom';
import APIService from '../../service/api.service';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { INote } from '../../../../back/src/models/note.model';
import ReactMarkdown from 'react-markdown';
import CategorySelector from '../../components/CategorySelector';
import { ICategory } from '../../../../back/src/models/category.model';
import TagSelector from '../../components/TagSelector';
import { ITag } from '../../../../back/src/models/tag.model';

export default function ManageNotes(props: { id?: string }) {
  const [showPreview, setShowPreview] = useState<boolean>(false);
  const [note, setNote] = useState<Partial<INote>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');

  const params = useParams();
  const navigate = useNavigate();
  const id = props?.id ?? params?.id ?? null;

  useEffect(() => {
    if (id) {
      const getNote = async () => {
        try {
          setError('');
          const noteRes: Partial<INote> = await APIService.get(`notes/${id}`);

          setNote(noteRes);
        } catch (err: any) {
          const errorMessage = err?.message || 'Failed to load note';
          console.error('Error loading note:', errorMessage);
          setError(errorMessage);
          setTimeout(() => {
            navigate('/admin');
          }, 33000);
        }
      };

      getNote();
    }
  }, [id, navigate]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (!note.title?.trim()) {
      setError('Title is required');
      return;
    }

    if (!note.content?.trim()) {
      setError('Content is required');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      await APIService.post('notes', note);
      setSuccessMessage('Note created successfully!');

      setTimeout(() => {
        navigate('/admin');
      }, 1500);
    } catch (err: any) {
      const errorMessage =
        err?.message || 'Something went wrong. Please try again.';
      console.error('Error submitting form:', errorMessage);
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleCategoryChange(category: ICategory) {
    setNote((prev) => {
      return { ...prev, category: category };
    });
  }

  const getSelectedTags = () => {
    if (!note?.tags) return [];
    return note.tags;
  };

  const handleTagsChange = (tags: ITag[]) => {
    setNote((prev) => {
      return { ...prev, tags };
    });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 p-4">
      <div className="bg-custom-sidebar/70 backdrop-blur-sm border border-custom-border rounded-xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">
            {id ? 'Edit' : 'Create'} Note
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

        {successMessage && (
          <div className="mt-4 p-3 bg-custom-dark  border border-custom-border rounded-lg text-lime-200">
            {successMessage}
          </div>
        )}

        {error && (
          <div className="mt-4 p-3 bg-custom-dark border border-custom-border rounded-lg text-red-200">
            {error}
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit}>
        <div>
          <label className="block text-zinc-300 mb-2">
            Title <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={note?.title || ''}
            onChange={(e) => {
              setNote((prev) => {
                if (!prev) return { title: e.target.value };
                return { ...prev, title: e.target.value };
              });
            }}
            className={`w-full px-4 py-2 rounded-lg bg-custom-base border ${
              !note?.title && error ? 'border-red-500' : 'border-custom-border'
            } text-white focus:outline-none focus:ring-1 focus:ring-lime-100/20 focus:border-custom-border`}
            placeholder="Enter note title..."
            required
          />
        </div>

        <div className="mt-4">
          <CategorySelector
            selectedCategory={note?.category?._id || ''}
            onChange={handleCategoryChange}
          />
        </div>

        <div className="mt-4">
          <TagSelector
            selectedTags={getSelectedTags()}
            onChange={handleTagsChange}
          />
        </div>

        <div className="mt-6">
          <label className="block text-zinc-300 mb-2">
            Content <span className="text-red-400">*</span>
          </label>
          {showPreview ? (
            <div className="p-4 bg-custom-base border border-custom-border rounded-lg prose prose-invert max-w-none min-h-[300px]">
              <ReactMarkdown
                components={{
                  code({ node, inline, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || '');
                    return !inline && match ? (
                      <SyntaxHighlighter
                        style={atomDark as any}
                        language={match[1]}
                        PreTag="div"
                        {...props}
                      >
                        {String(children).replace(/\n$/, '')}
                      </SyntaxHighlighter>
                    ) : (
                      <code className={className} {...props}>
                        {children}
                      </code>
                    );
                  },
                }}
              >
                {typeof note?.content === 'string' ? note?.content : ''}
              </ReactMarkdown>
            </div>
          ) : (
            <textarea
              value={note?.content || ''}
              onChange={(e) => {
                setNote((prev) => {
                  if (!prev) return { content: e.target.value };
                  return { ...prev, content: e.target.value };
                });
              }}
              rows={15}
              className={`w-full px-4 py-2 rounded-lg bg-custom-base border ${
                !note?.content && error
                  ? 'border-red-500'
                  : 'border-custom-border'
              } text-white font-mono text-sm focus:outline-none focus:ring-1 focus:ring-lime-100/20 focus:border-custom-border`}
              placeholder="# Markdown content here..."
              required
            />
          )}
        </div>

        <div className="mt-8 flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => navigate('/admin')}
            className="px-4 py-2 rounded-lg text-zinc-400 hover:text-white flex items-center"
            disabled={isSubmitting}
          >
            <X size={18} className="mr-2" />
            Cancel
          </button>

          <button
            type="submit"
            className="px-5 py-2 rounded-lg bg-lime-200 hover:bg-lime-300 text-zinc-900 font-medium flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isSubmitting}
          >
            <Save size={18} className="mr-2" />
            {isSubmitting ? 'Saving...' : id ? 'Update' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  );
}
