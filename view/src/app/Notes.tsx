import { useCallback, useEffect, useState } from 'react';
import { INote } from '../../../back/src/models/note.model';
import { TipTap } from '../components/TipTap';
import APIService from '../service/api.service';
import {
  Edit3,
  FileText,
  PlusIcon,
  PlusSquareIcon,
  Search,
  Trash2,
} from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { defaultContent, NoteEditor } from '../components/NoteEditor';

export default function Notes() {
  const [notes, setNotes] = useState<INote[] | null>(null);
  const [selectedNote, setSelectedNote] = useState<INote | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!selectedNote && notes && notes.length > 0) {
      setSelectedNote(notes[0]);
    }
  }, [notes]);

  const isSelected = (id: string) => selectedNote?._id === id;

  async function fetchNotes() {
    try {
      setIsLoading(true);
      const notesRes = await APIService.get('notes');
      setNotes(notesRes);

      if (!selectedNote && notesRes.length > 0) {
        setSelectedNote(notesRes[0]);
      }
    } catch (error) {
      console.error('Error loading notes:', error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleNoteSelect = (note: INote) => {
    setSelectedNote(note);
  };

  function debounce(pr: (...args: any[]) => void, timeout = 300) {
    let timer: string | number | NodeJS.Timeout | undefined;
    return (...args: any[]) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        pr(...args);
      }, timeout);
    };
  }

  function saveNote() {
    try {
      APIService.post('notes', {
        _id: selectedNote?._id,
        title: selectedNote?.title,
        content: selectedNote?.content,
      });
    } catch (err) {
      console.error('Error posting note');
    }
  }

  const debouncedSave = useCallback(
    debounce(() => saveNote(), 1000),
    [selectedNote]
  );

  async function createNewNote() {
    try {
      const content = JSON.stringify(defaultContent);
      const newNote = await APIService.post('notes', {
        _id: 'new',
        title: 'Untitled Note',
        content: defaultContent,
      });
      setNotes((prev) => (prev ? [newNote, ...prev] : [newNote]));
      setSelectedNote(newNote);
    } catch (error) {
      console.error('Error creating note:', error);
    }
  }

  async function handleDelete(id: string) {
    try {
      await APIService.delete(`notes/${id}`);

      setNotes((prevNotes) => {
        const updatedNotes = prevNotes?.filter((note) => note._id !== id) || [];

        if (selectedNote?._id === id) {
          setSelectedNote(updatedNotes.length > 0 ? updatedNotes[0] : null);
        }

        return updatedNotes;
      });
    } catch (err) {
      console.error('Error deleting a note:', err);
    }
  }

  const filteredNotes =
    notes?.filter((note) => {
      const matchesSearch =
        note.title?.toLowerCase().includes(search.toLowerCase()) ||
        note.content?.toLowerCase().includes(search.toLowerCase());
      return matchesSearch;
    }) || [];

  return (
    <div className="min-h-screen">
      <div className="flex h-screen border-r border-custom-border">
        <div className="w-80 border-r border-custom-border flex flex-col">
          <div className="mx-3 min-h-screen p-4 md:p-2 my-2 md:my-6">
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#404040]" />
                <input
                  type="text"
                  placeholder="Search notes..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-11 pr-4 py-2 bg-[#141414] border border-[#242424] rounded-lg text-white placeholder-[#404040] focus:outline-none focus:border-[#303030]"
                />
              </div>
            </div>

            <div className="flex w-full justify-end py-2">
              <button
                onClick={createNewNote}
                className="flex items-center gap-2 px-4 py-2 bg-custom-surface hover:bg-custom-hover/20 hover:text-zinc- text-custom-text-400 rounded-lg transition-colors"
              >
                <PlusIcon className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-1">
              {isLoading ? (
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="animate-pulse border border-custom-border glass-card rounded-lg p-4"
                    >
                      <div className="h-4 bg-custom-border rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-custom-border rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
              ) : filteredNotes && filteredNotes.length > 0 ? (
                <div className="space-y-3">
                  {filteredNotes.map((note) => (
                    <div
                      key={note._id}
                      className={`border border-custom-border bg-custom-surface rounded-lg overflow-hidden hover:border-custom-hover transition-all cursor-pointer ${
                        isSelected(note._id)
                          ? 'border-[#242424] glass-card '
                          : ''
                      }`}
                    >
                      <div className="p-2">
                        <button
                          onClick={() => handleNoteSelect(note)}
                          className="w-full text-left"
                        >
                          <div className="flex items-start justify-between mb-1">
                            <div className="flex-1 min-w-0">
                              <h3 className="text-md font-medium text-white mb-1 break-words truncate">
                                {note.title || 'Untitled'}
                              </h3>
                            </div>
                            <div className="flex items-center gap-2 ml-4 flex-shrink-0">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDelete(note._id);
                                }}
                                className="p-2 rounded-lg transition-all duration-200 text-custom-text hover:text-red-400 hover:bg-red-400/20 border border-transparent hover:border-red-400/20"
                                title="Delete note"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        </button>

                        <div className="flex items-center justify-between">
                          <span className="text-xs text-zinc-500 bg-custom-surface/50 px-2 py-1 rounded">
                            {note.createdAt
                              ? format(new Date(note.createdAt), 'PP')
                              : 'No date'}
                          </span>
                          {note.category && (
                            <span className="text-xs text-zinc-500 bg-custom-surface/50 px-2 py-1 rounded">
                              {note.category.name}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center border border-custom-border bg-custom-surface rounded-lg p-8">
                  <div className="text-zinc-500 mb-4">
                    <FileText className="w-12 h-12 mx-auto mb-3" />
                    <p className="text-sm">No notes found</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col">
          {selectedNote ? (
            <>
              <div className="bg-custom-surface px-10 pt-10 border-custom-border p-6 w-full">
                <input
                  type="text"
                  value={selectedNote.title || ''}
                  onChange={(e) => {
                    setSelectedNote((prev) =>
                      prev ? { ...prev, title: e.target.value } : null
                    );
                    APIService.post('notes', {
                      _id: selectedNote._id,
                      title: e.target.value,
                      content: selectedNote.content,
                    });
                  }}
                  className="text-2xl font-bold bg-transparent text-white placeholder-zinc-500 focus:outline-none w-full"
                  placeholder="Note title..."
                />
                <div className="flex items-center gap-2 mt-2 text-sm text-zinc-500">
                  <span>
                    Created{' '}
                    {selectedNote.createdAt
                      ? format(new Date(selectedNote.createdAt), 'PP')
                      : 'Unknown date'}
                  </span>
                  {selectedNote.category && (
                    <>
                      <span>•</span>
                      <span>{selectedNote.category.name}</span>
                    </>
                  )}
                </div>
              </div>

              <div className="flex-1">
                <NoteEditor
                  noteId={selectedNote?._id}
                  content={selectedNote.content}
                  onContentChange={(newContent) => {
                    setSelectedNote((prev) =>
                      prev ? { ...prev, content: newContent } : null
                    );
                    debouncedSave();
                  }}
                />
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-custom-base">
              <div className="text-center text-zinc-500 border border-custom-border bg-custom-surface rounded-lg p-12">
                <Edit3 className="w-16 h-16 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-zinc-400 mb-2">
                  Select a note to edit
                </h3>
                <p className="text-sm">
                  Choose a note from the sidebar or create a new one
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
