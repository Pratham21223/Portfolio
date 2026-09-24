import stats from "../../public/data/stats.json";

export const fallbackStats = {
  codeforces: {
    handle: "Pratham2123",
    rating: stats.codeforces.rating,
    maxRating: stats.codeforces.maxRating,
    rank: stats.codeforces.rank,
    maxRank: stats.codeforces.maxRank,
    contests: 12,
    solved: 0,
    history: [
      { x: "1", y: 920 },
      { x: "2", y: 1010 },
      { x: "3", y: 1085 },
      { x: "4", y: 1140 },
      { x: "5", y: 1210 },
      { x: "6", y: 1277 },
    ],
  },
  codechef: {
    handle: "generous_hand",
    rating: stats.codechef.rating,
    maxRating: stats.codechef.maxRating,
    stars: stats.codechef.stars,
  },
  leetcode: {
    handle: "Pratham3004",
    solved: stats.leetcode.solved,
    easy: stats.leetcode.easy,
    medium: stats.leetcode.medium,
    hard: stats.leetcode.hard,
  },
  github: {
    handle: "Pratham21223",
    repos: stats.github.repos,
    stars: stats.github.stars,
    contributions: stats.github.contributions,
    followers: stats.github.followers,
  },
  static: {
    problemsSolved: 600,
    hackathons: 6,
    projects: 3,
    cgpa: 9.04,
  },
};
