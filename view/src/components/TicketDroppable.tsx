import { useDraggable, useDroppable } from '@dnd-kit/core';
import { ITicket } from '../../../back/src/models/ticket.model';
import { Clock, Edit3, GitBranch, Trash2 } from 'lucide-react';
import { CSS } from '@dnd-kit/utilities';
import { ReactNode } from 'react-markdown/lib/react-markdown';
import { useState } from 'react';
import APIService from '../service/api.service';
import AddTicketModal from './AddTicketModal';
interface ITicketDroppable {
  tickets: ITicket[];
  column: string;

  refresh: () => void;
  handleEdit: () => void;
}
export default function TicketDroppable(props: ITicketDroppable) {
  const { tickets, refresh, handleEdit } = props;
  const { setNodeRef } = useDroppable({
    id: `ticket-droppable${props.column}`,
    data: {
      type: props.column,
    },
  });

  return (
    <div ref={setNodeRef}>
      <div className="flex-1 border-l overflow-y-scroll scrollbar-thin  max-h-screen min-h-screen border-r border-b border-custom-border/80 rounded-b-lg p-2">
        <div className="space-y-3">
          {tickets.map((ticket) => (
            <TicketCard
              key={ticket._id}
              ticket={ticket}
              refresh={refresh}
              handleEdit={handleEdit}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
interface ITicketCard {
  ticket: ITicket;

  refresh?: () => void;
  handleEdit: () => void;
}

export function TicketCard(props: ITicketCard) {
  const { ticket, refresh, handleEdit } = props;
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    console.log('called');
    setIsDeleting(true);
    try {
      APIService.delete(`ticket/${ticket?._id}`).then(() => {
        if (refresh) {
          refresh();
        }
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'parked':
        return 'bg-gray-500/20 text-gray-300';
      case 'backlog':
        return 'bg-blue-500/20 text-blue-300';
      case 'development':
        return 'bg-yellow-500/20 text-yellow-300';
      case 'done':
        return 'bg-green-500/20 text-green-300';
      default:
        return 'bg-gray-500/20 text-gray-300';
    }
  };

  return (
    <TicketDraggable id={ticket._id}>
      <div className="group relative bg-gradient-to-r from-blue-500/5 to-gray-500/5  border border-[#2a2a2a] rounded-xl overflow-hidden transition-all duration-300 hover:border-[#3a3a3a] hover:shadow-lg hover:shadow-black/20 hover:-translate-y-0.5">
        <div
          className={`h-1 w-full ${
            ticket.stage === 'parked'
              ? 'bg-gray-500'
              : ticket.stage === 'backlog'
              ? 'bg-blue-500/50'
              : ticket.stage === 'development'
              ? 'bg-yellow-500/50'
              : 'bg-green-500/50'
          }`}
        />

        <div className="p-5">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStageColor(
                    ticket.stage
                  )}`}
                >
                  {ticket.stage}
                </span>
              </div>

              <h3 className="text-lg text-start mt-4 font-semibold text-white mb-2 break-words leading-tight group-hover:text-blue-100 transition-colors">
                {ticket.title}
              </h3>

              {ticket.description && (
                <p className="text-sm text-start text-zinc-400 break-words leading-relaxed line-clamp-3">
                  {ticket.description}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-[#2a2a2a]">
            <div className="flex items-center gap-3 text-xs text-zinc-500">
              <div className="flex items-center gap-1">
                <GitBranch className="w-3 h-3" />
                <span> {ticket.category}</span>
              </div>
            </div>

            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleEdit();
                }}
                className="p-2 rounded-lg transition-all duration-200 text-zinc-400 hover:text-blue-400 hover:bg-blue-400/10 border border-transparent hover:border-blue-400/20"
                title="Edit ticket"
              >
                <Edit3 className="w-4 h-4" />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete();
                }}
                disabled={isDeleting}
                className="p-2 rounded-lg transition-all duration-200 text-zinc-400 hover:text-red-400 hover:bg-red-400/10 border border-transparent hover:border-red-400/20 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Delete ticket"
              >
                <Trash2
                  className={`w-4 h-4 ${isDeleting ? 'animate-pulse' : ''}`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
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
    data: {
      type: 'ticket',
      ticketId: id,
      supports: ['backlog', 'development', 'done', 'parked'],
    },
  });

  const style = {
    transform: CSS.Translate.toString(transform),
  };

  return (
    <div ref={setNodeRef} style={style}>
      <div {...listeners} {...attributes} className="cursor-move p-2">
        <span className="text-xs text-zinc-500">:: Drag</span>
      </div>
      {props?.children}
    </div>
  );
}
