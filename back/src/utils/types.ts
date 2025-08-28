export interface IRank {
  rank: number;
  name: string;
  color: string;
  score: number;
}

export interface IUserProfile {
  username: string;
  name: string;
  honor: number;
  clan: string;
  leaderboardPosition: number;
  skills: string[];
  ranks: {
    overall: IRank;
    languages: {
      [language: string]: IRank;
    };
  };
  codeChallenges: {
    totalAuthored: number;
    totalCompleted: number;
  };
}

export interface ICodewarsChallenge {
  id: string;
  name: string;
  slug: string;
  category: string;
  publishedAt: string | null;
  approvedAt: string | null;
  createdAt: string;
  contributorsWanted: boolean;
  createdBy: {
    username: string;
    url: string;
  };
  description: string;
  languages: string[];
  rank: {
    id: number | null;
    name: string | null;
    color: string | null;
  };
  tags: string[];
  totalAttempts: number;
  totalCompleted: number;
  totalStars: number;
  unresolved: {
    issues: number;
    suggestions: number;
  };
  url: string;
  voteScore: number;
}
