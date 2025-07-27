import { useDraggable, useDroppable } from '@dnd-kit/core';
import { ITicket } from '../app/ProjectBoard';
import { Trash2 } from 'lucide-react';
import { CSS } from '@dnd-kit/utilities';
import { ReactNode } from 'react-markdown/lib/react-markdown';
interface ITicketDroppable {
  tickets: ITicket[];
  handleDeleteTicket: (id: string) => void;
  refresh: () => void;
}
export default function TicketDroppable(props: ITicketDroppable) {
  const { tickets, handleDeleteTicket, refresh } = props;
  const { setNodeRef } = useDroppable({
    id: 'ticket-droppable',
  });

  console.log('Node reference', setNodeRef);
  return (
    <div ref={setNodeRef}>
      <div className="flex-1 border-l border-r border-b border-custom-border/80 rounded-b-lg bg-custom-hover/20 p-2 min-h-[400px]">
        <div className="space-y-3">
          {tickets.map((ticket) => (
            <TicketCard
              key={ticket._id}
              ticket={ticket}
              handleDeleteTicket={() => handleDeleteTicket(ticket._id)}
              refresh={refresh}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
interface ITicketCard {
  ticket: ITicket;
  handleDeleteTicket: (ticketId: string) => void;
  refresh?: () => void;
}

export function TicketCard(props: ITicketCard) {
  const { ticket, handleDeleteTicket, refresh } = props;

  return (
    <TicketDraggable id={ticket._id}>
      <section className="group border bg-[#161616] rounded-lg overflow-hidden border-custom-hover transition-all">
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-medium text-white mb-1 break-words">
                {ticket.title}
              </h3>
              <p className="text-sm text-zinc-400 break-words">
                {ticket.description}
              </p>
            </div>
            <div className="flex items-center gap-2 ml-4 flex-shrink-0">
              <button
                onClick={() => handleDeleteTicket(ticket._id)}
                className="p-2 rounded-lg transition-all duration-200 text-custom-text hover:text-red-400 hover:bg-red-400/20 border border-transparent hover:border-red-400/20"
                title="Delete snippet"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="border mx-5 border-custom-border h-0"></div>
      </section>
    </TicketDraggable>
  );
}

interface ITicketDraggable {
  id: string;
  children: ReactNode;
}
function TicketDraggable(props: ITicketDraggable) {
  const { id } = props;
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
  };

  return (
    <button ref={setNodeRef} style={style} {...listeners} {...attributes}>
      {props.children}
    </button>
  );
}
