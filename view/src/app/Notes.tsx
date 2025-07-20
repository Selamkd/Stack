import { useEffect, useState } from 'react';
import { INote } from '../../../back/src/models/note.model';
import { TipTap } from '../components/TipTap';
import APIService from '../service/api.service';
import { Edit3 } from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';

export default function Notes() {
  const [notes, setNotes] = useState<INote[] | null>(null);
  const [selectedNote, setSelectedNote] = useState<INote | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isSelected = (id: string) => selectedNote?._id === id;

  useEffect(() => {
    async function fetchNotes() {
      try {
        setIsLoading(true);
        const notesRes = await APIService.get('notes');
        setNotes(notesRes);
      } catch (error) {
        console.error('Error loading notes:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchNotes();
  }, []);

  const handleNoteSelect = (note: INote) => {
    setSelectedNote(note);
  };

  async function createNewNote() {
    try {
      const newNote = await APIService.post('notes', {
        title: 'Untitled Note',
        content: '<p>Type here...</p>',
        createdAt: new Date().toISOString(),
      });
      setNotes((prev) => (prev ? [newNote, ...prev] : [newNote]));
      setSelectedNote(newNote);
    } catch (error) {
      console.error('Error creating note:', error);
    }
  }

  return (
    <div className="min-h-screen bg-custom-base">
      <div className="flex h-screen border-r border-custom-border">
        <div className="w-80  border-r border-custom-border flex flex-col">
          <div className="p-6 border-custom-border">
            <div className="relative">
              <input
                type="text"
                placeholder="Search notes..."
                className="w-full px-3 py-2 bg-custom-base border border-custom-border rounded-md text-zinc-300 placeholder-zinc-500 focus:outline-none focus:border-zinc-600 text-sm"
              />
              <svg
                className="absolute right-3 top-2.5 w-4 h-4 text-zinc-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {isLoading ? (
              <div className="p-6">
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-4 bg-custom-border rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-custom-border rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
              </div>
            ) : notes && notes.length > 0 ? (
              <ul className="p-4 space-y-2">
                {notes.map((note) => (
                  <li key={note._id || note._id}>
                    <button
                      onClick={() => handleNoteSelect(note)}
                      className={`w-full text-left p-3 rounded-lg transition-colors group ${
                        isSelected(note._id)
                          ? 'bg-custom-active border border-custom-border'
                          : 'hover:bg-custom-hover'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <h3
                            className={`font-medium text-sm truncate ${
                              isSelected(note._id)
                                ? 'text-white'
                                : 'text-zinc-300 group-hover:text-white'
                            }`}
                          >
                            {note.title || 'Untitled'}
                          </h3>

                          <p
                            className={`text-xs mt-1 line-clamp-2 ${
                              isSelected(note._id)
                                ? 'text-zinc-400'
                                : 'text-zinc-500 group-hover:text-zinc-400'
                            }`}
                          >
                            {note.content
                              ? note.content
                                  .replace(/<[^>]*>/g, '')
                                  .substring(0, 80) + '...'
                              : 'No content'}
                          </p>

                          <p
                            className={`text-xs mt-2 ${
                              isSelected(note._id)
                                ? 'text-zinc-500'
                                : 'text-zinc-600 group-hover:text-zinc-500'
                            }`}
                          >
                            {note.createdAt && note.createdAt
                              ? selectedNote?.createdAt
                                ? `${format(
                                    new Date(selectedNote.createdAt),
                                    'PPPp'
                                  )}`
                                : 'No date'
                              : 'No date'}
                          </p>
                        </div>

                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                            }}
                            className="p-1 rounded hover:bg-custom-border text-zinc-500 hover:text-red-400"
                          >
                            <svg
                              width="12"
                              height="12"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <polyline points="3,6 5,6 21,6"></polyline>
                              <path d="M19,6V20a2,2,0,0,1-2,2H7a2,2,0,0,1-2-2V6M8,6V4a2,2,0,0,1,2-2h4a2,2,0,0,1,2,2V6"></path>
                            </svg>
                          </button>
                        </div>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-6 text-center">
                <div className="text-zinc-500 mb-4">
                  <svg
                    className="w-12 h-12 mx-auto mb-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <p className="text-sm">No notes yet</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 flex flex-col mt-5">
          {selectedNote ? (
            <>
              <div className="bg-custom-surface  border-custom-border p-6 max-w-7x mx-12">
                <input
                  type="text"
                  value={selectedNote.title || ''}
                  onChange={(e) => {
                    setSelectedNote((prev) =>
                      prev ? { ...prev, title: e.target.value } : null
                    );
                  }}
                  className="text-2xl font-bold bg-transparent text-white placeholder-zinc-500 focus:outline-none w-full"
                  placeholder="Note title..."
                />
                <div className="flex items-center gap-2 mt-2 text-sm text-zinc-500">
                  <span>
                    Created{' '}
                    {selectedNote.createdAt
                      ? `${format(new Date(selectedNote.createdAt), 'PP')}`
                      : null}
                  </span>
                  <span>•</span>
                  <span>
                    {selectedNote.category
                      ? `${selectedNote.category.name}`
                      : ''}
                  </span>
                </div>
              </div>

              <div className="flex-1 ">
                <TipTap
                  key={selectedNote._id || selectedNote._id}
                  initialContent={selectedNote.content}
                  onUpdate={(content) => {
                    setSelectedNote((prev) =>
                      prev ? { ...prev, content } : null
                    );
                    // debounce save
                  }}
                  className="max-w-7x mx-12 bg-custom-surface overflow-hidden shadow-xl "
                />
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-custom-base">
              <div className="text-center text-zinc-500">
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
