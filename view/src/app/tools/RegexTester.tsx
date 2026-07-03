import { Regex } from 'lucide-react';
import { Fragment, useMemo, useState } from 'react';
import ToolShell from './ToolShell';

const FLAG_OPTIONS = [
  { flag: 'g', label: 'global' },
  { flag: 'i', label: 'ignore case' },
  { flag: 'm', label: 'multiline' },
  { flag: 's', label: 'dotAll' },
];

interface MatchInfo {
  text: string;
  index: number;
  groups: string[];
}

export default function RegexTester() {
  const [pattern, setPattern] = useState('');
  const [flags, setFlags] = useState('g');
  const [testString, setTestString] = useState('');

  const { matches, error } = useMemo(() => {
    if (!pattern || !testString) {
      return { matches: [] as MatchInfo[], error: '' };
    }
    try {
      const regex = new RegExp(pattern, flags.includes('g') ? flags : flags + 'g');
      const found: MatchInfo[] = [];
      let match: RegExpExecArray | null;
      let guard = 0;
      while ((match = regex.exec(testString)) !== null && guard < 5000) {
        found.push({
          text: match[0],
          index: match.index,
          groups: match.slice(1),
        });
        if (match[0] === '') regex.lastIndex++;
        guard++;
      }
      return { matches: found, error: '' };
    } catch (err) {
      return {
        matches: [] as MatchInfo[],
        error: err instanceof Error ? err.message : 'Invalid pattern',
      };
    }
  }, [pattern, flags, testString]);

  const highlighted = useMemo(() => {
    if (matches.length === 0) return null;
    const parts: { text: string; hit: boolean }[] = [];
    let cursor = 0;
    for (const m of matches) {
      if (m.index > cursor) {
        parts.push({ text: testString.slice(cursor, m.index), hit: false });
      }
      parts.push({ text: m.text, hit: true });
      cursor = m.index + m.text.length;
    }
    if (cursor < testString.length) {
      parts.push({ text: testString.slice(cursor), hit: false });
    }
    return parts;
  }, [matches, testString]);

  function toggleFlag(flag: string) {
    setFlags((prev) =>
      prev.includes(flag) ? prev.replace(flag, '') : prev + flag
    );
  }

  return (
    <ToolShell
      icon={Regex}
      iconColor="text-dusk/70"
      title="Regex Tester"
      description="Pattern on top, test string below, matches as you type"
    >
      <div className="mb-3 flex items-center gap-2 font-mono text-sm">
        <span className="text-custom-text">/</span>
        <input
          autoFocus
          value={pattern}
          onChange={(e) => setPattern(e.target.value)}
          placeholder="(\w+)@(\w+)\.com"
          spellCheck={false}
          className="input-base w-full px-3 py-2.5"
        />
        <span className="text-custom-text">/{flags}</span>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {FLAG_OPTIONS.map(({ flag, label }) => (
          <button
            key={flag}
            onClick={() => toggleFlag(flag)}
            className={`rounded-full px-3 py-1 font-mono text-xs transition-colors ${
              flags.includes(flag)
                ? 'bg-dusk/15 text-dusk'
                : 'border border-custom-border text-custom-text hover:text-zinc-300'
            }`}
          >
            {flag} · {label}
          </button>
        ))}
        {error && <span className="text-xs text-red-400">{error}</span>}
      </div>

      <textarea
        value={testString}
        onChange={(e) => setTestString(e.target.value)}
        spellCheck={false}
        rows={6}
        placeholder="Paste text to test against…"
        className="input-base w-full resize-y px-4 py-3 font-mono text-[13px] leading-relaxed"
      />

      {highlighted && (
        <div className="mt-4 whitespace-pre-wrap rounded-xl border border-custom-border bg-custom-base p-4 font-mono text-[13px] leading-relaxed text-zinc-400">
          {highlighted.map((part, i) => (
            <Fragment key={i}>
              {part.hit ? (
                <mark className="rounded bg-dusk/30 px-0.5 text-dusk">
                  {part.text}
                </mark>
              ) : (
                part.text
              )}
            </Fragment>
          ))}
        </div>
      )}

      {pattern && testString && !error && (
        <div className="mt-4">
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-custom-text">
            {matches.length} match{matches.length === 1 ? '' : 'es'}
          </h3>
          <div className="max-h-64 space-y-1 overflow-y-auto scrollbar-thin">
            {matches.map((m, i) => (
              <div
                key={i}
                className="flex flex-wrap items-center gap-3 rounded-lg border border-custom-border bg-custom-surface px-3 py-2 font-mono text-xs"
              >
                <span className="text-custom-text">@{m.index}</span>
                <span className="text-zinc-200">{m.text}</span>
                {m.groups.map((group, gi) => (
                  <span key={gi} className="text-dusk/80">
                    ${gi + 1}: {group ?? '—'}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </ToolShell>
  );
}
