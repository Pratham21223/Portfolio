import { useMemo, useRef, useState } from "react";

/* =========================================================
   Constants
========================================================= */

const DAY = 86400000;

/* Codeforces rank tiers. Used for band tints, dots and text. */
const RANKS = [
  { min: 0, name: "Newbie", color: "#9ca3af" },
  { min: 1200, name: "Pupil", color: "#22c55e" },
  { min: 1400, name: "Specialist", color: "#06b6d4" },
  { min: 1600, name: "Expert", color: "#3b82f6" },
  { min: 1900, name: "Candidate Master", color: "#a855f7" },
  { min: 2100, name: "Master", color: "#f59e0b" },
  { min: 2300, name: "International Master", color: "#f97316" },
  { min: 2400, name: "Grandmaster", color: "#ef4444" },
  { min: 3000, name: "Legendary Grandmaster", color: "#b91c1c" },
];

const rankFor = (rating = 0) => {
  let found = RANKS[0];
  for (const rank of RANKS) {
    if (rating >= rank.min) found = rank;
  }
  return found;
};

const RANGES = [
  { key: "3M", months: 3 },
  { key: "6M", months: 6 },
  { key: "1Y", months: 12 },
  { key: "All", months: null },
];

const TABS = [
  { key: "rating", label: "Rating" },
  { key: "activity", label: "Activity" },
  { key: "problems", label: "Problems" },
];

const MONTH_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

/* Fixed intensity levels: 0, 1, 2-3, 4-5, 6+ */
const LEVEL_CLASS = [
  "bg-white/[0.05]",
  "bg-emerald-900",
  "bg-emerald-700",
  "bg-emerald-500",
  "bg-emerald-300",
];

const levelOf = (n) => (n <= 0 ? 0 : n === 1 ? 1 : n <= 3 ? 2 : n <= 5 ? 3 : 4);

/* =========================================================
   Helpers
========================================================= */

const pad = (n) => String(n).padStart(2, "0");

/* Local-calendar key (YYYY-MM-DD). Never use toISOString() for this. */
const toKey = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

const fmtDate = (t) =>
  new Date(t).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

const signed = (n) => (n >= 0 ? `+${n}` : `${n}`);

const timeAgo = (iso) => {
  if (!iso) return null;
  const minutes = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
  if (minutes < 60) return `${Math.max(minutes, 1)}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 48) return `${hours}h ago`;
  return `${Math.round(hours / 24)}d ago`;
};

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

const problemUrl = (p) => {
  if (!p.contestId) return null;
  const base = p.contestId >= 100000 ? "gym" : "contest";
  return `https://codeforces.com/${base}/${p.contestId}/problem/${p.index}`;
};

/* =========================================================
   Small shared pieces
========================================================= */

const Tile = ({ label, value, color }) => (
  <div className="rounded-xl bg-white/5 px-3 py-2.5">
    <div
      className="font-mono text-lg font-bold text-[var(--text)]"
      style={color ? { color } : undefined}
    >
      {value}
    </div>
    <div className="text-[11px] text-[var(--text-muted)]">{label}</div>
  </div>
);

const Pill = ({ active, onClick, children }) => (
  <button
    type="button"
    onClick={onClick}
    aria-pressed={active}
    className={`rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors ${
      active
        ? "bg-white/15 text-[var(--text)]"
        : "text-[var(--text-muted)] hover:bg-white/5 hover:text-[var(--text)]"
    }`}
  >
    {children}
  </button>
);

const Skeleton = () => (
  <section className="glass rounded-2xl p-4 sm:p-5" aria-busy="true">
    <div className="mb-5 flex items-center justify-between">
      <div className="h-9 w-44 animate-pulse rounded-lg bg-white/10" />
      <div className="h-9 w-32 animate-pulse rounded-lg bg-white/10" />
    </div>
    <div className="h-64 animate-pulse rounded-xl bg-white/5" />
    <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className="h-14 animate-pulse rounded-xl bg-white/5" />
      ))}
    </div>
  </section>
);

/* =========================================================
   RATING TAB
========================================================= */

const W = 760;
const H = 350;
const PAD = { top: 26, right: 18, bottom: 32, left: 46 };
const PLOT_W = W - PAD.left - PAD.right;
const PLOT_H = H - PAD.top - PAD.bottom;

const RatingGraph = ({ history }) => {
  const [range, setRange] = useState("All");
  const [hover, setHover] = useState(null);
  const svgRef = useRef(null);

  /* Ranges are anchored on the latest contest, so "3M" is never empty. */
  const data = useMemo(() => {
    const { months } = RANGES.find((r) => r.key === range);
    if (!months) return history;

    const cutoff = new Date(history[history.length - 1].date);
    cutoff.setMonth(cutoff.getMonth() - months);

    const filtered = history.filter((h) => h.date >= cutoff.getTime());
    return filtered.length ? filtered : history.slice(-1);
  }, [history, range]);

  const view = useMemo(() => {
    const ratings = data.map((d) => d.newRating);
    const lo = Math.max(0, Math.floor((Math.min(...ratings) - 100) / 100) * 100);
    const hi = Math.ceil((Math.max(...ratings) + 100) / 100) * 100;

    const t0 = data[0].date;
    const t1 = data[data.length - 1].date;
    const span = t1 - t0 || 30 * DAY;
    const d0 = t0 - span * 0.03;
    const d1 = t1 + span * 0.03;

    const getX = (t) => PAD.left + ((t - d0) / (d1 - d0)) * PLOT_W;
    const getY = (r) => PAD.top + ((hi - r) / (hi - lo)) * PLOT_H;

    const points = data.map((d) => ({ ...d, x: getX(d.date), y: getY(d.newRating) }));

    const peak = points.reduce((best, p, i) => (p.newRating > points[best].newRating ? i : best), 0);

    /* Y ticks */
    const step = hi - lo > 800 ? 200 : 100;
    const yTicks = [];
    for (let r = Math.ceil(lo / step) * step; r <= hi; r += step) yTicks.push({ r, y: getY(r) });

    /* X ticks: month starts, thinned to fit the visible span */
    const monthsSpan = (d1 - d0) / (30.44 * DAY);
    const xStep = monthsSpan <= 7 ? 1 : monthsSpan <= 14 ? 2 : monthsSpan <= 30 ? 3 : monthsSpan <= 60 ? 6 : 12;
    const xTicks = [];
    const cursor = new Date(new Date(d0).getFullYear(), new Date(d0).getMonth() + 1, 1);
    while (cursor.getTime() <= d1) {
      if (cursor.getMonth() % xStep === 0) {
        const mon = MONTH_NAMES[cursor.getMonth()];
        const yy = String(cursor.getFullYear()).slice(2);
        xTicks.push({
          x: getX(cursor.getTime()),
          label: xStep === 12 ? String(cursor.getFullYear()) : monthsSpan > 12 ? `${mon} '${yy}` : mon,
        });
      }
      cursor.setMonth(cursor.getMonth() + 1);
    }

    /* Rank bands, clipped to the visible rating range */
    const bands = RANKS.map((rank, i) => ({ ...rank, max: RANKS[i + 1]?.min ?? 4000 }))
      .filter((b) => b.max > lo && b.min < hi)
      .map((b) => {
        const top = getY(Math.min(b.max, hi));
        const bottom = getY(Math.max(b.min, lo));
        return { ...b, y: top, h: bottom - top };
      });

    const path = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");

    return { points, peak, yTicks, xTicks, bands, path };
  }, [data]);

  /* Snap to the nearest contest by pointer x (works for touch too) */
  const onMove = (event) => {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((event.clientX - rect.left) / rect.width) * W;
    let best = 0;
    let bestDist = Infinity;
    view.points.forEach((p, i) => {
      const dist = Math.abs(p.x - x);
      if (dist < bestDist) {
        bestDist = dist;
        best = i;
      }
    });
    setHover(best);
  };

  const active = hover !== null ? view.points[hover] : null;
  const peakPoint = view.points[view.peak];

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <div className="flex gap-1" role="group" aria-label="Rating range">
          {RANGES.map((r) => (
            <Pill
              key={r.key}
              active={range === r.key}
              onClick={() => {
                setRange(r.key);
                setHover(null);
              }}
            >
              {r.key}
            </Pill>
          ))}
        </div>
        <span className="text-[11px] text-[var(--text-faint)]">
          {data.length} {data.length === 1 ? "contest" : "contests"}
        </span>
      </div>

      <div className="overflow-x-auto rounded-xl bg-black/30">
        <div className="relative min-w-[520px]">
          <svg
            ref={svgRef}
            viewBox={`0 0 ${W} ${H}`}
            className="block h-auto w-full touch-pan-y select-none"
            role="img"
            aria-label={`Rating history across ${data.length} contests, peak ${peakPoint.newRating}`}
            onPointerMove={onMove}
            onPointerLeave={() => setHover(null)}
          >
            {view.bands.map((b) => (
              <rect
                key={b.name}
                x={PAD.left}
                y={b.y}
                width={PLOT_W}
                height={b.h}
                fill={b.color}
                fillOpacity="0.1"
              />
            ))}

            {view.yTicks.map((t) => (
              <g key={t.r}>
                <line
                  x1={PAD.left}
                  x2={W - PAD.right}
                  y1={t.y}
                  y2={t.y}
                  stroke="rgba(255,255,255,0.07)"
                />
                <text
                  x={PAD.left - 8}
                  y={t.y + 4}
                  textAnchor="end"
                  fontSize="11"
                  fill="rgba(255,255,255,0.45)"
                >
                  {t.r}
                </text>
              </g>
            ))}

            {view.xTicks.map((t) => (
              <g key={t.x}>
                <line
                  x1={t.x}
                  x2={t.x}
                  y1={PAD.top}
                  y2={H - PAD.bottom}
                  stroke="rgba(255,255,255,0.05)"
                />
                <text
                  x={t.x}
                  y={H - 11}
                  textAnchor="middle"
                  fontSize="11"
                  fill="rgba(255,255,255,0.45)"
                >
                  {t.label}
                </text>
              </g>
            ))}

            <path
              d={view.path}
              fill="none"
              stroke="#fcd34d"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {active && (
              <line
                x1={active.x}
                x2={active.x}
                y1={PAD.top}
                y2={H - PAD.bottom}
                stroke="rgba(255,255,255,0.35)"
                strokeDasharray="3 3"
              />
            )}

            {view.points.map((p, i) => (
              <circle
                key={`${p.contestId}-${i}`}
                cx={p.x}
                cy={p.y}
                r={hover === i ? 5.5 : 3.5}
                fill={rankFor(p.newRating).color}
                stroke="rgba(255,255,255,0.9)"
                strokeWidth="1.5"
              />
            ))}

            <text
              x={peakPoint.x}
              y={peakPoint.y - 11}
              textAnchor={peakPoint.x < 90 ? "start" : peakPoint.x > W - 90 ? "end" : "middle"}
              fontSize="11"
              fontWeight="600"
              fill={rankFor(peakPoint.newRating).color}
            >
              Max {peakPoint.newRating}
            </text>
          </svg>

          {active && (
            <div
              className="pointer-events-none absolute z-30 w-56 rounded-lg border border-white/10 bg-zinc-950/95 px-3 py-2 text-xs shadow-2xl"
              style={{
                left: `${(active.x / W) * 100}%`,
                top: `${clamp((active.y / H) * 100, 22, 78)}%`,
                transform: `translate(${active.x / W > 0.6 ? "calc(-100% - 12px)" : "12px"}, -50%)`,
              }}
            >
              <div className="flex items-baseline gap-2 font-mono">
                <span
                  className="text-base font-bold"
                  style={{ color: rankFor(active.newRating).color }}
                >
                  {active.newRating}
                </span>
                <span className={active.change >= 0 ? "text-emerald-400" : "text-red-400"}>
                  {signed(active.change)}
                </span>
              </div>
              <div className="mt-0.5 text-[var(--text-muted)]">
                {rankFor(active.newRating).name} · Rank #{active.rank}
              </div>
              <div className="mt-1.5 truncate text-[var(--text)]">{active.contestName}</div>
              <div className="text-[var(--text-faint)]">{fmtDate(active.date)}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const RatingPanel = ({ history }) => {
  if (!history.length) {
    return (
      <div className="flex h-56 items-center justify-center text-sm text-[var(--text-muted)]">
        No rated contests yet.
      </div>
    );
  }

  const bestPlace = Math.min(...history.map((h) => h.rank));
  const bestGain = Math.max(...history.map((h) => h.change));
  const worstDrop = Math.min(...history.map((h) => h.change));
  const recent = history.slice(-5).reverse();

  return (
    <div>
      <RatingGraph history={history} />

      {/* <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
        <Tile label="Contests" value={history.length} />
        <Tile label="Best place" value={`#${bestPlace}`} />
        <Tile label="Biggest gain" value={signed(bestGain)} color="#34d399" />
        <Tile label="Biggest drop" value={signed(worstDrop)} color="#f87171" />
      </div> */}
    </div>
  );
};

/* =========================================================
   ACTIVITY TAB
========================================================= */

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
    days.push({
      date: new Date(d),
      inRange: d >= start && d <= visibleEnd,
    });
  }

  const weeks = [];
  for (let i = 0; i < days.length; i += 7) weeks.push(days.slice(i, i + 7));
  return weeks;
};

const Heatmap = ({ activity, total, years }) => {
  const [period, setPeriod] = useState("last");
  const [tip, setTip] = useState(null);
  const wrapRef = useRef(null);

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

    return { inPeriod, thisMonth, ...calcStreaks(activity) };
  }, [weeks, activity]);

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
    <div>
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="text-[11px] text-[var(--text-muted)]">
          Accepted submissions, first solve per problem
        </div>
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          aria-label="Activity period"
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
                aria-label={`${stats.inPeriod} problems solved in the selected period`}
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
                      aria-label={
                        count ? `${count} solved on ${fmtDate(day.date)}` : undefined
                      }
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
            className="pointer-events-none absolute z-30 w-36 rounded-md border border-white/10 bg-zinc-950 px-2.5 py-2 text-center text-[10px] shadow-xl"
            style={{
              left: tip.left,
              top: tip.top,
              transform: `translate(-50%, ${tip.below ? "0" : "-100%"})`,
            }}
          >
            <div className="font-medium text-white">
              {tip.count} {tip.count === 1 ? "problem" : "problems"} solved
            </div>
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
        <Tile label="Solved, all time" value={total} />
        <Tile label={period === "last" ? "Last 12 months" : `In ${period}`} value={stats.inPeriod} />
        <Tile label="This month" value={stats.thisMonth} />
        <Tile label="Current streak" value={`${stats.current}d`} />
        <Tile label="Longest streak" value={`${stats.max}d`} />
      </div>
    </div>
  );
};

/* =========================================================
   PROBLEMS TAB
========================================================= */

const ProblemsPanel = ({ solved }) => {
  const data = useMemo(() => {
    const rated = solved.filter((p) => p.rating);

    const buckets = [];
    if (rated.length) {
      const lo = Math.min(...rated.map((p) => p.rating));
      const hi = Math.max(...rated.map((p) => p.rating));
      for (let r = lo; r <= hi; r += 100) {
        buckets.push({ rating: r, count: rated.filter((p) => p.rating === r).length });
      }
    }

    const tagCount = new Map();
    for (const p of solved) {
      for (const tag of p.tags ?? []) {
        if (tag.startsWith("*")) continue;
        tagCount.set(tag, (tagCount.get(tag) ?? 0) + 1);
      }
    }
    const tags = [...tagCount.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8);

    const recent = [...solved].sort((a, b) => b.timestamp - a.timestamp).slice(0, 6);

    const average = rated.length
      ? Math.round(rated.reduce((s, p) => s + p.rating, 0) / rated.length)
      : 0;

    return {
      buckets,
      tags,
      recent,
      hardest: rated.length ? Math.max(...rated.map((p) => p.rating)) : 0,
      average,
      unrated: solved.length - rated.length,
    };
  }, [solved]);

  if (!solved.length) {
    return (
      <div className="flex h-56 items-center justify-center text-sm text-[var(--text-muted)]">
        No solved problems yet.
      </div>
    );
  }

  const maxBucket = Math.max(1, ...data.buckets.map((b) => b.count));
  const maxTag = Math.max(1, ...data.tags.map(([, n]) => n));
  const showCounts = data.buckets.length <= 14;

  return (
    <div className="space-y-6">
      {/* <div className="grid grid-cols-3 gap-2">
        <Tile label="Hardest solved" value={data.hardest || "–"} color={rankFor(data.hardest).color} />
        <Tile label="Average rating" value={data.average || "–"} />
        <Tile label="Unrated problems" value={data.unrated} />
      </div> */}

      <div>
        <div className="mb-3 text-xs font-semibold text-[var(--text)]">Solved by difficulty</div>
        <div className="flex h-40 items-end gap-[3px]">
          {data.buckets.map((b) => (
            <div
              key={b.rating}
              className="flex h-full min-w-0 flex-1 flex-col justify-end"
              title={`${b.rating}: ${b.count} solved`}
            >
              {showCounts && b.count > 0 && (
                <span className="mb-0.5 text-center text-[9px] text-[var(--text-muted)]">
                  {b.count}
                </span>
              )}
              <div
                className="w-full rounded-t-[3px]"
                style={{
                  height: `${(b.count / maxBucket) * 100}%`,
                  minHeight: b.count ? 3 : 0,
                  background: rankFor(b.rating).color,
                }}
              />
            </div>
          ))}
        </div>
        <div className="mt-1 flex gap-[3px]">
          {data.buckets.map((b) => (
            <span
              key={b.rating}
              className="min-w-0 flex-1 text-center text-[9px] text-[var(--text-faint)]"
            >
              {data.buckets.length <= 14 || b.rating % 200 === 0 ? b.rating : ""}
            </span>
          ))}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <div className="mb-3 text-xs font-semibold text-[var(--text)]">Top tags</div>
          <ul className="space-y-2">
            {data.tags.map(([tag, count]) => (
              <li key={tag} className="flex items-center gap-2 text-[11px]">
                <span className="w-28 shrink-0 truncate text-[var(--text-muted)]">{tag}</span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/5">
                  <div
                    className="h-full rounded-full bg-emerald-500/70"
                    style={{ width: `${(count / maxTag) * 100}%` }}
                  />
                </div>
                <span className="w-8 text-right font-mono text-[var(--text)]">{count}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <div className="mb-3 text-xs font-semibold text-[var(--text)]">Recent solves</div>
          <ul className="divide-y divide-white/5 text-xs">
            {data.recent.map((p) => {
              const url = problemUrl(p);
              const Name = url ? "a" : "span";
              return (
                <li key={p.key} className="flex items-center gap-3 py-2">
                  <Name
                    {...(url
                      ? { href: url, target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                    className="min-w-0 flex-1 truncate text-[var(--text)] hover:underline"
                  >
                    {p.name}
                  </Name>
                  <span
                    className="font-mono"
                    style={{ color: p.rating ? rankFor(p.rating).color : undefined }}
                  >
                    {p.rating ?? "–"}
                  </span>
                  <span className="w-20 text-right text-[var(--text-faint)]">
                    {fmtDate(p.timestamp * 1000)}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};

/* =========================================================
   MAIN ANALYTICS PANEL
========================================================= */

const CFAnalytics = ({ codeforces, loading = false, updatedAt }) => {
  const [tab, setTab] = useState("rating");

  if (loading) return <Skeleton />;

  if (!codeforces) {
    return (
      <section className="glass rounded-2xl p-5 text-sm text-[var(--text-muted)]">
        Couldn't load Codeforces data. Run the stats script again to refresh it.
      </section>
    );
  }

  const history = codeforces.history ?? [];
  const activity = codeforces.activity ?? {};
  const solved = codeforces.solvedProblems ?? [];
  const years = codeforces.years ?? [];

  const latest = history[history.length - 1];
  const rating = codeforces.rating ?? 0;
  const rank = rankFor(rating);
  const updated = timeAgo(updatedAt);

  return (
    <section className="glass rounded-2xl p-4 sm:p-5">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="text-xs text-[var(--text-muted)]">
            {codeforces.handle ? `@${codeforces.handle}` : "Codeforces"}
            {updated && <span className="text-[var(--text-faint)]"> · updated {updated}</span>}
          </div>
          <div className="mt-1 flex items-baseline gap-3">
            <span className="font-mono text-3xl font-bold" style={{ color: rank.color }}>
              {rating}
            </span>
            <span className="text-sm font-medium" style={{ color: rank.color }}>
              {rank.name}
            </span>
            {latest && (
              <span
                className={`font-mono text-sm ${
                  latest.change >= 0 ? "text-emerald-400" : "text-red-400"
                }`}
              >
                {signed(latest.change)}
              </span>
            )}
          </div>
          <div className="mt-0.5 text-[11px] text-[var(--text-faint)]">
            Peak {codeforces.maxRating ?? 0}
          </div>
        </div>

        <div className="flex gap-1 rounded-lg bg-black/30 p-1" role="tablist">
          {TABS.map((t) => (
            <button
              key={t.key}
              type="button"
              role="tab"
              aria-selected={tab === t.key}
              onClick={() => setTab(t.key)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/30 ${
                tab === t.key
                  ? "bg-white/15 text-[var(--text)]"
                  : "text-[var(--text-muted)] hover:text-[var(--text)]"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {tab === "rating" && <RatingPanel history={history} />}
      {tab === "activity" && (
        <Heatmap activity={activity} total={solved.length} years={years} />
      )}
      {tab === "problems" && <ProblemsPanel solved={solved} />}
    </section>
  );
};

export default CFAnalytics;