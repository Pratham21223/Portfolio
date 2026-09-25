import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(__dirname, "../public/data/stats.json");

const CF_HANDLE = "Pratham2123";
const CC_HANDLE = "generous_hand";
const LC_HANDLE = "Pratham3004";
const GH_HANDLE = "Pratham21223";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/* Accepts full fetch options (method, headers, body). */
const json = async (url, options = {}) => {
  const res = await fetch(url, options);

  if (!res.ok) {
    throw new Error(`${res.status} ${url}`);
  }

  const data = await res.json();

  if (data.status && data.status !== "OK") {
    throw new Error(`${data.comment ?? "API request failed"}`);
  }

  return data;
};

/* Calendar date in IST (YYYY-MM-DD), so heatmap days match your local days. */
const dateKey = (timestampSeconds) =>
  new Date(timestampSeconds * 1000).toLocaleDateString("en-CA", {
    timeZone: "Asia/Kolkata",
  });


/* =========================================================
   CODEFORCES
========================================================= */

const codeforces = async () => {
  const info = await json(
    `https://codeforces.com/api/user.info?handles=${CF_HANDLE}`
  );

  const ratingData = await json(
    `https://codeforces.com/api/user.rating?handle=${CF_HANDLE}`
  );

  /* Fetch submissions in pages so we are not limited to the first 10,000. */
  const PAGE_SIZE = 10000;
  const submissions = [];

  for (let from = 1; ; from += PAGE_SIZE) {
    const page = await json(
      `https://codeforces.com/api/user.status?handle=${CF_HANDLE}&from=${from}&count=${PAGE_SIZE}`
    );

    const result = page.result ?? [];
    submissions.push(...result);

    if (result.length < PAGE_SIZE) break;

    await sleep(300);
  }

  const user = info.result?.[0];

  if (!user) {
    throw new Error(`Codeforces user not found: ${CF_HANDLE}`);
  }

  /* ---- Rating history ---- */

  const contests = ratingData.result ?? [];

  const history = contests.map((contest) => ({
    contestId: contest.contestId,
    contestName: contest.contestName,
    date: contest.ratingUpdateTimeSeconds * 1000,
    oldRating: contest.oldRating,
    newRating: contest.newRating,
    change: contest.newRating - contest.oldRating,
    rank: contest.rank,
  }));

  /* ---- Accepted problems (first solve only) ---- */

  const solvedMap = new Map();

  for (const submission of submissions) {
    if (submission.verdict !== "OK") continue;
    if (!submission.problem) continue;

    const problem = submission.problem;

    const problemKey = [
      problem.contestId ?? "unknown",
      problem.index ?? "unknown",
    ].join("-");

    /* The API returns newest first, so keep the EARLIEST accepted submission. */
    const existing = solvedMap.get(problemKey);

    if (!existing || submission.creationTimeSeconds < existing.timestamp) {
      solvedMap.set(problemKey, {
        key: problemKey,
        contestId: problem.contestId ?? null,
        index: problem.index ?? null,
        name: problem.name ?? "Unknown",
        rating: problem.rating ?? null,
        tags: problem.tags ?? [],
        timestamp: submission.creationTimeSeconds,
        date: dateKey(submission.creationTimeSeconds),
      });
    }
  }

  /* ---- Daily activity ---- */

  const activity = {};

  for (const problem of solvedMap.values()) {
    activity[problem.date] = (activity[problem.date] ?? 0) + 1;
  }

  /* ---- Years available (read from the string, no timezone shifts) ---- */

  const years = [
    ...new Set(Object.keys(activity).map((date) => Number(date.slice(0, 4)))),
  ].sort((a, b) => b - a);

  return {
    handle: CF_HANDLE,
    rating: user.rating ?? 0,
    maxRating: user.maxRating ?? 0,
    rank: user.rank ?? "unrated",
    maxRank: user.maxRank ?? "unrated",
    contests: contests.length,
    history,
    solvedProblems: [...solvedMap.values()],
    activity,
    years,
  };
};


/* =========================================================
   CODECHEF
========================================================= */

const codechef = async () => {
  const res = await fetch(`https://www.codechef.com/users/${CC_HANDLE}`);

  if (!res.ok) {
    throw new Error(`codechef ${res.status}`);
  }

  const html = await res.text();

  const rating = Number(
    html.match(/rating-number[^>]*>\s*(\d+)/i)?.[1] ?? 0
  );

  const maxRating = Number(
    html.match(/Highest Rating[^\d]*(\d+)/i)?.[1] ?? rating
  );

  const parsedStars = Number(html.match(/(\d)★/)?.[1] ?? 0);

  const stars = parsedStars || (rating >= 1400 ? 2 : rating >= 0 ? 1 : 0);

  return { handle: CC_HANDLE, rating, maxRating, stars };
};


/* =========================================================
   LEETCODE
========================================================= */

const leetcode = async () => {
  const query = {
    query: `
      query($u: String!) {
        matchedUser(username: $u) {
          submitStats {
            acSubmissionNum {
              difficulty
              count
            }
          }
        }
      }
    `,
    variables: { u: LC_HANDLE },
  };

  const res = await fetch("https://leetcode.com/graphql", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "user-agent": "Mozilla/5.0",
    },
    body: JSON.stringify(query),
  });

  if (!res.ok) {
    throw new Error(`leetcode ${res.status}`);
  }

  const data = await res.json();

  const stats = data.data?.matchedUser?.submitStats?.acSubmissionNum ?? [];

  return {
    handle: LC_HANDLE,
    solved: stats[0]?.count ?? 0,
    easy: stats[1]?.count ?? 0,
    medium: stats[2]?.count ?? 0,
    hard: stats[3]?.count ?? 0,
  };
};


/* =========================================================
   GITHUB
========================================================= */

const ghHeaders = () => ({
  "user-agent": "stats-script",
  accept: "application/vnd.github+json",
  ...(process.env.GH_PAT ? { authorization: `bearer ${process.env.GH_PAT}` } : {}),
});

const ghGraphql = async (query, variables) => {
  const data = await json("https://api.github.com/graphql", {
    method: "POST",
    headers: { ...ghHeaders(), "content-type": "application/json" },
    body: JSON.stringify({ query, variables }),
  });

  if (data.errors) throw new Error(data.errors[0].message);

  return data.data;
};

/* Daily contribution counts for every year on the account. Needs GH_PAT. */
const githubActivity = async () => {
  if (!process.env.GH_PAT) {
    return { activity: {}, years: [], lastYear: 0 };
  }

  const { user } = await ghGraphql(
    `query($l:String!){ user(login:$l){ contributionsCollection{ contributionYears } } }`,
    { l: GH_HANDLE }
  );

  const years = user.contributionsCollection.contributionYears; // newest first

  const activity = {};

  for (const year of years) {
    const d = await ghGraphql(
      `query($l:String!,$from:DateTime!,$to:DateTime!){
         user(login:$l){
           contributionsCollection(from:$from,to:$to){
             contributionCalendar{ weeks{ contributionDays{ date contributionCount } } }
           }
         }
       }`,
      {
        l: GH_HANDLE,
        from: `${year}-01-01T00:00:00Z`,
        to: `${year}-12-31T23:59:59Z`,
      }
    );

    for (const week of d.user.contributionsCollection.contributionCalendar.weeks) {
      for (const day of week.contributionDays) {
        if (day.contributionCount > 0) {
          activity[day.date] = day.contributionCount;
        }
      }
    }

    await sleep(200);
  }

  const cutoff = new Date(Date.now() - 365 * 86400000)
    .toISOString()
    .slice(0, 10);

  const lastYear = Object.entries(activity)
    .filter(([date]) => date >= cutoff)
    .reduce((sum, [, n]) => sum + n, 0);

  return { activity, years, lastYear };
};

const github = async () => {
  const user = await json(`https://api.github.com/users/${GH_HANDLE}`, {
    headers: ghHeaders(),
  });

  const repos = await json(
    `https://api.github.com/users/${GH_HANDLE}/repos?per_page=100&type=owner`,
    { headers: ghHeaders() }
  );

  let extra = { activity: {}, years: [], lastYear: 0 };

  try {
    extra = await githubActivity();
  } catch (err) {
    console.error(
      `  github activity skipped: ${err instanceof Error ? err.message : err}`
    );
  }

  return {
    handle: GH_HANDLE,
    repos: user.public_repos ?? repos.length,
    stars: repos.reduce((total, repo) => total + (repo.stargazers_count ?? 0), 0),
    followers: user.followers ?? 0,
    contributions: extra.lastYear, // last 12 months
    activity: extra.activity,
    years: extra.years,
  };
};


/* =========================================================
   MAIN
========================================================= */
const DEFAULTS = {
  codeforces: {
    handle: CF_HANDLE, rating: 0, maxRating: 0, rank: "unrated", maxRank: "unrated",
    contests: 0, history: [], solvedProblems: [], activity: {}, years: [],
  },
  codechef: { handle: CC_HANDLE, rating: 0, maxRating: 0, stars: 0 },
  leetcode: { handle: LC_HANDLE, solved: 0, easy: 0, medium: 0, hard: 0 },
  github: { handle: GH_HANDLE, repos: 0, stars: 0, followers: 0, contributions: 0, activity: {}, years: [] },
};

const main = async () => {
  const out = {};
  const errors = [];

  const providers = { codeforces, codechef, leetcode, github };

  for (const [name, fn] of Object.entries(providers)) {
    try {
      out[name] = await fn();
      console.log(`✓ ${name}`);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      errors.push(`${name}: ${message}`);
      console.error(`✗ ${name}: ${message}`);
      out[name] = DEFAULTS[name];
    }
  }

  out.static = {
    problemsSolved: out.codeforces?.solvedProblems?.length ?? 0,
    hackathons: 6,
    projects: 3,
    cgpa: 9.04,
  };

  out.updatedAt = new Date().toISOString();

  mkdirSync(dirname(OUT), { recursive: true });

  writeFileSync(OUT, JSON.stringify(out, null, 2) + "\n");

  if (errors.length) {
    console.log("\nPartial failure:");
    errors.forEach((error) => console.log("  -", error));
  }

  console.log(`\nWrote ${OUT}`);
};

main();
