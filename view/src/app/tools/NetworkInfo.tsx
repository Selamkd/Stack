import { Check, Copy, Globe, RefreshCw } from 'lucide-react';
import { useEffect, useState } from 'react';
import ToolShell from './ToolShell';

export default function NetworkInfo() {
  const [ip, setIp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState('');

  async function fetchIp() {
    try {
      setLoading(true);
      setError('');
      const res = await fetch('https://api.ipify.org?format=json');
      const data = await res.json();
      setIp(data.ip);
    } catch (err) {
      console.error('Error fetching IP:', err);
      setError('Could not reach the IP service — are you offline?');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchIp();
  }, []);

  const rows = [
    { label: 'Public IP', value: loading ? 'Loading…' : ip || '—' },
    { label: 'Timezone', value: Intl.DateTimeFormat().resolvedOptions().timeZone },
    { label: 'Locale', value: navigator.language },
    {
      label: 'Screen',
      value: `${window.screen.width} × ${window.screen.height} @${window.devicePixelRatio}x`,
    },
    { label: 'User agent', value: navigator.userAgent },
  ];

  async function copy(value: string) {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(value);
      setTimeout(() => setCopied(''), 1500);
    } catch (err) {
      console.error('Error copying:', err);
    }
  }

  return (
    <ToolShell
      icon={Globe}
      iconColor="text-haze/70"
      title="My Network"
      description="Your public IP and environment, one click to copy"
    >
      {error && (
        <div className="mb-4 flex items-center gap-3 rounded-lg border border-red-400/20 bg-red-400/10 px-4 py-2.5 text-sm text-red-300">
          {error}
          <button
            onClick={fetchIp}
            className="flex items-center gap-1 text-xs underline"
          >
            <RefreshCw size={11} />
            Retry
          </button>
        </div>
      )}

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
    </ToolShell>
  );
}
