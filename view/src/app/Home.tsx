import {
  FileText,
  Code,
  Ticket,
  Search,
  Clock,
  Activity,
  Command,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import APIService from '../service/api.service';

interface RecentActivity {
  id: string;
  type: 'note' | 'snippet' | 'ticket' | 'lookup';
  title: string;
  action: 'created' | 'updated' | 'deleted';
  timestamp: string;
}

export default function Dashboard() {
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  useEffect(() => {
    loadDashboardData();
  }, []);

  async function loadDashboardData() {
    try {
      setIsLoading(true);

      const [notes, snippets, tickets, lookups] = await Promise.all([
        APIService.get('notes'),
        APIService.get('snippets'),
        APIService.get('tickets'),
        APIService.get('quicklookups'),
      ]);

      console.log(tickets);

      const activities: RecentActivity[] = [
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

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'note':
        return <FileText className="w-4 h-4" />;
      case 'snippet':
        return <Code className="w-4 h-4" />;
      case 'ticket':
        return <Ticket className="w-4 h-4" />;
      case 'lookup':
        return <Search className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  return (
    <main className="mx-5 min-h-screen p-4 md:p-6 my-2 md:my-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
          <p className="text-zinc-400">
            Overview of your productivity workspace
          </p>
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
                <button
                  onClick={handleSearch}
                  className="flex items-center gap-2 px-3 py-1.5 bg-custom-border hover:bg-lime-200 text-white hover:text-gray-800 rounded text-sm font-medium transition-colors"
                >
                  Search
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {[
                {
                  key: 'all',
                  label: 'All',
                  icon: Search,
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="group relative border border-custom-border bg-gradient-to-br from-slate-200/5 to-transparent rounded-xl p-6 overflow-hidden hover:border-slate-400/30 transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-200/5 to-transparent group-hover:opacity-100 transition-opacity duration-300"></div>

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-slate-200/15 rounded-lg border border-slate-200/25">
                <Clock className="w-5 h-5 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">
                Recent Activity
              </h3>
            </div>

            <div className="space-y-3">
              {recentActivity.slice(0, 6).map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center gap-3 p-3 bg-custom-base rounded-lg border border-custom-border hover:bg-custom-hover transition-colors"
                >
                  <div className="text-zinc-400">
                    {getTypeIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white truncate">
                      {activity.title}
                    </p>
                    <p className="text-xs text-zinc-500">
                      {activity.action} • {activity.timestamp}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="group relative border border-custom-border  bg-gradient-to-br from-emerald-200/5 to-transparent  rounded-xl p-6 overflow-hidden hover:border-custome-border transition-all duration-300">
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <h3 className="text-lg font-semibold text-white">
                Quick Actions
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button className="flex w-full justify-between group/btn p-4 bg-custom-base hover:bg-custom-hover border border-custom-border rounded-lg transition-all text-left ">
                <p className="text-md font-lg  text-white">Notes</p>
                <div className="p-2 bg-blue-200/15 rounded-lg border border-blue-200/25 w- h-fit mb-2 group-hover/btn:bg-blue-200/25 transition-colors">
                  <FileText className="w-4 h-4 text-lime-200/50" />
                </div>
              </button>

              <button className="flex w-full justify-between  group/btn p-4 bg-custom-base hover:bg-custom-hover border border-custom-border rounded-lg transition-all text-left">
                <p className="text-sm font-medium text-white">Snippets</p>
                <div className="p-2 bg-green-200/15 rounded-lg border border-lime-200/25 w-fit mb-2 group-hover/btn:bg-lime-200/25 transition-colors">
                  <Code className="w-4 h-4 text-lime-200" />
                </div>
              </button>

              <button className="flex w-full justify-between group/btn p-4 bg-custom-base hover:bg-custom-hover border border-custom-border rounded-lg transition-all text-left ">
                <p className="text-sm font-medium text-white">Ticket Board</p>
                <div className="p-2 bg-orange-200/15 rounded-lg border border-lime-200/25  h-fit w-fit mb-2 group-hover/btn:bg-orange-200/25 transition-colors">
                  <Ticket className="w-4 h-4 text-brand-400" />
                </div>
              </button>

              <button className="flex w-full justify-between group/btn p-4 bg-custom-base hover:bg-custom-hover border border-custom-border rounded-lg transition-all text-left">
                <p className="text-sm font-medium text-white">Quick Lookups</p>
                <div className="p-2 bg-purple-200/15 rounded-lg border border-purple-200/25 w-fit mb-2 group-hover/btn:bg-purple-200/25 transition-colors">
                  <Search className="w-4 h-4 text-purple-200" />
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
