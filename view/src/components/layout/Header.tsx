import { Menu, Plus, SearchCheck, Settings } from 'lucide-react';
import { ISideBarMode } from './Sidebar';
import { useLocation, useNavigate } from 'react-router-dom';

interface IHeader {
  sidebarMode: ISideBarMode;
  scrolled: boolean;
  activePage: string;
}

export default function Header(props: IHeader) {
  return (
    <header
      className={`sticky top-0 z-10 backdrop-blur-lg bg-[#0a0a0e]/70 border-b border-custom-border transition-all ${
        props?.scrolled ? 'py-2' : 'py-3.5'
      }`}
    >
      <div className="flex items-center justify-between px-4 max-w-7xl mx-auto">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-medium text-white">{props.activePage}</h1>
        </div>

        <div className="flex items-center space-x-3">
          <button className="p-2 rounded-lg text-zinc-400 hover:text-lime-400 hover:bg-custom-surface transition-colors">
            <Settings size={20} />
          </button>
        </div>
      </div>
    </header>
  );
}

export function FilterTabs() {
  const location = useLocation();
  const navigate = useNavigate();

  const tabs = [
    { label: 'All', path: '/search' },
    { label: 'Notes', path: '/search/notes' },
    { label: 'Snippets', path: '/search/snippets' },
    { label: 'Lookups', path: '/search/lookups' },
  ];

  const isSearchPage = location.pathname.startsWith('/search');

  // if (!isSearchPage) return null;

  return (
    <div className="sticky top-16 z-5 bg-custom-base/90 backdrop-blur border-b border-[#2a2a35] px-4 py-2">
      <div className="max-w-7xl mx-auto flex items-center space-x-1">
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.path;
          return (
            <button
              key={tab.label}
              onClick={() => navigate(tab.path)}
              className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                isActive
                  ? 'bg-gradient-to-r from-lime-500/20 to-lime-400/10 text-lime-400 font-medium'
                  : 'text-zinc-400 hover:text-white hover:bg-[#1c1c24]/70'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
