import {
  FileText,
  Code,
  Ticket,
  Search,
  Clock,
  Activity,
  Command,
} from 'lucide-react';
import { IRecentActivity } from '../app/Home';

export default function RecentActivity({
  recents,
}: {
  recents: IRecentActivity[];
}) {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'note':
        return <FileText className="w-4 h-4 text-gray-400" />;
      case 'snippet':
        return <Code className="w-4 h-4 text-emerald-400" />;
      case 'ticket':
        return <Ticket className="w-4 h-4" />;
      case 'lookup':
        return <Search className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };
  return (
    <div className="group relative border border-custom-border bg-gradient-to-br from-slate-200/5 to-transparent rounded-xl p-6 overflow-hidden hover:border-slate-400/30 transition-all duration-300">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-200/5 to-transparent group-hover:opacity-100 transition-opacity duration-300"></div>

      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-slate-200/15 rounded-lg border border-slate-200/25">
            <Clock className="w-5 h-5 text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-white">Recent Activity</h3>
        </div>

        <div className="space-y-3">
          {recents.slice(0, 6).map((activity) => (
            <div
              key={activity.id}
              className="flex items-center gap-3 p-3 bg-custom-base rounded-lg border border-custom-border hover:bg-custom-hover transition-colors"
            >
              <div className="text-zinc-400">{getTypeIcon(activity.type)}</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white truncate">{activity.title}</p>
                <p className="text-xs text-zinc-500">
                  {activity.action} • {activity.timestamp}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
