import { Component, useEffect, useState } from 'react';
import APIService from '../service/api.service';
import {
  FileText,
  Code,
  Ticket,
  Search,
  Clock,
  Activity,
  Command,
  ComponentIcon,
} from 'lucide-react';
import QuickActions from '../components/QuickActions';
import RecentActivity from '../components/RecentActivity';
import { ITicket } from '../../../back/src/models/ticket.model';
import { format } from 'date-fns';
import CodewarsActivityCard from '../components/CodewarsActivity';
import DailyTodos from '../components/DailyTodos';
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

  const handleSearch = () => {
    if (searchQuery.trim()) {
      console.log('Searching for:', searchQuery, 'in:', selectedFilter);
    }
  };

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
    <main className="mx-5 min-h-screen p-4 md:p-6 my-2 md:my-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
          <p className="text-zinc-400">{format(new Date(), 'PPP')}</p>
        </div>
        <div className="flex items-center gap-2 mt-4 md:mt-0">
          <span className="text-sm text-zinc-500">
            Last updated: {new Date().toLocaleTimeString()}
          </span>
        </div>
      </div>

      <div className="group relative border border-custom-border  bg-gradient-to-br from-blue-200/5 to-transparent  rounded-xl p-6 overflow-hidden transition-all duration-300 mb-8">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-200/5 to-transparen transition-opacity duration-300"></div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4"></div>

          <div className="space-y-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Command className="h-5 w-5 text-zinc-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search across all your content..."
                className="w-full pl-12 pr-24 py-3 bg-custom-base border border-custom-border rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-lime-200/10 focus:border-lime-200/10"
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              <div className="absolute inset-y-0 right-0 pr-2 flex items-center">
                <button onClick={handleSearch}>
                  <Search />
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {[
                {
                  key: 'all',
                  label: 'All',
                  icon: ComponentIcon,
                },
                {
                  key: 'notes',
                  label: 'Notes',
                  icon: FileText,
                },
                {
                  key: 'snippets',
                  label: 'Code',
                  icon: Code,
                },
                {
                  key: 'tickets',
                  label: 'Tickets',
                  icon: Ticket,
                },
                {
                  key: 'lookups',
                  label: 'Lookups',
                  icon: Search,
                },
              ].map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setSelectedFilter(key)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${
                    selectedFilter === key
                      ? `bg-[#242424]  border border-lime-200/30 text-lime-200 `
                      : 'bg-custom-base text-zinc-300 border border-custom-border hover:bg-custom-hover hover:border-zinc-600'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1">
        <QuickActions />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CodewarsActivityCard />
        <DailyTodos />
      </div>
    </main>
  );
}
