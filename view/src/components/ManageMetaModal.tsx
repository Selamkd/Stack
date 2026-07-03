import { Check, Folder, Hash, Pencil, Plus, Trash2, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import APIService from '../service/api.service';
import Modal from './ui/Modal';

interface MetaItem {
  _id: string;
  name: string;
  count?: number;
}

interface ManageMetaModalProps {
  open: boolean;
  onClose: () => void;
}

export default function ManageMetaModal({ open, onClose }: ManageMetaModalProps) {
  return (
    <Modal open={open} title="Categories & Tags" onClose={onClose} wide>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <MetaList
          endpoint="categories"
          label="Categories"
          icon={<Folder size={14} className="text-haze/80" />}
        />
        <MetaList
          endpoint="tags"
          label="Tags"
          icon={<Hash size={14} className="text-clay/80" />}
        />
      </div>
    </Modal>
  );
}

function MetaList({
  endpoint,
  label,
  icon,
}: {
  endpoint: 'categories' | 'tags';
  label: string;
  icon: React.ReactNode;
}) {
  const [items, setItems] = useState<MetaItem[]>([]);
  const [newName, setNewName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [confirmingId, setConfirmingId] = useState<string | null>(null);

  async function fetchItems() {
    try {
      const res = await APIService.get(endpoint);
      setItems(res || []);
    } catch (error) {
      console.error(`Error fetching ${endpoint}:`, error);
    }
  }

  useEffect(() => {
    fetchItems();
  }, [endpoint]);

  async function addItem() {
    const name = newName.trim();
    if (!name) return;
    try {
      const created = await APIService.post(endpoint, { name });
      setItems((prev) =>
        [...prev, created].sort((a, b) => a.name.localeCompare(b.name))
      );
      setNewName('');
    } catch (error) {
      console.error(`Error creating ${endpoint}:`, error);
    }
  }

  async function renameItem(id: string) {
    const name = editName.trim();
    if (!name) return;
    try {
      await APIService.post(endpoint, { _id: id, name });
      setItems((prev) =>
        prev.map((item) => (item._id === id ? { ...item, name } : item))
      );
      setEditingId(null);
    } catch (error) {
      console.error(`Error renaming ${endpoint}:`, error);
    }
  }

  async function deleteItem(id: string) {
    if (confirmingId !== id) {
      setConfirmingId(id);
      setTimeout(() => setConfirmingId(null), 2500);
      return;
    }
    try {
      await APIService.delete(`${endpoint}/${id}`);
      setItems((prev) => prev.filter((item) => item._id !== id));
      setConfirmingId(null);
    } catch (error) {
      console.error(`Error deleting ${endpoint}:`, error);
    }
  }

  return (
    <div>
      <h3 className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-400">
        {icon}
        {label}
      </h3>

      <div className="mb-3 flex gap-2">
        <input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addItem()}
          placeholder={`New ${label.toLowerCase().slice(0, -1)}…`}
          className="input-base w-full px-3 py-2 text-sm"
        />
        <button
          onClick={addItem}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-clay/10 text-clay transition-colors hover:bg-clay/20"
        >
          <Plus size={15} />
        </button>
      </div>

      <div className="max-h-72 space-y-1 overflow-y-auto scrollbar-thin pr-1">
        {items.length === 0 && (
          <p className="py-4 text-center text-xs text-custom-text">
            None yet — add one above
          </p>
        )}
        {items.map((item) => (
          <div
            key={item._id}
            className="group flex items-center gap-2 rounded-lg border border-transparent px-3 py-1.5 hover:border-custom-border hover:bg-custom-surface"
          >
            {editingId === item._id ? (
              <>
                <input
                  value={editName}
                  autoFocus
                  onChange={(e) => setEditName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') renameItem(item._id);
                    if (e.key === 'Escape') setEditingId(null);
                  }}
                  className="input-base w-full px-2 py-1 text-sm"
                />
                <button
                  onClick={() => renameItem(item._id)}
                  className="rounded p-1 text-clay hover:bg-clay/10"
                >
                  <Check size={13} />
                </button>
                <button
                  onClick={() => setEditingId(null)}
                  className="rounded p-1 text-zinc-500 hover:text-white"
                >
                  <X size={13} />
                </button>
              </>
            ) : (
              <>
                <span className="min-w-0 flex-1 truncate text-sm text-zinc-200">
                  {item.name}
                </span>
                {typeof item.count === 'number' && item.count > 0 && (
                  <span className="rounded-full bg-custom-hover/50 px-2 py-0.5 text-[10px] text-custom-text">
                    {item.count}
                  </span>
                )}
                <button
                  onClick={() => {
                    setEditingId(item._id);
                    setEditName(item.name);
                  }}
                  className="rounded p-1 text-custom-text opacity-0 transition-all hover:text-zinc-100 group-hover:opacity-100"
                >
                  <Pencil size={12} />
                </button>
                <button
                  onClick={() => deleteItem(item._id)}
                  className={`rounded p-1 transition-all ${
                    confirmingId === item._id
                      ? 'bg-red-400/20 text-red-400 opacity-100'
                      : 'text-custom-text opacity-0 hover:text-red-400 group-hover:opacity-100'
                  }`}
                >
                  {confirmingId === item._id ? (
                    <Check size={12} />
                  ) : (
                    <Trash2 size={12} />
                  )}
                </button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
