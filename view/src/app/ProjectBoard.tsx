import { PlusSquareIcon, Search, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import APIService from '../service/api.service';
import { DndContext, useDraggable } from '@dnd-kit/core';
import TicketDroppable from '../components/TicketDroppable';
import { ITicket } from '../../../back/src/models/ticket.model';
import AddTicketModal from '../components/AddTicketModal';

export default function ProjectBoard() {
  const [tickets, setTickets] = useState<ITicket[]>([]);
  const [search, setSearch] = useState('');
  const [deleteMessage, setDeleteMessage] = useState<string | null>(null);
  const [ticketModalOpen, setTicketModalOpen] = useState(false);
  const STAGES = ['parked', 'backlog', 'development', 'done'];

  const [ticketsWithStages, setTicketsWithStages] = useState<
    Record<string, ITicket[]>
  >({});

  function handleDragEnd(event: any) {
    const { active, over } = event;

    if (over && active.data.current.supports.includes(over.data.current.type)) {
    }
  }

  async function getTickets() {
    try {
      const ticketRes = await APIService.get('ticket');
      setTickets(ticketRes);
    } catch (e) {
      console.error('Error fetching tickets', e);
    }
  }

  useEffect(() => {
    getTickets();
  }, []);

  async function handleDeleteTicket(ticketId: string) {
    try {
      await APIService.delete(`snippets/${ticketId}`);
      setDeleteMessage('Ticket deleted successfully!');
      setTimeout(() => setDeleteMessage(null), 3000);
      getTickets();
    } catch (err) {
      console.error('Error deleting ticket', err);
      setDeleteMessage('Error deleting ticket');
      setTimeout(() => setDeleteMessage(null), 3000);
    }
  }

  const filtered = tickets.filter((ticket) => {
    const matchesSearch =
      ticket.title.toLowerCase().includes(search.toLowerCase()) ||
      ticket.description?.toLowerCase().includes(search.toLowerCase());

    return matchesSearch;
  });

  useEffect(() => {
    if (filtered.length > 0) {
      const mapTickets: Record<string, ITicket[]> = {};
      setTicketsWithStages(() => {
        STAGES.forEach((stage) => {
          mapTickets[stage] = [];
        });

        filtered.forEach((ticket) => {
          const key = ticket.stage;
          if (mapTickets[key]) {
            mapTickets[key].push(ticket);
          }
        });

        return mapTickets;
      });
    }
  }, [tickets]);

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <main className="max-w-9xl mx-auto min-h-screen p-4 md:p-6 my-2 md:my-6 rounded-lg">
        <div className="flex flex-col mb-4">
          <h1 className="text-3xl">Project Tracker Board</h1>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#404040]" />
            <input
              type="text"
              placeholder="Search tickets..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-[#141414] border border-[#242424] rounded-lg text-white placeholder-[#404040] focus:outline-none focus:border-[#303030]"
            />
          </div>
        </div>
        <div className="flex w-full justify-end py-2">
          <button
            onClick={() => setTicketModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-custom-surface hover:bg-lime-200  hover:text-gray-800 text-custom-text-400 rounded-lg transition-colors"
          >
            <PlusSquareIcon className="w-4 h-4" />
          </button>
        </div>

        {deleteMessage && (
          <div className="flex items-center gap-6 mb-5 ml-2">
            {deleteMessage && (
              <span
                onClick={() => setDeleteMessage(null)}
                className="text-xs text-red-200/80 cursor-pointer"
              >
                {deleteMessage}
              </span>
            )}
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {' '}
          {STAGES.map((stage) => (
            <div className="flex flex-col">
              <header className="px-4 py-3 border border-custom-border bg-custom-hover/80 rounded-t-lg">
                <p className="text-center font-medium">{stage}</p>
              </header>

              <TicketDroppable
                tickets={ticketsWithStages[stage] || []}
                handleDeleteTicket={handleDeleteTicket}
                refresh={getTickets}
              />
            </div>
          ))}
        </div>
        <AddTicketModal
          isOpen={ticketModalOpen}
          onClose={() => setTicketModalOpen(false)}
        />
      </main>
    </DndContext>
  );
}
