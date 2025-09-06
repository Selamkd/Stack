import {
  FileDown,
  MapPinHouse,
  Palette,
  SquareTerminal,
  TextQuote,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export interface ITool {
  url: string;
  name: string;
  icon: any;
  description: string;
  iconColor: string;
  hoverIconColor: string;
}

const tools: ITool[] = [
  {
    url: '/text-generator',
    name: 'Tailwind Color → HEX',
    icon: Palette,
    description:
      'Convert Tailwind CSS classes to HEX values or find the closest Tailwind color for any HEX input.',
    iconColor: 'text-emerald-200/60',
    hoverIconColor: 'group-hover/link:text-emerald-300/50',
  },
  {
    url: '/text-generator',
    icon: TextQuote,
    name: 'Lorem Ipsum Generator',
    description: 'Generate placeholder text for layouts.',
    hoverIconColor: 'group-hover/link:text-amber-300/50',
    iconColor: 'text-amber-200/40',
  },
  {
    url: '/pdf-generator',
    icon: FileDown,
    name: 'Sample PDF Generator',
    description: 'Create downloadable sample PDFs for testing.',
    hoverIconColor: 'group-hover/link:text-emerald-300/50',
    iconColor: 'text-rose-400/50',
  },
  {
    url: '/shortcuts',
    icon: SquareTerminal,
    name: 'Daily Shortcuts',
    description:
      'Access a curated list of productivity shortcuts and command references.',
    hoverIconColor: 'group-hover/link:text-emerald-300/50',
    iconColor: 'text-indigo-200/60',
  },
  {
    url: 'https://lucide.dev/icons/',
    icon: MapPinHouse,
    name: 'Find my IP Address',
    description: 'Get current IP address.',
    hoverIconColor: 'group-hover/link:text-emerald-300/50',
    iconColor: 'text-pink-200/60',
  },
];
export default function Tools() {
  return (
    <main className="mx-5 min-h-screen p-4 md:p-6 my-2 md:my-6 rounded-lg">
      <div className="flex flex-col mb-10">
        <h1 className="text-3xl">Tools</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 xl:grid-cols-3 lg:gap-8 max-w-3xl xl:max-w-6xl mx-auto mt-6">
        {tools.map((tool) => (
          <SnippetCard tool={tool} />
        ))}
      </div>
    </main>
  );
}

export function SnippetCard({ tool }: { tool: ITool }) {
  const Icon = tool.icon;
  const navigate = useNavigate();
  return (
    <section
      onClick={() => navigate(`/tools${tool.url}`)}
      className="border blue-glass cursor-pointer hover:scale-105 w-[350px] flex flex-col justify-between items-center border-[#242424] rounded-lg overflow-hidden hover:border-custom-hover transition-all pt-10 "
    >
      <div className="">
        <Icon
          className={`w-[100px] h-[100px] ${tool.iconColor} ${tool.hoverIconColor} transition-colors duration-200`}
        />
      </div>
      <div className="flex h-full flex-col items-start  border-t border-[#49505770]  w-full px-8 mx-auto py-4  mt-8 justify-center mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-medium text-white mb-1 break-words">
            {tool.name}
          </h3>
          <p className="text-sm text-zinc-400 break-words">
            {tool.description}
          </p>
        </div>
      </div>
    </section>
  );
}
