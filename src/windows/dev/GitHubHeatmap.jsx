import { useMemo, useRef, useState } from "react";

/* Self-contained: does not import anything from CFAnalytics. */

const DAY = 86400000;

const MONTH_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const LEVEL_CLASS = [
  "bg-white/[0.05]",
  "bg-emerald-900",
  "bg-emerald-700",
  "bg-emerald-500",
  "bg-emerald-300",
];

/* Smallest contribution count that reaches levels 1, 2, 3, 4 */
const THRESHOLDS = [1, 3, 6, 10];

const levelOf = (n) =>
  n < THRESHOLDS[0] ? 0 : n < THRESHOLDS[1] ? 1 : n < THRESHOLDS[2] ? 2 : n < THRESHOLDS[3] ? 3 : 4;

/* =========================================================
   Helpers
========================================================= */

const pad = (n) => String(n).padStart(2, "0");

const toKey = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

const fmtDate = (d) =>
  d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

const calcStreaks = (activity) => {
  const days = Object.keys(activity)
    .filter((k) => activity[k] > 0)
    .sort();

  let max = 0;
  let run = 0;
  let prev = null;

  for (const key of days) {
    const [y, m, d] = key.split("-").map(Number);
    const t = Date.UTC(y, m - 1, d);
    run = prev !== null && t - prev === DAY ? run + 1 : 1;
    max = Math.max(max, run);
    prev = t;
  }

  /* Today may be empty; yesterday can still continue the streak. */
  const set = new Set(days);
  const cursor = new Date();
  if (!set.has(toKey(cursor))) cursor.setDate(cursor.getDate() - 1);

  let current = 0;
  while (set.has(toKey(cursor))) {
    current++;
    cursor.setDate(cursor.getDate() - 1);
  }

  return { current, max };
};

const buildWeeks = (mode, year) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let start;
  let end;

  if (mode === "last") {
    end = new Date(today);
    start = new Date(today);
    start.setDate(start.getDate() - 364);
  } else {
    start = new Date(year, 0, 1);
    end = new Date(year, 11, 31);
  }

  const visibleEnd = end < today ? end : today;

  /* Align to Monday */
  const first = new Date(start);
  first.setDate(first.getDate() - ((first.getDay() + 6) % 7));

  const days = [];
  for (const d = new Date(first); d <= end; d.setDate(d.getDate() + 1)) {
    days.push({ date: new Date(d), inRange: d >= start && d <= visibleEnd });
  }

  const weeks = [];
  for (let i = 0; i < days.length; i += 7) weeks.push(days.slice(i, i + 7));
  return weeks;
};

const phrase = (n) => `${n} ${n === 1 ? "contribution" : "contributions"}`;

/* =========================================================
   Small pieces
========================================================= */

const Tile = ({ label, value }) => (
  <div className="rounded-xl bg-white/5 px-3 py-2.5">
    <div className="font-mono text-lg font-bold text-[var(--text)]">{value}</div>
    <div className="text-[11px] text-[var(--text-muted)]">{label}</div>
  </div>
);

const Skeleton = () => (
  <section className="glass rounded-2xl p-4 sm:p-5" aria-busy="true">
    <div className="mb-5 h-9 w-56 animate-pulse rounded-lg bg-white/10" />
    <div className="h-32 animate-pulse rounded-xl bg-white/5" />
    <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-5">
      {[0, 1, 2, 3, 4].map((i) => (
        <div key={i} className="h-14 animate-pulse rounded-xl bg-white/5" />
      ))}
    </div>
  </section>
);

/* =========================================================
   GITHUB HEATMAP
========================================================= */

const GitHubHeatmap = ({ github, loading = false }) => {
  const [period, setPeriod] = useState("last");
  const [tip, setTip] = useState(null);
  const wrapRef = useRef(null);

  const activity = github?.activity ?? {};
  const years = github?.years ?? [];

  const weeks = useMemo(
    () => buildWeeks(period === "last" ? "last" : "year", Number(period)),
    [period]
  );

  const monthLabels = weeks.map((week, i) => {
    const m = week[0].date.getMonth();
    const prev = weeks[i - 1]?.[0].date.getMonth();
    const next = weeks[i + 1]?.[0].date.getMonth();
    if (i === 0) return next === m ? MONTH_NAMES[m] : "";
    return m !== prev ? MONTH_NAMES[m] : "";
  });

  const stats = useMemo(() => {
    let inPeriod = 0;
    for (const week of weeks) {
      for (const day of week) {
        if (day.inRange) inPeriod += activity[toKey(day.date)] ?? 0;
      }
    }

    const now = new Date();
    const monthPrefix = `${now.getFullYear()}-${pad(now.getMonth() + 1)}`;
    const thisMonth = Object.entries(activity)
      .filter(([k]) => k.startsWith(monthPrefix))
      .reduce((sum, [, v]) => sum + v, 0);

    const total = Object.values(activity).reduce((sum, n) => sum + n, 0);

    return { inPeriod, thisMonth, total, ...calcStreaks(activity) };
  }, [weeks, activity]);

  if (loading) return <Skeleton />;

  if (!Object.keys(activity).length) {
    return (
      <section className="glass rounded-2xl p-5 text-sm text-[var(--text-muted)]">
        No GitHub contribution data yet. Set GH_PAT and re-run the stats script.
      </section>
    );
  }

  const showTip = (event, day, count) => {
    const cell = event.currentTarget.getBoundingClientRect();
    const wrap = wrapRef.current.getBoundingClientRect();
    const top = cell.top - wrap.top;
    const below = top < 64;
    setTip({
      left: clamp(cell.left - wrap.left + cell.width / 2, 72, wrap.width - 72),
      top: below ? top + cell.height + 8 : top - 8,
      below,
      count,
      label: fmtDate(day.date),
    });
  };

  return (
    <section className="glass rounded-2xl p-4 sm:p-5">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <div className="text-sm font-semibold text-[var(--text)]">GitHub contributions</div>
          <div className="mt-1 text-[11px] text-[var(--text-muted)]">
            @{github.handle} · {github.repos ?? 0} repos · {github.stars ?? 0} stars ·{" "}
            {github.followers ?? 0} followers
          </div>
        </div>

        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          aria-label="Contribution period"
          className="rounded-md border border-white/10 bg-zinc-900 px-2.5 py-1.5 text-xs text-[var(--text)] outline-none focus-visible:ring-1 focus-visible:ring-white/30"
        >
          <option value="last">Last 12 months</option>
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>

      <div ref={wrapRef} className="relative">
        <div className="overflow-x-auto pb-1" onScroll={() => setTip(null)}>
          <div className="min-w-[560px]">
            <div className="flex gap-2">
              <div className="w-6 shrink-0" />
              <div
                className="grid flex-1 gap-[3px] text-[10px] text-[var(--text-faint)]"
                style={{ gridTemplateColumns: `repeat(${weeks.length}, minmax(0, 1fr))` }}
              >
                {monthLabels.map((label, i) => (
                  <div key={i} className="h-4 whitespace-nowrap">
                    {label}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <div className="grid w-6 shrink-0 grid-rows-7 gap-[3px] text-[10px] leading-none text-[var(--text-faint)]">
                {["Mon", "", "Wed", "", "Fri", "", ""].map((d, i) => (
                  <span key={i} className="flex items-center">
                    {d}
                  </span>
                ))}
              </div>

              <div
                className="grid flex-1 gap-[3px]"
                style={{
                  gridTemplateColumns: `repeat(${weeks.length}, minmax(0, 1fr))`,
                  gridTemplateRows: "repeat(7, auto)",
                  gridAutoFlow: "column",
                }}
                role="img"
                aria-label={`${phrase(stats.inPeriod)} in the selected period`}
                onMouseLeave={() => setTip(null)}
              >
                {weeks.flat().map((day) => {
                  if (!day.inRange) {
                    return <div key={toKey(day.date)} className="aspect-square" />;
                  }

                  const count = activity[toKey(day.date)] ?? 0;

                  return (
                    <div
                      key={toKey(day.date)}
                      aria-label={count ? `${phrase(count)} on ${fmtDate(day.date)}` : undefined}
                      onMouseEnter={(e) => showTip(e, day, count)}
                      className={`aspect-square rounded-[3px] transition-transform hover:scale-125 ${
                        LEVEL_CLASS[levelOf(count)]
                      }`}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {tip && (
          <div
            className="pointer-events-none absolute z-30 w-40 rounded-md border border-white/10 bg-zinc-950 px-2.5 py-2 text-center text-[10px] shadow-xl"
            style={{
              left: tip.left,
              top: tip.top,
              transform: `translate(-50%, ${tip.below ? "0" : "-100%"})`,
            }}
          >
            <div className="font-medium text-white">{phrase(tip.count)}</div>
            <div className="mt-0.5 text-gray-400">{tip.label}</div>
          </div>
        )}
      </div>

      <div className="mt-2 flex items-center justify-end gap-1.5 text-[10px] text-[var(--text-faint)]">
        <span>Less</span>
        {LEVEL_CLASS.map((c) => (
          <span key={c} className={`h-3 w-3 rounded-[3px] ${c}`} />
        ))}
        <span>More</span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-5">
        <Tile label="All time" value={stats.total} />
        <Tile label={period === "last" ? "Last 12 months" : `In ${period}`} value={stats.inPeriod} />
        <Tile label="This month" value={stats.thisMonth} />
        <Tile label="Current streak" value={`${stats.current}d`} />
        <Tile label="Longest streak" value={`${stats.max}d`} />
      </div>
    </section>
  );
};

export default GitHubHeatmap;