import {
  BotMessageSquare,
  ChevronLeft,
  FileText,
  Home,
  Layers,
  SearchCode,
  SquareChevronRight,
  SquareTerminal,
  SwatchBook,
  Trello,
} from 'lucide-react';
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export type ISideBarMode = 'expanded' | 'compact';

interface ISideBar {
  sidebarMode: ISideBarMode;
  setSidebarMode: React.Dispatch<React.SetStateAction<ISideBarMode>>;
}

const NAV_ITEMS = [
  {
    label: 'Dashboard',
    link: '/',
    icon: Home,
    accent: 'text-haze',
  },
  {
    label: 'Chat',
    link: '/chat',
    icon: BotMessageSquare,
    accent: 'text-clay',
  },
  {
    label: 'Notes',
    link: '/notes',
    icon: FileText,
    accent: 'text-clay',
  },
  {
    label: 'Snippets',
    link: '/snippets',
    icon: SquareChevronRight,
    accent: 'text-sand',
  },
  {
    label: 'Quick Lookups',
    link: '/lookups',
    icon: SearchCode,
    accent: 'text-haze',
  },
  {
    label: 'Shortcuts',
    link: '/shortcuts',
    icon: SquareTerminal,
    accent: 'text-dusk',
  },
  {
    label: 'Project Board',
    link: '/project-board',
    icon: Trello,
    accent: 'text-haze',
  },
  {
    label: 'Tools',
    link: '/tools',
    icon: SwatchBook,
    accent: 'text-dusk',
  },
];

export default function Sidebar({ sidebarMode, setSidebarMode }: ISideBar) {
  const location = useLocation();

  function isActive(path: string) {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  }

  const toggleSidebar = () => {
    setSidebarMode((prev) => (prev === 'expanded' ? 'compact' : 'expanded'));
  };

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 border-r border-custom-border bg-custom-surface/80 backdrop-blur-xl transition-all duration-300 ease-in-out ${
        sidebarMode === 'expanded' ? 'w-60' : 'w-[68px]'
      }`}
    >
      <div className="flex h-full flex-col">
        <div
          className={`flex items-center gap-2.5 border-b border-custom-border px-5 py-4 ${
            sidebarMode === 'compact' ? 'justify-center px-0' : ''
          }`}
        >
          <Layers size={20} className="shrink-0 text-clay" />
          {sidebarMode === 'expanded' && (
            <span className="text-sm font-semibold tracking-wide text-white">
              Stack
            </span>
          )}
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto scrollbar-thin px-3 py-4">
          {NAV_ITEMS.map((item) => (
            <NavButton
              key={item.link}
              item={item}
              isActive={isActive(item.link)}
              mode={sidebarMode}
            />
          ))}
        </nav>

        <div className="border-t border-custom-border p-3">
          <button
            onClick={toggleSidebar}
            className="flex w-full items-center justify-center rounded-lg p-2 text-zinc-500 transition-all duration-200 hover:bg-custom-hover/50 hover:text-white"
          >
            <ChevronLeft
              size={18}
              className={`transition-transform duration-300 ${
                sidebarMode === 'compact' ? 'rotate-180' : ''
              }`}
            />
          </button>
        </div>
      </div>
    </aside>
  );
}

interface INavButton {
  item: (typeof NAV_ITEMS)[number];
  isActive: boolean;
  mode: ISideBarMode;
}

function NavButton({ item, isActive, mode }: INavButton) {
  const navigate = useNavigate();
  const Icon = item.icon;

  if (mode === 'compact') {
    return (
      <button
        onClick={() => navigate(item.link)}
        title={item.label}
        className={`mx-auto flex h-10 w-10 items-center justify-center rounded-lg transition-all duration-200 ${
          isActive
            ? `bg-custom-raised ${item.accent}`
            : 'text-zinc-500 hover:bg-custom-hover/50 hover:text-zinc-200'
        }`}
      >
        <Icon size={18} />
      </button>
    );
  }

  return (
    <button
      onClick={() => navigate(item.link)}
      className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 transition-all duration-200 ${
        isActive
          ? 'bg-custom-raised text-white'
          : 'text-zinc-500 hover:bg-custom-hover/40 hover:text-zinc-200'
      }`}
    >
      <Icon size={17} className={isActive ? item.accent : ''} />
      <span className="text-sm">{item.label}</span>
    </button>
  );
}
