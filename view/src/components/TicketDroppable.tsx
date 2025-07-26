import { useDroppable } from '@dnd-kit/core';
import { ITicket, TicketCard } from '../app/ProjectBoard';

interface ITicketDroppable {
  tickets: ITicket[];
}
export default function TicketDroppable(props: ITicketDroppable) {
  const { setNodeRef } = useDroppable({
    id: 'ticket-droppable',
  });

  return <div ref={setNodeRef}></div>;
}
