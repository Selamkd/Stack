import {
  Github,
  Globe,
  MessageSquare,
  Monitor,
  Figma,
  GitBranch,
  Layers,
  Database,
  Zap,
  ExternalLink,
  Activity,
  Search,
  FileCode,
  Lollipop,
  Slack,
  SatelliteDish,
} from 'lucide-react';

export default function ActiveLinks() {
  const developerLinks = [
    {
      url: 'https://github.com',
      icon: Github,
      color: 'emerald',
      bgColor: 'bg-zinc-800',
      hoverBgColor: 'hover:bg-zinc-750',
      border: 'border-zinc-700 hover:border-emerald-600',
      iconColor: 'text-emerald-200/60',
      hoverIconColor: 'group-hover/link:text-emerald-300/50',
    },
    {
      url: 'http://localhost:5173/',
      icon: SatelliteDish,

      color: 'yellow',
      bgColor: 'bg-zinc-800',
      hoverBgColor: 'hover:bg-zinc-750',
      border: 'border-zinc-700 hover:border-yellow-600',
      iconColor: 'text-amber-200/40',
    },
    {
      url: 'https://developer.mozilla.org/en-US/',
      icon: FileCode,

      color: 'orange',
      bgColor: 'bg-zinc-800',
      hoverBgColor: 'hover:bg-zinc-750',
      border: 'border-zinc-700 hover:border-orange-600',
      iconColor: 'text-indigo-300/60',
    },
    {
      url: 'https://lucide.dev/icons/',
      icon: Lollipop,

      color: 'pink',
      bgColor: 'glass-card',
      hoverBgColor: 'hover:bg-zinc-750',
      border: 'border-zinc-700 hover:border-pink-600',
      iconColor: 'text-pink-200/60',
    },

    {
      url: 'https://app.slack.com',
      icon: Slack,

      color: 'indigo',
      bgColor: 'bg-zinc-800',
      hoverBgColor: 'hover:bg-zinc-750',
      border: 'border-zinc-700 hover:border-indigo-600',
      iconColor: 'text-indigo-200/60',
    },
  ];

  const handleLinkClick = (url: string) => {
    if (url.startsWith('http') || url.startsWith('chrome://')) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="group mb-8 relative">
      <div className="grid grid-cols-2 sm:grid-cols-7 gap-2 max-w-3xl xl:max-w-4xl">
        {developerLinks.map((link) => {
          const Icon = link.icon;
          return (
            <button
              onClick={() => handleLinkClick(link.url)}
              className={`
                group/link relative py-3 max-w-[120px]
        glass-card border
                border-custom-border
                rounded-xl
               
                shadow-sm hover:shadow-md hover:shadow-black/20
                text-center
              
              `}
            >
              <div className="relative z-10 space-y-3">
                <div
                  className={`
                  inline-flex items-center justify-center w-10 h-10 
                  rounded-lg

                   border-zinc-800 group-hover/link:border-zinc-600
                  transition-all duration-200
                `}
                >
                  <Icon
                    className={`w-6 h-6 ${link.iconColor} ${link.hoverIconColor} transition-colors duration-200`}
                  />
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <button
        className="
        flex mx-auto justify-center items-center
        mt-4 w-full p-3 
        bg-zinc-800 hover:bg-zinc-750
        border border-zinc-700 hover:border-zinc-600
        text-zinc-400 hover:text-zinc-300
        rounded-lg transition-all duration-200
        text-sm font-medium
        shadow-sm hover:shadow-md hover:shadow-black/10
      "
      >
        <Search className="w-4 h-4 mr-2" />
        Lookups
      </button>
    </div>
  );
}
