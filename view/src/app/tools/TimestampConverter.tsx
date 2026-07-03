import { formatDistanceToNow } from 'date-fns';
import { Check, Clock, Copy } from 'lucide-react';
import { useMemo, useState } from 'react';
import ToolShell from './ToolShell';

function parseInput(raw: string): Date | null {
  const input = raw.trim();
  if (!input) return null;

  if (/^\d{10}$/.test(input)) return new Date(parseInt(input, 10) * 1000);
  if (/^\d{13}$/.test(input)) return new Date(parseInt(input, 10));

  const parsed = new Date(input);
  return isNaN(parsed.getTime()) ? null : parsed;
}

export default function TimestampConverter() {
  const [input, setInput] = useState('');
  const [copied, setCopied] = useState('');

  const date = useMemo(() => parseInput(input), [input]);

  const rows = useMemo(() => {
    if (!date) return [];
    return [
      { label: 'Unix (seconds)', value: String(Math.floor(date.getTime() / 1000)) },
      { label: 'Unix (millis)', value: String(date.getTime()) },
      { label: 'ISO 8601 (UTC)', value: date.toISOString() },
      { label: 'Local', value: date.toLocaleString() },
      {
        label: 'Relative',
        value: formatDistanceToNow(date, { addSuffix: true }),
      },
    ];
  }, [date]);

  async function copy(value: string) {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(value);
      setTimeout(() => setCopied(''), 1500);
    } catch (error) {
      console.error('Error copying:', error);
    }
  }

  return (
    <ToolShell
      icon={Clock}
      iconColor="text-haze/70"
      title="Timestamp Converter"
      description="Unix seconds, millis, or any date string — converted every way at once"
    >
      <div className="mb-5 flex gap-2">
        <input
          autoFocus
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="1719936000 · 2026-07-02T10:00:00Z · Jul 2 2026"
          spellCheck={false}
          className="input-base w-full px-4 py-3 font-mono text-sm"
        />
        <button
          onClick={() => setInput(String(Date.now()))}
          className="shrink-0 rounded-lg bg-haze/10 px-4 py-2 text-sm text-haze transition-colors hover:bg-haze/20"
        >
          Now
        </button>
      </div>

      {input && !date && (
        <p className="text-sm text-red-400">
          Couldn’t parse that — try a unix timestamp or an ISO date
        </p>
      )}

      {date && (
        <div className="space-y-2">
          {rows.map((row) => (
            <button
              key={row.label}
              onClick={() => copy(row.value)}
              className="group flex w-full items-center justify-between gap-4 rounded-lg border border-custom-border bg-custom-surface px-4 py-3 text-left transition-colors hover:border-custom-active"
            >
              <span className="shrink-0 text-xs text-custom-text">
                {row.label}
              </span>
              <span className="flex min-w-0 items-center gap-2 font-mono text-sm text-zinc-200">
                <span className="truncate">{row.value}</span>
                {copied === row.value ? (
                  <Check size={13} className="shrink-0 text-clay" />
                ) : (
                  <Copy
                    size={12}
                    className="shrink-0 text-custom-text opacity-0 transition-opacity group-hover:opacity-100"
                  />
                )}
              </span>
            </button>
          ))}
        </div>
      )}
    </ToolShell>
  );
}
