import React, { useState, useEffect } from 'react';
import { Calendar, GitBranch } from 'lucide-react';

export const GitHubContributionGraph = () => {
  const [contributions, setContributions] = useState<
    { date: string; count: number; level: number }[]
  >([]);
  const [hoveredDay, setHoveredDay] = useState<null | string>(null);
  const [totalContributions, setTotalContributions] = useState(0);

  useEffect(() => {
    const generateContributions = () => {
      const today = new Date();
      const oneYearAgo = new Date(
        today.getFullYear() - 1,
        today.getMonth(),
        today.getDate()
      );
      const contributions = [];
      let total = 0;

      for (
        let d = new Date(oneYearAgo);
        d <= today;
        d.setDate(d.getDate() + 1)
      ) {
        const date = new Date(d);
        const dayOfWeek = date.getDay();

        const baseActivity = dayOfWeek === 0 || dayOfWeek === 6 ? 0.3 : 0.7;
        const randomFactor = Math.random();

        let count = 0;
        if (randomFactor < 0.2) count = 0;
        else if (randomFactor < 0.4) count = Math.floor(Math.random() * 3) + 1;
        else if (randomFactor < 0.7) count = Math.floor(Math.random() * 8) + 3;
        else if (randomFactor < 0.9) count = Math.floor(Math.random() * 15) + 8;
        else count = Math.floor(Math.random() * 25) + 15;

        count = Math.floor(count * baseActivity);
        total += count;

        contributions.push({
          date: date.toISOString().split('T')[0],
          count,
          level:
            count === 0
              ? 0
              : count <= 3
              ? 1
              : count <= 8
              ? 2
              : count <= 15
              ? 3
              : 4,
        });
      }

      setContributions(contributions);
      setTotalContributions(total);
    };

    generateContributions();
  }, []);

  const getContributionColor = (level: any) => {
    switch (level) {
      case 0:
        return 'bg-zinc-800/50';
      case 1:
        return 'bg-lime-200/20';
      case 2:
        return 'bg-lime-200/40';
      case 3:
        return 'bg-lime-200/60';
      case 4:
        return 'bg-lime-200/80';
      default:
        return 'bg-zinc-800/50';
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const weeks: any[][] = [];
  let currentWeek: ({ date: string; count: number; level: number } | null)[] =
    [];

  contributions.forEach((contribution, index) => {
    const date = new Date(contribution.date);
    const dayOfWeek = date.getDay();

    if (index === 0) {
      for (let i = 0; i < dayOfWeek; i++) {
        currentWeek.push(null);
      }
    }

    currentWeek.push(contribution);

    if (dayOfWeek === 6 || index === contributions.length - 1) {
      while (currentWeek.length < 7) {
        currentWeek.push(null);
      }
      weeks.push([...currentWeek]);
      currentWeek = [];
    }
  });

  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 backdrop-blur-sm">
      {/* Header */}
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-8 h-8 bg-zinc-700 rounded-full flex items-center justify-center">
          <GitBranch className="w-4 h-4 text-lime-200" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">GitHub Activity</h3>
          <p className="text-sm text-zinc-400">
            {totalContributions.toLocaleString()} contributions this year
          </p>
        </div>
      </div>

      <div className="relative">
        <div className="flex justify-between text-xs text-zinc-400 mb-2 ml-6">
          {months.map((month, index) => (
            <span key={index} className={index % 2 === 0 ? '' : 'opacity-0'}>
              {month}
            </span>
          ))}
        </div>

        <div className="flex">
          {/* Day labels */}
          <div className="flex flex-col justify-between text-xs text-zinc-400 mr-2">
            <span></span>
            <span>Mon</span>
            <span></span>
            <span>Wed</span>
            <span></span>
            <span>Fri</span>
            <span></span>
          </div>

          <div
            className="grid grid-flow-col gap-1"
            style={{ gridTemplateRows: 'repeat(7, 1fr)' }}
          >
            {weeks.map((week, weekIndex) =>
              week.map((day, dayIndex) => (
                <div
                  key={`${weekIndex}-${dayIndex}`}
                  className={`w-3 h-3 rounded-sm transition-all duration-200 cursor-pointer ${
                    day ? getContributionColor(day.level) : 'bg-transparent'
                  } ${
                    hoveredDay === `${weekIndex}-${dayIndex}`
                      ? 'scale-110 ring-1 ring-lime-200/50'
                      : ''
                  }`}
                  onMouseEnter={() =>
                    day && setHoveredDay(`${weekIndex}-${dayIndex}`)
                  }
                  onMouseLeave={() => setHoveredDay(null)}
                  title={
                    day
                      ? `${day.count} contributions on ${formatDate(day.date)}`
                      : ''
                  }
                />
              ))
            )}
          </div>
        </div>

        <div className="flex items-center justify-between mt-4 text-xs text-zinc-400">
          <span>Less</span>
          <div className="flex space-x-1">
            {[0, 1, 2, 3, 4].map((level) => (
              <div
                key={level}
                className={`w-3 h-3 rounded-sm ${getContributionColor(level)}`}
              />
            ))}
          </div>
          <span>More</span>
        </div>

        {hoveredDay && (
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-zinc-700 border border-zinc-600 rounded text-xs text-white whitespace-nowrap pointer-events-none">
            {(() => {
              const [weekIndex, dayIndex] = hoveredDay.split('-').map(Number);
              const day = weeks[weekIndex][dayIndex];
              return day
                ? `${day.count} contributions on ${formatDate(day.date)}`
                : '';
            })()}
          </div>
        )}
      </div>

      <div className="flex justify-between items-center mt-4 pt-4 border-t border-zinc-800">
        <div className="text-xs text-zinc-400">
          Current streak:{' '}
          <span className="text-lime-200 font-medium">12 days</span>
        </div>
        <div className="text-xs text-zinc-400">
          Longest streak:{' '}
          <span className="text-lime-200 font-medium">47 days</span>
        </div>
      </div>
    </div>
  );
};

export default GitHubContributionGraph;
