import stats from "../../public/data/stats.json";

export const fallbackStats = {
  codeforces: {
    handle: "Pratham2123",
    rating: stats.codeforces?.rating ?? 0,
    maxRating: stats.codeforces?.maxRating ?? 0,
    rank: stats.codeforces?.rank ?? "unrated",
    maxRank: stats.codeforces?.maxRank ?? "unrated",
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
    rating: stats.codechef?.rating ?? 0,
    maxRating: stats.codechef?.maxRating ?? 0,
    stars: stats.codechef?.stars ?? 0,
  },
  leetcode: {
    handle: "Pratham3004",
    solved: stats.leetcode?.solved ?? 0,
    easy: stats.leetcode?.easy ?? 0,
    medium: stats.leetcode?.medium ?? 0,
    hard: stats.leetcode?.hard ?? 0,
  },
  github: {
    handle: "Pratham21223",
    repos: stats.github?.repos ?? 0,
    stars: stats.github?.stars ?? 0,
    contributions: stats.github?.contributions ?? 0,
    followers: stats.github?.followers ?? 0,
  },
  static: {
    problemsSolved: stats.static?.problemsSolved ?? 600,
    hackathons: 6,
    projects: 3,
    cgpa: 9.04,
  },
};