import { CircleArrowOutUpRightIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function QuickActions() {
  const navigate = useNavigate();
  return (
    <div className="group relative border border-custom-border h-fit  bg-gradient-to-br from-emerald-200/5 to-transparent  rounded-xl p-6 overflow-hidden hover:border-custome-border transition-all duration-300">
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <h3 className="text-lg font-semibold text-white">Quick Actions</h3>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => navigate('/project-board')}
            className="flex w-full justify-between group/btn p-4 bg-custom-base hover:bg-custom-hover border border-custom-border rounded-lg transition-all text-left "
          >
            <p className="text-md font-lg  text-white">Notes</p>
            <div className="p-2 bg-blue-200/15 rounded-lg border border-rose-200/25 w- h-fit mb-2 group-hover/btn:bg-blue-200/25 transition-colors">
              <CircleArrowOutUpRightIcon className="w-4 h-4 text-rose-200/50" />
            </div>
          </button>

          <button
            onClick={() => navigate('/snippets')}
            className="flex w-full justify-between  group/btn p-4 bg-custom-base hover:bg-custom-hover border border-custom-border rounded-lg transition-all text-left"
          >
            <p className="text-sm font-medium text-white">Snippets</p>
            <div className="p-2 bg-green-200/15 rounded-lg border border-lime-200/25 w-fit mb-2 group-hover/btn:bg-lime-200/25 transition-colors">
              <CircleArrowOutUpRightIcon className="w-4 h-4 text-lime-200/50" />
            </div>
          </button>

          <button
            onClick={() => navigate('/project-board')}
            className="flex w-full justify-between group/btn p-4 bg-custom-base hover:bg-custom-hover border border-custom-border rounded-lg transition-all text-left "
          >
            <p className="text-sm font-medium text-white">Ticket Board</p>
            <div className="p-2 bg-orange-200/15 rounded-lg border border-amber-200/25  h-fit w-fit mb-2 group-hover/btn:bg-orange-200/25 transition-colors">
              <CircleArrowOutUpRightIcon className="w-4 h-4 text-amber-200/50" />
            </div>
          </button>

          <button
            onClick={() => navigate('/lookups')}
            className="flex w-full justify-between group/btn p-4 bg-custom-base hover:bg-custom-hover border border-custom-border rounded-lg transition-all text-left"
          >
            <p className="text-sm font-medium text-white">Quick Lookups</p>
            <div className="p-2 bg-purple-200/15 rounded-lg border border-purple-200/25 w-fit mb-2 group-hover/btn:bg-purple-200/25 transition-colors">
              <CircleArrowOutUpRightIcon className="w-4 h-4 text-purple-200/50" />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
