import { CircleArrowOutUpRightIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function QuickActions() {
  const navigate = useNavigate();
  return (
    <div className="group mb-4 relative p-1  border-custom-border h-fit  to-transparent  rounded-xl  overflow-hidden hover:border-custome-border transition-all duration-300">
      <div className="relative z-10">
        <div className="grid grid-cols-4 gap-3">
          <button
            onClick={() => navigate('/project-board')}
            className="flex w-full justify-between group/btn p-4 bg-custom-base hover:glass-card border border-custom-border rounded-lg transition-all text-left "
          >
            <p className="text-md font-lg  text-white">Notes</p>
            <div className="p- bg-blue-200/15 rounded-lg border border-rose-200/25  h-fit mb-2  transition-colors">
              <CircleArrowOutUpRightIcon className="w-4 h-4 text-rose-200/50" />
            </div>
          </button>

          <button
            onClick={() => navigate('/snippets')}
            className="flex w-full justify-between  group/btn p-4 bg-custom-base hover:glass-card border border-custom-border rounded-lg transition-all text-left"
          >
            <p className="text-sm font-medium text-white">Snippets</p>

            <CircleArrowOutUpRightIcon className="w-4 h-4 text-lime-200/50" />
          </button>

          <button
            onClick={() => navigate('/project-board')}
            className="flex w-full justify-between group/btn p-4 bg-custom-base hover:glass-card border border-custom-border rounded-lg transition-all text-left "
          >
            <p className="text-sm font-medium text-white">Ticket Board</p>

            <CircleArrowOutUpRightIcon className="w-4 h-4 text-amber-200/50" />
          </button>

          <button
            onClick={() => navigate('/lookups')}
            className="flex w-full justify-between group/btn p-4 bg-custom-base hover:glass-card border border-custom-border rounded-lg transition-all text-left"
          >
            <p className="text-sm font-medium text-white">Quick Lookups</p>

            <CircleArrowOutUpRightIcon className="w-4 h-4 text-purple-200/50" />
          </button>
        </div>
      </div>
    </div>
  );
}
