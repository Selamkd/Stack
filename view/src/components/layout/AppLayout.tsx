import { ReactNode, useState } from 'react';
import Sidebar, { ISideBarMode } from './Sidebar';
import Header, { FilterTabs } from './Header';
import { useLocation } from 'react-router-dom';

export default function AppLayout(props: { children: ReactNode }) {
  const [scrolled, setScrolled] = useState(false);
  const [sidebarMode, setSidebarMode] = useState<ISideBarMode>('expanded');
  const location = useLocation();
  function getActivePage() {
    if (location.pathname.endsWith('/')) return 'Search';
    if (location.pathname.endsWith('/search/notes')) return 'Notes';
    if (location.pathname.endsWith('/search/snippets')) return 'Snippets';
    if (location.pathname.endsWith('/search/lookups')) return 'Lookups';
    if (location.pathname.endsWith('/notes')) return 'Notes';
    if (location.pathname.endsWith('/snippets')) return 'Snippets';
    if (location.pathname.endsWith('/search-lookup')) return 'Lookups';
    if (location.pathname.endsWith('/tools')) return 'Tools';
    if (location.pathname.endsWith('/admin')) return 'Admin';
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
        <FilterTabs />
        {props?.children}
      </main>
    </div>
  );
}
