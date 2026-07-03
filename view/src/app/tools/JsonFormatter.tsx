import { Braces, Check, Copy } from 'lucide-react';
import { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import ToolShell from './ToolShell';

export default function JsonFormatter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  function run(mode: 'format' | 'minify') {
    setError('');
    setOutput('');
    if (!input.trim()) return;
    try {
      const parsed = JSON.parse(input);
      setOutput(
        mode === 'format'
          ? JSON.stringify(parsed, null, 2)
          : JSON.stringify(parsed)
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid JSON');
    }
  }

  async function copyOutput() {
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error('Error copying:', err);
    }
  }

  return (
    <ToolShell
      icon={Braces}
      iconColor="text-sand/70"
      title="JSON Formatter"
      description="Paste JSON, get it pretty — or minified, or told exactly where it broke"
    >
      <textarea
        autoFocus
        value={input}
        onChange={(e) => setInput(e.target.value)}
        spellCheck={false}
        rows={10}
        placeholder='{"paste": "your json here"}'
        className="input-base w-full resize-y px-4 py-3 font-mono text-[13px] leading-relaxed"
      />

      <div className="mt-3 flex items-center gap-2">
        <button
          onClick={() => run('format')}
          className="rounded-lg bg-clay/15 px-4 py-2 text-sm font-medium text-clay transition-colors hover:bg-clay/25"
        >
          Format
        </button>
        <button
          onClick={() => run('minify')}
          className="rounded-lg border border-custom-border px-4 py-2 text-sm text-zinc-300 transition-colors hover:border-custom-active"
        >
          Minify
        </button>
        {error && (
          <span className="min-w-0 truncate text-xs text-red-400">
            {error}
          </span>
        )}
      </div>

      {output && (
        <div className="mt-5 overflow-hidden rounded-xl border border-custom-border bg-custom-base">
          <div className="flex items-center justify-between border-b border-custom-border px-4 py-2">
            <span className="font-mono text-xs text-custom-text">
              {output.length.toLocaleString()} chars
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
          <div className="max-h-[50vh] overflow-auto scrollbar-thin">
            <SyntaxHighlighter
              language="json"
              style={oneDark}
              customStyle={{
                margin: 0,
                padding: '1rem',
                background: 'transparent',
                fontSize: '0.8rem',
                lineHeight: '1.6',
              }}
              wrapLongLines
            >
              {output}
            </SyntaxHighlighter>
          </div>
        </div>
      )}
    </ToolShell>
  );
}
