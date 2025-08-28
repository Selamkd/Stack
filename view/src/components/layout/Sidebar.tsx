import {
  ChevronLeft,
  FileText,
  Hash,
  Home,
  SearchCode,
  Settings,
  SquareChevronRight,
  SwatchBook,
  Trello,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ICategory } from '../../../../back/src/models/category.model';
import APIService from '../../service/api.service';

export type ISideBarMode = 'expanded' | 'compact';

interface ISideBar {
  sidebarMode: ISideBarMode;
  setSidebarMode: React.Dispatch<React.SetStateAction<ISideBarMode>>;
}

export default function Sidebar({ sidebarMode, setSidebarMode }: ISideBar) {
  const location = useLocation();
  const [categories, setCategories] = useState<ICategory[]>();

  function isActive(path: string) {
    return location.pathname === path;
  }
  useEffect(() => {
    async function getSnippets() {
      try {
        const categoriesRes = await APIService.get('categories');
        setCategories(categoriesRes);
      } catch (e) {
        console.error('Error fetching snippets', e);
      }
    }
    getSnippets();
  }, []);

  const toggleSidebar = () => {
    setSidebarMode((prev) => (prev === 'expanded' ? 'compact' : 'expanded'));
  };

  return (
    <aside
      className={`fixed inset-y-0 left-0 bg-gradient-to-b from-zinc-900/95 to-black/95 backdrop-blur-xl border-r border-zinc-800/50 z-50 transition-all duration-300 ease-in-out ${
        sidebarMode === 'expanded'
          ? 'w-64'
          : sidebarMode === 'compact'
          ? 'w-20'
          : 'w-0'
      }`}
    >
      <div className="relative h-full flex flex-col">
        <nav className="flex-1 py-6 px-4 space-y-1">
          <NavButton
            icon={<Home size={18} />}
            label="Dashboard"
            link="/"
            isActive={isActive('/')}
            mode={sidebarMode}
          />
          <NavButton
            icon={<FileText size={18} />}
            label="Notes"
            link="/notes"
            isActive={isActive('/notes')}
            mode={sidebarMode}
          />
          <NavButton
            icon={<SquareChevronRight size={18} />}
            label="Snippets"
            link="/snippets"
            isActive={isActive('/snippets')}
            mode={sidebarMode}
          />
          <NavButton
            icon={<SearchCode size={18} />}
            label="Quick Lookups"
            link="/lookups"
            isActive={isActive('/lookups')}
            mode={sidebarMode}
          />
          <NavButton
            icon={<Trello size={18} />}
            label="Project Tracker"
            link="/project-board"
            isActive={isActive('/project-board')}
            mode={sidebarMode}
          />

          <NavButton
            icon={<SwatchBook size={18} />}
            label="Tools"
            link="/tools"
            isActive={location.pathname === '/tools'}
            mode={sidebarMode}
          />

          <NavButton
            icon={<Settings size={18} />}
            label="Config"
            link="/admin"
            isActive={isActive('/admin')}
            mode={sidebarMode}
          />
        </nav>

        {sidebarMode === 'expanded' && (
          <div className="px-4 py-6 border-t border-zinc-800/50">
            <h3 className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-3">
              Topics
            </h3>

            {categories &&
              categories.slice(0, 5).map((cat) => (
                <div className="space-y-1">
                  <TagButton
                    label={cat.name}
                    count={cat.count ? cat.count : null}
                  />
                </div>
              ))}
          </div>
        )}

        <div className="p-4 border-t border-zinc-800/50">
          <button
            onClick={toggleSidebar}
            className="w-full p-2 rounded-lg hover:bg-zinc-800/50 text-zinc-400 hover:text-white transition-all duration-200 flex items-center justify-center group"
          >
            <ChevronLeft
              size={20}
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
  icon: React.ReactNode;
  label: string;
  link: string;
  isActive: boolean;
  mode: ISideBarMode;
}

function NavButton({ icon, label, link, isActive, mode }: INavButton) {
  const navigate = useNavigate();

  if (mode === 'compact') {
    return (
      <button
        onClick={() => navigate(link)}
        className={`flex items-center justify-center w-12 h-12 mx-auto rounded-lg transition-all duration-200
          ${
            isActive
              ? 'bg-custom-active text-white'
              : 'text-zinc-500 hover:text-zinc-300 hover:bg-custom-surface'
          }`}
        title={label}
      >
        {icon}
      </button>
    );
  }

  return (
    <button
      onClick={() => navigate(link)}
      className={`flex items-center space-x-3 w-full px-3 py-2.5 rounded-lg transition-all duration-200
        ${
          isActive
            ? 'bg-zinc-950/50 backdrop-blur-sm text-white border-zinc-800/50'
            : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/50 hover:backdrop-blur-sm'
        }`}
    >
      {icon}
      <span className="text-sm">{label}</span>
    </button>
  );
}

interface ITagButton {
  label: string;
  count: number | null;
}

function TagButton({ label, count }: ITagButton) {
  return (
    <button className="flex items-center justify-between w-full px-3 py-2 rounded-lg text-sm text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200 hover:border-zinc-700/50 transition-all duration-200">
      <div className="flex items-center">
        <Hash size={14} className="mr-2 text-zinc-500" />
        <span>{label}</span>
      </div>
      {count && (
        <span className="text-xs bg-zinc-800/50 border border-zinc-700/30 px-2 py-0.5 rounded-full text-zinc-400">
          {count}
        </span>
      )}
    </button>
  );
}
