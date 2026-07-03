import { ArrowLeft, LucideIcon } from 'lucide-react';
import { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

interface ToolShellProps {
  icon: LucideIcon;
  iconColor: string;
  title: string;
  description: string;
  children: ReactNode;
}

export default function ToolShell({
  icon: Icon,
  iconColor,
  title,
  description,
  children,
}: ToolShellProps) {
  const navigate = useNavigate();

  return (
    <main className="mx-auto min-h-screen w-full max-w-4xl p-4 md:p-6">
      <button
        onClick={() => navigate('/tools')}
        className="mb-5 mt-2 flex items-center gap-1.5 text-xs text-custom-text transition-colors hover:text-zinc-200"
      >
        <ArrowLeft size={13} />
        All tools
      </button>

      <div className="mb-6 flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-custom-border bg-custom-surface">
          <Icon size={20} className={iconColor} />
        </span>
        <div>
          <h1 className="text-xl font-bold text-white">{title}</h1>
          <p className="text-sm text-custom-text">{description}</p>
        </div>
      </div>

      {children}
    </main>
  );
}
