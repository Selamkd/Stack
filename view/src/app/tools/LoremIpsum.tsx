import { Check, Copy, RefreshCw, TextQuote } from 'lucide-react';
import { useState } from 'react';
import ToolShell from './ToolShell';

const WORD_BANK =
  'lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua enim ad minim veniam quis nostrud exercitation ullamco laboris nisi aliquip ex ea commodo consequat duis aute irure in reprehenderit voluptate velit esse cillum fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt culpa qui officia deserunt mollit anim id est laborum vero eos accusamus accusantium doloremque laudantium totam rem aperiam eaque ipsa quae ab illo inventore veritatis quasi architecto beatae vitae dicta explicabo nemo ipsam voluptatem quia'.split(
    ' '
  );

function randomWord(): string {
  return WORD_BANK[Math.floor(Math.random() * WORD_BANK.length)];
}

function makeSentence(): string {
  const length = 6 + Math.floor(Math.random() * 9);
  const words = Array.from({ length }, randomWord);
  const sentence = words.join(' ');
  return sentence.charAt(0).toUpperCase() + sentence.slice(1) + '.';
}

function makeParagraph(): string {
  const count = 4 + Math.floor(Math.random() * 4);
  return Array.from({ length: count }, makeSentence).join(' ');
}

type LoremType = 'words' | 'sentences' | 'paragraphs';

export default function LoremIpsum() {
  const [type, setType] = useState<LoremType>('paragraphs');
  const [amount, setAmount] = useState(3);
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);

  function generate() {
    const n = Math.max(1, Math.min(200, amount));
    if (type === 'words') {
      setOutput(Array.from({ length: n }, randomWord).join(' '));
    } else if (type === 'sentences') {
      setOutput(Array.from({ length: n }, makeSentence).join(' '));
    } else {
      setOutput(Array.from({ length: n }, makeParagraph).join('\n\n'));
    }
  }

  async function copyOutput() {
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (error) {
      console.error('Error copying:', error);
    }
  }

  return (
    <ToolShell
      icon={TextQuote}
      iconColor="text-sand/70"
      title="Lorem Ipsum"
      description="Placeholder text for layouts — words, sentences, or paragraphs"
    >
      <div className="mb-5 flex flex-wrap items-end gap-3">
        <div>
          <label className="mb-1.5 block text-xs text-zinc-400">Type</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as LoremType)}
            className="input-base px-3 py-2 text-sm"
          >
            <option value="words">Words</option>
            <option value="sentences">Sentences</option>
            <option value="paragraphs">Paragraphs</option>
          </select>
        </div>
        <div>
          <label className="mb-1.5 block text-xs text-zinc-400">Amount</label>
          <input
            type="number"
            min={1}
            max={200}
            value={amount}
            onChange={(e) => setAmount(parseInt(e.target.value) || 1)}
            className="input-base w-24 px-3 py-2 text-sm"
          />
        </div>
        <button
          onClick={generate}
          className="flex items-center gap-2 rounded-lg bg-clay/15 px-4 py-2 text-sm font-medium text-clay transition-colors hover:bg-clay/25"
        >
          <RefreshCw size={14} />
          Generate
        </button>
      </div>

      {output && (
        <div className="panel p-5">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs text-custom-text">
              {output.split(/\s+/).length.toLocaleString()} words
            </span>
            <button
              onClick={copyOutput}
              className={`flex items-center gap-1.5 rounded-md px-2 py-1 text-xs transition-colors ${
                copied
                  ? 'text-clay'
                  : 'text-custom-text hover:bg-custom-hover/60 hover:text-zinc-200'
              }`}
            >
              {copied ? <Check size={12} /> : <Copy size={12} />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
          <div className="whitespace-pre-wrap text-sm leading-relaxed text-zinc-400">
            {output}
          </div>
        </div>
      )}
    </ToolShell>
  );
}
