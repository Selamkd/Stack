import React, { useEffect, useMemo, useState } from 'react';
import {
  ICodewarsChallenge,
  IUserProfile,
} from '../../../back/src/utils/types';
import APIService from '../service/api.service';
import { ISlug } from '../../../back/src/models/slug.model';
import { Activity, RedoDot, RotateCcw, Slack } from 'lucide-react';

const CODEWARS_BASE_API: string = 'https://www.codewars.com/api/v1';

function CodewarsActivityCard() {
  const [profile, setUserProfile] = useState<IUserProfile | undefined>(
    undefined
  );
  const [potd, setPotd] = useState<ICodewarsChallenge | undefined>(undefined);
  const [challenges, setChallenges] = useState<ISlug[] | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    loadData();
  }, []);

  const completedChallenges = useMemo(() => {
    const completed = challenges?.filter((c) => c.completed === true);
    return completed?.length;
  }, [challenges]);

  async function loadData() {
    setLoading(true);
    try {
      await Promise.all([
        getProfileStats(),
        getProblemOfTheDay(),
        getChallenges(),
        checkForCompleted(),
      ]);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  }

  async function getProfileStats() {
    try {
      const res: IUserProfile = await APIService.getExternal(
        '/users/s3lam',
        CODEWARS_BASE_API
      );
      setUserProfile(res);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  }

  async function getProblemOfTheDay() {
    try {
      const res: ICodewarsChallenge = await APIService.get(
        'codewars/code-challenges'
      );
      setPotd(res);
    } catch (error) {
      console.error('Error fetching POTD:', error);
    }
  }

  async function getChallenges() {
    try {
      const res: ISlug[] = await APIService.get('slugs');
      setChallenges(res);
    } catch (error) {
      console.error('Error fetching challenges:', error);
    }
  }

  async function checkForCompleted() {
    try {
      await APIService.get('codewars/completed');
    } catch (e) {
      console.error('Error checking for completed slugs');
    }
  }

  function handleChallengeClick() {
    if (potd?.url) {
      window.open(potd.url, '_blank');
    }
  }

  if (loading) {
    return (
      <div className="group relative border border-custom-border bg-gradient-to-br from-slate-200/5 to-transparent rounded-xl p-6 overflow-hidden">
        <LoadingSkeleton />
      </div>
    );
  }

  return (
    <div className="group relative border-custom-border cursor-pointer bg-gradient-to-br from-slate-200/5 to-transparent rounded-xl p-6 overflow-hidden hover:border-slate-400/30 transition-all duration-300">
      <div className="absolute inset-0 hover-glass "></div>

      {profile && (
        <ProfileSection
          profile={profile}
          completed={completedChallenges || undefined}
        />
      )}

      {potd && (
        <div className="relative z-10 space-y-4">
          <div className="flex items-center justify-between"></div>

          <div className="space-y-3">
            <div className="flex w-full justify-end">
              <div className="flex items-center gap-2">
                <span
                  className={`px-2 py-1 text-xs font-medium rounded border ${getRankColor(
                    potd.rank?.color || 'grey'
                  )}`}
                >
                  {potd.rank?.name || '8kyu'}
                </span>
                <span
                  className={`px-2 py-1 text-xs font-medium rounded ${getCategoryColor(
                    potd.category
                  )}`}
                >
                  {potd.category}
                </span>
              </div>
            </div>

            {potd.description && (
              <div className="bg-custom-secondary rounded-lg p-4 border border-slate-700/30">
                <h4 className="text-xl font-bold text-white leading-tight mb-3">
                  {potd.name}
                </h4>
                <p className="text-slate-300 text-sm leading-relaxed line-clamp-4">
                  {potd.description.split('\\n')[0]}
                </p>
              </div>
            )}
          </div>

          {potd.languages && potd.languages.length > 0 && (
            <LanguageBadges languages={potd.languages} />
          )}

          <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-700/30">
            <div className="flex items-center gap-4">
              {potd.createdBy && <span>By: {potd.createdBy.username}</span>}
            </div>
            <button onClick={getProblemOfTheDay} className=" w-2 h-2 ">
              <RotateCcw
                size={14}
                className="text-xs text-neutral-400 hover:text-lime-200"
              />
            </button>
          </div>

          <button
            onClick={handleChallengeClick}
            className="btn-full"
            type="button"
          >
            Start Challenge →
          </button>
        </div>
      )}
    </div>
  );
}

interface IProfile {
  profile: IUserProfile;
  completed: number | undefined;
}
function ProfileSection(props: IProfile) {
  const { profile, completed } = props;
  return (
    <div className="relative z-10 mb-2">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full overflow-hidden">
            <img
              src="https://ik.imagekit.io/3npnjsjvd/IMG_3130%202.JPG"
              alt={profile.username || 'avatar'}
              className="w-full h-full object-cover"
            />
          </div>

          <div>
            <h3 className="text-2xl font-semibold text-white">Selamkd</h3>
            <span
              className={`px-2 py-1 text-xs font-medium rounded border ${getRankColor(
                profile.ranks?.overall?.color || 'grey'
              )}`}
            >
              {profile.ranks?.overall.name || '8kyu'}
            </span>
          </div>
        </div>

        <div className="text-center flex space-x-3">
          <div>
            <div className="text-1xl font-bold text-gray-200">
              {profile.honor}
            </div>
            <p className="text-xs text-slate-400">Honor</p>
          </div>
          <div>
            <div className="text-1xl font-bold text-gray-400">
              {`${completed}/100`}
            </div>
            <p className="text-xs text-slate-400">Completed</p>
          </div>
        </div>
      </div>
    </div>
  );
}

interface ILanguage {
  languages: string[];
}

function LanguageBadges(props: ILanguage) {
  const { languages } = props;
  return (
    <div className="space-y-2">
      <span className="text-xs text-slate-400">Available Languages:</span>
      <div className="flex flex-wrap gap-1">
        {languages.slice(0, 8).map((lang: string, index: number) => (
          <span
            key={index}
            className="px-2 py-1 bg-custom-secondary text-slate-300 text-xs rounded border border-slate-600/30"
          >
            {lang}
          </span>
        ))}
        {languages.length > 8 && (
          <span className="px-2 py-1 bg-glass-card text-slate-400 text-xs rounded border border-slate-600/30">
            +{languages.length - 8} more
          </span>
        )}
      </div>
    </div>
  );
}

const getRankColor = (color: string | undefined): string => {
  const colorMap: Record<string, string> = {
    white: 'text-gray-100 bg-gray-700/30 border-gray-600',
    yellow: 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30',
    blue: 'text-blue-400 bg-blue-500/20 border-blue-500/30',
    purple: 'text-purple-400 bg-purple-500/20 border-purple-500/30',
    red: 'text-red-400 bg-red-500/20 border-red-500/30',
  };
  return colorMap[color || 'white'] || colorMap['white'];
};

const getCategoryColor = (category: string | undefined): string => {
  const categoryMap: Record<string, string> = {
    algorithms: 'text-emerald-400 bg-emerald-500/20',
    fundamentals: 'text-blue-400 bg-blue-500/20',
    bug_fixes: 'text-orange-400 bg-orange-500/20',
    refactoring: 'text-purple-400 bg-purple-500/20',
  };
  return categoryMap[category || ''] || 'text-gray-400 bg-gray-500/20';
};
export default CodewarsActivityCard;

const LoadingSkeleton = () => (
  <div className={`animate-pulse space-y-4`}>
    <div className="h-6 glass-card rounded w-3/4"></div>
    <div className="h-4 glass-card rounded w-1/2"></div>
    <div className="h-20 glass-card rounded"></div>
  </div>
);
