import { Check, Palette } from 'lucide-react';
import { useMemo, useState } from 'react';
import { TAILWIND_COLORS } from '../../data/tailwindColors';
import ToolShell from './ToolShell';

interface PaletteEntry {
  cls: string;
  hex: string;
}

const FLAT_PALETTE: PaletteEntry[] = Object.entries(TAILWIND_COLORS).flatMap(
  ([family, shades]) =>
    typeof shades === 'string'
      ? [{ cls: family, hex: shades }]
      : Object.entries(shades).map(([shade, hex]) => ({
          cls: `${family}-${shade}`,
          hex,
        }))
);

function normalizeHex(input: string): string | null {
  let hex = input.trim().replace(/^#/, '').toLowerCase();
  if (/^[0-9a-f]{3}$/.test(hex)) {
    hex = hex
      .split('')
      .map((c) => c + c)
      .join('');
  }
  return /^[0-9a-f]{6}$/.test(hex) ? `#${hex}` : null;
}

function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace('#', '');
  return [
    parseInt(clean.slice(0, 2), 16),
    parseInt(clean.slice(2, 4), 16),
    parseInt(clean.slice(4, 6), 16),
  ];
}

function distance(a: string, b: string): number {
  const [r1, g1, b1] = hexToRgb(a);
  const [r2, g2, b2] = hexToRgb(b);
  return (r1 - r2) ** 2 + (g1 - g2) ** 2 + (b1 - b2) ** 2;
}

function lookupClass(input: string): PaletteEntry | null {
  const cleaned = input
    .trim()
    .toLowerCase()
    .replace(/^(bg|text|border|ring|fill|stroke|from|via|to|accent|shadow)-/, '')
    .replace(/\/\d+$/, '');
  return FLAT_PALETTE.find((entry) => entry.cls === cleaned) || null;
}

export default function ColorConverter() {
  const [input, setInput] = useState('');
  const [copied, setCopied] = useState('');

  const result = useMemo(() => {
    if (!input.trim()) return null;

    const asHex = normalizeHex(input);
    if (asHex) {
      const exact = FLAT_PALETTE.find((e) => e.hex.toLowerCase() === asHex);
      if (exact) return { entry: exact, exact: true, hex: asHex };
      let best = FLAT_PALETTE[0];
      let bestDist = Infinity;
      for (const entry of FLAT_PALETTE) {
        const d = distance(asHex, entry.hex);
        if (d < bestDist) {
          bestDist = d;
          best = entry;
        }
      }
      return { entry: best, exact: false, hex: asHex };
    }

    const byClass = lookupClass(input);
    if (byClass) return { entry: byClass, exact: true, hex: byClass.hex };
    return { entry: null, exact: false, hex: null };
  }, [input]);

  async function copy(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(text);
      setTimeout(() => setCopied(''), 1500);
    } catch (error) {
      console.error('Error copying:', error);
    }
  }

  return (
    <ToolShell
      icon={Palette}
      iconColor="text-clay/70"
      title="Tailwind ↔ HEX"
      description="Paste a HEX value or a Tailwind class — get the other one"
    >
      <input
        autoFocus
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="#84cc16 — or — clay / bg-dusk"
        className="input-base mb-5 w-full px-4 py-3 font-mono text-sm"
      />

      {result &&
        (result.entry ? (
          <div className="panel mb-8 flex flex-wrap items-center gap-4 p-4">
            <span
              className="h-14 w-14 shrink-0 rounded-lg border border-custom-border"
              style={{ backgroundColor: result.hex || result.entry.hex }}
            />
            <div className="min-w-0 flex-1">
              <p className="text-sm text-zinc-300">
                {result.exact ? 'Exact match' : 'Closest Tailwind color'}
              </p>
              <div className="mt-1 flex flex-wrap gap-2">
                <CopyChip
                  label={result.entry.cls}
                  copied={copied === result.entry.cls}
                  onCopy={() => copy(result.entry!.cls)}
                />
                <CopyChip
                  label={result.entry.hex}
                  copied={copied === result.entry.hex}
                  onCopy={() => copy(result.entry!.hex)}
                />
              </div>
            </div>
          </div>
        ) : (
          <p className="mb-8 text-sm text-custom-text">
            Couldn’t read that — try a hex like{' '}
            <code className="text-zinc-300">#84cc16</code> or a class like{' '}
            <code className="text-zinc-300">clay</code>
          </p>
        ))}

      <div className="space-y-3">
        {Object.entries(TAILWIND_COLORS).map(([family, shades]) => {
          if (typeof shades === 'string') return null;
          return (
            <div key={family} className="flex items-center gap-3">
              <span className="w-20 shrink-0 text-right font-mono text-xs text-custom-text">
                {family}
              </span>
              <div className="flex flex-1 gap-1">
                {Object.entries(shades).map(([shade, hex]) => (
                  <button
                    key={shade}
                    title={`${family}-${shade} · ${hex}`}
                    onClick={() => copy(hex)}
                    className={`h-7 flex-1 rounded transition-transform hover:scale-110 ${
                      copied === hex ? 'ring-2 ring-white/70' : ''
                    }`}
                    style={{ backgroundColor: hex }}
                  />
                ))}
              </div>
            </div>
          );
        })}
        <p className="pl-24 pt-1 text-xs text-custom-text">
          Click any swatch to copy its hex
        </p>
      </div>
    </ToolShell>
  );
}

function CopyChip({
  label,
  copied,
  onCopy,
}: {
  label: string;
  copied: boolean;
  onCopy: () => void;
}) {
  return (
    <button
      onClick={onCopy}
      className="flex items-center gap-1.5 rounded-md border border-custom-border bg-custom-surface px-2.5 py-1 font-mono text-xs text-zinc-200 transition-colors hover:border-custom-active"
    >
      {label}
      {copied && <Check size={11} className="text-clay" />}
    </button>
  );
}
