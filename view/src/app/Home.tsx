import { BotMessageSquare, SearchIcon, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import QuickActions from '../components/QuickActions';
import APIService from '../service/api.service';

import { ITicket } from '../../../back/src/models/ticket.model';

import SyntaxHighlighter from 'react-syntax-highlighter';
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import CodewarsActivityCard from '../components/CodewarsActivity';
import SpotifyCurrentlyPlaying from '../components/Currently';
import DailyTodos from '../components/DailyTodos';
import { StickyNotes } from '../components/StickeyNotes';

export interface IRecentActivity {
  id: string;
  type: 'note' | 'snippet' | 'ticket' | 'lookup';
  title: string;
  action: 'created' | 'updated' | 'deleted';
  timestamp: string;
}

export default function Dashboard() {
  const [recentActivity, setRecentActivity] = useState<IRecentActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [botResponse, setBotResponse] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const tickets: ITicket[] = [];

  useEffect(() => {
    loadDashboardData();
  }, []);

  async function loadDashboardData() {
    try {
      setIsLoading(true);

      const [notes, snippets, lookups] = await Promise.all([
        APIService.get('notes'),
        APIService.get('snippets'),
        APIService.get('quicklookups'),
      ]);

      const activities: IRecentActivity[] = [
        ...notes.slice(-3).map((note: any) => ({
          id: note._id,
          type: 'note' as const,
          title: note.title || 'Untitled Note',
          action: 'updated' as const,
          timestamp: note.updatedAt || note.createdAt,
        })),
        ...snippets.slice(-2).map((snippet: any) => ({
          id: snippet._id,
          type: 'snippet' as const,
          title: snippet.title,
          action: 'created' as const,
          timestamp: snippet.createdAt,
        })),
        ...tickets.slice(-2).map((ticket: any) => ({
          id: ticket._id,
          type: 'ticket' as const,
          title: ticket.title,
          action: 'updated' as const,
          timestamp: ticket.updatedAt || ticket.createdAt,
        })),
      ].sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );

      setRecentActivity(activities);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSearch() {
    if (searchQuery.trim()) {
      try {
        setIsSearching(true);
        const response = await APIService.post('bot/ask-bot', {
          question: searchQuery,
        });
        console.log(response);
        setBotResponse(response);
      } catch (error) {
        console.error('Error searching:', error);
        setBotResponse(
          'Sorry, I encountered an error while processing your request.'
        );
      } finally {
        setIsSearching(false);
      }
    }
  }

  function clearBotResponse() {
    setBotResponse('');
    setSearchQuery('');
  }

  if (isLoading) {
    return (
      <main className="mx-5 min-h-screen p-4 md:p-6 my-2 md:my-6">
        <div className="animate-pulse">
          <div className="h-8 bg-custom-border rounded w-1/4 mb-8"></div>
          <div className="h-32 bg-custom-surface border border-custom-border rounded-lg mb-8"></div>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto min-h-screen p-4 md:p-6">
      <div className="group relative blue-glass border border-custom-border  rounded-xl p-8 overflow-hidden transition-all duration-300 mb-8">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4"></div>

          <div className="space-y-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <BotMessageSquare className="h-5 w-5 text-zinc-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Ask your question...."
                className="w-full pl-12 pr-24 py-3 bg-custom-base border border-custom-border rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-lime-200/10 focus:border-lime-200/10"
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                disabled={isSearching}
              />
              <div className="absolute inset-y-0 right-0 pr-2 flex items-center">
                <button
                  onClick={handleSearch}
                  disabled={isSearching}
                  className="disabled:opacity-50"
                >
                  <SearchIcon className="h-5 w-5 text-zinc-400" />
                </button>
              </div>
            </div>
          </div>
          <QuickActions />
        </div>
      </div>

      {(botResponse || isSearching) && (
        <div className="border border-custom-border blue-glass rounded-xl p-6 mb-8 transition-all duration-300">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-2">
              <BotMessageSquare className="h-5 w-5 text-gray-400" />
            </div>
            {!isSearching && (
              <button
                onClick={clearBotResponse}
                className="text-zinc-400 hover:text-white transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="bg-transparent backdrop-blur-lg border border-gray-300/10 rounded-md p-4">
            {isSearching ? (
              <div className="flex items-center gap-3 text-zinc-400">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-200/60"></div>
                <span>Thinking...</span>
              </div>
            ) : (
              <div className="whitespace-pre-wrap text-zinc-200">
                <SyntaxHighlighter
                  style={atomOneDark}
                  customStyle={{
                    margin: 0,
                    background: 'transparent',
                    fontSize: '0.875rem',
                    lineHeight: '1.5',
                    maxHeight: '700px',
                    fontFamily: '-moz-initial',
                  }}
                  language="javascript"
                  editable={true}
                  wrapLines={true}
                  wrapLongLines={true}
                  showLineNumbers={false}
                >
                  {botResponse}
                </SyntaxHighlighter>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1"></div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-8">
        <StickyNotes />
        <SpotifyCurrentlyPlaying />
      </div>
      <div className="grid grid-cols-1  gap-6">
        <CodewarsActivityCard />
      </div>
    </main>
  );
}
