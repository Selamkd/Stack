import { ReactNode, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import CommandPalette from '../CommandPalette';
import ManageMetaModal from '../ManageMetaModal';
import Header from './Header';
import Sidebar, { ISideBarMode } from './Sidebar';

const PAGE_TITLES: [string, string][] = [
  ['/chat', 'Chat'],
  ['/notes', 'Notes'],
  ['/note', 'Notes'],
  ['/snippets', 'Snippets'],
  ['/lookups', 'Quick Lookups'],
  ['/shortcuts', 'Shortcuts'],
  ['/project-board', 'Project Board'],
  ['/tools', 'Tools'],
];

export default function AppLayout(props: { children: ReactNode }) {
  const [sidebarMode, setSidebarMode] = useState<ISideBarMode>('compact');
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setPaletteOpen((open) => !open);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const activePage =
    PAGE_TITLES.find(([path]) => location.pathname.startsWith(path))?.[1] ||
    'Dashboard';

  return (
    <div className="min-h-screen text-zinc-200">
      <Sidebar sidebarMode={sidebarMode} setSidebarMode={setSidebarMode} />
      <main
        className={`transition-all duration-300 ${
          sidebarMode === 'expanded' ? 'ml-60' : 'ml-[68px]'
        }`}
      >
        <Header
          activePage={activePage}
          onOpenPalette={() => setPaletteOpen(true)}
          onOpenSettings={() => setSettingsOpen(true)}
        />
        {props?.children}
      </main>

      <CommandPalette
        open={paletteOpen}
        onClose={() => setPaletteOpen(false)}
      />
      <ManageMetaModal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />
    </div>
  );
}
