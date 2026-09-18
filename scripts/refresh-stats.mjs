import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(__dirname, "../public/data/stats.json");

const CF_HANDLE = "Pratham2123";
const CC_HANDLE = "generous_hand";
const LC_HANDLE = "Pratham3004";
const GH_HANDLE = "Pratham21223";

const json = async (url, headers = {}) => {
  const res = await fetch(url, { headers });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return res.json();
};

const codeforces = async () => {
  const info = await json(`https://codeforces.com/api/user.info?handles=${CF_HANDLE}`);
  const rating = await json(`https://codeforces.com/api/user.rating?handle=${CF_HANDLE}`);
  const u = info.result[0];
  const contests = rating.result ?? [];
  const history = contests.slice(-12).map((c, i) => ({
    x: String(i + 1),
    y: c.newRating,
  }));
  return {
    handle: CF_HANDLE,
    rating: u.rating ?? 0,
    maxRating: u.maxRating ?? 0,
    rank: u.rank ?? "unrated",
    maxRank: u.maxRank ?? "unrated",
    contests: contests.length,
    history,
  };
};

const codechef = async () => {
  const res = await fetch(`https://www.codechef.com/users/${CC_HANDLE}`);
  if (!res.ok) throw new Error(`codechef ${res.status}`);
  const html = await res.text();
  const rating = Number(html.match(/rating-number[^>]*>\s*(\d+)/i)?.[1] ?? 0);
  const maxRating = Number(html.match(/Highest Rating[^\d]*(\d+)/i)?.[1] ?? rating);
  const parsedStars = Number(html.match(/(\d)★/)?.[1] ?? 0);
  const stars = parsedStars || (rating >= 1400 ? 2 : rating >= 0 ? 1 : 0);
  return { handle: CC_HANDLE, rating, maxRating, stars };
};

const leetcode = async () => {
  const query = {
    query: `query($u: String!){ matchedUser(username:$u){ submitStats { acSubmissionNum { difficulty count } } } }`,
    variables: { u: LC_HANDLE },
  };
  const res = await fetch("https://leetcode.com/graphql", {
    method: "POST",
    headers: { "content-type": "application/json", "user-agent": "Mozilla/5.0" },
    body: JSON.stringify(query),
  });
  if (!res.ok) throw new Error(`leetcode ${res.status}`);
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

const github = async () => {
  const user = await json(`https://api.github.com/users/${GH_HANDLE}`);
  const repos = await json(`https://api.github.com/users/${GH_HANDLE}/repos?per_page=100&type=owner`);
  let contributions = 0;
  if (process.env.GH_PAT) {
    try {
      const q = {
        query: `query($l:String!){ user(login:$l){ contributionsCollection { contributionCalendar { totalContributions } } } }`,
        variables: { l: GH_HANDLE },
      };
      const data = await json("https://api.github.com/graphql", {
        "content-type": "application/json",
        authorization: `bearer ${process.env.GH_PAT}`,
      });
      contributions = data.data?.user?.contributionsCollection?.contributionCalendar?.totalContributions ?? 0;
    } catch {
      contributions = 0;
    }
  }
  return {
    handle: GH_HANDLE,
    repos: user.public_repos ?? repos.length,
    stars: repos.reduce((a, r) => a + (r.stargazers_count ?? 0), 0),
    followers: user.followers ?? 0,
    contributions,
  };
};

const main = async () => {
  const out = {};
  const errors = [];

  for (const [name, fn] of Object.entries({ codeforces, codechef, leetcode, github })) {
    try {
      out[name] = await fn();
      console.log(`✓ ${name}`);
    } catch (err) {
      errors.push(`${name}: ${err.message}`);
      console.error(`✗ ${name}: ${err.message}`);
    }
  }

  out.static = { problemsSolved: 600, hackathons: 6, projects: 3, cgpa: 9.04 };
  out.updatedAt = new Date().toISOString();

  mkdirSync(dirname(OUT), { recursive: true });
  writeFileSync(OUT, JSON.stringify(out, null, 2) + "\n");

  if (errors.length) {
    console.log("\nPartial failure (some sources skipped):");
    errors.forEach((e) => console.log("  -", e));
  }
  console.log(`\nWrote ${OUT}`);
};

main();
