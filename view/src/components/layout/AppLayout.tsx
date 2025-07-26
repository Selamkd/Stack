import { ReactNode, useState } from 'react';
import Sidebar, { ISideBarMode } from './Sidebar';
import Header, { FilterTabs } from './Header';
import { useLocation } from 'react-router-dom';

export default function AppLayout(props: { children: ReactNode }) {
  const [scrolled, setScrolled] = useState(false);
  const [sidebarMode, setSidebarMode] = useState<ISideBarMode>('compact');
  const location = useLocation();

  const pathname = location.pathname;

  function getActivePage() {
    if (pathname.endsWith('/')) return 'Search';
    if (pathname.endsWith('/search/notes')) return 'Notes';
    if (pathname.endsWith('/search/snippets')) return 'Snippets';
    if (pathname.endsWith('/search/lookups')) return 'Lookups';
    if (pathname.endsWith('/notes')) return 'Notes';
    if (pathname.endsWith('/snippets')) return 'Snippets';
    if (pathname.endsWith('/search-lookup')) return 'Lookups';
    if (pathname.endsWith('/tools')) return 'Tools';
    if (pathname.endsWith('/admin')) return 'Admin';
    return 'Page';
  }

  return (
    <div className="bg-custom-base min-h-screen text-zinc-200">
      <Sidebar sidebarMode={sidebarMode} setSidebarMode={setSidebarMode} />
      <main
        className={`flex-1 transition-all h-screen duration-300 ${
          sidebarMode === 'expanded'
            ? 'ml-64'
            : sidebarMode === 'compact'
            ? 'ml-20'
            : 'ml-0'
        }`}
      >
        <Header
          scrolled={scrolled}
          sidebarMode={sidebarMode}
          activePage={getActivePage()}
        />

        {props?.children}
      </main>
    </div>
  );
}
