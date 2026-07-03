import { useEffect, useState } from 'react';
import { ICategory } from '../../../back/src/models/category.model';
import { IQuickLookup } from '../../../back/src/models/quicklookup.model';
import { ITag } from '../../../back/src/models/tag.model';
import APIService from '../service/api.service';
import CategorySelector from './CategorySelector';
import TagSelector from './TagSelector';
import Modal from './ui/Modal';

interface LookupModalProps {
  open: boolean;
  onClose: () => void;
  initial?: Partial<IQuickLookup>;
  onSaved: (lookup: IQuickLookup) => void;
}

export default function LookupModal({
  open,
  onClose,
  initial,
  onSaved,
}: LookupModalProps) {
  const [title, setTitle] = useState('');
  const [answer, setAnswer] = useState('');
  const [category, setCategory] = useState<ICategory | null>(null);
  const [tags, setTags] = useState<ITag[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!open) return;
    setTitle(initial?.title || '');
    setAnswer(initial?.answer || '');
    setCategory(initial?.category || null);
    setTags(initial?.tags || []);
    setError('');
  }, [open, initial]);

  async function save() {
    if (!title.trim() || !answer.trim()) {
      setError('Term and answer are required');
      return;
    }
    try {
      setSaving(true);
      const payload: Record<string, unknown> = {
        title: title.trim(),
        answer,
        category,
        tags,
      };
      if (initial?._id) payload._id = initial._id;
      const saved = await APIService.post('quicklookups', payload);
      onSaved(saved);
      onClose();
    } catch (err) {
      console.error('Error saving lookup:', err);
      setError('Failed to save lookup');
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal
      open={open}
      title={initial?._id ? 'Edit lookup' : 'New lookup'}
      onClose={onClose}
      wide
    >
      <div className="space-y-4">
        <div>
          <label className="mb-1.5 block text-xs text-zinc-400">
            Term / operator / concept
          </label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. ?? (nullish coalescing)"
            className="input-base w-full px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs text-zinc-400">Answer</label>
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            spellCheck={false}
            rows={8}
            placeholder="The explanation — code welcome"
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
            {saving ? 'Saving…' : 'Save lookup'}
          </button>
        </div>
      </div>
    </Modal>
  );
}
