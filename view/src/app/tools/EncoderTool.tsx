import { ArrowDownUp, Binary, Check, Copy, RefreshCw } from 'lucide-react';
import { useState } from 'react';
import ToolShell from './ToolShell';

function base64Encode(text: string): string {
  const bytes = new TextEncoder().encode(text);
  let binary = '';
  bytes.forEach((byte) => (binary += String.fromCharCode(byte)));
  return btoa(binary);
}

function base64Decode(text: string): string {
  const binary = atob(text.trim());
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

export default function EncoderTool() {
  return (
    <ToolShell
      icon={Binary}
      iconColor="text-haze/70"
      title="Encode / Decode"
      description="Base64, URL encoding, and UUIDs — without leaving Stack"
    >
      <div className="space-y-6">
        <ConverterCard
          title="Base64"
          encode={base64Encode}
          decode={base64Decode}
          encodePlaceholder="Plain text…"
          decodePlaceholder="SGVsbG8gd29ybGQ="
        />
        <ConverterCard
          title="URL"
          encode={encodeURIComponent}
          decode={decodeURIComponent}
          encodePlaceholder="a param with spaces & symbols"
          decodePlaceholder="a%20param%20with%20spaces%20%26%20symbols"
        />
        <UuidCard />
      </div>
    </ToolShell>
  );
}

function ConverterCard({
  title,
  encode,
  decode,
  encodePlaceholder,
  decodePlaceholder,
}: {
  title: string;
  encode: (text: string) => string;
  decode: (text: string) => string;
  encodePlaceholder: string;
  decodePlaceholder: string;
}) {
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [input, setInput] = useState('');
  const [copied, setCopied] = useState(false);

  let output = '';
  let error = '';
  if (input) {
    try {
      output = mode === 'encode' ? encode(input) : decode(input);
    } catch {
      error = `Not valid ${title} input`;
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
    <div className="panel p-4">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-zinc-200">{title}</h2>
        <button
          onClick={() => {
            setMode((m) => (m === 'encode' ? 'decode' : 'encode'));
            setInput(output && !error ? output : '');
          }}
          className="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-custom-text transition-colors hover:bg-custom-hover/60 hover:text-zinc-200"
        >
          <ArrowDownUp size={12} />
          {mode === 'encode' ? 'encoding' : 'decoding'}
        </button>
      </div>

      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        spellCheck={false}
        rows={2}
        placeholder={mode === 'encode' ? encodePlaceholder : decodePlaceholder}
        className="input-base mb-2 w-full resize-y px-3 py-2 font-mono text-[13px]"
      />

      {error ? (
        <p className="text-xs text-red-400">{error}</p>
      ) : (
        output && (
          <div className="flex items-start gap-2 rounded-lg border border-custom-border bg-custom-base p-3">
            <span className="min-w-0 flex-1 break-all font-mono text-[13px] text-zinc-300">
              {output}
            </span>
            <button
              onClick={copyOutput}
              className={`shrink-0 rounded p-1 transition-colors ${
                copied
                  ? 'text-clay'
                  : 'text-custom-text hover:text-zinc-200'
              }`}
            >
              {copied ? <Check size={13} /> : <Copy size={13} />}
            </button>
          </div>
        )
      )}
    </div>
  );
}

function UuidCard() {
  const [uuids, setUuids] = useState<string[]>(() => [crypto.randomUUID()]);
  const [copied, setCopied] = useState('');

  async function copy(uuid: string) {
    try {
      await navigator.clipboard.writeText(uuid);
      setCopied(uuid);
      setTimeout(() => setCopied(''), 1500);
    } catch (error) {
      console.error('Error copying:', error);
    }
  }

  return (
    <div className="panel p-4">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-zinc-200">UUID v4</h2>
        <button
          onClick={() =>
            setUuids((prev) => [crypto.randomUUID(), ...prev].slice(0, 8))
          }
          className="flex items-center gap-1.5 rounded-md bg-haze/10 px-2.5 py-1 text-xs text-haze transition-colors hover:bg-haze/20"
        >
          <RefreshCw size={12} />
          Generate
        </button>
      </div>
      <div className="space-y-1.5">
        {uuids.map((uuid) => (
          <button
            key={uuid}
            onClick={() => copy(uuid)}
            className="group flex w-full items-center justify-between gap-2 rounded-lg border border-custom-border bg-custom-base px-3 py-2 text-left font-mono text-[13px] text-zinc-300 transition-colors hover:border-custom-active"
          >
            {uuid}
            {copied === uuid ? (
              <Check size={13} className="shrink-0 text-clay" />
            ) : (
              <Copy
                size={12}
                className="shrink-0 text-custom-text opacity-0 transition-opacity group-hover:opacity-100"
              />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
