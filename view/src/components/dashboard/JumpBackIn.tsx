import { formatDistanceToNow } from 'date-fns';
import {
  FileText,
  History,
  SearchCode,
  SquareChevronRight,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import APIService from '../../service/api.service';

interface ActivityItem {
  id: string;
  type: 'note' | 'snippet' | 'lookup';
  title: string;
  timestamp?: string;
}

interface RawItem {
  _id: string;
  title: string;
  updatedAt?: string;
  createdAt?: string;
}

const TYPE_META = {
  note: { icon: FileText, color: 'text-clay/80', label: 'Note' },
  snippet: {
    icon: SquareChevronRight,
    color: 'text-sand/80',
    label: 'Snippet',
  },
  lookup: { icon: SearchCode, color: 'text-haze/80', label: 'Lookup' },
};

export default function JumpBackIn() {
  const [items, setItems] = useState<ActivityItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([
      APIService.get('notes', { page: '1', limit: '8' }),
      APIService.get('snippets'),
      APIService.get('quicklookups'),
    ])
      .then(([notesRes, snippets, lookups]) => {
        const notes: RawItem[] = Array.isArray(notesRes)
          ? notesRes
          : notesRes?.data || [];
        const toItem =
          (type: ActivityItem['type']) =>
          (raw: RawItem): ActivityItem => ({
            id: raw._id,
            type,
            title: raw.title || 'Untitled',
            timestamp: raw.updatedAt || raw.createdAt,
          });

        const activity = [
          ...notes.map(toItem('note')),
          ...((snippets as RawItem[]) || []).slice(0, 6).map(toItem('snippet')),
          ...((lookups as RawItem[]) || []).slice(0, 6).map(toItem('lookup')),
        ]
          .filter((item) => item.timestamp)
          .sort(
            (a, b) =>
              new Date(b.timestamp as string).getTime() -
              new Date(a.timestamp as string).getTime()
          )
          .slice(0, 8);
        setItems(activity);
      })
      .catch((error) => console.error('Error loading activity:', error))
      .finally(() => setIsLoading(false));
  }, []);

  function open(item: ActivityItem) {
    if (item.type === 'note') navigate(`/notes?id=${item.id}`);
    if (item.type === 'snippet') navigate(`/snippets?id=${item.id}`);
    if (item.type === 'lookup') navigate('/lookups');
  }

  return (
    <div className="panel flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-custom-border px-4 py-3">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-zinc-200">
          <History size={15} className="text-haze/80" />
          Jump back in
        </h2>
      </div>

      <div className="flex-1 p-3">
        {isLoading ? (
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-14 animate-pulse rounded-lg bg-custom-hover/30"
              />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="flex h-full min-h-[140px] flex-col items-center justify-center gap-2 text-custom-text">
            <History size={20} />
            <p className="text-xs">
              Your latest notes, snippets, and lookups land here
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {items.map((item) => {
              const meta = TYPE_META[item.type];
              const Icon = meta.icon;
              return (
                <button
                  key={`${item.type}-${item.id}`}
                  onClick={() => open(item)}
                  className="group flex items-center gap-3 rounded-lg border border-custom-border bg-custom-raised/50 px-3 py-2.5 text-left transition-colors hover:border-custom-active hover:bg-custom-raised"
                >
                  <Icon size={15} className={`shrink-0 ${meta.color}`} />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm text-zinc-200">
                      {item.title}
                    </span>
                    <span className="block text-[10px] text-custom-text">
                      {meta.label}
                      {item.timestamp
                        ? ` · ${formatDistanceToNow(new Date(item.timestamp), {
                            addSuffix: true,
                          })}`
                        : ''}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
