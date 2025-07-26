import { Search, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import APIService from '../service/api.service';
import { DndContext, useDraggable } from '@dnd-kit/core';
import TicketDroppable from '../components/TicketDroppable';

//placeholder ticket interface till model setup
export interface ITicket {
  _id: string;
  title: string;
  description: string;
  stage: 'backlog' | 'development' | 'done' | 'parked';
}

export default function ProjectBoard() {
  const [tickets, setTickets] = useState<ITicket[]>([]);
  const [search, setSearch] = useState('');
  const [deleteMessage, setDeleteMessage] = useState<string | null>(null);
  const STAGES = ['Parked', 'Backlog', 'In Development', 'Done'];

  async function getTickets() {
    try {
      //   const ticketRes = await APIService.get('ticket');
      setTickets(sampleTickets);
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

  return (
    <DndContext>
      <main className="max-w-9xl mx-auto min-h-screen p-4 md:p-6 my-2 md:my-6 rounded-lg">
        <div className="flex flex-col mb-4">
          <h1 className="text-3xl">Project Tracker Board</h1>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
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

              <div className="flex-1 border-l border-r border-b border-custom-border/80 rounded-b-lg bg-custom-hover/20 p-2 min-h-[400px]">
                <div className="space-y-3">
                  {filtered.map((ticket) => (
                    <TicketCard
                      key={ticket._id}
                      ticket={ticket}
                      handleDeleteTicket={() => handleDeleteTicket(ticket._id)}
                      refresh={getTickets}
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </DndContext>
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
  );
}

const sampleTickets: ITicket[] = [
  {
    _id: '67a1b2c3d4e5f6789abcdef0',
    title: 'Implement user authentication system',
    description:
      'Create a secure login/logout system with JWT tokens and password hashing. Include password reset functionality and email verification.',
    stage: 'development',
  },
  {
    _id: '67a1b2c3d4e5f6789abcdef1',
    title: 'Fix responsive design issues on mobile',
    description:
      "The navigation menu doesn't collapse properly on mobile devices. Several buttons are also too small for touch interaction.",
    stage: 'backlog',
  },
  {
    _id: '67a1b2c3d4e5f6789abcdef2',
    title: 'Add dark mode toggle',
    description:
      'Implement a dark/light theme switcher that persists user preference in localStorage. Update all components to support both themes.',
    stage: 'done',
  },
  {
    _id: '67a1b2c3d4e5f6789abcdef3',
    title: 'Optimize database queries',
    description:
      'Several API endpoints are running slow queries. Add proper indexing and optimize the most frequently used queries for better performance.',
    stage: 'development',
  },
  {
    _id: '67a1b2c3d4e5f6789abcdef4',
    title: 'Create API documentation',
    description:
      'Generate comprehensive API documentation using Swagger/OpenAPI. Include examples and proper error code descriptions.',
    stage: 'backlog',
  },
  {
    _id: '67a1b2c3d4e5f6789abcdef5',
    title: 'Implement file upload feature',
    description:
      'Add ability for users to upload profile pictures and documents. Include file type validation and size limits.',
    stage: 'done',
  },
  {
    _id: '67a1b2c3d4e5f6789abcdef6',
    title: 'Add unit tests for payment module',
    description:
      'The payment processing module lacks proper test coverage. Write comprehensive unit tests to ensure reliability.',
    stage: 'development',
  },
  {
    _id: '67a1b2c3d4e5f6789abcdef7',
    title: 'Refactor legacy codebase',
    description:
      'Large portions of the codebase use outdated patterns. Modernize the code structure and remove technical debt.',
    stage: 'parked',
  },
  {
    _id: '67a1b2c3d4e5f6789abcdef8',
    title: 'Setup CI/CD pipeline',
    description:
      'Configure automated testing and deployment pipeline using GitHub Actions. Include staging and production environments.',
    stage: 'done',
  },
  {
    _id: '67a1b2c3d4e5f6789abcdef9',
    title: 'Add email notification system',
    description:
      'Implement email notifications for important user actions like password changes, order confirmations, and account updates.',
    stage: 'backlog',
  },
  {
    _id: '67a1b2c3d4e5f6789abcdefa',
    title: 'Fix memory leak in dashboard',
    description:
      'The main dashboard page shows increasing memory usage over time. Investigate and fix potential memory leaks in React components.',
    stage: 'development',
  },
  {
    _id: '67a1b2c3d4e5f6789abcdefb',
    title: 'Implement search functionality',
    description:
      'Add full-text search capability across all user-generated content. Include filters and sorting options.',
    stage: 'backlog',
  },
  {
    _id: '67a1b2c3d4e5f6789abcdefc',
    title: 'Update security dependencies',
    description:
      'Several npm packages have security vulnerabilities. Update all dependencies to their latest secure versions.',
    stage: 'done',
  },
  {
    _id: '67a1b2c3d4e5f6789abcdefd',
    title: 'Add user analytics dashboard',
    description:
      'Create an analytics dashboard for admins to view user engagement metrics, conversion rates, and usage patterns.',
    stage: 'parked',
  },
  {
    _id: '67a1b2c3d4e5f6789abcdefe',
    title: 'Implement real-time chat feature',
    description:
      'Add WebSocket-based real-time messaging between users. Include typing indicators and message status updates.',
    stage: 'development',
  },
  {
    _id: '67a1b2c3d4e5f6789abcdeff',
    title: 'Fix checkout flow bugs',
    description:
      'Users report issues completing purchases. The checkout process sometimes freezes on the payment confirmation step.',
    stage: 'backlog',
  },
  {
    _id: '67a1b2c3d4e5f6789abcdf00',
    title: 'Add internationalization support',
    description:
      'Implement i18n for multiple language support. Start with English, Spanish, and French translations.',
    stage: 'parked',
  },
  {
    _id: '67a1b2c3d4e5f6789abcdf01',
    title: 'Create user onboarding flow',
    description:
      'Design and implement a guided onboarding experience for new users. Include interactive tutorials and progress tracking.',
    stage: 'done',
  },
  {
    _id: '67a1b2c3d4e5f6789abcdf02',
    title: 'Optimize image loading performance',
    description:
      'Implement lazy loading for images and add WebP format support. Consider using a CDN for better performance.',
    stage: 'development',
  },
  {
    _id: '67a1b2c3d4e5f6789abcdf03',
    title: 'Add social media integration',
    description:
      'Allow users to connect their social media accounts and share content. Include OAuth integration for major platforms.',
    stage: 'backlog',
  },
];
