import {
  Binary,
  Braces,
  Clock,
  FileDown,
  Globe,
  LucideIcon,
  Palette,
  Regex,
  TextQuote,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export interface ITool {
  url: string;
  name: string;
  icon: LucideIcon;
  description: string;
  iconColor: string;
}

const tools: ITool[] = [
  {
    url: '/color-converter',
    name: 'Tailwind ↔ HEX',
    icon: Palette,
    description:
      'Convert Tailwind classes to HEX and find the closest Tailwind color for any HEX value.',
    iconColor: 'text-clay/70',
  },
  {
    url: '/json',
    name: 'JSON Formatter',
    icon: Braces,
    description: 'Format, minify, and validate JSON with clear error messages.',
    iconColor: 'text-sand/70',
  },
  {
    url: '/regex',
    name: 'Regex Tester',
    icon: Regex,
    description: 'Test patterns live with highlighted matches and capture groups.',
    iconColor: 'text-dusk/70',
  },
  {
    url: '/timestamp',
    name: 'Timestamp Converter',
    icon: Clock,
    description: 'Unix ↔ ISO ↔ local time, with relative time at a glance.',
    iconColor: 'text-haze/70',
  },
  {
    url: '/encode',
    name: 'Encode / Decode',
    icon: Binary,
    description: 'Base64, URL encoding, and UUID generation in one place.',
    iconColor: 'text-haze/70',
  },
  {
    url: '/lorem',
    name: 'Lorem Ipsum',
    icon: TextQuote,
    description: 'Placeholder words, sentences, or paragraphs for layouts.',
    iconColor: 'text-sand/70',
  },
  {
    url: '/pdf',
    name: 'Sample PDF',
    icon: FileDown,
    description: 'Generate downloadable sample PDFs for testing uploads.',
    iconColor: 'text-red-300/70',
  },
  {
    url: '/network',
    name: 'My Network',
    icon: Globe,
    description: 'Your public IP, browser, and environment info.',
    iconColor: 'text-haze/70',
  },
];

export default function Tools() {
  return (
    <main className="mx-auto min-h-screen w-full max-w-6xl p-4 md:p-6">
      <div className="mb-6 mt-2">
        <h1 className="text-2xl font-bold text-white">Tools</h1>
        <p className="mt-1 text-sm text-custom-text">
          Small utilities so you can stay out of sketchy converter websites
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {tools.map((tool) => (
          <ToolCard key={tool.url} tool={tool} />
        ))}
      </div>
    </main>
  );
}

function ToolCard({ tool }: { tool: ITool }) {
  const Icon = tool.icon;
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate(`/tools${tool.url}`)}
      className="bg-custom-surface group flex flex-col items-start rounded-xl border border-custom-border p-5 text-left transition-all hover:-translate-y-0.5 hover:border-custom-active"
    >
      <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl border border-custom-border bg-custom-surface transition-colors group-hover:border-custom-active">
        <Icon size={20} className={tool.iconColor} />
      </span>
      <h3 className="mb-1 text-sm font-semibold text-white">{tool.name}</h3>
      <p className="text-xs leading-relaxed text-custom-text">
        {tool.description}
      </p>
    </button>
  );
}
