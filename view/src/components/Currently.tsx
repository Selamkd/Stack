import React, { useState } from 'react';
import {
  Play,
  Pause,
  FileDown,
  MapPinHouse,
  Palette,
  SquareTerminal,
  TextQuote,
} from 'lucide-react';

import { ITool } from '../app/Tools';
import { useNavigate } from 'react-router-dom';

export const tools: ITool[] = [
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
const SpotifyCurrentlyPlaying = () => {
  return (
    <div className="blue-glass  border-custom-border relative  rounded-xl p-6 w-full mx-4  max-h-sm h-[380px] lg:h-fit backdrop-blur-sm">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 xl:grid-cols-3 lg:gap-8 max-w-3xl xl:max-w-6xl mx-auto mt-6">
        {tools.map((tool: ITool) => (
          <SnippetCard tool={tool} width={'90px'} />
        ))}
      </div>
    </div>
  );
};

export default SpotifyCurrentlyPlaying;

export function SnippetCard({ tool, width }: { tool: ITool; width?: string }) {
  const Icon = tool.icon;
  const navigate = useNavigate();
  return (
    <section
      onClick={() => navigate(`/tools${tool.url}`)}
      className={`border blue-glass cursor-pointer hover:scale-105 w-${
        width ? width : '350px'
      } flex flex-col justify-center items-center border-[#242424] rounded-lg overflow-hidden hover:border-custom-hover transition-all py-4 ${
        tool.name.includes('IP') ? 'col-span-2 py-1' : ''
      }`}
    >
      <>
        <Icon
          className={` ${
            tool.name.includes('IP')
              ? 'w-[30px] h-[30px]'
              : 'w-[50px] h-[50px] '
          } ${tool.iconColor} ${
            tool.hoverIconColor
          } transition-colors duration-200`}
        />
      </>
    </section>
  );
}
