import {
  BotMessageSquare,
  Check,
  ExternalLink,
  FilePlus2,
  Zap,
} from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CodewarsCard from '../components/dashboard/CodewarsCard';
import InboxCard from '../components/dashboard/InboxCard';
import JumpBackIn from '../components/dashboard/JumpBackIn';
import TasksCard from '../components/dashboard/TasksCard';
import { EMPTY_DOC } from '../components/NoteEditor';
import APIService from '../service/api.service';

const DEV_LINKS = [
  { label: 'GitHub', url: 'https://github.com' },
  { label: 'MDN', url: 'https://developer.mozilla.org/en-US/' },
  { label: 'Lucide', url: 'https://lucide.dev/icons/' },
  { label: 'Tailwind', url: 'https://tailwindcss.com/docs' },
  { label: 'localhost:5173', url: 'http://localhost:5173/' },
];

function greeting(): string {
  const hour = new Date().getHours();
  if (hour < 5) return 'Up late';
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

export default function Dashboard() {
  const [capture, setCapture] = useState('');
  const [captured, setCaptured] = useState(false);
  const navigate = useNavigate();

  async function captureThought() {
    const text = capture.trim();
    if (!text) return;
    try {
      await APIService.post('stickies', { text, color: 'chalk-white' });
      setCapture('');
      setCaptured(true);
      setTimeout(() => setCaptured(false), 1800);
      window.dispatchEvent(new CustomEvent('sticky-captured'));
    } catch (error) {
      console.error('Error capturing thought:', error);
    }
  }

  async function newNote() {
    try {
      const note = await APIService.post('notes', {
        _id: 'new',
        title: 'Untitled note',
        content: JSON.stringify(EMPTY_DOC),
      });
      navigate(`/notes?id=${note._id}`);
    } catch (error) {
      console.error('Error creating note:', error);
    }
  }

  return (
    <main className="mx-auto min-h-screen max-w-6xl p-4 md:p-6">
      <div className="mb-5 mt-2 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100">
            {greeting()}, Selam
          </h1>
          <p className="mt-1 text-sm text-custom-text">
            Everything you know, one ⌘K away.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          {DEV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-full border border-custom-border bg-custom-surface px-3 py-1 text-xs text-zinc-400 transition-colors hover:border-custom-active hover:text-clay"
            >
              {link.label}
              <ExternalLink size={10} />
            </a>
          ))}
        </div>
      </div>

      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Zap
            size={15}
            className={`absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors ${
              captured ? 'text-clay' : 'text-custom-text'
            }`}
          />
          <input
            value={capture}
            onChange={(e) => setCapture(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && captureThought()}
            placeholder={
              captured
                ? 'Captured — it’s in your inbox'
                : 'Brain dump — capture a thought before it escapes, hit Enter'
            }
            className="input-base w-full py-2.5 pl-10 pr-4 text-sm"
          />
          {captured && (
            <Check
              size={15}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-clay"
            />
          )}
        </div>
        <div className="flex shrink-0 gap-2">
          <button
            onClick={newNote}
            className="flex items-center gap-2 rounded-lg bg-clay/15 px-3.5 py-2 text-sm text-clay transition-colors hover:bg-clay/25"
          >
            <FilePlus2 size={14} />
            New note
          </button>
          <button
            onClick={() => navigate('/chat')}
            className="flex items-center gap-2 rounded-lg bg-haze/15 px-3.5 py-2 text-sm text-haze transition-colors hover:bg-haze/25"
          >
            <BotMessageSquare size={14} />
            Ask AI
          </button>
        </div>
      </div>

      <div className="mb-5 grid grid-cols-1 gap-5 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <TasksCard />
        </div>
        <div className="lg:col-span-2">
          <InboxCard />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <JumpBackIn />
        </div>
        <div className="lg:col-span-2">
          <CodewarsCard />
        </div>
      </div>
    </main>
  );
}
