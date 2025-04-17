import {
  Bookmark,
  Code,
  Database,
  FileText,
  Hash,
  Home,
  Wrench,
} from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export type ISideBarMode = 'expanded' | 'compact';

interface ISideBar {
  sidebarMode: ISideBarMode;
  setSidebarMode: React.Dispatch<React.SetStateAction<ISideBarMode>>;
}
export default function Sidebar(props: ISideBar) {
  const toggleSidebar = () => {
    props.setSidebarMode((prev) => {
      if (prev === 'expanded') return 'compact';
      if (prev === 'compact') return 'expanded';
      return 'expanded';
    });
  };

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-20 transition-all duration-300 ease-in-out ${
        props?.sidebarMode === 'expanded'
          ? 'w-64'
          : props?.sidebarMode === 'compact'
          ? 'w-20'
          : 'w-0'
      }`}
    >
      <div className="absolute inset-0 bg-custom-sidebar border-r border-gray-800">
        <div className="absolute inset-0 bg-gradient-to-b from-lime-500/5 via-transparent to-violet-500/5"></div>
      </div>

      <div className="relative h-full flex flex-col">
        <div
          className={`flex items-center h-16 px-4 border-b border-custom-border`}
        >
          {props?.sidebarMode === 'expanded' ? (
            <div className="flex items-center space-x-1">
              <div className="relative h-9 w-9 mx-auto">
                <div className="absolute inset-0  rounded-lg opacity-80" />
                <div className="relative h-full w-full flex items-center justify-center">
                  <Database size={20} className="text-lime-200" />
                </div>
              </div>
              <h1 className="text-xl font-light tracking-tight text-white">
                Stack
              </h1>
            </div>
          ) : props?.sidebarMode === 'compact' ? (
            <div className="relative h-9 w-9 mx-auto">
              <div className="absolute inset-0 rounded-lg opacity-80" />
              <div className="relative h-full w-full flex items-center justify-center">
                <Database size={20} className="text-lime-200" />
              </div>
            </div>
          ) : null}
        </div>
        <nav
          className={`flex-1 py-3 space-y-1 px-2 transition-all duration-300 ${
            props?.sidebarMode === 'compact'
              ? 'overflow-hidden'
              : 'overflow-y-auto'
          }`}
        >
          <NavButton
            icon={<Home size={18} />}
            label="Search"
            isActive={true}
            link={'/search'}
            mode={props?.sidebarMode}
          />
          <NavButton
            icon={<FileText size={18} />}
            label="Notes"
            isActive={false}
            link={'/notes'}
            mode={props?.sidebarMode}
          />
          <NavButton
            icon={<Code size={18} />}
            label="Snippets"
            isActive={false}
            link={'/snippets'}
            mode={props?.sidebarMode}
          />
          <NavButton
            icon={<Bookmark size={18} />}
            label="Lookups"
            isActive={false}
            link={'/lookups'}
            mode={props?.sidebarMode}
          />
          <NavButton
            icon={<Wrench size={18} />}
            label="Tools"
            isActive={false}
            link={'/tools'}
            mode={props.sidebarMode}
          />
        </nav>

        {props?.sidebarMode === 'expanded' && (
          <div className="p-3 border-t border-custom-border">
            <h3 className="text-xs font-medium text-zinc-500 uppercase tracking-wider px-2 mb-2">
              Tags
            </h3>
            <div className="space-y-1">
              <TagButton label="React" stat={15} />
              <TagButton label="JavaScript" stat={23} />
              <TagButton label="CSS" stat={8} />
              <TagButton label="API" stat={7} />
            </div>
          </div>
        )}

        <div className="p-3 flex justify-center border-t border-custom-border">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-custom-surface text-zinc-400 hover:text-lime-400 transition-colors"
          >
            {props?.sidebarMode === 'expanded' ? (
              <SidebarIcon size={20} />
            ) : (
              <SidebarIcon size={20} />
            )}
          </button>
        </div>
      </div>
    </aside>
  );
}

interface INavLink {
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  link: string;
  mode: ISideBarMode;
}

function NavButton(props: INavLink) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`${props.link}`);
  };

  if (props.mode === 'compact') {
    return (
      <button
        onClick={handleClick}
        className={`flex items-center justify-center w-14 h-14 mx-auto rounded-xl transition-all duration-200
        ${
          props.isActive
            ? 'bg-gradient-to-r from-lime-500/20 to-lime-400/10 text-lime-200 border border-lime-500/30'
            : 'text-zinc-500 hover:text-lime-400 hover:bg-custom-surface'
        }`}
        title={props.label}
      >
        {props.icon}
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      className={`flex items-center space-x-3 w-full px-3 py-2.5 rounded-sm transition-all duration-200 text-sm
      ${
        props.isActive
          ? `border-b border-custom-border bg-gradient-to-r from-lime-400/20 to-lime-300/10 text-lime-200 border border-lime-200/10`
          : 'text-zinc-400 hover:bg-custom-surface hover:text-white'
      }`}
    >
      {props.icon}
      <span>{props.label}</span>
    </button>
  );
}

interface ITagButton {
  label: string;
  stat: number;
}
function TagButton(props: ITagButton) {
  return (
    <button className="flex items-center justify-between w-full px-3 py-1.5 rounded-lg text-sm text-zinc-400 hover:bg-custom-surface hover:text-white transition-colors">
      <div className="flex items-center">
        <Hash size={14} className="mr-2 text-zinc-500" />
        <span>{props.label}</span>
      </div>
      <span className="text-xs bg-custom-surface px-1.5 py-0.5 rounded-full">
        {props.stat}
      </span>
    </button>
  );
}

function SidebarIcon(props: { size: number; className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={props.size}
      height={props.size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={props.className}
    >
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}
