import { ReactNode, useState } from 'react';
import Sidebar, { ISideBarMode } from './Sidebar';
import Header, { FilterTabs } from './Header';

export default function AppLayout(props: { children: ReactNode }) {
  const [scrolled, setScrolled] = useState(false);
  const [sidebarMode, setSidebarMode] = useState<ISideBarMode>('expanded');
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
          activePage={'Search'}
        />
        <FilterTabs />
        {props?.children}
      </main>
    </div>
  );
}
