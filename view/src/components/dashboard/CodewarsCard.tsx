import { ArrowUpRight, RotateCcw, Swords } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { ISlug } from '../../../../back/src/models/slug.model';
import {
  ICodewarsChallenge,
  IUserProfile,
} from '../../../../back/src/utils/types';
import APIService from '../../service/api.service';

const CODEWARS_BASE_API = 'https://www.codewars.com/api/v1';

const RANK_COLORS: Record<string, string> = {
  white: 'text-zinc-200 bg-custom-hover/50 border-custom-active',
  yellow: 'text-sand bg-sand/10 border-sand/25',
  blue: 'text-haze bg-haze/10 border-haze/25',
  purple: 'text-dusk bg-dusk/10 border-dusk/25',
  red: 'text-red-300 bg-red-400/10 border-red-400/25',
};

const CATEGORY_COLORS: Record<string, string> = {
  algorithms: 'text-clay bg-clay/10',
  fundamentals: 'text-haze bg-haze/10',
  bug_fixes: 'text-sand bg-sand/10',
  refactoring: 'text-dusk bg-dusk/10',
};

function rankClass(color?: string | null): string {
  return RANK_COLORS[color || 'white'] || RANK_COLORS.white;
}

export default function CodewarsCard() {
  const [profile, setProfile] = useState<IUserProfile | undefined>();
  const [potd, setPotd] = useState<ICodewarsChallenge | undefined>();
  const [challenges, setChallenges] = useState<ISlug[] | undefined>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      APIService.getExternal('/users/s3lam', CODEWARS_BASE_API)
        .then(setProfile)
        .catch((e) => console.error('Error fetching profile:', e)),
      fetchPotd(),
      APIService.get('slugs')
        .then(setChallenges)
        .catch((e) => console.error('Error fetching challenges:', e)),
      APIService.get('codewars/completed').catch(() => undefined),
    ]).finally(() => setLoading(false));
  }, []);

  async function fetchPotd() {
    try {
      const res = await APIService.get('codewars/code-challenges');
      setPotd(res);
    } catch (error) {
      console.error('Error fetching challenge:', error);
    }
  }

  const completed = useMemo(
    () => challenges?.filter((c) => c.completed).length ?? 0,
    [challenges]
  );

  if (loading) {
    return (
      <div className="panel h-full animate-pulse p-4">
        <div className="mb-4 h-4 w-28 rounded bg-custom-hover/40" />
        <div className="mb-6 h-8 rounded bg-custom-hover/30" />
        <div className="mb-2 h-3 w-3/4 rounded bg-custom-hover/30" />
        <div className="h-3 w-1/2 rounded bg-custom-hover/30" />
      </div>
    );
  }

  return (
    <div className="panel flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-custom-border px-4 py-3">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-zinc-200">
          <Swords size={15} className="text-dusk/80" />
          Codewars
        </h2>
        {profile?.ranks?.overall && (
          <span
            className={`rounded-md border px-2 py-0.5 text-[11px] font-medium ${rankClass(
              profile.ranks.overall.color
            )}`}
          >
            {profile.ranks.overall.name}
          </span>
        )}
      </div>

      <div className="grid grid-cols-3 divide-x divide-custom-border border-b border-custom-border">
        <Stat label="Honor" value={profile?.honor?.toLocaleString() ?? '—'} />
        <Stat
          label="Completed"
          value={`${completed}/${challenges?.length ?? 0}`}
        />
        <Stat
          label="Languages"
          value={String(
            profile ? Object.keys(profile.ranks?.languages || {}).length : '—'
          )}
        />
      </div>

      <div className="flex flex-1 flex-col p-4">
        {potd ? (
          <>
            <div className="mb-2 flex items-center justify-between gap-2">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-custom-text">
                Challenge of the day
              </span>
              <button
                onClick={fetchPotd}
                title="Another one"
                className="rounded p-1 text-custom-text transition-colors hover:bg-custom-hover/60 hover:text-zinc-200"
              >
                <RotateCcw size={12} />
              </button>
            </div>

            <h3 className="mb-2 text-base font-semibold leading-snug text-zinc-100">
              {potd.name}
            </h3>

            <div className="mb-3 flex flex-wrap items-center gap-1.5">
              <span
                className={`rounded border px-1.5 py-0.5 text-[11px] font-medium ${rankClass(
                  potd.rank?.color
                )}`}
              >
                {potd.rank?.name || '8 kyu'}
              </span>
              {potd.category && (
                <span
                  className={`rounded px-1.5 py-0.5 text-[11px] ${
                    CATEGORY_COLORS[potd.category] ||
                    'text-zinc-400 bg-custom-hover/50'
                  }`}
                >
                  {potd.category.replace('_', ' ')}
                </span>
              )}
              {potd.languages?.slice(0, 3).map((lang) => (
                <span
                  key={lang}
                  className="rounded border border-custom-border px-1.5 py-0.5 font-mono text-[10px] text-custom-text"
                >
                  {lang}
                </span>
              ))}
              {potd.languages && potd.languages.length > 3 && (
                <span className="text-[10px] text-custom-text">
                  +{potd.languages.length - 3}
                </span>
              )}
            </div>

            <button
              onClick={() => potd.url && window.open(potd.url, '_blank')}
              className="mt-auto flex w-full items-center justify-center gap-1.5 rounded-lg bg-clay/15 px-3 py-2.5 text-sm font-medium text-clay transition-colors hover:bg-clay/20"
            >
              Start challenge
              <ArrowUpRight size={14} />
            </button>
          </>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center gap-2 text-custom-text">
            <Swords size={20} />
            <p className="text-xs">No challenge loaded</p>
            <button
              onClick={fetchPotd}
              className="text-xs text-clay hover:underline"
            >
              Try again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="px-4 py-3 text-center">
      <div className="text-base font-semibold text-zinc-100">{value}</div>
      <div className="text-[10px] uppercase tracking-wider text-custom-text">
        {label}
      </div>
    </div>
  );
}
