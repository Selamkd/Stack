import { useEffect, useState } from 'react';
import { ICategory } from '../../../back/src/models/category.model';
import { ISnippet } from '../../../back/src/models/snippet.model';
import { ITag } from '../../../back/src/models/tag.model';
import APIService from '../service/api.service';
import CategorySelector from './CategorySelector';
import TagSelector from './TagSelector';
import Modal from './ui/Modal';

export const SNIPPET_LANGUAGES = [
  'typescript',
  'javascript',
  'tsx',
  'jsx',
  'html',
  'css',
  'scss',
  'json',
  'yaml',
  'sql',
  'bash',
  'python',
  'java',
  'csharp',
  'cpp',
  'go',
  'rust',
  'php',
  'ruby',
  'swift',
  'kotlin',
  'markdown',
  'plaintext',
];

interface SnippetModalProps {
  open: boolean;
  onClose: () => void;
  initial?: Partial<ISnippet>;
  onSaved: (snippet: ISnippet) => void;
}

export default function SnippetModal({
  open,
  onClose,
  initial,
  onSaved,
}: SnippetModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [language, setLanguage] = useState('typescript');
  const [code, setCode] = useState('');
  const [category, setCategory] = useState<ICategory | null>(null);
  const [tags, setTags] = useState<ITag[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!open) return;
    setTitle(initial?.title || '');
    setDescription(initial?.description || '');
    setLanguage(initial?.language || 'typescript');
    setCode(initial?.code || '');
    setCategory(initial?.category || null);
    setTags(initial?.tags || []);
    setError('');
  }, [open, initial]);

  async function save() {
    if (!title.trim() || !code.trim()) {
      setError('Title and code are required');
      return;
    }
    try {
      setSaving(true);
      const payload: Record<string, unknown> = {
        title: title.trim(),
        description: description.trim(),
        language,
        code,
        category,
        tags,
      };
      if (initial?._id) payload._id = initial._id;
      const saved = await APIService.post('snippets', payload);
      onSaved(saved);
      onClose();
    } catch (err) {
      console.error('Error saving snippet:', err);
      setError('Failed to save snippet');
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal
      open={open}
      title={initial?._id ? 'Edit snippet' : 'New snippet'}
      onClose={onClose}
      wide
    >
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-xs text-zinc-400">Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Debounced fetch hook"
              className="input-base w-full px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs text-zinc-400">
              Language
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="input-base w-full px-3 py-2 text-sm"
            >
              {SNIPPET_LANGUAGES.map((lang) => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-xs text-zinc-400">
            Description
          </label>
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What does it do, when do you reach for it?"
            className="input-base w-full px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs text-zinc-400">Code</label>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            spellCheck={false}
            rows={10}
            placeholder="Paste the code…"
            className="input-base w-full resize-y px-3 py-2 font-mono text-[13px] leading-relaxed"
          />
        </div>

        <CategorySelector
          selectedCategory={category?._id || ''}
          onChange={setCategory}
        />
        <TagSelector selectedTags={tags} onChange={setTags} />

        <div className="flex items-center justify-end gap-3 pt-1">
          {error && <span className="text-xs text-red-400">{error}</span>}
          <button
            onClick={onClose}
            className="rounded-lg px-4 py-2 text-sm text-zinc-400 transition-colors hover:text-white"
          >
            Cancel
          </button>
          <button
            onClick={save}
            disabled={saving}
            className="rounded-lg bg-clay/15 px-4 py-2 text-sm font-medium text-clay transition-colors hover:bg-clay/25 disabled:opacity-50"
          >
            {saving ? 'Saving…' : 'Save snippet'}
          </button>
        </div>
      </div>
    </Modal>
  );
}
