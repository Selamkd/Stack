import { useEffect, useState } from 'react';
import APIService from '../service/api.service';
import { X } from 'lucide-react';
import { ITicket } from '../../../back/src/models/ticket.model';

interface ITicketFormModal {
  isOpen: boolean;
  onClose: () => void;
  ticketId: string | null;
}
export default function AddTicketModal(props: ITicketFormModal) {
  const { isOpen, onClose, ticketId } = props;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [stage, setStage] = useState<
    'backlog' | 'development' | 'done' | 'parked'
  >('backlog');
  const [ticket, setTicket] = useState<ITicket>();

  useEffect(() => {
    async function fetchTicket() {
      if (ticketId) {
        const res = await APIService.get(`tickets/${ticketId}`);
        setTicket(res);
        setTitle(res.title);
        setCategory(res.category);
        setDescription(res.description);
        setStage(res.stage);
      } else {
        setTitle('');
        setCategory('');
        setDescription('');
        setStage('backlog');
      }
    }

    fetchTicket();
  }, [ticketId]);

  async function fetchTicket() {
    if (ticketId) {
      const res = await APIService.get(`tickets/${ticketId}`);

      setTicket(res);
    }
  }
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await APIService.post('tickets', {
        title: title.trim(),
        description: description.trim(),
        category: category.trim(),
        stage,
      });

      setTitle('');
      setDescription('');
      setStage('backlog');
      setCategory('');
      onClose();
    } catch (err) {
      console.error('Error creating ticket:', err);
    }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#1a1a1a] border border-[#242424] rounded-lg w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-[#242424]">
          <h2 className="text-xl font-semibold text-white">Add New Ticket</h2>
          <button
            onClick={onClose}
            className="text-[#404040] hover:text-white transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-white mb-2"
            >
              Title *
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter ticket title"
              className="w-full px-4 py-3 bg-[#141414] border border-[#242424] rounded-lg text-white placeholder-[#404040] focus:outline-none focus:border-[#303030]"
              required
            />
          </div>
          <div>
            <label
              htmlFor="category"
              className="block text-sm font-medium text-white mb-2"
            >
              Category
            </label>
            <input
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Enter ticket category"
              className="w-full px-4 py-3 bg-[#141414] border border-[#242424] rounded-lg text-white placeholder-[#404040] focus:outline-none focus:border-[#303030] resize-none"
            />
          </div>
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-white mb-2"
            >
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter ticket description (optional)"
              rows={4}
              className="w-full px-4 py-3 bg-[#141414] border border-[#242424] rounded-lg text-white placeholder-[#404040] focus:outline-none focus:border-[#303030] resize-none"
            />
          </div>

          <div>
            <label
              htmlFor="stage"
              className="block text-sm font-medium text-white mb-2"
            >
              Stage
            </label>
            <select
              id="stage"
              value={stage}
              onChange={(e) =>
                setStage(
                  e.target.value as
                    | 'backlog'
                    | 'development'
                    | 'done'
                    | 'parked'
                )
              }
              className="w-full px-4 py-3 bg-[#141414] border border-[#242424] rounded-lg text-white focus:outline-none focus:border-[#303030]"
            >
              <option value="parked">Parked</option>
              <option value="backlog">Backlog</option>
              <option value="development">Development</option>
              <option value="done">Done</option>
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-[#242424] hover:bg-[#303030] text-white rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!title.trim()}
              className="flex-1 px-4 py-3 bg-custom-surface hover:bg-lime-200 hover:text-gray-900 text-white rounded-lg"
            >
              Create Ticket
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
