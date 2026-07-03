import { formatDistanceToNow } from 'date-fns';
import {
  Check,
  Copy,
  FileOutput,
  Inbox,
  Trash2,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ISticky } from '../../../../back/src/models/sticky.model';
import { useDebouncedCallback } from '../../hooks/useDebouncedCallback';
import APIService from '../../service/api.service';

export default function InboxCard() {
  const [items, setItems] = useState<ISticky[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchItems = () =>
      APIService.get('stickies')
        .then((res: ISticky[]) =>
          setItems(
            (res || []).sort(
              (a, b) =>
                new Date(b.createdAt || 0).getTime() -
                new Date(a.createdAt || 0).getTime()
            )
          )
        )
        .catch((error) => console.error('Error fetching inbox:', error))
        .finally(() => setIsLoading(false));

    fetchItems();
    window.addEventListener('sticky-captured', fetchItems);
    return () => window.removeEventListener('sticky-captured', fetchItems);
  }, []);

  async function deleteItem(id: string) {
    if (confirmingId !== id) {
      setConfirmingId(id);
      setTimeout(() => setConfirmingId(null), 2500);
      return;
    }
    try {
      setItems((prev) => prev.filter((s) => s._id !== id));
      setConfirmingId(null);
      await APIService.delete(`stickies/${id}`);
    } catch (error) {
      console.error('Error deleting inbox item:', error);
    }
  }

  async function copyItem(item: ISticky) {
    try {
      await navigator.clipboard.writeText(item.text);
      setCopiedId(item._id);
      setTimeout(() => setCopiedId(null), 1500);
    } catch (error) {
      console.error('Error copying:', error);
    }
  }

  async function promoteToNote(item: ISticky) {
    try {
      const lines = item.text.split('\n').filter((l) => l.trim());
      const title = (lines[0] || 'Captured thought').slice(0, 60);
      const content = {
        type: 'doc',
        content: lines.length
          ? lines.map((line) => ({
              type: 'paragraph',
              content: [{ type: 'text', text: line }],
            }))
          : [{ type: 'paragraph' }],
      };
      const note = await APIService.post('notes', {
        _id: 'new',
        title,
        content: JSON.stringify(content),
      });
      await APIService.delete(`stickies/${item._id}`);
      navigate(`/notes?id=${note._id}`);
    } catch (error) {
      console.error('Error promoting to note:', error);
    }
  }

  function updateLocal(id: string, text: string) {
    setItems((prev) => prev.map((s) => (s._id === id ? { ...s, text } : s)));
  }

  return (
    <div className="panel flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-custom-border px-4 py-3">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-zinc-200">
          <Inbox size={15} className="text-sand/80" />
          Inbox
          {items.length > 0 && (
            <span className="rounded-full bg-custom-hover/50 px-2 py-0.5 text-[10px] font-normal text-custom-text">
              {items.length}
            </span>
          )}
        </h2>
      </div>

      <div className="max-h-[380px] flex-1 overflow-y-auto scrollbar-thin p-2">
        {isLoading ? (
          <div className="space-y-2 p-1">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="h-12 animate-pulse rounded-lg bg-custom-hover/30"
              />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="flex h-full min-h-[160px] flex-col items-center justify-center gap-2 text-custom-text">
            <Inbox size={22} />
            <p className="text-xs">
              Empty — capture a thought up top and it lands here
            </p>
          </div>
        ) : (
          <div className="space-y-1">
            {items.map((item) => (
              <InboxRow
                key={item._id}
                item={item}
                copied={copiedId === item._id}
                confirming={confirmingId === item._id}
                onEdit={(text) => updateLocal(item._id, text)}
                onCopy={() => copyItem(item)}
                onPromote={() => promoteToNote(item)}
                onDelete={() => deleteItem(item._id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

interface InboxRowProps {
  item: ISticky;
  copied: boolean;
  confirming: boolean;
  onEdit: (text: string) => void;
  onCopy: () => void;
  onPromote: () => void;
  onDelete: () => void;
}

function InboxRow({
  item,
  copied,
  confirming,
  onEdit,
  onCopy,
  onPromote,
  onDelete,
}: InboxRowProps) {
  const [editing, setEditing] = useState(false);
  const itemRef = useRef(item);
  itemRef.current = item;

  const save = useDebouncedCallback(() => {
    const current = itemRef.current;
    APIService.post('stickies', {
      _id: current._id,
      text: current.text,
      color: current.color,
    }).catch((error) => console.error('Error saving inbox item:', error));
  }, 700);

  return (
    <div className="group rounded-lg px-2.5 py-2 transition-colors hover:bg-custom-raised/70">
      <div className="flex items-start gap-2">
        <div className="min-w-0 flex-1">
          {editing ? (
            <textarea
              value={item.text}
              autoFocus
              rows={Math.min(5, Math.max(1, item.text.split('\n').length))}
              onChange={(e) => {
                onEdit(e.target.value);
                save();
              }}
              onBlur={() => setEditing(false)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  setEditing(false);
                }
              }}
              className="w-full resize-none bg-transparent text-sm leading-snug text-zinc-200 focus:outline-none"
            />
          ) : (
            <p
              onClick={() => setEditing(true)}
              className="cursor-text whitespace-pre-wrap text-sm leading-snug text-zinc-200 [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:3] overflow-hidden"
            >
              {item.text || (
                <span className="text-custom-text">Empty — click to write</span>
              )}
            </p>
          )}
          <span className="mt-0.5 block text-[10px] text-custom-text">
            {item.createdAt
              ? formatDistanceToNow(new Date(item.createdAt), {
                  addSuffix: true,
                })
              : ''}
          </span>
        </div>

        <div className="flex shrink-0 items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
          <button
            onClick={onPromote}
            title="Turn into note"
            className="rounded p-1 text-custom-text transition-colors hover:bg-custom-hover/60 hover:text-clay"
          >
            <FileOutput size={13} />
          </button>
          <button
            onClick={onCopy}
            title="Copy"
            className={`rounded p-1 transition-colors ${
              copied
                ? 'text-clay'
                : 'text-custom-text hover:bg-custom-hover/60 hover:text-zinc-200'
            }`}
          >
            {copied ? <Check size={13} /> : <Copy size={13} />}
          </button>
          <button
            onClick={onDelete}
            title={confirming ? 'Click again to delete' : 'Delete'}
            className={`rounded p-1 transition-colors ${
              confirming
                ? 'bg-red-400/20 text-red-400 opacity-100'
                : 'text-custom-text hover:bg-custom-hover/60 hover:text-red-400'
            }`}
          >
            {confirming ? <Check size={13} /> : <Trash2 size={13} />}
          </button>
        </div>
      </div>
    </div>
  );
}
