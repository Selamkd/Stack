import { format, formatDistanceToNow } from 'date-fns';
import {
  Check,
  Edit3,
  FileText,
  Heart,
  Plus,
  Search,
  Tags,
  Trash2,
} from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { INote } from '../../../back/src/models/note.model';
import { ITag } from '../../../back/src/models/tag.model';
import { ICategory } from '../../../back/src/models/category.model';
import CategorySelector from '../components/CategorySelector';
import { EMPTY_DOC, NoteEditor } from '../components/NoteEditor';
import TagSelector from '../components/TagSelector';
import Modal from '../components/ui/Modal';
import { useDebouncedCallback } from '../hooks/useDebouncedCallback';
import APIService from '../service/api.service';

interface INoteListItem {
  _id: string;
  title: string;
  isStarred?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

export default function Notes() {
  const [notes, setNotes] = useState<INoteListItem[]>([]);
  const [selectedNote, setSelectedNote] = useState<INote | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const [confirmingDelete, setConfirmingDelete] = useState<string | null>(null);
  const [metaOpen, setMetaOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  const draftRef = useRef<
    { id: string; title: string; content: string } | undefined
  >(undefined);

  async function fetchNotes(): Promise<INoteListItem[]> {
    try {
      setIsLoading(true);
      const res = await APIService.get('notes', { page: '1', limit: '50' });
      const list: INoteListItem[] = Array.isArray(res) ? res : res?.data || [];
      setNotes(list);
      return list;
    } catch (error) {
      console.error('Error loading notes:', error);
      return [];
    } finally {
      setIsLoading(false);
    }
  }

  async function selectNote(id: string) {
    if (selectedNote?._id === id) return;
    try {
      const note = await APIService.get(`notes/${id}`);
      setSelectedNote(note);
      setSaveStatus('idle');
      draftRef.current = { id: note._id, title: note.title, content: note.content };
      setSearchParams({ id }, { replace: true });
    } catch (error) {
      console.error('Error loading note:', error);
    }
  }

  useEffect(() => {
    fetchNotes().then((list) => {
      const requested = searchParams.get('id');
      const target =
        (requested && list.find((n) => n._id === requested)) || list[0];
      if (target) selectNote(target._id);
    });
  }, []);

  const persist = useCallback(async () => {
    const draft = draftRef.current;
    if (!draft) return;
    try {
      setSaveStatus('saving');
      await APIService.post('notes', {
        _id: draft.id,
        title: draft.title,
        content: draft.content,
      });
      setSaveStatus('saved');
      setNotes((prev) =>
        prev.map((n) =>
          n._id === draft.id
            ? { ...n, title: draft.title, updatedAt: new Date().toISOString() }
            : n
        )
      );
    } catch (error) {
      console.error('Error saving note:', error);
      setSaveStatus('error');
    }
  }, []);

  const debouncedPersist = useDebouncedCallback(persist, 800);

  function handleTitleChange(title: string) {
    if (!selectedNote || !draftRef.current) return;
    setSelectedNote({ ...selectedNote, title });
    draftRef.current.title = title;
    setSaveStatus('saving');
    debouncedPersist();
  }

  function handleContentChange(content: string) {
    if (!draftRef.current) return;
    draftRef.current.content = content;
    setSaveStatus('saving');
    debouncedPersist();
  }

  async function createNewNote() {
    try {
      const newNote = await APIService.post('notes', {
        _id: 'new',
        title: 'Untitled note',
        content: JSON.stringify(EMPTY_DOC),
      });
      setNotes((prev) => [newNote, ...prev]);
      setSelectedNote(newNote);
      draftRef.current = {
        id: newNote._id,
        title: newNote.title,
        content: newNote.content,
      };
      setSaveStatus('idle');
      setSearchParams({ id: newNote._id }, { replace: true });
    } catch (error) {
      console.error('Error creating note:', error);
    }
  }

  async function handleDelete(id: string) {
    if (confirmingDelete !== id) {
      setConfirmingDelete(id);
      setTimeout(() => setConfirmingDelete(null), 2500);
      return;
    }
    try {
      await APIService.delete(`notes/${id}`);
      const remaining = notes.filter((n) => n._id !== id);
      setNotes(remaining);
      setConfirmingDelete(null);
      if (selectedNote?._id === id) {
        setSelectedNote(null);
        draftRef.current = undefined;
        if (remaining.length > 0) selectNote(remaining[0]._id);
      }
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  }

  async function toggleStar() {
    if (!selectedNote) return;
    try {
      const updated = await APIService.patch(
        `notes/${selectedNote._id}/star`,
        {}
      );
      setSelectedNote({ ...selectedNote, isStarred: updated.isStarred });
      setNotes((prev) =>
        prev.map((n) =>
          n._id === selectedNote._id
            ? { ...n, isStarred: updated.isStarred }
            : n
        )
      );
    } catch (error) {
      console.error('Error toggling star:', error);
    }
  }

  async function saveMeta(category: ICategory | null, tags: ITag[]) {
    if (!selectedNote || !draftRef.current) return;
    try {
      const updated = await APIService.post('notes', {
        _id: selectedNote._id,
        title: draftRef.current.title,
        content: draftRef.current.content,
        category: category ? category._id : null,
        tags: tags.map((t) => t._id),
      });
      setSelectedNote({ ...selectedNote, category: updated.category, tags });
      setMetaOpen(false);
    } catch (error) {
      console.error('Error saving note details:', error);
    }
  }

  const filteredNotes = notes.filter((note) =>
    note.title?.toLowerCase().includes(search.toLowerCase())
  );

  const statusLabel = {
    idle: '',
    saving: 'Saving…',
    saved: 'Saved',
    error: 'Failed to save — retrying on next change',
  }[saveStatus];

  return (
    <div className="flex h-[calc(100vh-57px)]">
      <div className="flex w-72 shrink-0 flex-col border-r border-custom-border">
        <div className="flex items-center gap-2 p-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-custom-text" />
            <input
              type="text"
              placeholder="Search notes…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-base w-full py-2 pl-9 pr-3 text-sm"
            />
          </div>
          <button
            onClick={createNewNote}
            title="New note"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-clay/10 text-clay transition-colors hover:bg-clay/20"
          >
            <Plus size={16} />
          </button>
        </div>

        <div className="flex-1 space-y-1 overflow-y-auto scrollbar-thin px-3 pb-4">
          {isLoading ? (
            [...Array(4)].map((_, i) => (
              <div key={i} className="panel animate-pulse p-3">
                <div className="mb-2 h-4 w-3/4 rounded bg-custom-hover" />
                <div className="h-3 w-1/2 rounded bg-custom-hover" />
              </div>
            ))
          ) : filteredNotes.length > 0 ? (
            filteredNotes.map((note) => (
              <div
                key={note._id}
                onClick={() => selectNote(note._id)}
                className={`group cursor-pointer rounded-lg border p-3 transition-all ${
                  selectedNote?._id === note._id
                    ? 'border-custom-active bg-custom-raised'
                    : 'border-transparent hover:border-custom-border hover:bg-custom-surface'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <h3 className="min-w-0 flex-1 truncate text-sm font-medium text-zinc-100">
                    {note.isStarred && (
                      <Heart
                        size={11}
                        className="mb-0.5 mr-1.5 inline fill-dusk/70 text-dusk/70"
                      />
                    )}
                    {note.title || 'Untitled'}
                  </h3>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(note._id);
                    }}
                    title={
                      confirmingDelete === note._id
                        ? 'Click again to delete'
                        : 'Delete note'
                    }
                    className={`shrink-0 rounded-md p-1 transition-all ${
                      confirmingDelete === note._id
                        ? 'bg-red-400/20 text-red-400'
                        : 'text-custom-text opacity-0 hover:text-red-400 group-hover:opacity-100'
                    }`}
                  >
                    {confirmingDelete === note._id ? (
                      <Check size={13} />
                    ) : (
                      <Trash2 size={13} />
                    )}
                  </button>
                </div>
                <span className="mt-1 block text-xs text-custom-text">
                  {note.updatedAt
                    ? formatDistanceToNow(new Date(note.updatedAt), {
                        addSuffix: true,
                      })
                    : ''}
                </span>
              </div>
            ))
          ) : (
            <div className="panel p-8 text-center text-custom-text">
              <FileText className="mx-auto mb-3 h-10 w-10" />
              <p className="text-sm">
                {search ? 'No notes match your search' : 'No notes yet'}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        {selectedNote ? (
          <>
            <div className="border-b border-custom-border px-8 pb-4 pt-6 md:px-12">
              <div className="flex items-start justify-between gap-4">
                <input
                  type="text"
                  value={selectedNote.title || ''}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  className="w-full bg-transparent text-2xl font-bold text-white placeholder-custom-text focus:outline-none"
                  placeholder="Note title…"
                />
                <div className="flex shrink-0 items-center gap-1">
                  <button
                    onClick={toggleStar}
                    title={selectedNote.isStarred ? 'Unstar' : 'Star'}
                    className={`rounded-lg p-2 transition-colors ${
                      selectedNote.isStarred
                        ? 'text-dusk'
                        : 'text-custom-text hover:bg-custom-hover/60 hover:text-dusk'
                    }`}
                  >
                    <Heart
                      size={16}
                      className={selectedNote.isStarred ? 'fill-current' : ''}
                    />
                  </button>
                  <button
                    onClick={() => setMetaOpen(true)}
                    title="Category & tags"
                    className="rounded-lg p-2 text-custom-text transition-colors hover:bg-custom-hover/60 hover:text-zinc-100"
                  >
                    <Tags size={16} />
                  </button>
                </div>
              </div>
              <div className="mt-1.5 flex items-center gap-2 text-xs text-custom-text">
                <span>
                  {selectedNote.createdAt
                    ? format(new Date(selectedNote.createdAt), 'PP')
                    : ''}
                </span>
                {selectedNote.category && (
                  <>
                    <span>·</span>
                    <span className="text-haze/80">
                      {selectedNote.category.name}
                    </span>
                  </>
                )}
                {selectedNote.tags?.map((tag) => (
                  <span
                    key={tag._id}
                    className="rounded-full border border-custom-border px-2 py-0.5 text-custom-text"
                  >
                    #{tag.name}
                  </span>
                ))}
                {statusLabel && (
                  <span
                    className={`ml-auto ${
                      saveStatus === 'error'
                        ? 'text-red-400'
                        : saveStatus === 'saved'
                        ? 'text-clay/80'
                        : 'text-custom-text'
                    }`}
                  >
                    {statusLabel}
                  </span>
                )}
              </div>
            </div>

            <div className="min-h-0 flex-1">
              <NoteEditor
                key={selectedNote._id}
                content={selectedNote.content}
                onContentChange={handleContentChange}
              />
            </div>
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center">
            <div className="panel p-12 text-center text-custom-text">
              <Edit3 className="mx-auto mb-4 h-12 w-12" />
              <h3 className="mb-1 text-base font-medium text-zinc-300">
                {isLoading ? 'Loading…' : 'No note selected'}
              </h3>
              {!isLoading && (
                <p className="text-sm">
                  Pick a note from the list or create a new one
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {selectedNote && (
        <NoteMetaModal
          open={metaOpen}
          note={selectedNote}
          onClose={() => setMetaOpen(false)}
          onSave={saveMeta}
        />
      )}
    </div>
  );
}

interface NoteMetaModalProps {
  open: boolean;
  note: INote;
  onClose: () => void;
  onSave: (category: ICategory | null, tags: ITag[]) => void;
}

function NoteMetaModal({ open, note, onClose, onSave }: NoteMetaModalProps) {
  const [category, setCategory] = useState<ICategory | null>(
    note.category || null
  );
  const [tags, setTags] = useState<ITag[]>(note.tags || []);

  useEffect(() => {
    if (open) {
      setCategory(note.category || null);
      setTags(note.tags || []);
    }
  }, [open, note]);

  return (
    <Modal open={open} title="Note details" onClose={onClose}>
      <div className="space-y-5">
        <CategorySelector
          selectedCategory={category?._id || ''}
          onChange={setCategory}
        />
        <TagSelector selectedTags={tags} onChange={setTags} />
        <div className="flex justify-end gap-2 pt-2">
          <button
            onClick={onClose}
            className="rounded-lg px-4 py-2 text-sm text-zinc-400 transition-colors hover:text-white"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(category, tags)}
            className="rounded-lg bg-clay/15 px-4 py-2 text-sm font-medium text-clay transition-colors hover:bg-clay/25"
          >
            Save
          </button>
        </div>
      </div>
    </Modal>
  );
}
