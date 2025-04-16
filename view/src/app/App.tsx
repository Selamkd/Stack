import React, { useState, useEffect } from 'react';
import {
  Search,
  Code,
  FileText,
  Bookmark,
  Settings,
  Menu,
  X,
  Home,
  Hash,
  Database,
  Wrench,
  Plus,
  ChevronDown,
  Clock,
  Star,
  ArrowUpRight,
} from 'lucide-react';

export default function App() {
  const [sidebarMode, setSidebarMode] = useState<
    'expanded' | 'compact' | 'hidden'
  >('expanded'); // 'expanded', 'compact', 'hidden'
  const [activePage, setActivePage] = useState('search');
  const [activeSection, setActiveSection] = useState('all');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleSidebar = () => {
    setSidebarMode((prev) => {
      if (prev === 'expanded') return 'compact';
      if (prev === 'compact') return 'hidden';
      return 'expanded';
    });
  };

  // Page content
  const renderPageContent = () => {
    switch (activePage) {
      case 'search':
        return <SearchPage activeSection={activeSection} />;
      case 'notes':
        return <NotesPage />;
      case 'snippets':
        return <SnippetsPage />;
      case 'lookups':
        return <LookupsPage />;
      case 'tools':
        return <ToolsPage />;
      case 'admin':
        return <AdminPage />;
      default:
        return <SearchPage activeSection={activeSection} />;
    }
  };

  return (
    <div className="min-h-screen flex bg-[#0a0a0e] text-zinc-200 overflow-x-hidden">
      {/* Animated sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-20 transition-all duration-300 ease-in-out
          ${
            sidebarMode === 'expanded'
              ? 'w-64'
              : sidebarMode === 'compact'
              ? 'w-20'
              : 'w-0'
          } 
        `}
      >
        {/* Sidebar background with gradient */}
        <div className="absolute inset-0 bg-[#111116] border-r border-[#2a2a35]">
          <div className="absolute inset-0 bg-gradient-to-b from-lime-500/5 via-transparent to-violet-500/5" />
        </div>

        <div className="relative h-full flex flex-col">
          {/* Sidebar header */}
          <div
            className={`flex items-center h-16 px-4 border-b border-[#2a2a35]`}
          >
            {sidebarMode === 'expanded' ? (
              <div className="flex items-center space-x-3">
                <div className="relative h-9 w-9">
                  <div className="absolute inset-0 bg-gradient-to-br from-lime-400 to-lime-600 rounded-lg opacity-80" />
                  <div className="relative h-full w-full flex items-center justify-center">
                    <Database size={20} className="text-zinc-900" />
                  </div>
                </div>
                <h1 className="text-xl font-semibold tracking-tight text-white">
                  Stack
                </h1>
              </div>
            ) : (
              <div className="relative h-9 w-9 mx-auto">
                <div className="absolute inset-0 bg-gradient-to-br from-lime-400 to-lime-600 rounded-lg opacity-80" />
                <div className="relative h-full w-full flex items-center justify-center">
                  <Database size={20} className="text-zinc-900" />
                </div>
              </div>
            )}
          </div>

          {/* Search input */}
          <div className={`p-3 ${sidebarMode === 'compact' ? 'px-2' : ''}`}>
            <div
              className={`relative ${
                sidebarMode === 'compact' ? 'w-10 h-10' : 'w-full'
              } transition-all duration-300`}
            >
              {sidebarMode === 'expanded' && (
                <>
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search size={16} className="text-zinc-500" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search..."
                    className="block w-full pl-10 pr-3 py-2 rounded-xl bg-[#1c1c24] text-zinc-200 
                      border border-[#2a2a35] focus:border-lime-500/50 focus:ring-1 focus:ring-lime-500/30"
                  />
                </>
              )}

              {sidebarMode === 'compact' && (
                <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#1c1c24] border border-[#2a2a35] text-zinc-400 hover:text-lime-400">
                  <Search size={18} />
                </button>
              )}
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 py-3 space-y-1 overflow-y-auto px-2">
            <NavButton
              icon={<Home size={18} />}
              label="Search"
              isActive={activePage === 'search'}
              onClick={() => setActivePage('search')}
              mode={sidebarMode}
            />
            <NavButton
              icon={<FileText size={18} />}
              label="Notes"
              isActive={activePage === 'notes'}
              onClick={() => setActivePage('notes')}
              mode={sidebarMode}
            />
            <NavButton
              icon={<Code size={18} />}
              label="Snippets"
              isActive={activePage === 'snippets'}
              onClick={() => setActivePage('snippets')}
              mode={sidebarMode}
            />
            <NavButton
              icon={<Bookmark size={18} />}
              label="Lookups"
              isActive={activePage === 'lookups'}
              onClick={() => setActivePage('lookups')}
              mode={sidebarMode}
            />
            <NavButton
              icon={<Wrench size={18} />}
              label="Tools"
              isActive={activePage === 'tools'}
              onClick={() => setActivePage('tools')}
              mode={sidebarMode}
            />
          </nav>

          {/* Tags section */}
          {sidebarMode === 'expanded' && (
            <div className="p-3 border-t border-[#2a2a35]">
              <h3 className="text-xs font-medium text-zinc-500 uppercase tracking-wider px-2 mb-2">
                Tags
              </h3>
              <div className="space-y-1">
                <TagButton label="React" count={15} />
                <TagButton label="JavaScript" count={23} />
                <TagButton label="CSS" count={8} />
                <TagButton label="API" count={7} />
              </div>
            </div>
          )}

          {/* Sidebar footer with toggle button */}
          <div className="p-3 flex justify-center border-t border-[#2a2a35]">
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-lg hover:bg-[#1c1c24] text-zinc-400 hover:text-lime-400 transition-colors"
            >
              {sidebarMode === 'expanded' ? (
                <ChevronLeft className="" size={20} />
              ) : sidebarMode === 'compact' ? (
                <ChevronRight className="" size={20} />
              ) : (
                <Menu size={20} />
              )}
            </button>
          </div>
        </div>
      </aside>

      {/* Main content area */}
      <div
        className={`flex-1 transition-all duration-300 ${
          sidebarMode === 'expanded'
            ? 'ml-64'
            : sidebarMode === 'compact'
            ? 'ml-20'
            : 'ml-0'
        }`}
      >
        {/* Header with glass effect */}
        <header
          className={`sticky top-0 z-10 backdrop-blur-lg bg-[#0a0a0e]/70 border-b border-[#2a2a35] transition-all ${
            scrolled ? 'py-2' : 'py-4'
          }`}
        >
          <div className="flex items-center justify-between px-4 max-w-7xl mx-auto">
            <div className="flex items-center space-x-4">
              {sidebarMode === 'hidden' && (
                <button
                  onClick={toggleSidebar}
                  className="p-2 rounded-lg text-zinc-400 hover:text-lime-400 hover:bg-[#1c1c24] transition-colors"
                >
                  <Menu size={20} />
                </button>
              )}

              <h1 className="text-xl font-medium text-white">{activePage}</h1>
            </div>

            <div className="flex items-center space-x-3">
              <button
                className="relative group overflow-hidden px-4 py-2 rounded-xl transition-all
                 bg-gradient-to-r from-lime-500 to-lime-400 hover:from-lime-400 hover:to-lime-500 text-zinc-900 font-medium"
              >
                <span className="relative z-10 flex items-center">
                  <Plus size={16} className="mr-2" />
                  Create
                </span>
                <div className="absolute inset-0 transform translate-y-full group-hover:translate-y-0 bg-lime-300 transition-transform duration-200"></div>
              </button>

              <button
                onClick={() => setActivePage('admin')}
                className="p-2 rounded-lg text-zinc-400 hover:text-lime-400 hover:bg-[#1c1c24] transition-colors"
              >
                <Settings size={20} />
              </button>
            </div>
          </div>
        </header>

        {/* Filter tabs - only show for search page */}
        {activePage === 'search' && (
          <div className="sticky top-16 z-5 bg-[#0a0a0e]/90 backdrop-blur border-b border-[#2a2a35] px-4 py-2">
            <div className="max-w-7xl mx-auto flex items-center space-x-1">
              <button
                onClick={() => setActiveSection('all')}
                className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                  activeSection === 'all'
                    ? 'bg-gradient-to-r from-lime-500/20 to-lime-400/10 text-lime-400 font-medium'
                    : 'text-zinc-400 hover:text-white hover:bg-[#1c1c24]/70'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setActiveSection('notes')}
                className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                  activeSection === 'notes'
                    ? 'bg-gradient-to-r from-lime-500/20 to-lime-400/10 text-lime-400 font-medium'
                    : 'text-zinc-400 hover:text-white hover:bg-[#1c1c24]/70'
                }`}
              >
                Notes
              </button>
              <button
                onClick={() => setActiveSection('snippets')}
                className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                  activeSection === 'snippets'
                    ? 'bg-gradient-to-r from-lime-500/20 to-lime-400/10 text-lime-400 font-medium'
                    : 'text-zinc-400 hover:text-white hover:bg-[#1c1c24]/70'
                }`}
              >
                Snippets
              </button>
              <button
                onClick={() => setActiveSection('lookups')}
                className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                  activeSection === 'lookups'
                    ? 'bg-gradient-to-r from-lime-500/20 to-lime-400/10 text-lime-400 font-medium'
                    : 'text-zinc-400 hover:text-white hover:bg-[#1c1c24]/70'
                }`}
              >
                Lookups
              </button>
            </div>
          </div>
        )}

        {/* Main content scroll area */}
        <main className="p-4 sm:p-6">{renderPageContent()}</main>
      </div>
    </div>
  );
}

// Custom chevron icons for sidebar toggle
const ChevronLeft: React.FC<{ size: number; className?: string }> = ({
  size,
  className,
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M15 18l-6-6 6-6" />
  </svg>
);

const ChevronRight: React.FC<{ size: number; className?: string }> = ({
  size,
  className,
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M9 18l6-6-6-6" />
  </svg>
);

// Navigation button component with modes
interface NavButtonProps {
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
  mode: 'expanded' | 'compact' | 'hidden';
}

const NavButton: React.FC<NavButtonProps> = ({
  icon,
  label,
  isActive,
  onClick,
  mode,
}) => {
  if (mode === 'compact') {
    return (
      <button
        onClick={onClick}
        className={`flex items-center justify-center w-14 h-14 mx-auto rounded-xl transition-all duration-200
          ${
            isActive
              ? 'bg-gradient-to-r from-lime-500/20 to-lime-400/10 text-lime-400 border border-lime-500/30'
              : 'text-zinc-500 hover:text-lime-400 hover:bg-[#1c1c24]'
          }`}
        title={label}
      >
        {icon}
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      className={`flex items-center space-x-3 w-full px-3 py-2.5 rounded-xl transition-all duration-200 text-sm
        ${
          isActive
            ? 'bg-gradient-to-r from-lime-500/20 to-lime-400/10 text-lime-400 border border-lime-500/30'
            : 'text-zinc-400 hover:bg-[#1c1c24] hover:text-white'
        }`}
    >
      <span className="flex-shrink-0">{icon}</span>
      <span>{label}</span>
    </button>
  );
};

// Tag button component
const TagButton: React.FC<{ label: string; count: number }> = ({
  label,
  count,
}) => (
  <button className="flex items-center justify-between w-full px-3 py-1.5 rounded-lg text-sm text-zinc-400 hover:bg-[#1c1c24] hover:text-white transition-colors">
    <div className="flex items-center">
      <Hash size={14} className="mr-2 text-zinc-500" />
      <span>{label}</span>
    </div>
    <span className="text-xs bg-[#1c1c24] px-1.5 py-0.5 rounded-full">
      {count}
    </span>
  </button>
);

// Search page component
interface SearchPageProps {
  activeSection: string;
}

const SearchPage: React.FC<SearchPageProps> = ({ activeSection }) => {
  // Determine what sections to show based on filter
  const showSection = (section: string) => {
    return activeSection === 'all' || activeSection === section;
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Hero search section */}
      <div className="relative rounded-2xl overflow-hidden">
        {/* Background decoration elements */}
        <div className="absolute -top-20 -left-20 w-40 h-40 bg-lime-500 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-violet-500 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0e]/30 via-[#0a0a0e]/90 to-[#0a0a0e]/30 backdrop-blur-sm border border-[#2a2a35] rounded-2xl"></div>

        {/* Search content */}
        <div className="relative p-6 md:p-8">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
            Your second brain
          </h2>
          <p className="text-zinc-400 mb-6 max-w-md">
            Instantly find anything you've stored - notes, code, or knowledge.
          </p>

          <div className="relative max-w-3xl">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search size={20} className="text-zinc-500" />
            </div>
            <input
              type="text"
              placeholder="Type / to search..."
              className="block w-full pl-12 pr-4 py-3.5 rounded-xl bg-[#1c1c24]/80 border border-[#2a2a35] text-white
                focus:border-lime-500/50 focus:ring-2 focus:ring-lime-500/20 text-base"
            />
          </div>

          {/* Info badges */}
          <div className="flex flex-wrap gap-4 mt-6">
            <StatBadge label="Notes" count={42} icon={<FileText size={18} />} />
            <StatBadge label="Snippets" count={89} icon={<Code size={18} />} />
            <StatBadge
              label="Lookups"
              count={16}
              icon={<Bookmark size={18} />}
            />
            <StatBadge label="Tools" count={7} icon={<Wrench size={18} />} />
          </div>
        </div>
      </div>

      {/* Grid sections */}
      {showSection('notes') && (
        <ContentSection
          title="Recent notes"
          actionLabel="View all notes"
          items={[
            {
              id: 1,
              title: 'Setting up React with Vite',
              type: 'note',
              date: '2d ago',
              tags: ['React', 'Vite'],
              excerpt:
                'A quick guide to setting up a new React project with Vite for faster development and better DX.',
            },
            {
              id: 2,
              title: 'GraphQL vs REST API Design',
              type: 'note',
              date: '1w ago',
              tags: ['API', 'GraphQL', 'REST'],
              excerpt:
                'Comparing the two approaches with examples and use cases for different project requirements.',
            },
            {
              id: 3,
              title: 'CSS Grid Layout Guide',
              type: 'note',
              date: '3d ago',
              tags: ['CSS', 'Layout'],
              excerpt:
                'How to structure complex layouts using CSS Grid with fallbacks for older browsers.',
            },
          ]}
        />
      )}

      {showSection('snippets') && (
        <ContentSection
          title="Code snippets"
          actionLabel="View all snippets"
          items={[
            {
              id: 4,
              title: 'useLocalStorage Hook',
              type: 'snippet',
              date: '3d ago',
              tags: ['React', 'Hooks'],
              excerpt:
                'Custom React hook to easily use localStorage with React state.',
            },
            {
              id: 5,
              title: 'CSS Grid Templates',
              type: 'snippet',
              date: '2w ago',
              tags: ['CSS', 'Layout'],
              excerpt:
                'Collection of reusable CSS Grid layout templates for common UI patterns.',
            },
          ]}
        />
      )}

      {showSection('lookups') && (
        <ContentSection
          title="Quick lookups"
          actionLabel="View all lookups"
          items={[
            {
              id: 6,
              title: 'HTTP Status Codes',
              type: 'lookup',
              date: '5d ago',
              tags: ['HTTP', 'API'],
              excerpt:
                'Common HTTP status codes and their meanings for quick reference.',
            },
            {
              id: 7,
              title: 'Git Commands',
              type: 'lookup',
              date: '1m ago',
              tags: ['Git', 'CLI'],
              excerpt:
                'Essential Git commands for daily workflow and common operations.',
            },
          ]}
        />
      )}

      {/* Pinned items */}
      <div className="space-y-4">
        <div className="flex items-center">
          <Star size={16} className="text-lime-400 mr-2" />
          <h3 className="text-lg font-medium text-white">Pinned items</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <PinnedItemCard
            title="React Hooks Cheatsheet"
            type="lookup"
            icon={<Bookmark size={16} />}
          />
          <PinnedItemCard
            title="Webpack Config"
            type="snippet"
            icon={<Code size={16} />}
          />
          <PinnedItemCard
            title="CSS Flexbox Guide"
            type="note"
            icon={<FileText size={16} />}
          />
          <PinnedItemCard
            title="SVG Optimizer"
            type="tool"
            icon={<Wrench size={16} />}
          />
        </div>
      </div>
    </div>
  );
};

// Stat badge component
interface StatBadgeProps {
  label: string;
  count: number;
  icon: React.ReactNode;
}

const StatBadge: React.FC<StatBadgeProps> = ({ label, count, icon }) => (
  <div className="flex items-center px-4 py-2 rounded-xl bg-[#1c1c24]/60 border border-[#2a2a35]">
    <div className="mr-3 text-lime-400">{icon}</div>
    <div>
      <div className="text-sm font-medium text-zinc-300">{label}</div>
      <div className="text-xl font-bold text-white">{count}</div>
    </div>
  </div>
);

// Content section component
interface ContentSectionProps {
  title: string;
  actionLabel: string;
  items: Array<{
    id: number;
    title: string;
    type: string;
    date: string;
    tags: string[];
    excerpt: string;
  }>;
}

const ContentSection: React.FC<ContentSectionProps> = ({
  title,
  actionLabel,
  items,
}) => (
  <section className="space-y-4">
    <div className="flex items-center justify-between">
      <h3 className="text-lg font-medium text-white flex items-center">
        <Clock size={16} className="mr-2 text-zinc-500" />
        {title}
      </h3>
      <button className="text-lime-400 hover:text-lime-300 text-sm flex items-center">
        {actionLabel}
        <ArrowUpRight size={14} className="ml-1" />
      </button>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((item) => (
        <ContentCard
          key={item.id}
          title={item.title}
          type={item.type}
          date={item.date}
          tags={item.tags}
          excerpt={item.excerpt}
        />
      ))}
    </div>
  </section>
);

// Content card component - with unique styling
interface ContentCardProps {
  title: string;
  type: string;
  tags: string[];
  excerpt: string;
  date: string;
}

const ContentCard: React.FC<ContentCardProps> = ({
  title,
  type,
  tags,
  excerpt,
  date,
}) => {
  // Define color based on content type
  interface TypeStyles {
    gradientFrom: string;
    gradientTo: string;
    border: string;
    text: string;
  }

  const getTypeStyles = (type: string): TypeStyles => {
    switch (type) {
      case 'note':
        return {
          gradientFrom: 'from-lime-500/20',
          gradientTo: 'to-lime-600/5',
          border: 'border-lime-500/30',
          text: 'text-lime-400',
        };
      case 'snippet':
        return {
          gradientFrom: 'from-emerald-500/20',
          gradientTo: 'to-emerald-600/5',
          border: 'border-emerald-500/30',
          text: 'text-emerald-400',
        };
      case 'lookup':
        return {
          gradientFrom: 'from-amber-500/20',
          gradientTo: 'to-amber-600/5',
          border: 'border-amber-500/30',
          text: 'text-amber-400',
        };
      case 'tool':
        return {
          gradientFrom: 'from-violet-500/20',
          gradientTo: 'to-violet-600/5',
          border: 'border-violet-500/30',
          text: 'text-violet-400',
        };
      default:
        return {
          gradientFrom: 'from-zinc-700/20',
          gradientTo: 'to-zinc-700/5',
          border: 'border-zinc-600/30',
          text: 'text-zinc-400',
        };
    }
  };

  const styles = getTypeStyles(type);

  return (
    <div className="group relative rounded-xl overflow-hidden border border-[#2a2a35] hover:border-[#3a3a45] transition-all duration-300">
      {/* Card background with subtle gradient */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${styles.gradientFrom} ${styles.gradientTo} opacity-60`}
      />
      <div className="absolute inset-0 bg-[#1c1c24]/90 backdrop-blur-sm" />

      {/* Card content */}
      <div className="relative p-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-base font-medium text-white truncate pr-2">
            {title}
          </h4>
          <span
            className={`flex-shrink-0 ${styles.text} text-xs uppercase font-medium py-1 px-2 rounded-md bg-[#1c1c24]/80 border ${styles.border}`}
          >
            {type}
          </span>
        </div>
        <p className="text-zinc-400 text-sm mb-3 line-clamp-2">{excerpt}</p>

        <div className="flex flex-wrap gap-2 mt-4">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="text-xs bg-[#1c1c24]/80 border border-[#2a2a35] text-zinc-300 px-2 py-0.5 rounded-md"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>

      <div className="relative px-4 py-2 flex items-center justify-between border-t border-[#2a2a35] bg-[#1c1c24]/60">
        {date && <span className="text-xs text-zinc-500">{date}</span>}
        <button
          className={`${styles.text} hover:text-white text-sm flex items-center ml-auto group-hover:opacity-100 transition-all`}
        >
          View <ChevronRight size={16} className="ml-1" />
        </button>
      </div>
    </div>
  );
};

// Pinned item card component
interface PinnedItemCardProps {
  title: string;
  type: string;
  icon: React.ReactNode;
}

const PinnedItemCard: React.FC<PinnedItemCardProps> = ({
  title,
  type,
  icon,
}) => {
  // Define gradient based on content type
  const getTypeStyles = (type: string): string => {
    switch (type) {
      case 'note':
        return 'from-lime-500/30 to-lime-600/10';
      case 'snippet':
        return 'from-emerald-500/30 to-emerald-600/10';
      case 'lookup':
        return 'from-amber-500/30 to-amber-600/10';
      case 'tool':
        return 'from-violet-500/30 to-violet-600/10';
      default:
        return 'from-zinc-600/30 to-zinc-700/10';
    }
  };

  return (
    <button className="group relative h-24 rounded-xl overflow-hidden border border-[#2a2a35] hover:border-[#3a3a45] transition-all duration-300">
      <div
        className={`absolute inset-0 bg-gradient-to-br ${getTypeStyles(
          type
        )} opacity-50`}
      />
      <div className="absolute inset-0 bg-[#1c1c24]/80 backdrop-blur-sm" />

      <div className="relative h-full flex flex-col items-center justify-center p-4 text-center">
        <div className="text-lime-400 mb-2">{icon}</div>
        <h4 className="text-sm font-medium text-white group-hover:text-lime-300 transition-colors">
          {title}
        </h4>
      </div>
    </button>
  );
};

// Placeholder page components with glassmorphism styling
const NotesPage = () => (
  <div className="max-w-7xl mx-auto">
    <div className="relative rounded-xl overflow-hidden">
      <div className="absolute inset-0 bg-[#1c1c24]/70 backdrop-blur-sm border border-[#2a2a35]"></div>
      <div className="relative p-6">
        <h3 className="text-lg font-medium text-white mb-4">Your Notes</h3>
        <p className="text-zinc-400">Notes content goes here</p>
      </div>
    </div>
  </div>
);

const SnippetsPage = () => (
  <div className="max-w-7xl mx-auto">
    <div className="relative rounded-xl overflow-hidden">
      <div className="absolute inset-0 bg-[#1c1c24]/70 backdrop-blur-sm border border-[#2a2a35]"></div>
      <div className="relative p-6">
        <h3 className="text-lg font-medium text-white mb-4">Code Snippets</h3>
        <p className="text-zinc-400">Snippets content goes here</p>
      </div>
    </div>
  </div>
);

const LookupsPage = () => (
  <div className="max-w-7xl mx-auto">
    <div className="relative rounded-xl overflow-hidden">
      <div className="absolute inset-0 bg-[#1c1c24]/70 backdrop-blur-sm border border-[#2a2a35]"></div>
      <div className="relative p-6">
        <h3 className="text-lg font-medium text-white mb-4">Quick Lookups</h3>
        <p className="text-zinc-400">Lookups content goes here</p>
      </div>
    </div>
  </div>
);

const ToolsPage = () => (
  <div className="max-w-7xl mx-auto">
    <div className="relative rounded-xl overflow-hidden">
      <div className="absolute inset-0 bg-[#1c1c24]/70 backdrop-blur-sm border border-[#2a2a35]"></div>
      <div className="relative p-6">
        <h3 className="text-lg font-medium text-white mb-4">Developer Tools</h3>
        <p className="text-zinc-400">Tools content goes here</p>
      </div>
    </div>
  </div>
);

const AdminPage = () => (
  <div className="max-w-7xl mx-auto">
    <div className="relative rounded-xl overflow-hidden">
      <div className="absolute inset-0 bg-[#1c1c24]/70 backdrop-blur-sm border border-[#2a2a35]"></div>
      <div className="relative p-6">
        <h3 className="text-lg font-medium text-white mb-4">Admin Panel</h3>
        <p className="text-zinc-400">Admin content goes here</p>
      </div>
    </div>
  </div>
);
